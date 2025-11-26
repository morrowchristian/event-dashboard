export default class Sidebar {
    static template(isMobileOpen = false) {
        const mobileClass = isMobileOpen ? 'mobile-open' : '';
        return `
            <div class="sidebar ${mobileClass}" id="sidebar">
                <div class="logo">
                    <h1><i class="fas fa-calendar-alt"></i> EventFlow</h1>
                </div>
                <ul class="nav-links">
                    <li class="active"><i class="fas fa-home"></i> Dashboard</li>
                    <li><i class="fas fa-calendar-day"></i> Events</li>
                    <li><i class="fas fa-tasks"></i> Tasks</li>
                    <li><i class="fas fa-users"></i> Team</li>
                </ul>
                <div class="realtime-status">
                    <i class="fas fa-circle status-indicator"></i>
                    <span>Live Updates Active</span>
                </div>
            </div>
        `;
    }
}