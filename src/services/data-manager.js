import { storage, STORAGE_KEYS } from '../index.js';
let events = [];

export default {
    getEvents: () => events,
    addEvent: (event) => { events.push({ ...event, id: Date.now() }); },
    updateEvent: (id, data) => {
        const idx = events.findIndex(e => e.id == id);
        if (idx > -1) events[idx] = { ...events[idx], ...data };
    },
    deleteEvent: (id) => { events = events.filter(e => e.id != id); },
    load: () => {
        const data = storage.get(STORAGE_KEYS.EVENTS_DATA);
        if (data) events = data;
    },
    save: () => storage.set(STORAGE_KEYS.EVENTS_DATA, events)
};