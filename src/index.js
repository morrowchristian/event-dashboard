/**
 * Central utilities hub
 */ 

//Local storage with error handling
export const storage = {
    get(key, fallback = null) {
        try {
            const item = localStorage.getItem(key);
            return item !== null ? JSON.parse(item) : fallback;
        } catch (err) {
            console.warn(`storage.get(${key}) failed:`, err);
            return fallback;
        }
    },

    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (err) {
            console.warn(`storage.set(${key}) failed:`, err);
            return false;
        }
    },

    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (err) {
            console.warn(`storage.remove(${key}) failed:`, err);
            return false;
        }
    }
};

// Generate unique ID
export const generateId = () => 
    Date.now().toString(36) + Math.random().toString(36).substr(2);

//Format time: "03:30 PM" → "15:30" for <input type="time">
export const time24toInput = (timeStr) => {
    if (!timeStr) return '';
    const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) return '';
    let [_, hours, minutes, period] = match;
    let h = parseInt(hours);
    if (period.toUpperCase() === 'PM' && h !== 12) h += 12;
    if (period.toUpperCase() === 'AM' && h === 12) h = 0;
    return `${h.toString().padStart(2, '0')}:${minutes}`;
};

// Format time for display: "15:30" → "3:30 PM"
export const formatTime = (time24) => {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
};

// Format date for display: "2025-04-05" → "Apr 5, 2025"
export const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};

/**
 * Generate color from string (for avatars, tags, etc.)
 */
export const stringToColor = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash % 360);
    return `hsl(${hue}, 70%, 60%)`;
};

/**
 * Get initials from name: "John Doe" → "JD"
 */
export const getInitials = (name) => {
    return name
        .split(' ')
        .map(part => part[0]?.toUpperCase() || '')
        .join('')
        .slice(0, 2);
};

/**
 * Deep clone object (safe for localStorage)
 */
export const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

/**
 * Debounce function
 */
export const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

/**
 * Throttle function
 */
export const throttle = (func, limit) => {
    let inThrottle;
    return (...args) => {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

/**
 * Mobile device detection
 */
export const isMobileDevice = () => 
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

/**
 * Validate email
 */
export const isValidEmail = (email) => 
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

/**
 * Show notification via event (used by Notification UI component)
 */
export const showNotification = (message, type = 'info') => {
    document.dispatchEvent(new CustomEvent('notification:show', {
        detail: { message, type }
    }));
};

/**
 * App Constants
 */
export const STORAGE_KEYS = {
    EVENTS_DATA: 'event-dashboard-events',
    TEAM_DATA: 'event-dashboard-team',
    SETTINGS: 'event-dashboard-settings'
};

export const EVENT_STATUS = {
    UPCOMING: 'upcoming',
    ONGOING: 'ongoing',
    COMPLETED: 'completed'
};

export const NOTIFICATION_TYPES = {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info'
};

export const COLORS = {
    PRIMARY: '#4361ee',
    SUCCESS: '#4cc9f0',
    WARNING: '#f72585',
    LIGHT: '#f8f9fa',
    DARK: '#212529',
    GRAY: '#6c757d'
};

export const DEFAULT_CONFIG = {
    UPDATE_INTERVAL: 10000,
    NOTIFICATION_DURATION: 3000
};

export const FEATURE_FLAGS = {
    REAL_TIME_UPDATES: true,
    OFFLINE_MODE: false
};