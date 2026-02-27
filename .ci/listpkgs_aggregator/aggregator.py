"""
@file aggregator.py
@brief Основной модуль для оркестрации асинхронного процесса агрегации.
"""

import asyncio
import json
import logging
import os
import sys

import httpx
from . import github_client
from . import metadata_processor

logger = logging.getLogger(__name__)

async def run_aggregation_async(jobs: int) -> None:
    """
    Запускает полный цикл асинхронной агрегации пакетов.
    """
    logger.info(f"Starting package aggregation from {github_client.ORG_NAME} with concurrency limit {jobs}.")
    
    repos = await github_client.get_all_repos()
    if not repos:
        logger.critical("No repositories found. Exiting.")
        sys.exit(1)

    headers = github_client.get_headers()
    async with httpx.AsyncClient(headers=headers, http2=True) as client:
        # Создаем семафор для ограничения количества одновременных запросов
        semaphore = asyncio.Semaphore(jobs)
        
        async def process_with_semaphore(repo):
            async with semaphore:
                return await metadata_processor.process_repo(client, repo)

        tasks = [process_with_semaphore(repo) for repo in repos]
        results = await asyncio.gather(*tasks)

    aggregated = {key: data for key, data in filter(None, results)}
    
    if not aggregated:
        logger.critical("No valid package metadata was aggregated.")
        sys.exit(1)

    sorted_aggregated = dict(sorted(aggregated.items()))

    with open("repodata.json", "w", encoding="utf-8") as f:
        json.dump(sorted_aggregated, f, indent=2, ensure_ascii=False)
    
    logger.info(f"Successfully aggregated {len(sorted_aggregated)} packages into repodata.json.")
    
    if "GITHUB_OUTPUT" in os.environ:
        with open(os.environ["GITHUB_OUTPUT"], "a") as f:
            f.write(f"package_count={len(sorted_aggregated)}\n")

def run_aggregation(jobs: int):
    """Синхронная обертка для запуска асинхронного процесса."""
    asyncio.run(run_aggregation_async(jobs))
