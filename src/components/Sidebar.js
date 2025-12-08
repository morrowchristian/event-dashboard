export default class Sidebar {
    static template(isMobileOpen = false, activeTab = 'dashboard') {
        const mobileClass = isMobileOpen ? 'mobile-open' : '';
        return `
            <div class="sidebar ${mobileClass}" id="sidebar">
                <div class="logo">
                    <h1><i class="fas fa-calendar-alt"></i> EventFlow</h1>
                </div>
                <ul class="nav-links">
                    <li class="${activeTab === 'dashboard' ? 'active' : ''}" data-tab="dashboard">
                        <i class="fas fa-home"></i> Dashboard
                    </li>
                    <li class="${activeTab === 'events' ? 'active' : ''}" data-tab="events">
                        <i class="fas fa-calendar-day"></i> Schedule
                    </li>
                    <li class="${activeTab === 'team' ? 'active' : ''}" data-tab="team">
                        <i class="fas fa-users"></i> Team
                    </li>
                </ul>
                <div class="realtime-status">
                    <i class="fas fa-circle status-indicator"></i>
                    <span>Live Updates Active</span>
                </div>
            </div>
        `;
    }
}