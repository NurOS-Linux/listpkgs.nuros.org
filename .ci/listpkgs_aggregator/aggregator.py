"""Aggregate package metadata from NurOS-Packages organization."""

import json
import os
import sys
import time
from typing import Any

import requests

ORG_NAME = os.getenv("ORG_NAME", "NurOS-Packages")
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
MAX_RETRIES = 3
RETRY_DELAY = 5

IGNORED_REPOS = {"status", ".github", "template", "docs"}
REQUIRED_FIELDS = ["name", "version"]

session = requests.Session()
session.headers.update({
    "Authorization": f"token {GITHUB_TOKEN}",
    "Accept": "application/vnd.github.v3+json",
    "X-GitHub-Api-Version": "2022-11-28",
})


def api_request(url: str, retries: int = MAX_RETRIES) -> requests.Response | None:
    """Make API request with retry logic."""
    for attempt in range(retries):
        try:
            response = session.get(url, timeout=30)

            if response.status_code == 403:
                reset_time = int(response.headers.get("X-RateLimit-Reset", 0))
                wait_time = max(reset_time - int(time.time()), RETRY_DELAY)
                print(f"Rate limited. Waiting {wait_time}s...")
                time.sleep(wait_time)
                continue

            response.raise_for_status()
            return response

        except requests.exceptions.RequestException as e:
            print(f"Request failed (attempt {attempt + 1}/{retries}): {e}")
            if attempt < retries - 1:
                time.sleep(RETRY_DELAY)

    return None


def get_all_repos() -> list[dict[str, Any]]:
    """Fetch all repositories with pagination support."""
    repos = []
    page = 1
    per_page = 100

    while True:
        url = f"https://api.github.com/orgs/{ORG_NAME}/repos?per_page={per_page}&page={page}"
        response = api_request(url)

        if not response:
            print(f"Failed to fetch repos page {page}")
            break

        data = response.json()
        if not data:
            break

        repos.extend(data)

        if len(data) < per_page:
            break
        page += 1

    return repos


def fetch_metadata(repo_name: str) -> dict[str, Any] | None:
    """Fetch metadata.json from a repository."""
    url = f"https://raw.githubusercontent.com/{ORG_NAME}/{repo_name}/main/metadata.json"
    response = api_request(url, retries=2)

    if response and response.status_code == 200:
        try:
            return response.json()
        except json.JSONDecodeError as e:
            print(f"  Invalid JSON in {repo_name}: {e}")

    return None


def validate_metadata(metadata: dict[str, Any], repo_name: str) -> bool:
    """Validate required fields in metadata."""
    missing = [f for f in REQUIRED_FIELDS if f not in metadata]

    if missing:
        print(f"  Missing required fields in {repo_name}: {missing}")
        return False

    return True


def generate_package_key(metadata: dict[str, Any], repo_name: str) -> str:
    """Generate unique package key from name and architecture."""
    pkg_name = metadata.get("name", repo_name)
    architecture = metadata.get("architecture", "")

    if architecture:
        return f"{pkg_name}@{architecture}"
    return pkg_name


def main() -> None:
    """Main entry point."""
    print(f"Fetching repositories from {ORG_NAME}...")
    repos = get_all_repos()
    print(f"Found {len(repos)} repositories\n")

    aggregated = {}
    stats = {"success": 0, "skipped": 0, "failed": 0, "no_metadata": 0}

    for repo in repos:
        name = repo["name"]

        if name.startswith(".") or name in IGNORED_REPOS:
            print(f"Skipping: {name}")
            stats["skipped"] += 1
            continue

        print(f"Processing: {name}")
        metadata = fetch_metadata(name)

        if metadata is None:
            print("  No metadata.json found")
            stats["no_metadata"] += 1
            continue

        if not validate_metadata(metadata, name):
            stats["failed"] += 1
            continue

        metadata["_source_repo"] = repo["html_url"]
        metadata["_last_updated"] = repo.get("updated_at", "")

        pkg_key = generate_package_key(metadata, name)
        aggregated[pkg_key] = metadata
        stats["success"] += 1

        version = metadata.get('version', 'unknown')
        arch_info = f" ({metadata.get('architecture')})" if metadata.get('architecture') else ""
        print(f"  Added: {pkg_key} v{version}{arch_info}")

    aggregated = dict(sorted(aggregated.items()))

    with open("packages.json", "w", encoding="utf-8") as f:
        json.dump(aggregated, f, indent=2, ensure_ascii=False)

    print("\n" + "=" * 50)
    print("Summary:")
    print(f"  Success:     {stats['success']}")
    print(f"  Skipped:     {stats['skipped']}")
    print(f"  No metadata: {stats['no_metadata']}")
    print(f"  Failed:      {stats['failed']}")
    print(f"  Total pkgs:  {len(aggregated)}")
    print("=" * 50)

    with open(os.environ["GITHUB_OUTPUT"], "a") as f:
        f.write(f"package_count={len(aggregated)}\n")

    if not aggregated:
        print("Warning: No packages were aggregated!")
        sys.exit(1)


if __name__ == "__main__":
    main()