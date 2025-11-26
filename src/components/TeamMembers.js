export default class TeamMembers {
    static render() {
        return `
            <div class="team-grid">
                ${['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Williams'].map(name => `
                    <div class="team-member">
                        <div class="user-avatar">${name.split(' ').map(n => n[0]).join('')}</div>
                        <p>${name}</p>
                    </div>
                `).join('')}
            </div>
        `;
    }
}