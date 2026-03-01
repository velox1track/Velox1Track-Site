# PowerShell Security Test Script

Write-Host "SECURITY TEST SCRIPT" -ForegroundColor Green
Write-Host "====================" -ForegroundColor Green
Write-Host ""

# Test 1: Check if admin panel is accessible without authentication
Write-Host "Test 1: Checking admin panel access..." -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/admin" -Method GET -UseBasicParsing
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Cyan
    
    if ($response.StatusCode -eq 200) {
        Write-Host "VULNERABLE: Admin panel accessible without authentication!" -ForegroundColor Red
        Write-Host "   Anyone can see your subscriber data." -ForegroundColor Red
    } else {
        Write-Host "SECURE: Admin panel requires authentication." -ForegroundColor Green
    }
} catch {
    Write-Host "Error: Make sure your server is running (npm start)" -ForegroundColor Red
    Write-Host "   Then run this test again." -ForegroundColor Red
}

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Follow the SECURITY-SETUP.md guide" -ForegroundColor White
Write-Host "2. Set up your .env file with secure tokens" -ForegroundColor White
Write-Host "3. Restart your server and test again" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 