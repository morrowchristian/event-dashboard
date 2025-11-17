/**
 * Application constants and configuration
 */

// Event status constants
export const EVENT_STATUS = {
    UPCOMING: 'upcoming',
    ONGOING: 'ongoing',
    COMPLETED: 'completed'
};

// Notification types
export const NOTIFICATION_TYPES = {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info'
};

// Color scheme
export const COLORS = {
    PRIMARY: '#4361ee',
    SECONDARY: '#3f37c9',
    SUCCESS: '#4cc9f0',
    WARNING: '#f72585',
    LIGHT: '#f8f9fa',
    DARK: '#212529',
    GRAY: '#6c757d'
};

// Team roles
export const TEAM_ROLES = {
    PROJECT_MANAGER: 'Project Manager',
    EVENT_COORDINATOR: 'Event Coordinator',
    MARKETING_LEAD: 'Marketing Lead',
    OPERATIONS: 'Operations',
    DEVELOPER: 'Developer',
    DESIGNER: 'Designer',
    CONTENT_SPECIALIST: 'Content Specialist'
};

// Local storage keys
export const STORAGE_KEYS = {
    TEAM_DATA: 'event-dashboard-team',
    EVENTS_DATA: 'event-dashboard-events',
    SETTINGS: 'event-dashboard-settings'
};

// API endpoints (for future use)
export const API_ENDPOINTS = {
    EVENTS: '/api/events',
    TEAM: '/api/team',
    STATS: '/api/stats'
};

// Date and time formats
export const DATE_FORMATS = {
    DISPLAY_TIME: 'h:mm A',
    DISPLAY_DATE: 'MMM dd, yyyy',
    ISO_DATE: 'yyyy-MM-dd'
};

// Default configuration
export const DEFAULT_CONFIG = {
    TEAM_SIZE: 20,
    UPDATE_INTERVAL: 10000, // 10 seconds
    NOTIFICATION_DURATION: 3000, // 3 seconds
    ITEMS_PER_PAGE: 10
};

// Feature flags
export const FEATURE_FLAGS = {
    REAL_TIME_UPDATES: true,
    OFFLINE_MODE: false,
    ADVANCED_ANALYTICS: false,
    EXPORT_FUNCTIONALITY: false
};