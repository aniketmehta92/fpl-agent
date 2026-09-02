# publish-dashboard.ps1
# Copies coverage/dashboard.html -> fpl-dashboard/index.html, commits ONLY that
# file, and pushes. Run at the end of every fpl-analyst run.
#
# Safety model: the target repo is a SEPARATE directory outside the FPL repo,
# so .mcp.json / the FPL refresh token / coverage state have no path into it.
# The script additionally refuses to commit if the rendered page contains
# anything that looks like a credential, and refuses to stage any file other
# than index.html.

param(
    [string]$Source = 'C:\Users\anike\Claude\FPL\coverage\dashboard.html',
    [string]$RepoDir = 'C:\Users\anike\Claude\fpl-dashboard',
    [switch]$NoPush
)

$ErrorActionPreference = 'Stop'

if (-not (Test-Path $Source))  { throw "Source dashboard not found: $Source" }
if (-not (Test-Path $RepoDir)) { throw "Dashboard repo not found: $RepoDir" }

# --- Guard 1: never publish a page still flagged as sample data -------------
$content = Get-Content $Source -Raw
if ($content -match '"sample"\s*:\s*true') {
    throw "REFUSING TO PUBLISH: dashboard is still marked sample:true. Run a mode first."
}

# --- Guard 2: scan the rendered page for credential-shaped strings ----------
$patterns = @(
    'pl_profile', 'csrftoken', 'sessionid', 'Bearer\s', 'refresh[_-]?token',
    'api[_-]?key', 'client[_-]?secret', 'password', 'BEGIN [A-Z ]*PRIVATE KEY'
)
foreach ($p in $patterns) {
    if ($content -match $p) {
        throw "REFUSING TO PUBLISH: dashboard matched credential pattern '$p'. Inspect $Source."
    }
}

Copy-Item $Source -Destination (Join-Path $RepoDir 'index.html') -Force

Push-Location $RepoDir
try {
    # --- Guard 3: stage ONLY index.html. Never 'git add -A'. ---------------
    git add -- index.html
    if (Test-Path '.gitignore') { git add -- .gitignore }
    if (Test-Path 'README.md')  { git add -- README.md }

    # --- Guard 4: abort if anything unexpected got staged ------------------
    $staged = @(git diff --cached --name-only | Where-Object { $_ })
    $allowed = @('index.html', '.gitignore', 'README.md')
    $bad = $staged | Where-Object { $allowed -notcontains $_ }
    if ($bad) {
        git reset | Out-Null
        throw "REFUSING TO COMMIT: unexpected staged files -> $($bad -join ', ')"
    }

    if (-not $staged) {
        Write-Output 'No dashboard changes to publish.'
        return
    }

    $stamp = Get-Date -Format 'yyyy-MM-dd HH:mm'
    git commit -m "Update dashboard - $stamp" | Out-Null
    Write-Output "Committed: $($staged -join ', ')"

    if ($NoPush) {
        Write-Output 'Skipped push (-NoPush).'
        return
    }

    $hasRemote = (git remote) -contains 'origin'
    if (-not $hasRemote) {
        Write-Output 'No "origin" remote set yet - commit made locally, nothing pushed.'
        return
    }

    git push origin main
    Write-Output 'Pushed to origin/main.'
}
finally {
    Pop-Location
}
