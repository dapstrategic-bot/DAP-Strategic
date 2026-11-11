param(
  [Parameter(Mandatory = $true)]
  [string]$BackupPath,

  [Parameter(Mandatory = $true)]
  [string]$OutputPath
)

$ErrorActionPreference = 'Stop'
if (Test-Path -LiteralPath $OutputPath) {
  throw "Output file already exists: $OutputPath"
}

$encryptedBytes = [System.IO.File]::ReadAllBytes((Resolve-Path -LiteralPath $BackupPath))
$plainBytes = [System.Security.Cryptography.ProtectedData]::Unprotect(
  $encryptedBytes,
  $null,
  [System.Security.Cryptography.DataProtectionScope]::CurrentUser
)

[System.IO.File]::WriteAllBytes($OutputPath, $plainBytes)
Write-Output "Decrypted database export saved to $OutputPath"
