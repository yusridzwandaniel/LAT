# 🎬 Learn Apply Teach

> A training video management and program monitoring platform — deployable to GitHub Pages in one push.

![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-deployed-orange?style=flat-square&logo=github)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)
![HTML](https://img.shields.io/badge/HTML%2FCSS%2FJS-vanilla-yellow?style=flat-square)

---

## ✨ Features

- **Video Upload Interface** — drag-and-drop with simulated upload queue and progress bars
- **Training Programs** — create, filter, and track progress across multiple programs
- **Monitoring Dashboard** — GitHub Actions pipeline status, activity calendar (GitHub-style heatmap), KPI cards, bar charts, and donut infographics
- **Live Date Display** — all pages show current date dynamically
- **Fully Static** — no server, no build step, deploys straight to GitHub Pages
- **GitHub Actions CI/CD** — lint → build → deploy → monitor pipeline included

---

## 📁 Project Structure

```
trainingvault/
├── index.html          # Upload page (drag & drop, form, video grid)
├── dashboard.html      # Monitoring dashboard (KPIs, charts, pipeline)
├── programs.html       # Program management (create, filter, track)
├── style.css           # Full design system (dark industrial aesthetic)
├── app.js              # All JavaScript (upload, charts, calendar, counters)
├── README.md           # This file
└── .github/
    └── workflows/
        └── deploy.yml  # CI/CD: validate → build → deploy → monitor
```

---

## 🚀 Quick Deploy to GitHub Pages

### 1. Create a new repository

```bash
gh repo create trainingvault --public
cd trainingvault
```

### 2. Clone and add files

```bash
git clone https://github.com/YOUR_USERNAME/trainingvault.git
cd trainingvault

# Copy all project files here, then:
git add .
git commit -m "feat: initial TrainingVault deployment"
git push origin main
```

### 3. Enable GitHub Pages

Go to your repository → **Settings → Pages → Source → GitHub Actions**

That's it. The `deploy.yml` workflow will automatically:
1. Lint your HTML
2. Inject build metadata (date + commit SHA)
3. Deploy to `https://YOUR_USERNAME.github.io/trainingvault/`
4. Monitor the live site every 6 hours

---

## 🔧 GitHub Actions Pipeline

| Job | Trigger | Description |
|-----|---------|-------------|
| `validate` | Push / PR | HTMLHint lint + file structure checks |
| `build` | Push / PR | Inject build date/commit SHA → upload artifact |
| `deploy` | Push to `main` | Deploy artifact to GitHub Pages |
| `monitor` | Every 6h (cron) | Ping live site, check HTTP 200 + response time |

---

## 📊 Dashboard Features

| Widget | Description |
|--------|-------------|
| **KPI Cards** | Total uploads, active programs, uptime, hours logged — with animated counters |
| **Bar Chart** | Weekly upload activity (last 8 weeks) |
| **Donut Chart** | Program distribution by category |
| **Activity Calendar** | GitHub-style upload heatmap for the full year |
| **Pipeline View** | Visual GitHub Actions step-by-step status |
| **Activity Feed** | Real-time log of uploads, deploys, and program changes |

---

## 🎨 Design

- **Fonts:** Bebas Neue (display) + IBM Plex Mono + IBM Plex Sans
- **Theme:** Industrial dark — charcoal background, orange accent `#ff6b1a`
- **Aesthetic:** Editorial grid layouts, animated counters, CSS-only transitions
- **Responsive:** Works on mobile, tablet, and desktop

---

## 📅 Dates

All pages display the current date dynamically via JavaScript — no server required.

---

## 📝 Customisation

Edit `app.js` to update sample data:

```js
const sampleVideos   = [ /* your videos */ ];
const samplePrograms = [ /* your programs */ ];
```

Edit `deploy.yml` to change the monitoring schedule (default: every 6 hours):

```yaml
schedule:
  - cron: '0 */6 * * *'
```

---

## 📄 License

MIT — free to use, modify, and deploy.
