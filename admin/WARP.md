# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a React-based news website called "Unfiltered" that showcases news categories and articles with sophisticated animations. It's built with Vite, React Router, GSAP animations, Tailwind CSS, and includes Supabase integration for potential backend functionality.

The application features:
- Animated news category navigation
- Video backgrounds and dynamic content
- Responsive design with custom animations
- GitHub Pages deployment capability

## Development Commands

### Core Development
```bash
npm run dev          # Start development server with Vite
npm run build        # Clean dist and build for production  
npm run preview      # Preview production build locally
npm run clean        # Remove dist directory
```

### Code Quality
```bash
npm run lint         # Run ESLint on all files
```

### Deployment
```bash
npm run deploy       # Build and deploy to GitHub Pages
npm run predeploy    # Runs automatically before deploy (builds project)
```

## Architecture Overview

### Application Structure
- **Entry Point**: `src/main.jsx` - Sets up React app with routing, context providers, and animation wrapper
- **Routing**: React Router DOM handles navigation between 4 main pages
- **Context Management**: Custom NavContext manages navigation state and styling
- **Animation System**: GSAP powers page transitions and interactive elements

### Key Components Architecture

#### Navigation System
- `Navbar.jsx`: Fixed top navigation with hamburger menu trigger
- `FullScreenNav.jsx`: Animated full-screen overlay navigation with video elements
- Navigation state managed through `NavContext.jsx` with React Context

#### Page Transition System
- `Stairs.jsx`: Wrapper component that creates animated stair-step transitions between routes
- Uses GSAP timeline to orchestrate entry/exit animations
- Automatically triggers on route changes via `useLocation` hook

#### Component Organization
```
src/
├── Components/
│   ├── Navigation/     # Navigation components
│   ├── common/         # Shared components (Logo, Stairs)
│   ├── home/          # Home page specific components
│   └── projects/      # Project page components
├── context/           # React Context providers
├── pages/             # Route-level page components
└── main.jsx          # Application entry point
```

### Technology Stack Integration

#### GSAP Animation Pipeline
- Page transitions handled by `Stairs.jsx` with staggered animations
- Navigation interactions use GSAP timelines for smooth state changes
- Components use `useGSAP` hook for lifecycle-aware animations

#### Routing & State
- React Router DOM provides client-side routing
- NavContext manages navigation state and theme colors
- Route-based color theming (black for `/projects` and `/agence`, white for others)

#### Styling Architecture
- Tailwind CSS v4 with Vite plugin integration
- Custom font references (`font-[font2]`) suggest custom font loading
- Responsive design with `lg:` breakpoints
- CSS custom properties for dynamic styling

## Development Notes

### Asset Management
- All assets stored in `public/` directory (videos in `public/videos/`, images in `public/images/`)
- Asset paths use Vite's `import.meta.env.BASE_URL` for proper base path handling:
  - `${import.meta.env.BASE_URL}videos/file.mp4`
  - `${import.meta.env.BASE_URL}images/file.jpg`
- **Important**: Never use static paths (`/videos/`) or Create React App syntax (`%PUBLIC_URL%/`)
- In dev: `BASE_URL` = `/Unfiltered/`, in production: same base path applied automatically
- This ensures assets work in both development and deployment environments

### Supabase Integration
- `@supabase/supabase-js` dependency suggests backend data integration
- No current implementation visible, likely for future news content management

### Build Configuration
- Vite config sets base path to `/Unfiltered/` for GitHub Pages
- ESLint configured with React hooks and refresh plugins
- Modern JavaScript (ES modules) throughout

### Animation Performance
- GSAP animations use hardware acceleration
- Staggered animations prevent layout thrashing
- Video elements use autoPlay, loop, and muted for optimal UX

## Deployment Target

This project deploys to GitHub Pages at `https://risi-baba.github.io/unfiltered` with automatic build and deployment via the `deploy` script.

### Common Deployment Issues

**Assets not loading after deployment:**
- Use `import.meta.env.BASE_URL` for all public assets: `${import.meta.env.BASE_URL}videos/file.mp4`
- React Router needs `basename="/Unfiltered"` to handle routing with base path
- Vite's `base: '/Unfiltered/'` config works with `BASE_URL` for consistent asset paths
- Never use static paths or `%PUBLIC_URL%` - use Vite's environment variables
- Test locally with `npm run build && npm run preview` before deploying
