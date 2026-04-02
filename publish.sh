#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────
#  TrainingVault — GitHub Setup & Publish Script
#  Run this from INSIDE the trainingvault/ directory
# ─────────────────────────────────────────────────────────────────
set -e

# ── CONFIGURATION (edit these) ────────────────
REPO_NAME="trainingvault"
# Replace with your GitHub username:
GITHUB_USER="YOUR_GITHUB_USERNAME"
# Set to "https" or "ssh"
REMOTE_TYPE="https"
# ─────────────────────────────────────────────

GREEN='\033[0;32m'
ORANGE='\033[0;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
RESET='\033[0m'

echo ""
echo -e "${BOLD}${ORANGE}▶ TrainingVault — GitHub Publish Script${RESET}"
echo "────────────────────────────────────────"
echo ""

# ── STEP 1: Check prerequisites ───────────────
echo -e "${CYAN}[1/6] Checking prerequisites…${RESET}"

if ! command -v git &>/dev/null; then
  echo "❌  git is not installed. Install it from https://git-scm.com"
  exit 1
fi
echo "  ✅ git found: $(git --version)"

if ! command -v gh &>/dev/null; then
  echo "  ⚠️  GitHub CLI (gh) not found — you will create the repo manually."
  GH_AVAILABLE=false
else
  echo "  ✅ gh found: $(gh --version | head -1)"
  GH_AVAILABLE=true
fi

echo ""

# ── STEP 2: Initialise git ────────────────────
echo -e "${CYAN}[2/6] Initialising git repository…${RESET}"

if [ -d ".git" ]; then
  echo "  ℹ️  Git already initialised — skipping."
else
  git init
  echo "  ✅ git init done"
fi

# Make sure we're on main
git checkout -b main 2>/dev/null || git checkout main 2>/dev/null || true

echo ""

# ── STEP 3: Stage all files ───────────────────
echo -e "${CYAN}[3/6] Staging files…${RESET}"
git add .
echo "  ✅ All files staged"
git status --short
echo ""

# ── STEP 4: Initial commit ────────────────────
echo -e "${CYAN}[4/6] Creating initial commit…${RESET}"
git commit -m "feat: initial TrainingVault — video upload + training platform

- index.html    : Drag-and-drop video upload + recent videos grid
- dashboard.html: KPI cards, bar/donut charts, activity calendar, GitHub pipeline
- programs.html : Program management with create modal and filter
- style.css     : Industrial dark design system (Bebas Neue + IBM Plex)
- app.js        : Upload queue, counter animations, calendar, donut chart
- .github/workflows/deploy.yml : CI/CD — lint, build, deploy, monitor (cron)
- README.md     : Setup and deployment guide
" || echo "  ℹ️  Nothing new to commit."
echo ""

# ── STEP 5: Create remote repo ────────────────
echo -e "${CYAN}[5/6] Setting up remote repository…${RESET}"

if [ "$GITHUB_USER" = "YOUR_GITHUB_USERNAME" ]; then
  echo -e "  ${ORANGE}⚠️  Set GITHUB_USER at the top of this script, then re-run.${RESET}"
  echo "     Or add the remote manually:"
  if [ "$REMOTE_TYPE" = "ssh" ]; then
    echo "     git remote add origin git@github.com:YOUR_USERNAME/${REPO_NAME}.git"
  else
    echo "     git remote add origin https://github.com/YOUR_USERNAME/${REPO_NAME}.git"
  fi
else
  if [ "$GH_AVAILABLE" = "true" ]; then
    echo "  Creating public repo via GitHub CLI…"
    gh repo create "$REPO_NAME" --public --description "Training video platform with GitHub monitoring" 2>/dev/null \
      && echo "  ✅ Repo created" \
      || echo "  ℹ️  Repo may already exist — continuing."
  fi

  # Set remote URL
  if [ "$REMOTE_TYPE" = "ssh" ]; then
    REMOTE_URL="git@github.com:${GITHUB_USER}/${REPO_NAME}.git"
  else
    REMOTE_URL="https://github.com/${GITHUB_USER}/${REPO_NAME}.git"
  fi

  git remote remove origin 2>/dev/null || true
  git remote add origin "$REMOTE_URL"
  echo "  ✅ Remote set: $REMOTE_URL"
fi
echo ""

# ── STEP 6: Push ─────────────────────────────
echo -e "${CYAN}[6/6] Pushing to GitHub…${RESET}"

if [ "$GITHUB_USER" = "YOUR_GITHUB_USERNAME" ]; then
  echo -e "  ${ORANGE}⚠️  Skipping push — set GITHUB_USER first, then run:${RESET}"
  echo "     git push -u origin main"
else
  git push -u origin main
  echo ""
  echo -e "${GREEN}${BOLD}✅ TrainingVault published!${RESET}"
  echo ""
  echo "  🌐 Repository : https://github.com/${GITHUB_USER}/${REPO_NAME}"
  echo ""
  echo -e "${BOLD}Next step — enable GitHub Pages:${RESET}"
  echo "  1. Open https://github.com/${GITHUB_USER}/${REPO_NAME}/settings/pages"
  echo "  2. Under 'Source' → select 'GitHub Actions'"
  echo "  3. Re-push any change OR run the workflow manually"
  echo ""
  echo "  📊 Your site will be live at:"
  echo "     https://${GITHUB_USER}.github.io/${REPO_NAME}/"
  echo ""
  echo "  ⚙️  GitHub Actions pipeline runs on every push."
  echo "     Site health is monitored every 6 hours automatically."
fi

echo "────────────────────────────────────────"
echo ""
