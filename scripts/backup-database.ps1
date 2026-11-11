param(
  [string]$BackupDirectory
)

$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $PSScriptRoot
$node = (Get-Command node -ErrorAction SilentlyContinue).Source

if (-not $BackupDirectory) {
  $BackupDirectory = Join-Path (Split-Path -Parent $repoRoot) 'DAP-Database-Backups'
}

$configPath = Join-Path $BackupDirectory 'database-url.dpapi'
if (-not (Test-Path -LiteralPath $configPath)) {
  throw 'Backup is not configured. Run scripts/configure-database-backup.ps1 first.'
}

if (-not $node) {
  $node = Join-Path $HOME '.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
}

if (-not (Test-Path -LiteralPath $node)) {
  throw 'Node.js is required to export the database.'
}

$secureUrl = Get-Content -LiteralPath $configPath -Raw | ConvertTo-SecureString
$credential = [System.Management.Automation.PSCredential]::new('database', $secureUrl)
$plainUrl = $credential.GetNetworkCredential().Password
$tempPath = Join-Path ([System.IO.Path]::GetTempPath()) ("dap-db-{0}.json" -f [guid]::NewGuid())
$backupPath = Join-Path $BackupDirectory ("dap-database-{0}.dapbackup" -f (Get-Date -Format 'yyyy-MM-dd-HHmmss'))

try {
  $env:DATABASE_URL_UNPOOLED = $plainUrl
  & $node (Join-Path $PSScriptRoot 'export-database.mjs') $tempPath
  if ($LASTEXITCODE -ne 0) {
    throw "Database export failed with exit code $LASTEXITCODE"
  }

  $plainBytes = [System.IO.File]::ReadAllBytes($tempPath)
  $encryptedBytes = [System.Security.Cryptography.ProtectedData]::Protect(
    $plainBytes,
    $null,
    [System.Security.Cryptography.DataProtectionScope]::CurrentUser
  )
  [System.IO.File]::WriteAllBytes($backupPath, $encryptedBytes)
  Write-Output "Encrypted database backup saved to $backupPath"
}
finally {
  Remove-Item Env:DATABASE_URL_UNPOOLED -ErrorAction SilentlyContinue
  $plainUrl = $null
  $credential = $null
  if (Test-Path -LiteralPath $tempPath) {
    Remove-Item -LiteralPath $tempPath -Force
  }
}
