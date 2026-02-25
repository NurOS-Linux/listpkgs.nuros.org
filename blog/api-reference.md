# API Reference

## Overview

The NurOS Package List provides access to package data through the `packages.json` file, which is
generated automatically and embedded in the frontend.

## Data Access

### Static Data File

The package data is available as a static JSON file:

**URL**: `https://listpkgs.nuros.org/repodata.json`

**Alternative**: `https://NurOS-Linux.github.io/listpkgs.nuros.org/repodata.json`

**Format**: JSON (minified in production)

**Size**: Varies with number of packages (~500KB - 2MB)

**Update frequency**: Every 6 hours

### CORS

CORS headers are enabled for cross-origin requests:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, HEAD, OPTIONS
```

## Data Structure

### Package Object

```json
{
  "name": "string",
  "version": "semver",
  "release": "number (optional)",
  "description": "string",
  "home": "url (optional)",
  "license": "string (optional)",
  "source": "repository-name",
  "maintainer": "string (optional)",
  "maintainer_email": "email (optional)",
  "category": "string",
  "tags": ["string"],
  "dependencies": ["package-name"],
  "depends": "string (optional)",
  "url": "github-url",
  "checksum": "sha256 (optional)",
  "size": "bytes (optional)",
  "created": "ISO-8601 timestamp (optional)",
  "updated": "ISO-8601 timestamp (optional)",
  "metadata": {
    "custom_key": "custom_value"
  }
}
```

### Root Object

```json
{
  "packages": [
    {
      /* Package object */
    }
  ],
  "meta": {
    "version": "1.0",
    "count": 1234,
    "last_update": "ISO-8601 timestamp",
    "generated_at": "ISO-8601 timestamp"
  }
}
```

## Usage Examples

### JavaScript/Node.js

#### Fetch all packages

```javascript
const response = await fetch('https://listpkgs.nuros.org/repodata.json');
const data = await response.json();
console.log(`Total packages: ${data.packages.length}`);
```

#### Find package by name

```javascript
const findPackage = async (name) => {
  const response = await fetch('https://listpkgs.nuros.org/repodata.json');
  const data = await response.json();
  return data.packages.find((pkg) => pkg.name === name);
};

const pkg = await findPackage('vim');
console.log(pkg);
```

#### Filter by category

```javascript
const getByCategory = async (category) => {
  const response = await fetch('https://listpkgs.nuros.org/repodata.json');
  const data = await response.json();
  return data.packages.filter((pkg) => pkg.category === category);
};

const devTools = await getByCategory('development');
```

#### Search packages

```javascript
const searchPackages = async (query) => {
  const response = await fetch('https://listpkgs.nuros.org/repodata.json');
  const data = await response.json();
  const searchLower = query.toLowerCase();

  return data.packages.filter(
    (pkg) =>
      pkg.name.toLowerCase().includes(searchLower) ||
      pkg.description.toLowerCase().includes(searchLower)
  );
};

const results = await searchPackages('editor');
```

### Python

```python
import requests
import json

# Fetch packages
response = requests.get('https://listpkgs.nuros.org/repodata.json')
data = response.json()

# Find package
def find_package(name):
    for pkg in data['packages']:
        if pkg['name'] == name:
            return pkg
    return None

# Get by category
def get_by_category(category):
    return [pkg for pkg in data['packages']
            if pkg.get('category') == category]

# Search
def search(query):
    query_lower = query.lower()
    return [pkg for pkg in data['packages']
            if query_lower in pkg['name'].lower() or
               query_lower in pkg.get('description', '').lower()]

# Usage
vim_pkg = find_package('vim')
dev_tools = get_by_category('development')
editors = search('editor')
```

### Curl

```bash
# Get all packages
curl https://listpkgs.nuros.org/repodata.json

# Pretty print
curl https://listpkgs.nuros.org/repodata.json | jq .

# Count packages
curl https://listpkgs.nuros.org/repodata.json | jq '.packages | length'

# Find specific package
curl https://listpkgs.nuros.org/repodata.json | \
  jq '.packages[] | select(.name == "vim")'

# Get all categories
curl https://listpkgs.nuros.org/repodata.json | \
  jq '.packages[] | .category' | sort -u
```

### SolidJS (Frontend)

```typescript
import { createSignal, onMount } from 'solid-js';

