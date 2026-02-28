---
cover: ./cover.png
---

# NurOS Package List Documentation

Everything you need to know about the NurOS package search system.

## Quick Links

- [Getting Started](./getting-started.md) - Quick start guide
- [Architecture](./architecture.md) - System design overview
- [API Reference](./api-reference.md) - Integration guide
- [Contributing](./contributing.md) - How to contribute

## Features

### 🔍 Package Search

Lightning-fast search across all NurOS packages with real-time results and advanced filtering.

### 📚 Comprehensive Docs

Complete documentation covering architecture, API, and development guides.

### 🚀 Easy Integration

Access package data via simple JSON API for your applications and tools.

### 🎨 Modern UI

Responsive web interface with dark mode and accessibility features.

### 🔄 Auto-Updated

Package list updates automatically every 6 hours with latest metadata.

### 📖 Open Source

MIT licensed project - contribute and improve for the community.

## Access the Package Search

- **Main Interface**: https://listpkgs.nuros.org
- **GitHub Pages**: https://NurOS-Linux.github.io/listpkgs.nuros.org/

## Package Data API

The package data is available as a static JSON file:

```
https://listpkgs.nuros.org/repodata.json
```

Example usage:

```javascript
const response = await fetch('https://listpkgs.nuros.org/repodata.json');
const data = await response.json();
console.log(`Total packages: ${data.packages.length}`);
```

See [API Reference](./api-reference.md) for more examples.

## GitHub

View source code on GitHub: https://github.com/NurOS-Linux/listpkgs.nuros.org

## License

Copyright © 2024-present NurOS Project. Released under the MIT License.
