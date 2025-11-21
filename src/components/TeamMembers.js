/**
 * Team Members Component
 * Displays team member cards with avatars, names, and roles
 * Shows team availability and member information in a responsive grid
 */

import DataManager from '../services/data-manager.js';

class TeamMembers {
    constructor() {
        this.teamMembers = DataManager.getTeamMembers();
    }

    /**
     * Render team members grid
     * Creates responsive card layout for team member display
     * Shows avatar, name, and role for each team member
     * @returns {string} HTML string for team members card with member grid
     */
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
            </div>
        `;
    }
}

export default TeamMembers;