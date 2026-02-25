# GitBook Migration Guide

This document explains how to migrate the documentation from VitePress to GitBook.

## Overview

The documentation has been migrated from VitePress to GitBook to:
- Have a separate domain for documentation (not conflicting with the main site)
- Simplify the build and deployment process
- Leverage GitBook's built-in features (search, versions, collaboration)

## File Structure

```
blog/
├── README.md           # Main documentation page (GitBook home)
├── SUMMARY.md          # Table of contents for GitBook
├── book.json           # GitBook configuration
├── styles.css          # Custom styles for GitBook
├── getting-started.md
├── architecture.md
├── frontend-guide.md
├── api-reference.md
├── deployment.md
├── contributing.md
└── faq.md
```

## GitBook Setup Instructions

### Step 1: Create GitBook Account

1. Go to [https://app.gitbook.com/](https://app.gitbook.com/)
2. Sign up or log in with your GitHub account
3. Create a new **Space** for this documentation

### Step 2: Connect GitHub Repository

1. In your GitBook Space, go to **Settings** → **Integrations**
2. Select **GitHub** integration
3. Click **Connect Repository**
4. Authorize GitBook to access your GitHub account
5. Select repository: `NurOS-Linux/listpkgs.nuros.org`

### Step 3: Configure Documentation Source

1. Set the **source folder** to: `blog/`
2. GitBook will automatically detect `SUMMARY.md` for navigation
3. Verify the file structure is correct

### Step 4: Enable Auto-Sync

1. In GitHub integration settings, enable **Auto-sync**
2. Set branch to: `main`
3. Configure sync trigger: on push to main branch
4. Save settings

### Step 5: Configure Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your custom domain (e.g., `docs.nuros.org`)
3. Configure DNS records as instructed by GitBook
4. Wait for DNS propagation (up to 24 hours)

## GitHub Actions Workflow

The workflow `.github/workflows/sync-gitbook.yml` automatically:
- Validates documentation structure on each push
- Formats markdown files
- Triggers GitBook sync when changes are pushed to `main`

### Manual Sync

To manually trigger a sync:

1. Go to **Actions** tab in GitHub
2. Select **Sync Documentation to GitBook** workflow
3. Click **Run workflow**
4. Select branch: `main`
5. Click **Run workflow**

## GitBook Features

### Built-in Search

GitBook provides powerful full-text search out of the box.

### Versions

You can create different versions of your documentation:
- Go to **Settings** → **Versions**
- Create versions for different releases

### Collaboration

- Invite team members to your Space
- Enable comments on pages
- Track changes with version history

### Analytics

- View page views and popular content
- Track search queries
- Monitor reader engagement

## Migration Checklist

- [x] Create `SUMMARY.md` for navigation
- [x] Create `book.json` configuration
- [x] Update internal links in markdown files
- [x] Create GitHub Actions workflow
- [ ] Connect repository to GitBook
- [ ] Configure auto-sync
- [ ] Set up custom domain (optional)
- [ ] Test documentation on GitBook
- [ ] Remove VitePress files (`.vitepress/`, `package.json`, etc.)
- [ ] Update main README with new documentation URL

## Accessing Documentation

After setup, documentation will be available at:

- **GitBook Default URL**: `https://NurOS-Linux.gitbook.io/listpkgs-package-list`
- **Custom Domain** (if configured): `https://docs.nuros.org`

## Troubleshooting

### Sync Not Working

1. Check GitHub integration is enabled in GitBook
2. Verify repository permissions
3. Check workflow logs in GitHub Actions
4. Ensure `SUMMARY.md` and `book.json` are present

### Broken Links

1. All internal links should be relative (e.g., `architecture.md`)
2. Don't use `./` prefix in links
3. Use `.md` extension in links
4. Check GitBook preview for broken link warnings

### Styling Issues

1. Add custom CSS to `styles.css`
2. GitBook has limited CSS customization
3. Use GitBook's built-in theming options

## Support

For GitBook-specific issues:
- [GitBook Documentation](https://docs.gitbook.com/)
- [GitBook Community](https://community.gitbook.com/)
- [GitBook Support](https://support.gitbook.com/)

For project-specific issues:
- [GitHub Issues](https://github.com/NurOS-Linux/listpkgs.nuros.org/issues)
