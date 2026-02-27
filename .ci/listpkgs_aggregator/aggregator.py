"""
@file aggregator.py
@brief Основной модуль для оркестрации процесса агрегации.
"""

import json
import logging
import os
import sys
from multiprocessing import Pool

from . import github_client
from . import metadata_processor

logger = logging.getLogger(__name__)

def run_aggregation(jobs: int) -> None:
    """
    Запускает полный цикл агрегации пакетов.
    """
    logger.info(f"Starting package aggregation from {github_client.ORG_NAME} using {jobs} parallel jobs.")

    repos = github_client.get_all_repos()
    if not repos:
        logger.critical("No repositories found. Exiting.")
        sys.exit(1)

    with Pool(processes=jobs) as pool:
        results = pool.map(metadata_processor.process_repo, repos)

    aggregated = {key: data for key, data in filter(None, results)}

    if not aggregated:
        logger.critical("No valid package metadata was aggregated.")
        sys.exit(1)

    # Сортировка для консистентного вывода
    sorted_aggregated = dict(sorted(aggregated.items()))

    with open("repodata.json", "w", encoding="utf-8") as f:
        json.dump(sorted_aggregated, f, indent=2, ensure_ascii=False)

    logger.info(f"Successfully aggregated {len(sorted_aggregated)} packages into repodata.json.")

    # Вывод для GitHub Actions
    if "GITHUB_OUTPUT" in os.environ:
        with open(os.environ["GITHUB_OUTPUT"], "a") as f:
            f.write(f"package_count={len(sorted_aggregated)}\n")
