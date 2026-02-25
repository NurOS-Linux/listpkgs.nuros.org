# System Architecture

## Overview

The NurOS Package Search System consists of three main components:

1. **Package List Generator** - Aggregates package metadata
2. **Frontend Application** - Web interface for searching
3. **Deployment Pipeline** - Automated CI/CD

## System Flow Diagram

```
NurOS Repositories
    ↓
    └→ [Update List] (Every 6 hours)
       └→ packages.json created
          ↓
    └→ [Build Frontend] (On list update)
       └→ Frontend built with Vite
          └→ Data embedded
             ↓
    └→ [Deploy Pages] (On build success)
       └→ GitHub Pages updated
          └→ Live at listpkgs.nuros.org
```

## Component Details

### 1. Package List Generator (`update-list.yml`)

**Responsibility**: Scan repositories and aggregate package metadata

**How it works**:
- Runs every 6 hours via GitHub Actions
- Iterates through all repos in NurOS-Packages organization
- Reads `metadata.json` from each repository
- Combines all metadata into single `packages.json` file
- Uploads as artifact for next workflow

**Output**:
- `packages.json` - Complete package catalog
- `packages.json.sha256` - Integrity checksum

**Data structure** (each package):
```json
{
  "name": "package-name",
  "version": "1.0.0",
  "description": "Package description",
  "maintainer": "maintainer-name",
  "repository": "https://github.com/...",
  "source": "repository-name",
  "category": "development",
  "tags": ["tag1", "tag2"],
  "dependencies": [],
  "metadata": {}
}
```

### 2. Frontend Application

**Framework**: SolidJS + TypeScript
**Build Tool**: Vite
**Styling**: Modular SCSS

**Features**:
- Real-time package search
- Multiple view modes (list, grid, grouped)
- Advanced filtering (source, category)
- Dark mode support
- JSON preview
- Dark Reader compatibility

**Architecture**:
```
src/
├── App.tsx                 # Main app component
├── index.tsx              # Entry point
├── hooks/
│   └── usePackageData.ts  # Data fetching & search logic
├── components/
│   ├── SearchBar.tsx      # Search input
│   ├── Filters.tsx        # Filter controls
│   ├── PackageList.tsx    # List view
│   ├── PackageCard.tsx    # Individual package card
│   ├── GroupedList.tsx    # Grouped view
│   ├── JsonDisplay.tsx    # JSON preview
│   ├── Sidebar.tsx        # Navigation sidebar
│   └── TreeNavigation.tsx # Tree view renderer
└── styles/                # Modular SCSS structure
    ├── variables.scss     # Global variables
    ├── base.scss         # Base styles
    ├── animations.scss   # Keyframes
    ├── components/       # Component styles
    └── layout/          # Layout styles
```

### 3. Deployment Pipeline

**Platform**: GitHub Pages + GitHub Actions

**Workflow sequence**:

1. **Trigger**: Package list updated or manual dispatch
2. **Build**: 
   - Checkout code
   - Download latest package data
   - Install dependencies (`pnpm`)
   - Run `pnpm build`
   - Verify artifacts
   - Upload as artifact
3. **Deploy**:
   - Download build artifact
   - Configure GitHub Pages
   - Upload pages artifact
   - Deploy to `https://listpkgs.nuros.org`

## Data Flow

### Search Flow

```
User Input
    ↓
SearchBar Component
    ↓
usePackageData Hook
    ↓
Filter/Search Logic
    ↓
Display updated results
```

### Package Metadata Flow

```
Repository metadata.json
    ↓
Update List Workflow
    ↓
packages.json (artifact)
    ↓
Build Frontend Workflow
    ↓
Embedded in frontend
    ↓
Bundled with HTML/JS/CSS
    ↓
Deploy to GitHub Pages
    ↓
Downloaded by Browser
    ↓
Rendered in UI
```

## Technology Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| **Language** | TypeScript | 5.9.3 |
| **Framework** | SolidJS | 1.9.10 |
| **Build Tool** | Vite | 7.3.1 |
| **Styling** | SCSS | Latest |
| **Package Manager** | pnpm | 9.x |
| **Runtime** | Node.js | 22 |
| **Testing** | Playwright | 1.48.2 |
| **Hosting** | GitHub Pages | - |
| **CI/CD** | GitHub Actions | - |

## Performance Considerations

### Frontend
- Code splitting with Vite
- SCSS selectors optimized
- Lazy loading for large lists
- Real-time search (client-side)
- Minimal dependencies

### Data Updates
- Scheduled updates (not on demand)
- Efficient git operations
- Artifact caching
- Parallel workflows possible

### Deployment
- 15-minute timeout on builds
- Artifact retention: 7 days
- GitHub Pages caching friendly
- CDN distribution included

## Scalability

**Current limits**:
- Package list size: Supports thousands of packages
- Search performance: Real-time up to ~5000 packages
- Browser memory: Optimized for modern devices

**Future improvements**:
- Virtual scrolling for very large lists
- Server-side search (if needed)
- Pagination or infinite scroll
- Advanced filtering options

## Security

- No external API calls from frontend
- All data embedded at build time
- No third-party trackers
- Content Security Policy friendly
- No sensitive data exposure

## Monitoring

- GitHub Actions logs available
- Artifact upload/download tracking
- Build success/failure notifications
- Scheduled workflow status
- Error summaries in step summary

---

See [Deployment Guide](./deployment.md) for detailed deployment information.
