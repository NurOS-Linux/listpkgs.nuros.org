"""
@file metadata_processor.py
@brief Асинхронный модуль для обработки метаданных пакетов.
"""

import asyncio
import json
import logging
from typing import Any, Optional

import httpx
from . import github_client

logger = logging.getLogger(__name__)

REQUIRED_FIELDS = ["name", "version"]

async def fetch_metadata(client: httpx.AsyncClient, repo_name: str) -> Optional[dict[str, Any]]:
    """Асинхронно получает файл metadata.json из репозитория."""
    for branch in ['main', 'master']:
        url = f"https://raw.githubusercontent.com/{github_client.ORG_NAME}/{repo_name}/{branch}/metadata.json"
        response = await github_client.api_request(client, url, retries=2)
        if response and response.status_code == 200:
            try:
                return response.json()
            except json.JSONDecodeError:
                logger.error(f"Invalid JSON in {repo_name} from {branch} branch.")
    return None

def validate_metadata(metadata: dict[str, Any], repo_name: str) -> bool:
    """Проверяет наличие обязательных полей в метаданных."""
    missing = [field for field in REQUIRED_FIELDS if field not in metadata]
    if missing:
        logger.warning(f"Validation failed for {repo_name}, missing fields: {missing}")
        return False
    return True

def generate_package_key(metadata: dict[str, Any], repo_name: str) -> str:
    """Генерирует уникальный ключ пакета."""
    pkg_name = metadata.get("name", repo_name)
    architecture = metadata.get("architecture", "")
    return f"{pkg_name}@{architecture}" if architecture else pkg_name

async def process_repo(client: httpx.AsyncClient, repo: dict[str, Any]) -> Optional[tuple[str, dict[str, Any]]]:
    """
    Асинхронно обрабатывает один репозиторий.
    """
    name = repo["name"]
    ignored_repos = {"status", ".github", "template", "docs"}
    
    if name.startswith(".") or name in ignored_repos:
        return None

    logger.info(f"Processing: {name}")
    metadata = await fetch_metadata(client, name)

    if metadata is None:
        logger.warning(f"No metadata.json found for {name}")
        return None

    if not validate_metadata(metadata, name):
        return None

    metadata["_source_repo"] = repo["html_url"]
    metadata["_last_updated"] = repo.get("updated_at", "")
    
    pkg_key = generate_package_key(metadata, name)

    return pkg_key, metadata
