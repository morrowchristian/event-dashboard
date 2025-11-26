# EventFlow Dashboard

**A real-time, beautiful, zero-dependency event dashboard built with pure vanilla JavaScript.**

No React. No Vue. No build step. Just HTML, CSS, and modern ES6 modules — running at 60 FPS everywhere.

### Dashboard

<p align="center">
  <img src="docs/images/dashboard-preview-desktop.png" alt="EventFlow Dashboard – Desktop" width="100%">
</p>

<div align="center">

| Desktop View                                      | Mobile View                                          |
|---------------------------------------------------|-------------------------------------------------------|
| <img src="docs/images/dashboard-preview-desktop.png" alt="Desktop Dashboard" width="100%"> | <img src="docs/images/dashboard-preview-mobile.png" alt="Mobile Dashboard" width="380"> |

</div>

### Mobile Sidebar & Menu

<div align="center">
  <img src="docs/images/Sidebar-mobile.png" alt="Mobile Sidebar Open" width="380">
  <br><br>
  <em>Smooth slide-in sidebar with outside-click and Escape-key close</em>
</div>

### Add / Edit Event Modal

<div align="center">

| Desktop Modal                                          | Mobile Modal                                           |
|--------------------------------------------------------|--------------------------------------------------------|
| <img src="docs/images/add-event-modal-desktop.png" alt="Add Event Modal – Desktop" width="520"> | <img src="docs/images/add-event-modal-mobile.png" alt="Add Event Modal – Mobile" width="380"> |

</div>

---

## Features

- **Create, edit, and delete events** with full date/time support
- Events automatically **grouped by date** and **sorted by time**
- Real-time clock + simulated live updates every 30s
- Full **localStorage persistence** — survives refresh and closes
- Beautiful modals, toast notifications, loading states
- Mobile-first responsive design with hamburger menu
- **Edit/Delete** with confirmation modal
- Form validation + error handling
- 100% vanilla JS — zero dependencies, instant load

---

---

## Tech Stack

| Layer             | Technology                          |
|-------------------|-------------------------------------|
| Language          | Vanilla JavaScript (ES6+ modules)   |
| Styling           | CSS3 (single file, custom properties) |
| Icons             | Font Awesome 6                      |
| Testing           | Playwright (10 E2E tests)           |
| Dev Server        | `http-server` (via npm scripts)    |
| Dependencies      | **Zero**                            |

> Yes, this entire dashboard has **no npm packages** except dev tools.

---

## Quick Start

```bash
git clone https://github.com/yourusername/event-dashboard.git
cd event-dashboard
npm install          # only installs http-server + playwright
npm run dev          # → http://localhost:5500
```

Run Tests:
```bash
npm test        #headed mode: npm run test: headed
```

---

## Current Status (November 25, 2025)

**Massive modular refactor just landed** — code is now beautifully organized:

- `src/components/` • `src/ui/` • `src/services/` • `src/index.js` (single source of truth)

**Known regression (being fixed right now):**
- Mobile sidebar toggle temporarily broken after full DOM re-render changes

**Next step:**
Fix mobile menu → All 10 Playwright tests green → **v1.0.0 released**

We are **one small fix** away from having one of the cleanest, fastest, most impressive vanilla JS dashboards on the internet.

---

## License

[MIT](LICENSE) — free to use, modify, and ship

---

<div align="center">
  <strong>Made with passion • No Framework November 2025</strong>
</div>