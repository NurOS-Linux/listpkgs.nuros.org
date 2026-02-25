# NurOS Package Search System

This repository contains the package search and cataloging system for the NurOS ecosystem.

## Project Structure

- `.github/workflows/` - GitHub Actions automation files
  - `update-list.yml` - updates package list every 6 hours
  - `build_frontend.yml` - builds frontend after package list update
  - `deploy_on_pages.yml` - deploys built frontend to GitHub Pages
  - `deploy-docs.yml` - builds and deploys documentation (VitePress) separately
- `listpkgs.nuros.front-end/` - frontend application source code
- `blog/` - VitePress documentation with comprehensive guides (auto-deployed)
- `packages.json` - metadata file for all NurOS packages (auto-generated)
- `CNAME` - custom domain file for GitHub Pages (frontend)

## How It Works

1. Every 6 hours, `update-list.yml` runs to:
   - Scan all repositories in NurOS-Packages organization
   - Collect metadata from `metadata.json` files
   - Generate a single `packages.json` file

2. After successful list update, `build_frontend.yml` runs to:
   - Install frontend dependencies
   - Build frontend using Vite
   - Include up-to-date data from `packages.json`
   - Upload result as artifact

3. After successful build, `deploy_on_pages.yml` runs to:
   - Download built frontend artifact
   - Deploy to GitHub Pages via GitHub Actions

> **Note:** The `gh-pages` branch is no longer used. Deployment happens directly through GitHub Actions using artifacts.

## Frontend

The frontend is built with SolidJS and provides:

- Package search by name and description
- Filtering by various criteria
- Package grouping
- Detailed information display
- Full JSON representation view

See [README](listpkgs.nuros.front-end/README.md) in the frontend folder for more details.

## Documentation

Full documentation, guides, and development information is available as a separate GitHub Pages site built with VitePress.

### Documentation Site

- **Primary**: https://NurOS-Linux.github.io/listpkgs.nuros.org/docs/ (via separate github.io repo or same repo different domain)
- **Includes**:
  - Getting Started Guide
  - System Architecture Overview
  - Frontend User Guide
  - API Reference & Integration Examples
  - Deployment & CI/CD Guide
  - Contributing Guidelines
  - FAQ

### Documentation Development

Documentation is in the `blog/` directory and uses:
- **VitePress** for static site generation
- **Prettier** for markdown formatting (run with `pnpm format`)
- **pnpm** for dependency management

See [blog/README.md](blog/README.md) for documentation development guide.

## Contributing

To contribute:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the remote branch
5. Create a pull request

## License

MIT
