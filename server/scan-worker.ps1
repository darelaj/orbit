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
function Write-State([string]$state) {
    $temporary = Join-Path $run 'status.tmp'
    [IO.File]::WriteAllText($temporary, ('{"state":"' + $state + '"}'), [Text.UTF8Encoding]::new($false))
    Move-Item -LiteralPath $temporary -Destination $statusPath -Force
}
$mutex = [Threading.Mutex]::new($false, 'Local\OrbitReliquaryCapture')
$ownsMutex = $false
$child = $null
try {
    try { $ownsMutex = $mutex.WaitOne(0) } catch [Threading.AbandonedMutexException] { $ownsMutex = $true }
    if (-not $ownsMutex) { Write-State 'occupied'; exit 1 }
    $identity = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = [Security.Principal.WindowsPrincipal]::new($identity)
    if (-not $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) { throw 'Elevation required' }
    if ((Get-FileHash -LiteralPath $engine -Algorithm SHA256).Hash.ToLowerInvariant() -ne $manifest.sha256 -or (Get-Item -LiteralPath $engine).Length -ne $manifest.bytes) { throw 'Checksum mismatch' }
    $env:NO_SELF_UPDATE = '1'
    $env:RUST_LOG = 'reliquary_archiver=info'
    Write-State 'starting'
    $child = Start-Process -FilePath $engine -WindowStyle Hidden -WorkingDirectory $run -ArgumentList @('--headless', '--no-update', '--exit-after-capture', '--timeout', '120', ('"' + $output + '"')) -RedirectStandardOutput $stdout -RedirectStandardError $stderr -PassThru
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
    if ($child.ExitCode -eq 0 -and $text -match 'finished initialization' -and (Test-Path -LiteralPath $output)) { Write-State 'complete' }
    else { Write-State 'incomplete' }
} catch { Write-State 'failed' }
finally {
    # Even a status-file error must not release the scan lease while the native reader is running.
    if ($null -ne $child -and -not $child.HasExited) { $child.WaitForExit() }
    if ($ownsMutex) { $mutex.ReleaseMutex() }
    $mutex.Dispose()
}
