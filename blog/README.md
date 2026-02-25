# NurOS Package List Documentation

This directory contains the VitePress documentation for the NurOS Package Search System.

## Documentation Structure

```
blog/
├── .vitepress/
│   └── config.ts         # VitePress configuration
├── .prettierrc           # Prettier configuration for markdown
├── .gitignore            # Git ignore rules
├── package.json          # Dependencies
├── pnpm-lock.yaml        # Frozen lockfile (use pnpm!)
├── index.md             # Home/landing page
├── getting-started.md    # Quick start guide
├── architecture.md       # System architecture
├── frontend-guide.md     # Frontend documentation
├── api-reference.md      # API & data access
├── deployment.md         # Deployment guide
├── contributing.md       # Contributing guide
└── faq.md               # Frequently asked questions
```

## Setup & Development

### Prerequisites

- Node.js 22.x
- pnpm 9.x (required, not npm!)

### Installation

```bash
# Install dependencies with pnpm
pnpm install

# Or (implies --frozen-lockfile)
pnpm install --frozen-lockfile
```

### Development Server

```bash
# Start development server with hot reload
pnpm docs:dev

# Access at http://localhost:5173
```

### Build for Production

```bash
# Build static site
pnpm docs:build

# Preview production build locally
pnpm docs:preview

# Build output in .vitepress/dist/
```

## Code Formatting

### Format Markdown Files

```bash
# Format all markdown files with Prettier
pnpm format

# Prettier config: .prettierrc
# - Line width: 100 characters
# - Use single quotes
# - Prose wrap: always
```

### Before Committing

1. Format code:
   ```bash
   pnpm format
   ```

2. Build locally to check for errors:
   ```bash
   pnpm docs:build
   ```

3. Preview the build:
   ```bash
   pnpm docs:preview
   ```

4. Commit changes:
   ```bash
   git add .
   git commit -m "docs: your description"
   git push
   ```

## Deployment

Documentation is automatically deployed via GitHub Actions when changes are pushed to `main` branch.

### Workflows

- **deploy-docs.yml** - Builds and deploys documentation to GitHub Pages
  - Installs pnpm dependencies
  - Formats markdown with Prettier
  - Builds VitePress documentation
  - Deploys to GitHub Pages

### Deployment Triggers

Documentation rebuild is triggered when:
- Files in `blog/` directory are modified
- `.github/workflows/deploy-docs.yml` is modified
- Manual workflow dispatch in GitHub Actions

### Access Documentation

- **Development**: http://localhost:5173 (after `pnpm docs:dev`)
- **Production**: https://NurOS-Linux.github.io/listpkgs.nuros.org/docs/
  - Or via separate github.io repo if configured

## Adding New Documentation

### Create a New Page

1. Create a markdown file in `blog/`:
   ```
   blog/my-topic.md
   ```

2. Add frontmatter (optional but recommended):
   ```markdown
   ---
   title: My Topic Title
   description: A brief description of the topic
   ---

   # My Topic Title

   Content here...
   ```

3. Update navigation in `.vitepress/config.ts`:
   ```typescript
   nav: [
     // Add new link
     { text: 'My Topic', link: '/my-topic' },
   ]

   sidebar: [
     // Add to appropriate section
     { text: 'My Topic', link: '/my-topic' },
   ]
   ```

4. Format and build:
   ```bash
   pnpm format
   pnpm docs:build
   ```

### Update Existing Page

1. Edit markdown file
2. Format with Prettier:
   ```bash
   pnpm format
   ```
3. See changes live in dev server:
   ```bash
   pnpm docs:dev
   ```

## Markdown Formatting

### Best Practices

- **Line width**: Keep lines under 100 characters
- **Headers**: Use single `#` for page title only
- **Lists**: Use dashes `-` for unordered lists
- **Code**: Use triple backticks with language:
  ```markdown
  ```typescript
  const example = 'code';
  ```
  ```
- **Links**: Use relative paths when possible
- **Images**: Store in public/ directory (if needed)

### Code Blocks

Include language identifier for syntax highlighting:

\`\`\`typescript
const greeting = 'Hello, NurOS!';
\`\`\`

\`\`\`bash
pnpm install
\`\`\`

\`\`\`json
{ "key": "value" }
\`\`\`

## Prettier Configuration

- **File**: `.prettierrc`
- **Settings**:
  - `semi: true` - Require semicolons
  - `singleQuote: true` - Use single quotes
  - `printWidth: 100` - Line width limit
  - `proseWrap: 'always'` - Wrap prose at line width
  - `tabWidth: 2` - 2-space indentation
  - `trailingComma: 'es5'` - Trailing commas where valid in ES5

## Common Tasks

### Check for Broken Links

```bash
# VitePress reports 404s during build
pnpm docs:build

# Look for error messages in output
```

### Update Dependencies

```bash
# Only use pnpm for updates
pnpm update

# New lock file generated automatically
# Commit pnpm-lock.yaml with changes
```

### Fix Formatting Issues

```bash
# Prettier will auto-fix most issues
pnpm format

# For remaining issues, edit manually
# and re-run pnpm format
```

### Clean Build

```bash
# Remove build artifacts
rm -rf .vitepress/dist

# Rebuild from scratch
pnpm docs:build
```

## Troubleshooting

### Build Fails

- Check Node.js version: `node --version` (should be 22.x)
- Clear cache: `rm -rf node_modules pnpm-lock.yaml && pnpm install`
- Check for markdown syntax errors
- Run `pnpm docs:build` to see detailed errors

### Development Server Not Starting

- Verify pnpm is installed: `pnpm --version`
- Check port 5173 is not in use
- Try different port: `pnpm docs:dev -- --port 5174`

### Formatting Issues

- Run `pnpm format` to auto-fix
- Check `.prettierrc` for configuration
- Manual fixes if needed

### Documentation Doesn't Deploy

- Check GitHub Actions logs
- Verify `deploy-docs.yml` workflow is enabled
- Ensure changes are pushed to `main` branch
- Check GitHub Pages settings

## Links

- **Repository**: https://github.com/NurOS-Linux/listpkgs.nuros.org
- **VitePress Docs**: https://vitepress.dev
- **GitHub Pages**: https://pages.github.com
- **Prettier Docs**: https://prettier.io

---

**Always use `pnpm` - not npm or yarn!**
