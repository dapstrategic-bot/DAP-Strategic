param(
  [string]$BackupDirectory
)

$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $PSScriptRoot

if (-not $BackupDirectory) {
  $BackupDirectory = Join-Path (Split-Path -Parent $repoRoot) 'DAP-Database-Backups'
}

New-Item -ItemType Directory -Path $BackupDirectory -Force | Out-Null
$configPath = Join-Path $BackupDirectory 'database-url.dpapi'
$databaseUrl = Read-Host 'Paste the unpooled PostgreSQL connection string' -AsSecureString
$databaseUrl | ConvertFrom-SecureString | Set-Content -LiteralPath $configPath -Encoding utf8

Write-Output "Encrypted backup configuration saved to $configPath"
