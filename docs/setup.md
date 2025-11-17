# Setup Guide

## Development Environment Setup

### Prerequisites

- Node.js (v16 or higher)
- Git
- Modern web browser

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/event-dashboard.git
   cd event-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:8000`

### Alternative Setup (Without Node.js)

#### Using Python

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

#### Using PHP

```bash
php -S localhost:8000
```

## Project Structure

```
event-dashboard/
├── src/
│   ├── components/     # UI Components
│   ├── services/       # Data management
│   ├── styles/         # CSS stylesheets
│   ├── utils/          # Helper functions
│   └── tests/          # Test files
├── public/             # Static assets
├── docs/               # Documentation
└── scripts/            # Build scripts
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Troubleshooting

### Common Issues

**CORS errors during development**
- Use a local server instead of opening HTML file directly
- Configure server to allow cross-origin requests

**Modules not loading**
- Ensure you're using a modern browser
- Check that files are served with correct MIME types

**Styles not applying**
- Verify CSS file paths in HTML
- Check browser console for 404 errors

### Getting Help

- Check the browser console for errors
- Verify all file paths are correct
- Ensure JavaScript modules are supported