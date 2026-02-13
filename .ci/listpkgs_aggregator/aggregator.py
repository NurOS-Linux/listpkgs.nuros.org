"""
@file aggregator.py
@brief Скрипт для агрегации метаданных пакетов из организации NurOS-Packages

Этот модуль отвечает за сбор метаданных пакетов из репозиториев
организации NurOS-Packages на GitHub.
"""

import json
import logging
import os
import sys
import time
from typing import Any

import requests

# Настройка логирования
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger(__name__)

## @var ORG_NAME
# Имя организации на GitHub, из которой собираются пакеты
ORG_NAME = os.getenv("ORG_NAME", "NurOS-Packages")

## @var GITHUB_TOKEN
# Токен для аутентификации с API GitHub
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")

## @var MAX_RETRIES
# Максимальное количество попыток для запросов к API
MAX_RETRIES = 3

## @var RETRY_DELAY
# Задержка между попытками в секундах
RETRY_DELAY = 5

## @var IGNORED_REPOS
# Множество репозиториев, которые следует игнорировать
IGNORED_REPOS = {"status", ".github", "template", "docs"}

## @var REQUIRED_FIELDS
# Список обязательных полей в метаданных пакета
REQUIRED_FIELDS = ["name", "version"]

session = requests.Session()
session.headers.update({
    "Authorization": f"token {GITHUB_TOKEN}",
    "Accept": "application/vnd.github.v3+json",
    "X-GitHub-Api-Version": "2022-11-28",
})


def api_request(url: str, retries: int = MAX_RETRIES) -> requests.Response | None:
    """
    @brief Выполняет HTTP-запрос к API с логикой повторных попыток
    @param url URL для запроса
    @param retries Количество попыток (по умолчанию MAX_RETRIES)
    @return Объект Response в случае успеха, None в случае ошибки
    """
    for attempt in range(retries):
        try:
            response = session.get(url, timeout=30)

            match response.status_code:
                case 403:
                    reset_time = int(response.headers.get("X-RateLimit-Reset", 0))
                    wait_time = max(reset_time - int(time.time()), RETRY_DELAY)
                    logger.warning(f"Rate limited. Waiting {wait_time}s...")
                    time.sleep(wait_time)
                    continue
                case 200:
                    # Успешный ответ, продолжаем выполнение
                    pass
                case _:
                    # Любой другой статус-код, кроме 403 и 200
                    logger.debug(f"Received status code {response.status_code}")

            response.raise_for_status()
            return response

        except requests.exceptions.RequestException as e:
            logger.error(f"Request failed (attempt {attempt + 1}/{retries}): {e}")
            if attempt < retries - 1:
                time.sleep(RETRY_DELAY)

    return None


def get_all_repos() -> list[dict[str, Any]]:
    """
    @brief Получает все репозитории из организации с поддержкой пагинации
    @return Список словарей, представляющих репозитории
    """
    repos = []
    page = 1
    per_page = 100

    logger.info(f"Starting to fetch repositories from {ORG_NAME} with pagination (page size: {per_page})")

    while True:
        url = f"https://api.github.com/orgs/{ORG_NAME}/repos?per_page={per_page}&page={page}"
        logger.debug(f"Fetching page {page} of repositories")

        response = api_request(url)

        if not response:
            logger.error(f"Failed to fetch repos page {page}")
            break

        data = response.json()
        if not data:
            logger.debug(f"No more repositories found after page {page}")
            break

        repos.extend(data)
        logger.debug(f"Added {len(data)} repositories from page {page}")

        if len(data) < per_page:
            logger.debug(f"Last page reached: page {page}")
            break
        page += 1

    logger.info(f"Successfully fetched {len(repos)} repositories total")
    return repos


def fetch_metadata(repo_name: str) -> dict[str, Any] | None:
    """
    @brief Получает файл metadata.json из репозитория
    @param repo_name Имя репозитория
    @return Словарь с метаданными в случае успеха, None в случае ошибки
    """
    # Пробуем разные возможные ветки
    branches = ['main', 'master']
    
    for branch in branches:
        url = f"https://raw.githubusercontent.com/{ORG_NAME}/{repo_name}/{branch}/metadata.json"
        logger.debug(f"Attempting to fetch metadata from {url}")
        
        response = api_request(url, retries=2)

        if response and response.status_code == 200:
            try:
                metadata = response.json()
                logger.info(f"Successfully fetched metadata for {repo_name} from {branch} branch")
                return metadata
            except json.JSONDecodeError as e:
                logger.error(f"Invalid JSON in {repo_name} from {branch} branch: {e}")
                continue  # Пробуем следующую ветку
    
    logger.warning(f"No metadata.json found for {repo_name} in any of the checked branches: {branches}")
    return None


