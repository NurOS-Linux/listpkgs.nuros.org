# GitBook Integration Setup

## How to Enable GitBook Sync Check in GitHub Actions

The "GitBook - Updating content on GitBook..." check appears automatically when you connect this repository to GitBook.

### Setup Instructions

1. **Go to GitBook**
   - Visit https://app.gitbook.com/
   - Sign in or create an account

2. **Create or Select a Space**
   - Create a new space for your documentation
   - Or select an existing space

3. **Connect GitHub Repository**
   - Go to **Space Settings** → **Git Sync**
   - Select **GitHub** as the provider
   - Authorize GitBook to access your GitHub repositories
   - Select this repository: `NurOS-Linux/listpkgs.nuros.org`
   - Choose the `main` branch
   - Set the documentation folder: `blog/`

4. **Enable Auto-Sync**
   - Enable "Sync on push" option
   - GitBook will now automatically sync when you push to `main`

### After Setup

Once connected, you'll see in GitHub Actions:

- **GitBook** - `Pending - Updating content on GitBook...` (while syncing)
- **GitBook** - `Success` (after sync completes)

The check will appear on every commit to the `main` branch.

### GitBook URL

After setup, your documentation will be available at:
- `https://NurOS-Linux.gitbook.io/listpkgs-package-list`

Or configure a custom domain in GitBook settings.

### Troubleshooting

If the GitBook check doesn't appear:

1. Make sure you've authorized GitBook to access this repository
2. Check that Git Sync is enabled in your GitBook space
3. Verify the `blog/` folder contains valid GitBook files (`SUMMARY.md`, `book.json`)
4. Push a new commit to `main` to trigger the sync

### Required Files in `blog/` Folder

```
blog/
├── README.md          # Main documentation page
├── SUMMARY.md         # Table of contents for GitBook
├── book.json          # GitBook configuration
├── styles.css         # Custom styles
└── *.md               # Documentation pages
```
