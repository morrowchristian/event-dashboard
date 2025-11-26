# EventFlow Dashboard – Public API Documentation

Current as of November 25, 2025 (post-modular-refactor)

## DataManager (`src/services/data-manager.js`)

Central service for all data operations. Uses `localStorage` under the hood.

### Methods

| Method                  | Description                                      | Returns                         |
|-------------------------|--------------------------------------------------|---------------------------------|
| `load()`                | Loads data from `localStorage` on app start      | `void`                          |
| `save()`                | Persists current events to `localStorage`        | `void`                          |
| `getEvents()`           | Get all events                                   | `Array<Event>`                  |
| `addEvent(event)`       | Add a new event (auto-generates `id`)            | `Event` (with `id`)             |
| `updateEvent(id, data)` | Update existing event by ID                      | `void`                          |
| `deleteEvent(id)`       | Remove event by ID                               | `void`                          |

### Event Object Shape

```ts
{
  id: number;
  title: string;
  date: string;           // "2025-12-31"
  dateFormatted: string;  // "Wednesday, Dec 31"
  time: string;           // "03:30 PM"
  status: 'upcoming' | 'ongoing' | 'completed';
}
```

> Stats are computed on-the-fly in `Dashboard.js` — no longer stored.

## Component Rendering API

All UI components are stateless and expose a static render/template method.

| Component            | File                                 | Method                        | Returns       | Notes                              |
|----------------------|--------------------------------------|-------------------------------|---------------|------------------------------------|
| `Dashboard`          | `src/components/Dashboard.js`        | `Dashboard.render()`          | `string`      | Stats cards (computed on-the-fly)  |
| `EventList`          | `src/components/EventList.js`        | `EventList.render()`          | `string`      | Groups events by date              |
| `TeamMembers`        | `src/components/TeamMembers.js`      | `TeamMembers.render()`        | `string`      | Grid of team avatars               |
| `Sidebar`            | `src/components/Sidebar.js`          | `Sidebar.template(isOpen)`    | `string`      | Used by App.js                     |
| `MobileMenuToggle`   | `src/components/MobileMenuToggle.js` | `MobileMenuToggle.template()` | `string`      | Hamburger button                   |
| `EventModal`         | `src/components/EventModal.js`       | `EventModal.template()`       | `string`      | Add / Edit modal                   |
| `DeleteModal`        | `src/components/DeleteModal.js`      | `DeleteModal.template()`      | `string`      | Confirmation modal                 |

> No instances are created — components are pure functions/classes with static methods.

## Custom Events (Current)

After the refactor, the app uses **one single source-of-truth event**:

```js
'events:updated'
```

Dispatched whenever events are added, edited, or deleted.

### Usage

```js
// Dispatch (done inside DataManager methods)
document.dispatchEvent(new CustomEvent('events:updated'));

// Listen (used in App.js)
document.addEventListener('events:updated', () => {
  document.querySelector('.stats-section').innerHTML = Dashboard.render();
  
  const eventListContainer = document.querySelector('.events-section > div:last-child');
  if (eventListContainer) {
    eventListContainer.innerHTML = EventList.render();
  }
});
```

**Deprecated / Removed events** (no longer used):
- `dashboard:refresh`
- `event:added`
- `notification:show` (now uses `Notification` class directly)

This keeps the architecture simple, predictable, and easy to debug.

## Utility Exports (`src/index.js`)

All shared helpers are re-exported from a single barrel file.

```js
export {
  storage,           // LocalStorage wrapper
  STORAGE_KEYS,      // { EVENTS: 'EVENTS_DATA' }

  formatTime,        // "15:30" → "03:30 PM"
  formatDate,        // "2025-12-31" → "Wednesday, Dec 31"
  time24toInput,     // "03:30 PM" → "15:30"

  generateId,        // () => Date.now()
  showNotification,  // (msg, type = 'success')

  EVENT_STATUS       // { UPCOMING: 'upcoming', ... }
};
```

### Usage Example

```js
import { formatTime, showNotification, EVENT_STATUS } from './index.js';

const time = formatTime('14:45');        // → "02:45 PM"
showNotification('Event deleted', 'success');

if (event.status === EVENT_STATUS.COMPLETED) {
  // ...
}
```

Keeping everything exported from one file eliminates circular dependencies and makes refactoring safe and predictable.