# NurOS Package Search System

This repository contains the package search and cataloging system for the NurOS ecosystem.

## Project Structure

- `.github/workflows/` - GitHub Actions automation files
  - `update-list.yml` - updates package list every 6 hours
  - `build_frontend.yml` - builds frontend after package list update
  - `deploy_on_pages.yml` - deploys built frontend to GitHub Pages
  - `sync-gitbook.yml` - syncs documentation to GitBook
- `listpkgs.nuros.front-end/` - frontend application source code
- `blog/` - GitBook documentation source files
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

Documentation is now hosted on **GitBook** for a better reading experience and separate domain.

### 📚 Documentation Site

- **GitBook**: Setup required - see [GITBOOK_SETUP.md](blog/GITBOOK_SETUP.md)
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
- **GitBook** for hosting and rendering
- **GitHub Actions** for automatic sync on push to `main`
- **Prettier** for markdown formatting

#### Quick Setup

1. Go to [GitBook](https://app.gitbook.com/)
2. Create a Space
3. Connect this repository (`NurOS-Linux/listpkgs.nuros.org`)
4. Set source folder to `blog/`
5. Enable auto-sync

See [blog/GITBOOK_SETUP.md](blog/GITBOOK_SETUP.md) for detailed instructions.

#### Documentation Files

| File | Description |
|------|-------------|
| `blog/README.md` | Documentation home page |
| `blog/SUMMARY.md` | Table of contents (GitBook navigation) |
| `blog/book.json` | GitBook configuration |
| `blog/getting-started.md` | Quick start guide |
| `blog/architecture.md` | System architecture |
| `blog/frontend-guide.md` | Frontend user guide |
| `blog/api-reference.md` | API documentation |
| `blog/deployment.md` | Deployment guide |
| `blog/contributing.md` | Contributing guidelines |
| `blog/faq.md` | Frequently asked questions |

## Contributing

To contribute:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the remote branch
5. Create a pull request

For documentation changes, simply edit files in `blog/` and they will auto-sync to GitBook.

## License

MIT
