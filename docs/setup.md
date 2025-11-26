# Setup Guide

## Quick Start (Recommended)

```bash
git clone https://github.com/yourusername/event-dashboard.git
cd event-dashboard
npm install          # installs only http-server + playwright (dev only)
npm run dev          # starts server at http://localhost:5500
```

The app is **100 static** — no build step, no bundler, no framework.

## Development Server

We use `http-server` (installed as a dev dependency) with proper MIME types and CORS headers.

```bash
npm run dev
# → http://localhost:5500
# → includes --cors and cache disabled for instant reloads
```

## Alternative Servers (No Node.js Required)

### Python 3
```bash
python -m http.server 5500
```

### Python 2 (legacy)
```bash
python -m SimpleHTTPServer 5500
```

### PHP
```bash
php -S localhost:5500
```

### Any static server (e.g. Live Server in VS Code)
Just open the project folder — it will work perfectly.

## Project Structure

```text
event-dashboard/
├── src/
│   ├── components/          # Pure UI components (Dashboard, EventList, etc.)
│   ├── ui/                  # Reusable UI pieces (Notification, Clock, LoadingOverlay)
│   ├── services/            # DataManager, RealTimeUpdates
│   ├── index.js             # Single barrel export (all utils & constants)
│   └── main.js              # App entry point
├── public/                  # Static assets (icons, future images)
├── docs/
│   ├── images/              # Screenshots
│   ├── api.md               # Public API documentation
│   └── setup.md             # This file
├── tests/                   # Playwright E2E tests
├── .gitignore
├── package.json
├── README.md
└── index.html               # Single HTML entry point
```

## Running Tests

```bash
npm test                    # normal mode
npm run test:headed         # watch tests run in browser
npm run test:ui             # Playwright UI mode
```

## Browser Support

Fully supported on all modern browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile Chrome / Safari (iOS & Android)

> No polyfills needed — uses only stable ES6+ features.

## Troubleshooting

### CORS or Module Errors
→ Never open `index.html` directly via `file://`  
→ Always use one of the servers above

### Styles or Scripts Not Loading
→ Check DevTools → Network tab for 404s  
→ Ensure server sets correct `Content-Type: text/javascript` for `.js` files  
→ `http-server` does this automatically

### LocalStorage Not Persisting
→ Only happens if served over `http://localhost` or `https`  
→ `file://` protocol blocks localStorage in some browsers

## Notes

- Zero runtime dependencies — production bundle is just your code
- Development only uses `http-server` and `playwright`
- Perfect for learning vanilla JS architecture
- Designed to run instantly on GitHub Pages

You're all set. Just run `npm run dev` and start building.
```
