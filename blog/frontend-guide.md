# Frontend Guide

## Overview

The NurOS Package List frontend is a modern, responsive web application built with SolidJS. This
guide covers features, UI components, and development tips.

## User Interface

### Main Layout

```
┌─────────────────────────────────────────────────┐
│  NurOS Package List  │ [Theme] [Source Filter] │  ← Header
├─────────────────────────────────────────────────┤
│ [Search Bar]          [View Mode: List/Grid]    │  ← Search Area
├──────────────┬────────────────────────────────┤
│              │  [Filter Options]              │
│Sidebar       ├────────────────────────────────┤
│ Navigation   │                                │
│              │  Package Results               │
│              │  ├─ Package Card 1            │
│              │  ├─ Package Card 2            │
│              │  └─ ...                       │
│              │                                │
└──────────────┴────────────────────────────────┘
```

### Components

#### SearchBar

- Real-time search as you type
- Keyboard shortcut: `/` to focus
- Clear button for quick reset
- Accessible input field
- Debounced input processing

#### View Modes

**List View**

- Detailed information per row
- Shows: name, version, maintainer, description
- Best for detailed searches
- Expandable cards for more info

**Grid View**

- Compact card layout
- Shows: name, version, category
- Visual browsing experience
- Hover effects for interactivity

**Grouped View**

- Packages organized by category
- Expandable/collapsible groups
- Counts packages per group
- Search within groups

#### Filters

**Source Filter**

- Filter by package repository
- Multi-select capable
- Shows package count per source
- Quick category overview

**Additional Filters** (expandable)

- Category
- Maintainer
- Version range
- Tags

#### Package Card

**Information displayed**:

- Package name (bold heading)
- Version badge
- Category tag
- Brief description
- Repository source
- Maintain button

**Interactions**:

- Hover animations
- Click to view details
- Copy button for name
- Link to repository

#### Sidebar

**Navigation**:

- Package category tree
- Source repository tree
- Quick filter selections
- Search result count

**Features**:

- Collapsible sections
- Syntax highlighting
- Keyboard navigation
- Dark mode compatibility

#### JSON Display

**View raw metadata**:

- Complete package JSON
- Pretty printed
- Syntax highlighting
- Copy to clipboard
- Search within JSON

### Dark Mode

**Features**:

- Auto-detect system preference
- Manual toggle in header
- Persistent across sessions
- Dark Reader compatible
- All animations visible

**Colors** (Dark Mode):

- Background: #1a1a1a
- Text: #e0e0e0
- Primary: #3b82f6
- Accent: #10b981

## Styling System

### Architecture

Styles are organized in modular SCSS files:

```
src/styles/
├── variables.scss          # CSS custom properties
├── base.scss              # Global resets
├── animations.scss        # @keyframes
├── index.scss             # Entry point
├── components/            # Component styles
│   ├── search-bar.scss
│   ├── filters.scss
│   ├── view-mode.scss
│   ├── package-card.scss
│   ├── grouped-list.scss
│   └── sidebar.scss
└── layout/
    ├── app-layout.scss
    └── header.scss
```

### CSS Variables

Access in components:

```scss
$primary-color: var(--primary-color);
$bg-color: var(--bg-color);
$border-radius: var(--border-radius-md);
$transition: var(--transition-base);
```

### Animations

Available animations:

- `fadeIn / fadeOut` - Opacity transition
- `slideInUp / slideInDown` - Vertical slide
- `slideInLeft / slideInRight` - Horizontal slide
- `scaleIn / scaleOut` - Size scaling
- `pulse` - Breathing effect
- `heartbeat` - Emphasis animation
- `shimmer` - Loading placeholder
- `bounce` - Bouncy entrance

Usage:

```scss
.element {
  animation: fadeIn 0.3s ease-out;
}
```

## Data Management

### usePackageData Hook

```typescript
const packageData = usePackageData();
// Returns: {
//   packages: Package[];
//   filteredPackages: Package[];
//   searchTerm: string;
//   filters: FilterState;
//   setSearchTerm: (term: string) => void;
//   setFilters: (filters: FilterState) => void;
//   clearFilters: () => void;
// }
```

### Data Loading

- Packages loaded at app initialization
- Stored in-memory for performance
- Client-side filtering and search
- No network calls for searching

### Filter Types

```typescript
interface FilterState {
  source?: string[]; // Repository filter
  category?: string[]; // Category filter
  maintainer?: string[]; // Maintainer filter
  version?: VersionRange; // Version range
}
```

## Performance Tips

### For Users

1. Use specific search terms
2. Filter before searching for best results
3. Dark mode slightly faster (less rendering)
4. Cloud sync: Use browser cache for faster loads

### For Developers

1. SCSS module structure reduces CSS size
2. SolidJS fine-grained reactivity is efficient
3. No virtual scrolling needed yet (optimized for <5000 packages)
4. Client-side filtering is faster than server calls

## Accessibility

### Keyboard Navigation

- Tab through all interactive elements
- Enter/Space to activate buttons
- Arrow keys in dropdowns
- Escape to close modals

### Screen Readers

- ARIA labels on all inputs
- Semantic HTML structure
- Role attributes where needed
- Dynamic content updates announced

### Visual Accessibility

- High contrast mode support
- Large touch targets (44x44px minimum)
- Color not only indicator
- Text scalable to 200%

## Development

### Running Locally

```bash
cd listpkgs.nuros.front-end

# Install dependencies
pnpm install

# Development server with HMR
pnpm dev

# Format code
pnpm format

# Lint code
pnpm lint

# Build for production
pnpm build

# Preview production build
pnpm preview
```

### Adding New Features

1. Create component in `src/components/`
2. Create styles in `src/styles/components/`
3. Import in `src/styles/index.scss`
4. Use in App.tsx
5. Test locally
6. Format and lint
7. Commit with descriptive message

### Testing

```bash
# Run end-to-end tests
pnpm test

# Run specific test
pnpm test -- search.spec.ts

# Run with UI
pnpm test:ui
```

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers supported

## Known Limitations

- Very large package lists (>10000) may slow down on older devices
- Search is client-side only (offline capable but static data)
- Grid view limited to 4 columns on small screens
- Dark Reader might override some styles (mitigated with CSS flags)

## Troubleshooting UI Issues

| Issue                   | Solution                                   |
| ----------------------- | ------------------------------------------ |
| Search not responsive   | Check browser cache, try Ctrl+Shift+R      |
| Dark mode not working   | Enable in header, check system preferences |
| Cards cut off on mobile | Reduce browser zoom to 90%                 |
| Sidebar overlapping     | Use List view, reduce window width         |
| Text unreadable         | Increase font size in browser settings     |

---

Next: [API Reference](api-reference.md) | Back: [Architecture](architecture.md)
