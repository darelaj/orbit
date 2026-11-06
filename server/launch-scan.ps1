param([Parameter(Mandatory=$true)][string]$Payload)
$ErrorActionPreference = 'Stop'
try {
    $settings = [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String($Payload)) | ConvertFrom-Json
    $worker = Join-Path $PSScriptRoot 'scan-worker.ps1'
    $literal = $worker.Replace("'", "''")
    $command = "& '$literal' -Payload '$Payload'"
    $encoded = [Convert]::ToBase64String([Text.Encoding]::Unicode.GetBytes($command))
    $powershell = Join-Path $env:SystemRoot 'System32\WindowsPowerShell\v1.0\powershell.exe'
    $child = Start-Process -FilePath $powershell -Verb RunAs -WindowStyle Hidden -ArgumentList @('-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-EncodedCommand', $encoded) -Wait -PassThru
    exit $child.ExitCode
} catch {
    # Do not serialize exception details: native errors can include local paths/account data.
    exit 1
}
