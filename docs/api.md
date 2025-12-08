# EventFlow Dashboard – Public API Documentation

Current as of December 7, 2025 (post-unified-system-update)

## DataManager (```src/services/data-manager.js```)

Central service for all data operations. Uses ```localStorage``` under the hood.

### Methods

| Method                  | Description                                      | Returns                         |
|-------------------------|--------------------------------------------------|---------------------------------|
| ```load()```            | Loads data from ```localStorage``` on app start  | ```void```                      |
| ```save()```            | Persists current events to ```localStorage```    | ```void```                      |
| ```getEvents()```       | Get all events                                   | ```Array<Event>```              |
| ```addEvent(event)```   | Add a new event (auto-generates ```id```)        | ```Event``` (with ```id```)     |
| ```updateEvent(id, data)``` | Update existing event by ID                  | ```void```                      |
| ```deleteEvent(id)```   | Remove event by ID                               | ```void```                      |

### Event/Task Object Shape

```
{
  id: number;
  title: string;
  date: string;           // "2025-12-31"
  dateFormatted: string;  // "Wednesday, Dec 31"
  time: string;           // "03:30 PM" or "All Day" for tasks
  status: 'upcoming' | 'ongoing' | 'completed';
  type: 'event' | 'task'; // NEW: Item type
  priority: 'low' | 'medium' | 'high' | null; // NEW: Only for tasks
}
```

> Stats are computed on-the-fly in ```Dashboard.js``` — includes separate event/task counts.

## Component Rendering API

All UI components are stateless and expose a static render/template method.

| Component            | File                                 | Method                        | Returns       | Notes                              |
|----------------------|--------------------------------------|-------------------------------|---------------|------------------------------------|
| ```Dashboard```      | ```src/components/Dashboard.js```    | ```Dashboard.render()```      | ```string```  | Stats cards including task count   |
| ```EventList```      | ```src/components/EventList.js```    | ```EventList.render()```      | ```string```  | Unified timeline with priorities   |
| ```TeamMembers```    | ```src/components/TeamMembers.js```  | ```TeamMembers.render()```    | ```string```  | Grid of team avatars               |
| ```Sidebar```        | ```src/components/Sidebar.js```      | ```Sidebar.template(isOpen, activeTab)``` | ```string``` | Now supports active tab state      |
| ```MobileMenuToggle```| ```src/components/MobileMenuToggle.js``` | ```MobileMenuToggle.template()``` | ```string``` | Hamburger button                   |
| ```EventModal```     | ```src/components/EventModal.js```   | ```EventModal.template()```   | ```string```  | Unified add/edit modal             |
| ```DeleteModal```    | ```src/components/DeleteModal.js```  | ```DeleteModal.template()```  | ```string```  | Confirmation modal                 |

## Unified Event/Task System

### Type-Specific Behavior
- **Events**: Require time input, display specific times
- **Tasks**: Show "All Day", include priority selector (High/Medium/Low)

### Priority System
```
.priority-high    { background: rgba(247, 37, 133, 0.15); color: #f72585; }
.priority-medium  { background: rgba(76, 201, 240, 0.15); color: #4cc9f0; }
.priority-low     { background: rgba(108, 117, 125, 0.15); color: #6c757d; }
```

### Sorting Logic
- Events sorted by time (chronological)
- Tasks sorted by priority (High → Medium → Low)
- Mixed items: Events before tasks on same date

## Custom Events

The app uses **one single source-of-truth event**:

```
'events:updated'
```

Dispatched whenever events/tasks are added, edited, or deleted.

### Usage

```
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

## Utility Exports (```src/index.js```)

All shared helpers are re-exported from a single barrel file.

```
export {
  storage,           // LocalStorage wrapper
  STORAGE_KEYS,      // { EVENTS: 'EVENTS_DATA' }

  formatTime,        // "15:30" → "03:30 PM"
  formatDate,        // "2025-12-31" → "Wednesday, Dec 31"
  time24toInput,     // "03:30 PM" → "15:30"

  generateId,        // () => Date.now()
  showNotification,  // (msg, type = 'success')

  EVENT_STATUS,      // { UPCOMING: 'upcoming', ... }
  
  // NEW: Task utilities (if added in future)
  // getPriorityColor,
  // formatPriority,
};
```

### Usage Example

```
import { formatTime, showNotification, EVENT_STATUS } from './index.js';

const time = formatTime('14:45');        // → "02:45 PM"
showNotification('Task added successfully', 'success');

if (event.status === EVENT_STATUS.COMPLETED) {
  // ...
}
```