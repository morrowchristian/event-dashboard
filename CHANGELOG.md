# CHANGELOG

## [Unreleased]

### Breaking Changes
- Complete modular refactor: all components moved to `src/components/`, `src/ui/`, `src/services/`
- Flattened utils → single `src/index.js` god file
- App.js now fully re-renders on every update

### Added
- Full Playwright E2E test suite (10 tests written)
- Edit/delete events with confirmation modal
- Mobile menu toggle component
- Proper separation of concerns

### Fixed
- Date grouping and sorting
- Time formatting utilities
- LocalStorage persistence

### Known Issues (Being Fixed Now)
- Mobile sidebar not opening/closing reliably after refactor
- Outside-click-to-close mobile menu broken
- Some event listeners lost during DOM re-render
- Playwright tests currently failing due to above issues

## v0.1.0 - "It Worked Before the Refactor" (2025-11-24)
- Last known fully working version before modular overhaul
- All features functional on desktop and mobile
- All original tests would have passed
