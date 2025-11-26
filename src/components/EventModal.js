export default class EventModal {
    static template() {
        return `
            <div id="event-modal" class="modal hidden">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3><i class="fas fa-calendar-plus"></i> Add New Event</h3>
                        <button class="modal-close" id="modal-close"><i class="fas fa-times"></i></button>
                    </div>
                    <form id="event-form" class="event-form">
                        <div class="form-group">
                            <label for="event-title">Event Title *</label>
                            <input type="text" id="event-title" name="title" placeholder="Enter event title" required>
                            <span class="error-message" id="title-error"></span>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="event-date">Date *</label>
                                <input type="date" id="event-date" name="date" required>
                                <span class="error-message" id="date-error"></span>
                            </div>
                            <div class="form-group">
                                <label for="event-time">Time *</label>
                                <input type="time" id="event-time" name="time" required>
                                <span class="error-message" id="time-error"></span>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="event-status">Status *</label>
                            <select id="event-status" name="status" required>
                                <option value="upcoming">Upcoming</option>
                                <option value="ongoing">Ongoing</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn btn-outline" id="cancel-btn">Cancel</button>
                            <button type="submit" class="btn btn-primary" id="submit-btn">
                                <i class="fas fa-plus"></i> Add Event
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }
}