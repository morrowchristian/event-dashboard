# CHANGELOG

## [Unreleased]

### Added
- **Unified Event/Task System** - Single interface for both events and tasks
- **Task Priority System** - High/Medium/Low with visual color-coded badges
- **Dynamic Form Fields** - Time input for events, priority selector for tasks
- **Functional Sidebar Navigation** - Working tab switching (Dashboard, Schedule, Team)
- **Component-Based CSS Architecture** - Organized, maintainable styling
- **Task-specific statistics** in dashboard
- **Priority badges** in schedule view

### Changed
- **Merged Events and Tasks tabs** into unified Schedule
- **Updated EventModal** to handle both event and task creation
- **Enhanced EventList** to display tasks with priority badges
- **Modified DataManager** to support `type` and `priority` fields
- **Improved mobile sidebar** with proper event delegation
- **Reorganized CSS** into logical component sections

### Fixed
- **Mobile sidebar navigation** - Now fully functional
- **Tab switching** - Proper active state management
- **Template literal comments** - Removed from render methods
- **Event delegation** - Re-attached after DOM re-render
- **Form validation** - Updated for unified system
- **Dynamic form fields** - Proper toggling between time and priority

### Breaking Changes
- Removed separate "Tasks" tab from sidebar
- Changed "Add Event" to "Add Item" in UI
- Event model extended with `type` and `priority` fields
- Form structure updated with type selector

## v0.2.0 - "Unified System" (2025-12-07)
- Complete unification of events and tasks
- Functional sidebar navigation with tab switching
- Task priority system with visual badges
- Component-based CSS architecture
- Mobile experience fully restored and enhanced

## v0.1.0 - "It Worked Before the Refactor" (2025-11-24)
- Last known fully working version before modular overhaul
- All features functional on desktop and mobile
- All original tests would have passed