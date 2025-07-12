# Reflection Notes

A modern React application for creating and managing personal reflection notes with enterprise-level architecture and intelligent features.

## 🌐 Live Demo

**[Try Reflection Notes →](https://ripplejb.github.io/reflection-notes/)**

*Deployed automatically via GitHub Actions with full SOLID architecture*

## ✨ Key Features

### 📝 **Smart Note Management**
- Create, edit, and delete reflection notes organized by date
- **Intelligent Header System**: Predefined reflection headers with dropdown selection
- **Auto-Dropdown**: Empty header fields automatically show suggested options
- Custom header support alongside predefined options

### 🎯 **Predefined Reflection Headers**
- Goals, Achievements, Gratitudes
- Lessons Learned, Challenges Faced, Positive Moments
- Personal Growth, Reflections, Action Items
- Insights, Wins, Improvements, Inspiration, Progress Updates

### 💾 **Advanced File Operations**
- Save and load notes using native File System Access API
- Intelligent file handling with unsaved changes warnings
- JSON format for easy data portability
- Browser fallback with localStorage persistence

### 🎨 **Modern User Experience**
- Clean, responsive interface built with Tailwind CSS
- Custom app icon and Progressive Web App (PWA) support
- Convenient header controls for save/load operations
- Real-time markdown rendering with enhanced list formatting

### 🏗️ **Enterprise Architecture (NEW)**
- **SOLID Principles**: Complete refactoring following all 5 SOLID principles
- **Service Layer**: Dependency injection with service container
- **Type Safety**: Comprehensive TypeScript coverage with proper interfaces
- **Extensible Design**: Plugin-ready architecture for future enhancements

## 🚀 **Architecture Highlights**

### SOLID Principles Implementation
- **Single Responsibility**: Each component and service has one clear purpose
- **Open/Closed**: Extensible markdown processor and configuration system
- **Liskov Substitution**: Proper interface implementations throughout
- **Interface Segregation**: Focused, minimal interfaces
- **Dependency Inversion**: Service container with dependency injection

### Service Layer
- **StorageService**: Data persistence abstraction
- **FileSystemService**: File operations abstraction
- **MarkdownProcessor**: Extensible markdown processing with rule system
- **ConfigurationService**: Application settings and predefined headers

### Component Architecture
- **ContentViewer**: Pure presentation component for read-only display
- **ContentEditor**: Dedicated editing functionality with smart features
- **HeaderDropdown**: Reusable dropdown with predefined options
- **ServiceContainer**: Centralized dependency management

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

### Creating Reflection Notes
1. **Add a Date**: Click "Add" in the Dates section to create a new date entry
2. **Select Date**: Click on a date to view/edit its contents
3. **Add Content**: Click "Add" in the Contents section to add reflection entries
4. **Smart Headers**: Start typing in the header field or click the dropdown arrow
   - **Auto-suggestions**: Empty headers automatically show predefined options
   - **Quick Selection**: Choose from Goals, Achievements, Gratitudes, and more
   - **Custom Headers**: Type your own custom reflection headers

### Header Dropdown Features
- **14 Predefined Options**: Carefully curated reflection categories
- **Auto-Open**: Clicking on empty header fields automatically shows suggestions
- **Quick Access**: Dropdown arrow for manual access anytime
- **Spell-Corrected**: Properly spelled options (e.g., "Gratitudes" not "Grattitudes")

### Advanced Content Editing
- **Markdown Support**: Rich text formatting with live preview
- **List Processing**: Automatic formatting of nested lists and indentation
- **Real-time Updates**: Changes saved automatically as you type
- **Edit/View Toggle**: Clean separation between editing and reading modes

### File Operations
- **Smart Save**: Click the Save button in the header
  - First save prompts for file location and name
  - Subsequent saves update the existing file automatically
  - Visual indicator shows current loaded file name
- **Intelligent Load**: Click Load to open existing notes
  - Warns about unsaved changes before loading
  - Supports standard JSON format for portability
- **Data Safety**: Automatic localStorage backup prevents data loss

## Deployment

### Automatic CI/CD Pipeline
This project features enterprise-level deployment automation:

- **Trigger**: Every push to `main` branch automatically deploys
- **Build Process**: TypeScript compilation + Vite optimization
- **Quality Gates**: ESLint and TypeScript checks must pass
- **GitHub Actions**: Fully automated deployment pipeline
- **Live URL**: https://ripplejb.github.io/reflection-notes/

### Manual Deployment Setup

1. **Enable GitHub Pages** in repository settings:
   - Go to Settings → Pages
   - Source: GitHub Actions

2. **Push to main branch** - deployment happens automatically

3. **Monitor Progress** in Actions tab

4. **Access your site** at: `https://yourusername.github.io/reflection-notes/`

### Manual Deployment Setup

1. **Enable GitHub Pages** in your repository settings:
   - Go to Settings → Pages
   - Source: GitHub Actions

2. **Push to main branch** - deployment happens automatically

3. **Access your site** at: `https://yourusername.github.io/reflection-notes/`

## Project Structure

```
src/
├── components/           # React components (SRP compliant)
│   ├── MainPage.tsx     # Main application container
│   ├── ContentComponent.tsx # Content management orchestrator
│   ├── ContentEditor.tsx    # Editing functionality
│   ├── ContentViewer.tsx    # Display functionality
│   ├── HeaderDropdown.tsx   # Smart header suggestions
│   ├── DateComponent.tsx    # Date management
│   └── DiskStorageControls.tsx # File operations
├── services/            # Service layer (DI pattern)
│   ├── ServiceContainer.ts    # Dependency injection container
│   ├── StorageService.ts      # Data persistence abstraction
│   ├── FileSystemService.ts   # File operations abstraction
│   ├── MarkdownProcessor.ts   # Content processing service
│   └── ConfigurationService.ts # App configuration
├── hooks/              # Custom React hooks
│   └── useLocalStorage.ts # Persistent state management
├── models/             # Type definitions
│   └── Note.ts         # Core data models
├── utils/              # Utility functions
│   └── storage.ts      # Legacy storage utilities
└── App.tsx            # Root component

tests/                  # Automated test suite
├── test-functionality.js
└── README.md

.github/workflows/      # GitHub Actions
└── deploy.yml         # Auto-deployment workflow
```

## Technology Stack

- **React 19** - Latest React with advanced hooks and modern patterns
- **TypeScript** - Full type safety and comprehensive coverage
- **Vite 7.0.0** - Lightning-fast development and optimized builds
- **Tailwind CSS** - Utility-first styling with responsive design
- **Service Architecture** - Enterprise-level dependency injection pattern
- **File System Access API** - Native file operations for modern browsers
- **GitHub Actions** - Automated CI/CD pipeline
- **GitHub Pages** - Static site hosting with automatic deployment

## SOLID Architecture Benefits

- **Single Responsibility**: Each component and service has one clear purpose
- **Open/Closed**: Services are open for extension, closed for modification
- **Liskov Substitution**: Interface-based design enables easy testing and mocking
- **Interface Segregation**: Clean, focused service interfaces
- **Dependency Inversion**: High-level modules don't depend on low-level modules

## Testing

The application includes a comprehensive automated test suite covering:
- Component functionality and user interactions
- Service layer business logic and integrations
- SOLID architecture compliance
- Type safety validation

See `tests/README.md` for detailed testing instructions.

Quick test run:
1. Start the development server (`npm run dev`)
2. Open browser console on `http://localhost:5173/`
3. Run: `window.runReflectionNotesTests()`
- **Vite 7.0.0** - Lightning-fast development and optimized builds
- **Tailwind CSS** - Utility-first styling with responsive design
- **Service Architecture** - Enterprise-level dependency injection pattern
- **File System Access API** - Native file operations for modern browsers
- **GitHub Actions** - Automated CI/CD pipeline
- **GitHub Pages** - Static site hosting with automatic deployment

## Browser Compatibility

- ✅ **Chrome/Chromium** (recommended) - Full feature support
- ✅ **Microsoft Edge** - Full feature support  
- ⚠️ **Firefox** (limited) - File System Access API not supported, uses fallback
- ⚠️ **Safari** (limited) - File System Access API not supported, uses fallback

For browsers without File System Access API support, the application gracefully falls back to traditional file download/upload methods.

## Development

### Development Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/reflection-notes.git
cd reflection-notes

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173 in your browser
```

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build optimized production bundle
- `npm run lint` - Run ESLint with SOLID compliance checks
- `npm run type-check` - TypeScript compilation and type validation
- `npm run preview` - Preview production build locally

### Code Quality Standards
- **TypeScript**: Strict mode with comprehensive type coverage
- **ESLint**: Enforced code style and architectural compliance
- **SOLID Principles**: Service-oriented architecture pattern
- **Component Design**: Single Responsibility Principle compliance
- **Interface Abstractions**: Dependency Inversion throughout

### Adding New Features
1. **Services**: Add new capabilities through the service layer
2. **Components**: Follow SRP - split complex components when needed
3. **Dependencies**: Use ServiceContainer for dependency injection
4. **Types**: Define proper interfaces in models/
5. **Tests**: Include comprehensive test coverage for new functionality

## Contributing

### Architecture Guidelines
1. **Single Responsibility**: Each component/service has one clear purpose
2. **Interface Design**: Use abstractions for external dependencies
3. **Service Layer**: Business logic belongs in services, not components
4. **Type Safety**: Maintain comprehensive TypeScript coverage
5. **Testing**: Write tests for new services and complex components

### Pull Request Process
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Follow SOLID principles and existing architecture patterns
4. Add tests for new functionality
5. Ensure all quality checks pass (`npm run lint`, `npm run type-check`)
6. Commit with clear, descriptive messages
7. Push to your fork: `git push origin feature/amazing-feature`
8. Create a Pull Request with detailed description

## License

MIT License - see LICENSE file for details
