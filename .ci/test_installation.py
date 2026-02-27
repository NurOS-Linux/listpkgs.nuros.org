"""
@file test_installation.py
@brief Локальный тест для проверки логики агрегатора с использованием моков.
"""

import json
import logging
import unittest
from unittest.mock import patch, MagicMock

import pytest

# Важно импортировать модули, которые мы будем тестировать
from listpkgs_aggregator import github_client, metadata_processor

# Настройка логирования для тестов
logging.basicConfig(level=logging.DEBUG, format='%(levelname)s - %(message)s')

# --- Тестовые данные ---

MOCK_REPOS_PAYLOAD = [
    {"name": "repo-success", "html_url": "https://github.com/test/repo-success", "updated_at": "2023-01-01T00:00:00Z"},
    {"name": "repo-no-meta", "html_url": "https://github.com/test/repo-no-meta", "updated_at": "2023-01-01T00:00:00Z"},
    {"name": "repo-bad-meta", "html_url": "https://github.com/test/repo-bad-meta", "updated_at": "2023-01-01T00:00:00Z"},
    {"name": ".ignored-repo", "html_url": "https://github.com/test/.ignored-repo", "updated_at": "2023-01-01T00:00:00Z"},
]

MOCK_METADATA_SUCCESS = {"name": "my-package", "version": "1.0.0", "architecture": "x86_64"}
MOCK_METADATA_BAD = {"version": "1.0.0"} # Отсутствует 'name'

# --- Тесты ---

@patch('listpkgs_aggregator.github_client.requests.Session.get')
def test_get_all_repos_success(mock_get):
    """Тестирует успешное получение списка репозиториев."""
    logging.info("--- Running test: test_get_all_repos_success ---")
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = MOCK_REPOS_PAYLOAD
    mock_get.return_value = mock_response

    repos = github_client.get_all_repos()
    
    assert len(repos) == 4
    assert repos[0]['name'] == 'repo-success'
    logging.info("✅ Successfully fetched and parsed repositories.")

@patch('listpkgs_aggregator.github_client.api_request')
def test_fetch_metadata(mock_api_request):
    """Тестирует логику получения метаданных для разных сценариев."""
    logging.info("--- Running test: test_fetch_metadata ---")

    # Сценарий 1: Успешное получение
    mock_response_success = MagicMock()
    mock_response_success.status_code = 200
    mock_response_success.json.return_value = MOCK_METADATA_SUCCESS
    mock_api_request.return_value = mock_response_success
    
    metadata = metadata_processor.fetch_metadata("repo-success")
    assert metadata is not None
    assert metadata["name"] == "my-package"
    logging.info("✅ Correctly fetched metadata on success.")

    # Сценарий 2: Файл не найден
    mock_response_not_found = MagicMock()
    mock_response_not_found.status_code = 404
    mock_api_request.return_value = mock_response_not_found
    
    metadata = metadata_processor.fetch_metadata("repo-no-meta")
    assert metadata is None
    logging.info("✅ Correctly handled missing metadata file.")

def test_process_repo():
    """Тестирует полную логику обработки одного репозитория."""
    logging.info("--- Running test: test_process_repo ---")

    # Сценарий 1: Успешная обработка
    with patch('listpkgs_aggregator.metadata_processor.fetch_metadata') as mock_fetch:
        mock_fetch.return_value = MOCK_METADATA_SUCCESS
        result = metadata_processor.process_repo(MOCK_REPOS_PAYLOAD[0])
        assert result is not None
        key, data = result
        assert key == "my-package@x86_64"
        assert data["version"] == "1.0.0"
        logging.info("✅ Correctly processed a valid repository.")

    # Сценарий 2: Пропуск игнорируемого репозитория
    result = metadata_processor.process_repo(MOCK_REPOS_PAYLOAD[3])
    assert result is None
    logging.info("✅ Correctly skipped an ignored repository.")

    # Сценарий 3: Невалидные метаданные
    with patch('listpkgs_aggregator.metadata_processor.fetch_metadata') as mock_fetch:
        mock_fetch.return_value = MOCK_METADATA_BAD
        result = metadata_processor.process_repo(MOCK_REPOS_PAYLOAD[2])
        assert result is None
        logging.info("✅ Correctly handled a repository with invalid metadata.")

if __name__ == "__main__":
    print("Running local tests for listpkgs-aggregator...")
    # Запускаем pytest для этого файла
    sys.exit(pytest.main([__file__]))
