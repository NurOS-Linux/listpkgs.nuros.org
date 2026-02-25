# Frequently Asked Questions

## General Questions

### What is NurOS?

NurOS is a Linux distribution with a curated package management system. The package search system
helps users find and understand available packages.

### How often is the package list updated?

The package list updates automatically every 6 hours. Updates happen at:

- 00:00 UTC
- 06:00 UTC
- 12:00 UTC
- 18:00 UTC

### Where is the source code?

Source code is available on GitHub: <https://github.com/NurOS-Linux/listpkgs.nuros.org>

### Can I use the package data for my project?

Yes! The data is available as JSON:

```
https://listpkgs.nuros.org/repodata.json
```

See [API Reference](./api-reference.md) for usage examples.

## Using the Interface

### How do I search for packages?

1. Use the search bar at the top
2. Type a package name or description
3. Results update in real-time
4. Click a package to see details

### What's the difference between the view modes?

- **List View**: Detailed information per row
- **Grid View**: Compact cards for quick scanning
- **Grouped View**: Packages organized by category

### How do I filter packages?

1. Click the filter icon
2. Select criteria (source, category, etc.)
3. Results update automatically
4. Click "Clear filters" to reset

### Why doesn't my package appear?

- **Not indexed yet**: Might need to add repository to NurOS-Packages
- **Wrong repository**: Package must be in official NurOS organization
- **Wait for update**: List updates every 6 hours

See [Contributing Guide](./contributing.md) for adding new packages.

### Can I see the raw JSON?

Yes! Click the JSON icon in any package detail view to see raw metadata.

Or fetch directly:

```bash
curl https://listpkgs.nuros.org/repodata.json | jq
```

See [API Reference](./api-reference.md) for examples.

## Frontend & Performance

### Why is the search getting slow?

If you have >5000 packages indexed:

- Use filters to narrow results
- Be more specific in searches
- Try category filtering

Currently optimized for up to 5000 packages.

### Does dark mode work?

Yes! Dark mode:

- Auto-detects system preference
- Can be toggled manually
- Persists across sessions
- Works with Dark Reader

### Mobile support?

Yes, fully responsive:

- Works on phones and tablets
- All features available
- Touch-optimized buttons
- Responsive layout

### Browser support?

Supported browsers:

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Modern mobile browsers

### The page is slow, what should I do?

1. Check your internet connection
2. Hard refresh: Ctrl+Shift+R or Cmd+Shift+R
3. Clear browser cache
4. Try a different browser
5. Reduce browser zoom to 90%

## Technical Questions

### How does the system work?

1. **Update List** (every 6 hours):
   - Scan NurOS repositories
   - Collect metadata
   - Generate packages.json

2. **Build Frontend**:
   - Download latest data
   - Build with Vite
   - Embed data in app

3. **Deploy**:
   - Upload to GitHub Pages
   - Available at listpkgs.nuros.org

See [Architecture](./architecture.md) for details.

### What technology is used?

- **Frontend**: SolidJS + TypeScript
- **Styling**: SCSS (modular)
- **Build**: Vite
- **Hosting**: GitHub Pages
- **CI/CD**: GitHub Actions

### Can I integrate the package data?

Yes! You can fetch the JSON:

```javascript
const response = await fetch('https://listpkgs.nuros.org/repodata.json');
const packages = await response.json();
```

See [API Reference](./api-reference.md) with Python, Node.js, curl examples.

### Is there an API?

The `repodata.json` file is the API. It's static JSON served over HTTPS.

No REST API endpoints currently. Features:

- CORS enabled
- Caching friendly
- ETag support
- GZIP compression

### How much data is in packages.json?

Varies by number of repositories, typically:

- **Size**: 500KB - 2MB (compressed)
- **Packages**: 1000 - 5000+
- **Update time**: <1 minute

### Can I cache the data?

Yes! Recommended practices:

- Cache for at least 1 hour
- Respect `Cache-Control` headers
- Use `ETag` for conditional requests
- Implement local storage

See [API Reference](./api-reference.md) for cache examples.

## Troubleshooting

### Search results are empty

**Try**:

1. Check spelling (case-insensitive)
2. Use simpler search term
3. Clear any filters
4. Refresh the page
5. Wait for next update (6-hour schedule)

### Package details show incomplete info

**Causes**:

- Repository not yet indexed
- Metadata.json incomplete
- Custom fields not displayed

**Solution**: Update repository metadata at source

### Dark mode colors look wrong

**Fixes**:

1. Try different browser
2. Disable Dark Reader extension
3. Check system dark mode setting
4. Clear browser cache

### Getting 404 when accessing subpath

**Issue**: URL is `/listpkgs.nuros.org` instead of root

**Fixes**:

1. Hard refresh browser
2. Clear browser cache
3. Try different browser
4. Check GitHub Pages settings

### Site shows blank page

**Troubleshoot**:

1. Open browser console (F12)
2. Check for errors
3. Check JavaScript is enabled
4. Try private/incognito window
5. Wait for automatic update

## Deployment Questions

### How do I deploy changes?

1. Push to main branch
2. GitHub Actions auto-deploys
3. Check Actions tab for status
4. Live in ~5 minutes

### Can I trigger deployment manually?

Yes! In GitHub:

1. Go to Actions tab
2. Select workflow
3. Click "Run workflow"
4. Confirm

Or with GitHub CLI:

```bash
gh workflow run deploy_on_pages.yml
```

### How long does deployment take?

Typical timeline:

- Update list: 1-2 min
- Build frontend: 2-3 min
- Deploy to Pages: ~30 sec
- **Total**: 5-10 minutes

### What if deployment fails?

Check logs:

1. Go to Actions tab
2. Click failed workflow
3. Scroll to failed step
4. Read error message

Common fixes:

- Check pnpm-lock.yaml is committed
- Verify package.json dependencies
- Check Node.js version (22.x required)

## Contribution Questions

### How do I contribute?

See [Contributing Guide](./contributing.md) for:

1. Development setup
2. Code style guidelines
3. PR process
4. Commit message format

### Can I add a new package?

**To add your package**:

1. Create repository in NurOS-Packages org
2. Add `metadata.json` with package info
3. Wait for next list update (6 hours)
4. Package appears in search

See package metadata template in contributing guide.

### How do I report bugs?

1. Check [GitHub Issues](https://github.com/NurOS-Linux/listpkgs.nuros.org/issues)
2. Ensure it's not already reported
3. Create new issue with:
   - What happened
   - What you expected
   - Steps to reproduce
   - Your environment

### How do I suggest features?

Create GitHub issue with:

1. Feature description
2. Use case/why it's needed
3. Example or mockup if possible
4. Any implementation notes

---

**Still have questions?**

- Check [Architecture](./architecture.md) and [API Reference](./api-reference.md)
- Open a [GitHub Discussion](https://github.com/NurOS-Linux/listpkgs.nuros.org/discussions)
- Review [Contributing Guide](./contributing.md)
