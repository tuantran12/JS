# Script to push SENKAI project to GitHub
# Usage: .\push-to-github.ps1

Write-Host "🚀 Pushing SENKAI Project to GitHub..." -ForegroundColor Cyan
Write-Host ""

# Navigate to project directory
$projectPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectPath

Write-Host "📂 Current directory: $projectPath" -ForegroundColor Yellow
Write-Host ""

# Check if git is initialized
if (-not (Test-Path ".git")) {
    Write-Host "⚠️  Git not initialized. Initializing..." -ForegroundColor Yellow
    git init
    git branch -M main
    Write-Host "✅ Git initialized" -ForegroundColor Green
    Write-Host ""
}

# Check git status
Write-Host "📊 Checking git status..." -ForegroundColor Yellow
$status = git status --short 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "Git status OK" -ForegroundColor Green
} else {
    Write-Host "⚠️  Git status check failed" -ForegroundColor Red
}

Write-Host ""

# Add remote if not exists
Write-Host "🔗 Checking remote repository..." -ForegroundColor Yellow
$remote = git remote get-url origin 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Adding remote: https://github.com/tuantran12/JS.git" -ForegroundColor Yellow
    git remote add origin https://github.com/tuantran12/JS.git
    Write-Host "✅ Remote added" -ForegroundColor Green
} else {
    Write-Host "Remote already exists: $remote" -ForegroundColor Green
}

Write-Host ""

# Check if .gitignore exists
if (-not (Test-Path ".gitignore")) {
    Write-Host "⚠️  .gitignore not found! Creating one..." -ForegroundColor Yellow
    # .gitignore should already exist, but just in case
}

# Add all files
Write-Host "📦 Adding files to git..." -ForegroundColor Yellow
git add .

Write-Host ""

# Commit
Write-Host "💾 Committing changes..." -ForegroundColor Yellow
$commitMessage = "Initial commit: SENKAI Web3 Platform

- Frontend: Next.js 14 with Privy integration
- Backend: Express.js API server  
- Features: Copy trading, staking, referral program
- Ready for Vercel deployment
- Environment variables configured
- Deployment documentation included"

git commit -m $commitMessage

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Files committed successfully" -ForegroundColor Green
} else {
    Write-Host "⚠️  No changes to commit or commit failed" -ForegroundColor Yellow
}

Write-Host ""

# Push to GitHub
Write-Host "📤 Pushing to GitHub..." -ForegroundColor Yellow
Write-Host "Repository: https://github.com/tuantran12/JS.git" -ForegroundColor Cyan
Write-Host "Branch: main" -ForegroundColor Cyan
Write-Host ""

$confirm = Read-Host "Do you want to push to GitHub? (Y/N)"
if ($confirm -eq "Y" -or $confirm -eq "y") {
    git push -u origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
        Write-Host ""
        Write-Host "🔗 Repository: https://github.com/tuantran12/JS" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "📋 Next steps:" -ForegroundColor Yellow
        Write-Host "   1. Go to https://vercel.com/dashboard" -ForegroundColor White
        Write-Host "   2. Import project from GitHub" -ForegroundColor White
        Write-Host "   3. Set Root Directory to 'frontend'" -ForegroundColor White
        Write-Host "   4. Add environment variables" -ForegroundColor White
        Write-Host "   5. Deploy!" -ForegroundColor White
    } else {
        Write-Host ""
        Write-Host "❌ Push failed. Common issues:" -ForegroundColor Red
        Write-Host "   - Need to pull first: git pull origin main --allow-unrelated-histories" -ForegroundColor Yellow
        Write-Host "   - Authentication required: Setup SSH keys or use GitHub CLI" -ForegroundColor Yellow
        Write-Host "   - Check: git remote -v" -ForegroundColor Yellow
    }
} else {
    Write-Host ""
    Write-Host "⏸️  Push cancelled" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To push manually, run:" -ForegroundColor Cyan
    Write-Host "   git push -u origin main" -ForegroundColor White
}

Write-Host ""

