"""
@file github_client.py
@brief Асинхронный модуль для взаимодействия с GitHub API с использованием httpx.
"""

import asyncio
import logging
import os
from typing import Any, Optional

import httpx

logger = logging.getLogger(__name__)

# --- Конфигурация ---
ORG_NAME = os.getenv("ORG_NAME", "NurOS-Packages")
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
MAX_RETRIES = 3
RETRY_DELAY = 5

def get_headers() -> dict:
    """Возвращает заголовки для запросов к GitHub API."""
    headers = {
        "Accept": "application/vnd.github.v3+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }
    if GITHUB_TOKEN:
        headers["Authorization"] = f"token {GITHUB_TOKEN}"
    return headers

async def api_request(client: httpx.AsyncClient, url: str, retries: int = MAX_RETRIES) -> Optional[httpx.Response]:
    """Асинхронно выполняет HTTP-запрос с логикой повторных попыток."""
    for attempt in range(retries):
        try:
            response = await client.get(url, timeout=30)
            
            match response.status_code:
                case 200:
                    return response
                case 403:
                    reset_time = int(response.headers.get("X-RateLimit-Reset", 0))
                    wait_time = max(reset_time - int(asyncio.get_event_loop().time()), RETRY_DELAY)
                    logger.warning(f"Rate limited. Waiting {wait_time}s...")
                    await asyncio.sleep(wait_time)
                    continue
                case _:
                    response.raise_for_status()
                    
        except httpx.HTTPStatusError as e:
            logger.error(f"HTTP error for {url}: {e}")
        except httpx.RequestError as e:
            logger.error(f"Request failed (attempt {attempt + 1}/{retries}) for {url}: {e}")
            if attempt < retries - 1:
                await asyncio.sleep(RETRY_DELAY)
    return None

async def get_all_repos() -> list[dict[str, Any]]:
    """Асинхронно получает все репозитории из организации."""
    headers = get_headers()
    async with httpx.AsyncClient(headers=headers, http2=True) as client:
        repos = []
        page = 1
        per_page = 100
        logger.info(f"Fetching repositories from {ORG_NAME}...")
        
        while True:
            url = f"https://api.github.com/orgs/{ORG_NAME}/repos?per_page={per_page}&page={page}"
            response = await api_request(client, url)
            
            if not response:
                logger.error("Failed to fetch repositories page.")
                break
                
            data = response.json()
            if not data:
                break
                
            repos.extend(data)
            if len(data) < per_page:
                break
            page += 1

    logger.info(f"Found {len(repos)} repositories.")
    return repos
