export default class DeleteModal {
    static template() {
        return `
            <div id="delete-modal" class="modal hidden">
                <div class="modal-content" style="max-width: 420px;">
                    <div class="modal-header">
                        <h3><i class="fas fa-exclamation-triangle" style="color: #f72585;"></i> Delete Event</h3>
                        <button class="modal-close" id="delete-modal-close"><i class="fas fa-times"></i></button>
                    </div>
                    <div style="padding: 20px; text-align: center;">
                        <p style="font-size: 1.1rem; margin-bottom: 20px;">
                            Are you sure you want to delete "<span id="delete-event-title" style="font-weight: 600;"></span>"?
                        </p>
                        <p style="color: var(--gray); margin-bottom: 25px;">
                            This action <strong>cannot be undone</strong>.
                        </p>
                        <div style="display: flex; gap: 12px; justify-content: center;">
                            <button type="button" class="btn btn-outline" id="cancel-delete">Cancel</button>
                            <button type="button" class="btn btn-danger" id="confirm-delete">
                                <i class="fas fa-trash"></i> Delete Event
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}