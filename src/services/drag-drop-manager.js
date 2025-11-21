/**
 * Drag and Drop Manager
 * Manages drag-and-drop functionality for event scheduling
 * Handles draggable events, drop zones, and event rescheduling
 * Singleton pattern - exports single instance
 */

import DataManager from './data-manager.js';
import { showNotification } from '../utils/helpers.js';

class DragDropManager {
    constructor() {
        /**
         * Tracks whether a drag operation is currently in progress
         * @type {boolean}
         */
        this.isDragging = false;

        /**
         * Reference to the currently dragged event
         * @type {Object|null}
         */
        this.draggedEvent = null;

        /**
         * Map of registered drop zones and their options
         * @type {Map<HTMLElement, Object>}
         */
        this.dropTargets = new Map();
    }

    /**
     * Initialize drag and drop manager
     * Sets up global event listeners for drag operations
     */
    init() {
        this.setupGlobalEventListeners();
        console.log('Drag and Drop manager initialized');
    }

    /**
     * Set up global drag and drop event listeners
     * Handles dragstart, dragend, dragover, dragleave, and drop events
     * @private
     */
    setupGlobalEventListeners() {
        /**
         * Handle drag start
         * Initiates drag operation and sets drag data
         */
        document.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('draggable-event')) {
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', e.target.dataset.eventId);
                this.isDragging = true;
                e.target.classList.add('dragging');
            }
        });

        /**
         * Handle drag end
         * Cleans up drag state and visual feedback
         */
        document.addEventListener('dragend', (e) => {
            if (e.target.classList.contains('draggable-event')) {
                this.isDragging = false;
                e.target.classList.remove('dragging');
                // Remove drag-over class from all drop zones
                document.querySelectorAll('.drop-zone').forEach(zone => {
                    zone.classList.remove('drag-over');
                });
            }
        });

        /**
         * Handle drag over
         * Provides visual feedback when hovering over drop zones
         */
        document.addEventListener('dragover', (e) => {
            if (this.isDragging) {
                e.preventDefault(); // Required to allow drop
                const dropZone = e.target.closest('.drop-zone');
                if (dropZone) {
                    dropZone.classList.add('drag-over');
                }
            }
        });

        /**
         * Handle drag leave
         * Removes visual feedback when leaving drop zone
         */
        document.addEventListener('dragleave', (e) => {
            if (e.target.classList.contains('drop-zone')) {
                e.target.classList.remove('drag-over');
            }
        });

        /**
         * Handle drop
         * Processes the drop event and updates event time/date
         */
        document.addEventListener('drop', (e) => {
            e.preventDefault();
            const dropZone = e.target.closest('.drop-zone');
            if (dropZone && this.isDragging) {
                const eventId = e.dataTransfer.getData('text/plain');
                this.handleEventDrop(eventId, dropZone);
            }
            // Clean up all drop zone visual feedback
            document.querySelectorAll('.drop-zone').forEach(zone => {
                zone.classList.remove('drag-over');
            });
        });
    }

    /**
     * Handle event drop on a drop zone
     * Updates event time/date and dispatches update event
     * @param {string} eventId - ID of the dropped event
     * @param {HTMLElement} dropZone - Target drop zone element
     * @fires events:updated - Dispatched when event is successfully moved
     */
    handleEventDrop(eventId, dropZone) {
        console.log('=== DRAG DROP DEBUG ===');
        console.log('Event ID:', eventId);
        console.log('Drop Zone:', dropZone);
        console.log('Drop Zone time:', dropZone?.dataset?.time);
        
        const event = DataManager.getEvents().find(e => e.id == eventId);
        console.log('Found event:', event);
        
        if (!event) {
            console.log('❌ Event not found!');
            return;
        }

        const newTime = dropZone.dataset.time;
        console.log('Updating event time from', event.time, 'to', newTime);
        
        // Update event time
        event.time = newTime;
        
        // Show success feedback
        showNotification(`Event "${event.title}" moved to ${newTime}`, 'success');
        
        // Dispatch event for UI updates
        document.dispatchEvent(new CustomEvent('events:updated', {
            detail: { updatedEvent: event }
        }));

        console.log('✅ Event drop completed successfully');
        console.log('=====================');
    }

    /**
     * Get current date in ISO format (YYYY-MM-DD)
     * Used as fallback when drop zone doesn't specify date
     * @returns {string} Current date in ISO format
     * @example
     * getCurrentDate() // Returns "2025-01-15"
     */
    getCurrentDate() {
        return new Date().toISOString().split('T')[0];
    }

    /**
     * Register an element as a drop zone
     * Adds necessary classes and data attributes for drop functionality
     * @param {HTMLElement} element - Element to register as drop zone
     * @param {Object} options - Drop zone configuration
     * @param {string} [options.time] - Time slot this drop zone represents
     * @param {string} [options.date] - Date this drop zone represents
     * @example
     * registerDropZone(element, { time: '10:00 AM', date: '2025-01-15' })
     */
    registerDropZone(element, options = {}) {
        if (!element) return;

        element.classList.add('drop-zone');
        if (options.time) element.dataset.time = options.time;
        if (options.date) element.dataset.date = options.date;

        this.dropTargets.set(element, options);
    }

    /**
     * Unregister an element as a drop zone
     * Removes drop zone functionality and cleans up references
     * @param {HTMLElement} element - Element to unregister
     */
    unregisterDropZone(element) {
        element.classList.remove('drop-zone');
        this.dropTargets.delete(element);
    }

    /**
     * Make an element draggable
     * Enables drag functionality for event elements
     * @param {HTMLElement} element - Element to make draggable
     * @param {Object} eventData - Event data object
     * @param {number|string} eventData.id - Unique event identifier
     * @example
     * makeDraggable(eventElement, { id: 1, title: 'Meeting', time: '10:00 AM' })
     */
    makeDraggable(element, eventData) {
        if (!element) return;

        element.classList.add('draggable-event');
        element.draggable = true;
        element.dataset.eventId = eventData.id;
    }
}

// Export singleton instance for app-wide drag and drop management
export default new DragDropManager();