"""
@file __init__.py
@brief Инициализация пакета listpkgs_aggregator.

Этот файл делает пакет listpkgs_aggregator импортируемым и определяет
его публичное API.
"""

from .aggregator import run_aggregation
from .github_client import get_all_repos
from .metadata_processor import process_repo

__all__ = [
    "run_aggregation",
    "get_all_repos",
    "process_repo",
]
