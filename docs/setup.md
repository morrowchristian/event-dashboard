# Setup Guide

## Quick Start (Recommended)

```
git clone https://github.com/yourusername/event-dashboard.git
cd event-dashboard
npm install          # installs only http-server + playwright (dev only)
npm run dev          # starts server at http://localhost:5500
```

The app is **100 static** — no build step, no bundler, no framework.

## Development Server

We use ```http-server``` (installed as a dev dependency) with proper MIME types and CORS headers.

```
npm run dev
# → http://localhost:5500
# → includes --cors and cache disabled for instant reloads
```

## New Features (Unified Event/Task System)

### Key Changes in Latest Version
- **Unified Interface**: Single system for both events and tasks
- **Dynamic Forms**: Time input for events, priority selector for tasks
- **Visual Priority**: Color-coded badges (High/Medium/Low)
- **Enhanced Sidebar**: Functional tab navigation with active states
- **Component CSS**: Organized, maintainable styling architecture

### Testing the Unified System
1. **Create an Event**: Select "Event" type, add time
2. **Create a Task**: Select "Task" type, set priority
3. **View Unified Timeline**: See events and tasks grouped by date
4. **Test Mobile**: Verify responsive behavior
5. **Check Statistics**: Dashboard shows separate event/task counts

## Project Structure

```
event-dashboard/
├── src/
│   ├── components/          # UI components (Dashboard, EventList, etc.)
│   │   ├── Dashboard.js     # Stats including task count
│   │   ├── EventList.js     # Unified timeline with priority badges
│   │   ├── EventModal.js    # Dynamic form for events/tasks
│   │   ├── Sidebar.js       # Navigation with tab switching
│   │   └── ...
│   ├── ui/                  # Reusable UI (Notification, LoadingOverlay)
│   ├── services/            # DataManager (now handles types/priorities)
│   ├── index.js             # Single barrel export
│   └── main.js              # App entry point
├── public/
├── docs/
│   ├── images/
│   ├── api.md               # Updated with unified system docs
│   └── setup.md             # This file
├── tests/                   # Playwright E2E tests (needs updating)
├── .gitignore
├── package.json
├── README.md
└── index.html
```

## Running Tests

```
npm test                    # normal mode (needs updating for unified system)
npm run test:headed         # watch tests run in browser
npm run test:ui             # Playwright UI mode
```

> **Note**: Playwright tests need to be updated for the new unified event/task system.

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
→ Never open ```index.html``` directly via ```file://```  
→ Always use one of the servers above

### Styles or Scripts Not Loading
→ Check DevTools → Network tab for 404s  
→ Ensure server sets correct ```Content-Type: text/javascript``` for ```.js``` files  
→ ```http-server``` does this automatically

### Form Fields Not Toggling
→ Verify JavaScript console for errors  
→ Check that event listeners are properly attached in ```App.js```  
→ Ensure ```event-type``` select change handler is working

### LocalStorage Not Persisting
→ Only happens if served over ```file://``` protocol  
→ Use ```http://localhost:5500``` for full functionality

## Notes

- **Zero runtime dependencies** — production is just your code
- **Unified Data Model** - Single system handles both events and tasks
- **Priority System** - Visual feedback for task importance
- **Responsive Design** - Works perfectly on all screen sizes
- **Component Architecture** - Clean, maintainable code structure

You're all set. Just run ```npm run dev``` and start using the unified event/task system.