# Getting Started with NurOS Packages

## Overview

The NurOS Package Search System provides a web-based interface to browse and search packages
available in the NurOS ecosystem. This guide will help you get started.

## Accessing the Package Search

You can access the package search at:

- **Main Interface**: https://listpkgs.nuros.org
- **GitHub Pages**: https://NurOS-Linux.github.io/listpkgs.nuros.org/

## Searching for Packages

### Basic Search

1. Use the search bar at the top of the page
2. Type the package name or description
3. Results update in real-time as you type

### Filtering Results

Available filters:

- **Source/Repository**: Filter by package source
- **View Mode**: Switch between list and grid views
- **Categories**: Filter by package category

## Understanding Package Information

Each package card displays:

- **Package Name**: The unique identifier
- **Version**: Current version number
- **Maintainer**: Package maintainer information
- **Description**: Brief description of the package
- **Tags**: Category or feature tags

### Detailed View

Click on any package to see:

- Complete metadata
- Dependencies and relationships
- History and changelog
- Raw JSON representation

## View Modes

### List View

- Detailed information for each package
- Best for reading full descriptions
- Ideal for detailed searches

### Grid View

- Compact card layout
- Quick visual scanning
- Good for browsing categories

### Grouped View

- Packages grouped by category
- Expandable groups
- Organized overview

## Keyboard Shortcuts

| Shortcut | Action                 |
| -------- | ---------------------- |
| `/`      | Focus search bar       |
| `D`      | Toggle dark/light mode |
| `Enter`  | Open selected package  |
| `Esc`    | Clear search           |

## Tips & Tricks

1. **Use quotes for exact matches**: `"package name"`
2. **Search descriptions**: Type package purpose
3. **Multiple filters**: Combine source + category for narrow results
4. **JSON view**: Click the JSON icon for complete metadata
5. **Dark mode**: Auto-respects system preferences

## Troubleshooting

### No results found

- Try broader search terms
- Check spelling
- Remove filters temporarily
- Use package name instead of description

### Package information is outdated

- The list updates every 6 hours automatically
- Force refresh your browser (Ctrl+Shift+R / Cmd+Shift+R)
- Try accessing the page in a private/incognito window

### Interface not loading

- Check your internet connection
- Clear browser cache and cookies
- Try a different browser
- Check if JavaScript is enabled

## Next Steps

- Explore [Architecture](./architecture.md) to understand the system
- Read [Frontend Guide](./frontend-guide.md) for detailed UI information
- Check [API Reference](./api-reference.md) to integrate packages programmatically

---

**Need Help?** See [FAQ](./faq.md) or visit the
[GitHub Issues](https://github.com/NurOS-Linux/listpkgs.nuros.org/issues)
