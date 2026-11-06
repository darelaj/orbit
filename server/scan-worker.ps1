param([Parameter(Mandatory=$true)][string]$Payload)
$ErrorActionPreference = 'Stop'
$settings = [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String($Payload)) | ConvertFrom-Json
$manifest = Get-Content -LiteralPath (Join-Path $PSScriptRoot 'scanner-pin.json') -Raw | ConvertFrom-Json
$run = [IO.Path]::GetFullPath($settings.directory)
$engine = [IO.Path]::GetFullPath($settings.engine)
$statusPath = Join-Path $run 'status.json'
$output = Join-Path $run 'output.json'
$stdout = Join-Path $run 'stdout.txt'
$stderr = Join-Path $run 'stderr.txt'
$nativeInputPath = Join-Path $run 'stdin.txt'
function Write-State([string]$state, [string]$reason = '') {
    $temporary = Join-Path $run 'status.tmp'
    [IO.File]::WriteAllText($temporary, (ConvertTo-Json -InputObject @{ state = $state; reason = $reason } -Compress), [Text.UTF8Encoding]::new($false))
    Move-Item -LiteralPath $temporary -Destination $statusPath -Force
}
$mutex = [Threading.Mutex]::new($false, 'Local\OrbitReliquaryCapture')
$ownsMutex = $false
$child = $null
$stage = 'privilege'
try {
    try { $ownsMutex = $mutex.WaitOne(0) } catch [Threading.AbandonedMutexException] { $ownsMutex = $true }
    if (-not $ownsMutex) { Write-State 'occupied'; exit 1 }
    $identity = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = [Security.Principal.WindowsPrincipal]::new($identity)
    if (-not $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) { throw 'Elevation required' }
    $stage = 'engine'
    if ((Get-FileHash -LiteralPath $engine -Algorithm SHA256).Hash.ToLowerInvariant() -ne $manifest.sha256 -or (Get-Item -LiteralPath $engine).Length -ne $manifest.bytes) { throw 'Checksum mismatch' }
    $env:NO_SELF_UPDATE = '1'
    $env:RUST_LOG = 'reliquary_archiver=info'
    # EOF prevents the upstream panic handler from waiting for an invisible Enter prompt.
    [IO.File]::WriteAllText($nativeInputPath, '')
    Write-State 'starting'
    $stage = 'native'
    $child = Start-Process -FilePath $engine -WindowStyle Hidden -WorkingDirectory $run -ArgumentList @('--headless', '--no-update', '--exit-after-capture', '--timeout', '120', ('"' + $output + '"')) -RedirectStandardInput $nativeInputPath -RedirectStandardOutput $stdout -RedirectStandardError $stderr -PassThru
    $null = $child.Handle
    $stage = 'capture'
    $listening = $false
    while (-not $child.HasExited) {
        if (-not $listening -and (Test-Path -LiteralPath $stdout) -and (Get-Item -LiteralPath $stdout).Length -le 1048576) {
            $text = Get-Content -LiteralPath $stdout -Raw -ErrorAction SilentlyContinue
            if ($text -match 'listening with a timeout') { $listening = $true; Write-State 'capturing' }
        }
        Start-Sleep -Milliseconds 400
        $child.Refresh()
    }
    $child.WaitForExit()
    $text = ''
    if ((Get-Item -LiteralPath $stdout).Length -le 1048576) { $text = Get-Content -LiteralPath $stdout -Raw }
    # The upstream CLI can export partial data on timeout. Require its initialization marker.
    if ($null -eq $child.ExitCode) { Write-State 'incomplete' 'exit_unknown' }
    elseif ($child.ExitCode -ne 0) { Write-State 'incomplete' 'native_exit' }
    elseif (Test-Path -LiteralPath (Join-Path $run 'crashlog.txt')) { Write-State 'incomplete' 'crash' }
    elseif ($text -match 'not supported yet|DecryptionKeyMissing') { Write-State 'incomplete' 'unsupported_version' }
    elseif ($text -match 'Capture initialization error|Failed to create capture|Failed to start packet capture') { Write-State 'incomplete' 'capture_setup' }
    elseif ($text -notmatch 'finished initialization') { Write-State 'incomplete' 'initialization_missing' }
    elseif (-not (Test-Path -LiteralPath $output)) { Write-State 'incomplete' 'export_missing' }
    else { Write-State 'complete' }
} catch { Write-State 'failed' $stage }
finally {
    # Even a status-file error must not release the scan lease while the native reader is running.
    if ($null -ne $child -and -not $child.HasExited) { $child.WaitForExit() }
    if ($ownsMutex) { $mutex.ReleaseMutex() }
    $mutex.Dispose()
}
