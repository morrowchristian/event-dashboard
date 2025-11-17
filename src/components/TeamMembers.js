import DataManager from '../services/data-manager.js';

class TeamMembers {
    constructor() {
        this.teamMembers = DataManager.getTeamMembers();
    }

    render() {
        return `
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Team Members (${this.teamMembers.length})</h3>
                    <div class="card-icon">
                        <i class="fas fa-users"></i>
                    </div>
                </div>
                <div class="team-members-grid" id="team-members-list">
                    ${this.teamMembers.map(member => `
                        <div class="member-card" data-member-id="${member.id}">
                            <div class="member-avatar">${member.avatar}</div>
                            <div class="member-info">
                                <h4>${member.name}</h4>
                                <p>${member.role}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="action-buttons">
                    <button class="btn btn-primary" id="add-event-btn">
                        <i class="fas fa-plus"></i> Add Event
                    </button>
                    <button class="btn btn-outline" id="refresh-btn">
                        <i class="fas fa-sync"></i> Refresh Data
                    </button>
                </div>
            </div>
        `;
    }
}

export default TeamMembers;