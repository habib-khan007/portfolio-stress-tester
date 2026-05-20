# 🚀 Portfolio Stress Tester — Setup Guide
### Complete beginner guide: React + Firebase + Finnhub + Vercel

---

## What you're building

A live fintech web app where users can:
- Input their stock portfolio
- Fetch real prices with one click (Finnhub API)
- Stress test against crash scenarios (2008, Dot-com, custom)
- See risk score, VaR, sector concentration, loss charts
- Save and load portfolios (Firebase)
- Deploy for free (Vercel)

---

## File Structure (where every file lives)

```
portfolio-stress-tester/
│
├── public/
│   └── index.html              ← The one HTML page React uses
│
├── src/
│   ├── index.js                ← Entry point (don't edit)
│   ├── App.jsx                 ← Main app, manages all state
│   ├── firebase.js             ← Firebase connection
│   │
│   ├── components/
│   │   ├── Sidebar.jsx         ← Left panel (input, controls, save/load)
│   │   ├── HoldingRow.jsx      ← One row in the portfolio table
│   │   ├── MetricsBar.jsx      ← The 4 big number cards
│   │   ├── Charts.jsx          ← All charts (bar, pie, loss)
│   │   ├── RiskMeter.jsx       ← Risk score display
│   │   ├── SectorAndVaR.jsx    ← Sector bars + Value at Risk table
│   │   └── InsightsPanel.jsx   ← Auto-generated risk insight cards
│   │
│   ├── hooks/
│   │   ├── useFinnhub.js       ← Fetches live prices from Finnhub API
│   │   └── usePortfolioStorage.js ← Saves/loads to Firebase Firestore
│   │
│   └── utils/
│       ├── stockData.js        ← Static data: betas, sectors, scenarios
│       └── calculations.js     ← All the stress test math
│
├── .env.example                ← Copy this to .env and fill in your keys
├── .gitignore                  ← Protects your secret keys from GitHub
├── package.json                ← Dependencies list
└── vercel.json                 ← Vercel deployment config
```

---

## Step 1 — Install Node.js

Node.js is required to run React locally.

1. Go to https://nodejs.org
2. Download the **LTS** version (the one that says "Recommended")
3. Install it
4. Open Terminal (Mac) or Command Prompt (Windows)
5. Type `node --version` — you should see something like `v20.x.x`

---

## Step 2 — Get your project files

If you have the files from Claude, place them all in a folder called `portfolio-stress-tester` on your computer.

Then open Terminal/Command Prompt, navigate to that folder:

```bash
cd portfolio-stress-tester
```

Install all dependencies:

```bash
npm install
```

This downloads React, Recharts, Firebase, etc. into a `node_modules` folder (takes ~1 min).

---

## Step 3 — Get your Finnhub API key (free)

Finnhub provides real stock prices for free.

1. Go to https://finnhub.io
2. Click **"Get free API key"**
3. Sign up with your email
4. Copy your API key from the dashboard

---

## Step 4 — Set up Firebase (free database)

Firebase stores saved portfolios in the cloud.

### 4a. Create a Firebase project

1. Go to https://console.firebase.google.com
2. Click **"Add project"**
3. Name it `portfolio-stress-tester`
4. Disable Google Analytics (not needed)
5. Click **"Create project"**

### 4b. Set up Firestore database

1. In your Firebase project, click **"Firestore Database"** in the left menu
2. Click **"Create database"**
3. Choose **"Start in test mode"** (easy for development)
4. Choose any location (e.g. `us-east1`)
5. Click **"Done"**

### 4c. Get your Firebase config keys

1. Click the ⚙️ gear icon → **"Project settings"**
2. Scroll to **"Your apps"** section
3. Click the **</>** (web) icon to add a web app
4. Name it anything, click **"Register app"**
5. You'll see a block of code with `firebaseConfig` — copy all those values

---

## Step 5 — Create your .env file