export function PackageListComponent() {
  const [packages, setPackages] = createSignal([]);

  onMount(async () => {
    const response = await fetch('/repodata.json');
    const data = await response.json();
    setPackages(data.packages);
  });

  return (
    <div>
      <For each={packages()}>
        {(pkg) => <div>{pkg.name} v{pkg.version}</div>}
      </For>
    </div>
  );
}
```

## Field Reference

| Field              | Type      | Required | Description            |
| ------------------ | --------- | -------- | ---------------------- |
| `name`             | string    | ✓        | Package identifier     |
| `version`          | semver    | ✓        | Current version        |
| `release`          | number    | ✗        | Release number (NurOS) |
| `description`      | string    | ✓        | Short description      |
| `home`             | URL       | ✗        | Project homepage       |
| `license`          | string    | ✗        | License (SPDX)         |
| `source`           | string    | ✓        | Repository name        |
| `maintainer`       | string    | ✗        | Maintainer name        |
| `maintainer_email` | email     | ✗        | Contact email          |
| `category`         | string    | ✓        | Category/subsystem     |
| `tags`             | array     | ✗        | Feature tags           |
| `dependencies`     | array     | ✗        | Package dependencies   |
| `url`              | URL       | ✗        | Repository URL         |
| `checksum`         | sha256    | ✗        | File checksum          |
| `size`             | bytes     | ✗        | Package size           |
| `created`          | timestamp | ✗        | Creation date          |
| `updated`          | timestamp | ✗        | Last update date       |

## Caching

### Cache Headers

| Header          | Value                  |
| --------------- | ---------------------- |
| `Cache-Control` | `public, max-age=3600` |
| `ETag`          | SHA-256 of content     |
| `Last-Modified` | Update timestamp       |

### Best Practices

1. **Respect Cache Headers**: Don't bypass ETag/Last-Modified checks
2. **Implement Local Cache**: Cache data for 1 hour minimum
3. **Use Compression**: Request with `Accept-Encoding: gzip`
4. **Implement Retry Logic**: Handle temporary failures gracefully

### Example Cache Implementation

```javascript
class PackageCache {
  constructor(ttl = 3600000) {
    this.data = null;
    this.ttl = ttl;
    this.timestamp = null;
  }

  async fetch() {
    if (this.isValid()) {
      return this.data;
    }

    const response = await fetch('https://listpkgs.nuros.org/repodata.json');
    this.data = await response.json();
    this.timestamp = Date.now();
    return this.data;
  }

  isValid() {
    return this.data && this.timestamp && Date.now() - this.timestamp < this.ttl;
  }

  clear() {
    this.data = null;
    this.timestamp = null;
  }
}

const cache = new PackageCache();
const packages = await cache.fetch();
```

## Error Handling

### HTTP Status Codes

| Status | Meaning      | Action             |
| ------ | ------------ | ------------------ |
| 200    | OK           | Process response   |
| 304    | Not Modified | Use cached data    |
| 404    | Not Found    | Check URL          |
| 500    | Server Error | Retry later        |
| 503    | Unavailable  | Retry with backoff |

### Error Handling Example

```javascript
async function fetchPackagesWithRetry(maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch('https://listpkgs.nuros.org/repodata.json');

      if (response.status === 404) {
        throw new Error('Package list not found');
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (i === maxRetries - 1) throw error;

      const delay = Math.pow(2, i) * 1000; // Exponential backoff
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}
```

## Rate Limiting

Currently no rate limiting is enforced. However, we recommend:

- **Max 1 request per minute per IP** for production uses
- **Implement local caching** to reduce requests
- **Use ETags** to avoid re-downloading unchanged data
- Contact maintainers for higher limits if needed

## Integrity Verification

### SHA-256 Checksum

A checksum file is available:

```
https://listpkgs.nuros.org/repodata.json.sha256
```

### Verification Example

```bash
# Download both files
curl -O https://listpkgs.nuros.org/repodata.json
curl -O https://listpkgs.nuros.org/repodata.json.sha256

# Verify
sha256sum -c repodata.json.sha256

# Expected output: repodata.json: OK
```

## Changelog

### API Versioning

Current version: **1.0**

#### Future Changes (v2.0 planned)

- Additional metadata fields
- Package relationships (conflicts, replaces)
- Binary compatibility information
- Download statistics

#### Backward Compatibility

- v1.0 will be maintained indefinitely
- New fields added with `_new` suffix
- Old fields never removed
- Version indicator in response

---

See [Architecture](architecture.md) for system overview | [Frontend Guide](frontend-guide.md)
for UI integration details
