# Reflection Notes

A modern React application for creating and managing personal reflection notes with file save/load functionality.

## 🌐 Live Demo

**[Try Reflection Notes →](https://ripplejb.github.io/reflection-notes/)**

*Deployed automatically via GitHub Actions*

## Features

- 📝 **Note Management**: Create, edit, and delete reflection notes organized by date
- 💾 **File Operations**: Save and load notes using the native File System Access API
- 🎨 **Modern UI**: Clean, responsive interface built with Tailwind CSS
- 📱 **Header Controls**: Convenient save/load buttons in the header for easy access
- 💾 **Data Persistence**: Automatic localStorage backup with intelligent file handling
- 🚀 **Auto Deploy**: Continuous deployment to GitHub Pages

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Modern browser with File System Access API support (Chrome, Edge recommended)

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/ripplejb/reflection-notes.git
   cd reflection-notes
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173/`

### Production Build

```bash
npm run build
npm run preview
```

## Usage

### Creating Notes
1. Click "Add" in the Dates section to create a new date entry
2. Select a date to view/edit its contents
3. Click "Add" in the Contents section to add reflection entries
4. Edit the header and content inline

### Saving and Loading
- **Save**: Click the Save button in the header to save your notes
  - If no file is loaded, you'll be prompted to choose a location
  - If a file is already loaded, it will save to the existing file
- **Load**: Click the Load button to open an existing notes file

## Deployment

### Automatic Deployment
This project is configured with GitHub Actions for automatic deployment to GitHub Pages:

- **Trigger**: Pushes to `main` branch
- **Build**: Runs `npm ci && npm run build`
- **Deploy**: Automatically deploys to GitHub Pages
- **URL**: https://ripplejb.github.io/reflection-notes/

### Manual Deployment Setup

1. **Enable GitHub Pages** in your repository settings:
   - Go to Settings → Pages
   - Source: GitHub Actions

2. **Push to main branch** - deployment happens automatically

3. **Access your site** at: `https://yourusername.github.io/reflection-notes/`

## Project Structure

```
src/
├── components/          # React components
│   ├── MainPage.tsx    # Main application layout
│   ├── DateComponent.tsx
│   ├── ContentComponent.tsx
│   └── DiskStorageControls.tsx
├── hooks/              # Custom React hooks
│   └── useLocalStorage.ts
├── models/             # TypeScript interfaces
│   └── Note.ts
├── utils/              # Utility functions
│   └── storage.ts
└── App.tsx            # Root component

tests/                  # Automated test suite
├── test-functionality.js
└── README.md

.github/workflows/      # GitHub Actions
└── deploy.yml         # Auto-deployment workflow
```

## Testing

The application includes a comprehensive automated test suite. See `tests/README.md` for detailed testing instructions.

Quick test run:
1. Start the development server (`npm run dev`)
2. Open browser console on `http://localhost:5173/`
3. Run: `window.runReflectionNotesTests()`

## Technology Stack

- **React 19** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **File System Access API** - Native file operations
- **GitHub Actions** - CI/CD pipeline
- **GitHub Pages** - Static site hosting

## Browser Compatibility

- ✅ **Chrome/Chromium** (recommended)
- ✅ **Microsoft Edge**
- ⚠️ **Firefox** (limited - File System Access API not supported)
- ⚠️ **Safari** (limited - File System Access API not supported)

For browsers without File System Access API support, the application will display a warning message.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production  
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test thoroughly
4. Commit: `git commit -m 'Add feature-name'`
5. Push: `git push origin feature-name`
6. Create a Pull Request

## License

MIT License - see LICENSE file for details
