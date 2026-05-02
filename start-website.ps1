# Start LibriVista Website
# Run this script in PowerShell to start the website

Write-Host "Starting LibriVista Website..." -ForegroundColor Green

# Start Backend
Write-Host "`nStarting Backend (Port 5000)..." -ForegroundColor Yellow
Start-Process "node" -ArgumentList "server.js" -WorkingDirectory "C:\Users\Win11\Desktop\class10OJT\my-app\backend" -WindowStyle Normal

Start-Sleep -Seconds 3

# Start Frontend  
Write-Host "`nStarting Frontend (Port 3000)..." -ForegroundColor Yellow
Start-Process "npm" -ArgumentList "run","dev" -WorkingDirectory "C:\Users\Win11\Desktop\class10OJT\my-app\frontend" -WindowStyle Normal

Start-Sleep -Seconds 5

# Test if servers are running
$backendRunning = Test-NetConnection -ComputerName localhost -Port 5000 -InformationLevel Quiet
$frontendRunning = Test-NetConnection -ComputerName localhost -Port 3000 -InformationLevel Quiet

Write-Host "`n=== STATUS ===" -ForegroundColor Cyan
if ($backendRunning) {
    Write-Host "✅ Backend: http://localhost:5000" -ForegroundColor Green
} else {
    Write-Host "❌ Backend NOT running" -ForegroundColor Red
}

if ($frontendRunning) {
    Write-Host "✅ Frontend: http://localhost:3000" -ForegroundColor Green
} else {
    Write-Host "❌ Frontend NOT running" -ForegroundColor Red
}

Write-Host "`n=== TEST ACCOUNTS ===" -ForegroundColor Cyan
Write-Host "Admin: admin@librivista.com / admin123"
Write-Host "User: Bhandarikunjan9@gmail.com / user123"

Write-Host "`n=== NEXT STEPS ===" -ForegroundColor Cyan
Write-Host "1. Open http://localhost:3000 in your browser"
Write-Host "2. Click Login (top right)"
Write-Host "3. Use the credentials above"
Write-Host "4. Browse books, reserve them, and view your account!"

Write-Host "`nWebsite is ready!" -ForegroundColor Green
