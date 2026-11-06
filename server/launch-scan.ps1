param([Parameter(Mandatory=$true)][string]$Payload)
$ErrorActionPreference = 'Stop'
try {
    $worker = Join-Path $PSScriptRoot 'scan-worker.ps1'
    $powershell = Join-Path $env:SystemRoot 'System32\WindowsPowerShell\v1.0\powershell.exe'
    $child = Start-Process -FilePath $powershell -Verb RunAs -WindowStyle Hidden -ArgumentList @('-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-File', ('"' + $worker + '"'), '-Payload', $Payload) -PassThru
    # Cache the handle before waiting so PowerShell retains the completed process's exit code.
    $null = $child.Handle
    $child.WaitForExit()
    $child.Refresh()
    if ($null -eq $child.ExitCode) { exit 22 }
    if ($child.ExitCode -ne 0) { exit 23 }
    exit 0
} catch {
    # Do not serialize exception details: native errors can include local paths/account data.
    if ($_.Exception.NativeErrorCode -eq 1223) { exit 20 }
    exit 21
}