def validate_metadata(metadata: dict[str, Any], repo_name: str) -> bool:
    """
    @brief Проверяет наличие обязательных полей в метаданных
    @param metadata Словарь с метаданными
    @param repo_name Имя репозитория
    @return True если все обязательные поля присутствуют, иначе False
    """
    missing = [f for f in REQUIRED_FIELDS if f not in metadata]

    if missing:
        logger.warning(f"Missing required fields in {repo_name}: {missing}")
        return False

    logger.debug(f"All required fields present for {repo_name}")
    return True


def generate_package_key(metadata: dict[str, Any], repo_name: str) -> str:
    """
    @brief Генерирует уникальный ключ пакета на основе имени и архитектуры
    @param metadata Словарь с метаданными
    @param repo_name Имя репозитория
    @return Строка с уникальным ключом пакета
    """
    pkg_name = metadata.get("name", repo_name)
    architecture = metadata.get("architecture", "")

    match architecture:
        case "":
            return pkg_name
        case _:
            return f"{pkg_name}@{architecture}"


def main() -> None:
    """
    @brief Главная точка входа в программу
    @details Выполняет полный цикл агрегации пакетов: получение списка репозиториев,
             извлечение метаданных, валидацию и сохранение результата
    """
    logger.info(f"Starting package aggregation from {ORG_NAME}...")
    repos = get_all_repos()
    logger.info(f"Found {len(repos)} repositories to process")

    aggregated = {}
    stats = {"success": 0, "skipped": 0, "failed": 0, "no_metadata": 0}

    total_repos = len(repos)
    processed_count = 0

    for repo in repos:
        processed_count += 1
        name = repo["name"]

        if name.startswith(".") or name in IGNORED_REPOS:
            logger.debug(f"[{processed_count}/{total_repos}] Skipping: {name}")
            stats["skipped"] += 1
            continue

        logger.info(f"[{processed_count}/{total_repos}] Processing: {name}")
        metadata = fetch_metadata(name)

        if metadata is None:
            logger.warning(f"  No metadata.json found for {name}")
            stats["no_metadata"] += 1
            continue

        if not validate_metadata(metadata, name):
            logger.error(f"  Validation failed for {name}")
            stats["failed"] += 1
            continue

        metadata["_source_repo"] = repo["html_url"]
        metadata["_last_updated"] = repo.get("updated_at", "")

        pkg_key = generate_package_key(metadata, name)
        aggregated[pkg_key] = metadata
        stats["success"] += 1

        version = metadata.get('version', 'unknown')
        arch_info = f" ({metadata.get('architecture')})" if metadata.get('architecture') else ""
        logger.info(f"  Added: {pkg_key} v{version}{arch_info}")

    aggregated = dict(sorted(aggregated.items()))

    with open("repodata.json", "w", encoding="utf-8") as f:
        json.dump(aggregated, f, indent=2, ensure_ascii=False)
        logger.info(f"Saved aggregated data to repodata.json with {len(aggregated)} packages")

    logger.info("=" * 50)
    logger.info("Summary:")
    logger.info(f"  Success:     {stats['success']}")
    logger.info(f"  Skipped:     {stats['skipped']}")
    logger.info(f"  No metadata: {stats['no_metadata']}")
    logger.info(f"  Failed:      {stats['failed']}")
    logger.info(f"  Total pkgs:  {len(aggregated)}")
    logger.info("=" * 50)

    with open(os.environ["GITHUB_OUTPUT"], "a") as f:
        f.write(f"package_count={len(aggregated)}\n")

    if not aggregated:
        logger.critical("No packages were aggregated!")
        sys.exit(1)

def get_status_message(status_code: int) -> str:
    """
    @brief Возвращает описание статус-кода
    @param status_code Код статуса HTTP
    @return Строка с описанием статуса
    """
    match status_code:
        case 200:
            return "Success"
        case 403:
            return "Forbidden"
        case 404:
            return "Not Found"
        case 500:
            return "Internal Server Error"
        case _:
            return f"Unknown Status Code: {status_code}"


if __name__ == "__main__":
    main()