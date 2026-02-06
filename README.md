# NurOS Packages Aggregator

This repository contains tools for aggregating package metadata from the [NurOS-Packages](https://github.com/NurOS-Packages) organization.

## Architecture

- `.ci/main.py` - entry point for CI/CD
- `.ci/listpkgs_aggregator/aggregator.py` - main aggregation logic
- `.ci/pyproject.toml` - dependency management and building
- `.github/workflows/update-list.yaml` - GitHub Actions workflow

## How it works

1. The aggregation script retrieves all repositories from the NurOS-Packages organization
2. For each repository, it attempts to get `metadata.json` from the `main` branch
3. Validates required fields (`name`, `version`)
4. Generates unique package keys and creates `packages.json`
5. Results are published to GitHub Pages in the `gh-pages` branch

## Running locally

```bash
# Install dependencies
pip install .ci/

# Run aggregation
listpkgs-aggregate
```

## CI/CD

GitHub Actions automatically runs aggregation every 6 hours and on manual trigger.
Results are published to GitHub Pages.