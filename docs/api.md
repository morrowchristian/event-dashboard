# Event Dashboard API Documentation

## Overview

This document describes the JavaScript API for the Event Dashboard components and services.

## Data Manager API

### `DataManager` Class

Core service for managing application data.

#### Methods

##### `getTeamMembers()`

Returns the list of team members.

**Returns:** `Array<Object>`

```javascript
[
  {
    id: Number,
    name: String,
    role: String,
    avatar: String
  }
]
```

##### `getEvents()`

Returns the list of events.

**Returns:** `Array<Object>`

```javascript
[
  {
    id: Number,
    time: String,
    title: String,
    status: String // 'upcoming', 'ongoing', 'completed'
  }
]
```

##### `getStats()`

Returns dashboard statistics.

**Returns:** `Object`

```javascript
{
  upcomingEvents: Number,
  responseRate: Number,
  availableMembers: Number,
  totalMembers: Number,
  taskProgress: Number,
  remainingTasks: Number
}
```

##### `updateStats(newStats)`

Updates dashboard statistics.

**Parameters:**
- `newStats` (Object): Partial stats object to merge

**Returns:** `Object` - Updated stats

##### `addEvent(event)`

Adds a new event.

**Parameters:**
- `event` (Object): Event data without id

**Returns:** `Object` - Created event with id

## Component API

### Base Component Structure

All components follow this pattern:

```javascript
class Component {
  constructor() {
    // Initialize component state
  }
  
  render() {
    // Return HTML string
    return `
      <div>Component HTML</div>
    `;
  }
}
```

### Available Components

#### Dashboard

Renders the main dashboard with statistics cards.

#### EventList

Renders the schedule of events.

#### TeamMembers

Renders the team members grid.

## Event System

### Custom Events

The application uses these custom events:

- `dashboard:refresh` - Triggered when data needs refresh
- `event:added` - Triggered when new event is added
- `notification:show` - Triggered to show notifications

### Example Usage

```javascript
// Dispatch custom event
document.dispatchEvent(new CustomEvent('dashboard:refresh'));

// Listen for event
document.addEventListener('notification:show', (e) => {
  console.log(e.detail.message, e.detail.type);
});
```