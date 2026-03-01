# PowerShell Token Generator

Write-Host "=== SECURE TOKEN GENERATOR ===" -ForegroundColor Green
Write-Host ""

# Generate admin token (64 random hex characters)
$adminToken = -join ((48..57) + (97..102) | Get-Random -Count 64 | ForEach-Object {[char]$_})

# Generate session secret (64 random hex characters)
$sessionSecret = -join ((48..57) + (97..102) | Get-Random -Count 64 | ForEach-Object {[char]$_})

Write-Host "ADMIN_TOKEN=$adminToken" -ForegroundColor Yellow
Write-Host "SESSION_SECRET=$sessionSecret" -ForegroundColor Yellow

Write-Host ""
Write-Host "=== INSTRUCTIONS ===" -ForegroundColor Cyan
Write-Host "1. Copy these values to your .env file"
Write-Host "2. Never share these tokens with anyone"
Write-Host "3. Keep your .env file secure and never commit it to git"
Write-Host ""
Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 