In your project folder, create a file called `.env` (no extension).

Copy the contents of `.env.example` and fill in your actual keys:

```
REACT_APP_FINNHUB_KEY=d1abc123xyz456  ← your Finnhub key
REACT_APP_FIREBASE_API_KEY=AIzaSy...
REACT_APP_FIREBASE_AUTH_DOMAIN=myproject.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=myproject
REACT_APP_FIREBASE_STORAGE_BUCKET=myproject.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abc123
```

⚠️ **Important:** Never share this file. It's already in `.gitignore` so it won't be uploaded to GitHub.

---

## Step 6 — Run locally

```bash
npm start
```

This opens `http://localhost:3000` in your browser. The app is running locally!

Try it:
- Enter a stock ticker like `AAPL`
- Click the **↻** button to fetch the live price from Finnhub
- Adjust the crash slider
- Save a portfolio with a name

---

## Step 7 — Deploy to Vercel (free hosting)

Vercel makes your app live on the internet for free.

### 7a. Push to GitHub first

1. Go to https://github.com and create a free account
2. Create a new repository called `portfolio-stress-tester`
3. Upload your project files (drag and drop, or use GitHub Desktop)
4. Make sure `.env` is NOT uploaded (it should be in `.gitignore`)

### 7b. Deploy on Vercel

1. Go to https://vercel.com and sign up with your GitHub account
2. Click **"New Project"**
3. Choose your `portfolio-stress-tester` repository
4. Click **"Import"**
5. **Before clicking Deploy**, click **"Environment Variables"**
6. Add all 7 variables from your `.env` file, one by one
7. Click **"Deploy"**

In ~2 minutes, Vercel gives you a live URL like:
`https://portfolio-stress-tester-yourname.vercel.app`

**Every time you push to GitHub, Vercel auto-redeploys. Zero extra work.**

---

## How the app works (plain English)

| File | What it does |
|------|-------------|
| `App.jsx` | The manager — holds all state, renders everything |
| `Sidebar.jsx` | Left panel — portfolio input, scenario buttons, save/load |
| `HoldingRow.jsx` | One stock row — has the live price fetch button |
| `useFinnhub.js` | Makes API calls to Finnhub for real prices |
| `usePortfolioStorage.js` | Saves/reads from Firebase Firestore |
| `calculations.js` | Does all the stress test math (beta, VaR, risk score) |
| `Charts.jsx` | Draws the bar/pie/loss charts using Recharts |
| `InsightsPanel.jsx` | Generates smart warnings based on portfolio composition |

---

## Troubleshooting

**App shows blank page:**
- Open browser developer tools (F12) → Console tab
- Look for red errors

**"No price found for TICKER":**
- Check your Finnhub key in `.env`
- Make sure the ticker exists (try `AAPL`)
- Free tier: 60 calls/minute max

**Firebase save not working:**
- Make sure Firestore is set to "test mode"
- Check your Firebase keys in `.env`
- Look in browser console for errors

**Vercel build fails:**
- Make sure all 7 environment variables are added in Vercel dashboard
- Check the Vercel build logs for the specific error

---

## Free tier limits (you won't hit these for a personal project)

| Service | Free limit |
|---------|-----------|
| Finnhub | 60 API calls/minute |
| Firebase Firestore | 50,000 reads/day, 20,000 writes/day |
| Vercel | 100GB bandwidth/month, unlimited deployments |

---

## What to customize

- **Add more stocks to STOCK_DB** in `src/utils/stockData.js`
- **Add new crash scenarios** in the `SCENARIOS` array in `stockData.js`
- **Change colors** — look for `#ef4444` (red) and `#3b82f6` (blue) in the components
- **Add Indian stocks** — Finnhub supports NSE: use tickers like `RELIANCE.NS`, `TCS.NS`

---

*Built with React 18 · Recharts · Firebase Firestore · Finnhub API · Vercel*
