"""
@file test_installation.py
@brief Локальный асинхронный тест для проверки логики агрегатора.
"""

import json
import logging
import sys
import tempfile
import os
from unittest.mock import patch

import pytest
import httpx
import respx

# Импортируем тестируемые модули
from listpkgs_aggregator import github_client, metadata_processor, aggregator

# --- Настройка ---
logging.basicConfig(level=logging.INFO, format='%(levelname)s - %(message)s')
pytestmark = pytest.mark.asyncio

# --- Тестовые данные ---
ORG_URL = f"https://api.github.com/orgs/{github_client.ORG_NAME}/repos"
MOCK_REPOS_PAYLOAD = [
    {"name": "repo-success", "html_url": "https://github.com/test/repo-success", "updated_at": "2023-01-01T00:00:00Z"},
    {"name": "repo-no-meta", "html_url": "https://github.com/test/repo-no-meta", "updated_at": "2023-01-01T00:00:00Z"},
    {"name": ".ignored", "html_url": "https://github.com/test/.ignored", "updated_at": "2023-01-01T00:00:00Z"},
]
METADATA_URL_SUCCESS = f"https://raw.githubusercontent.com/{github_client.ORG_NAME}/repo-success/main/metadata.json"
MOCK_METADATA_SUCCESS = {"name": "my-package", "version": "1.0.0"}

# --- Тесты ---

@respx.mock
async def test_full_run_logic(tmp_path):
    """Тестирует полный цикл агрегации с имитацией HTTP запросов."""
    logging.info("--- Running test: test_full_run_logic ---")
    
    # Имитируем ответ для списка репозиториев
    respx.get(ORG_URL).mock(return_value=httpx.Response(200, json=MOCK_REPOS_PAYLOAD))
    
    # Имитируем ответы для metadata.json
    respx.get(METADATA_URL_SUCCESS).mock(return_value=httpx.Response(200, json=MOCK_METADATA_SUCCESS))
    respx.get(f"https://raw.githubusercontent.com/{github_client.ORG_NAME}/repo-no-meta/main/metadata.json").mock(return_value=httpx.Response(404))
    
    # Используем временный файл для вывода, чтобы не засорять проект
    output_file = tmp_path / "repodata.json"
    
    # Патчим open, чтобы запись шла во временный файл
    with patch("builtins.open", new_callable=lambda: lambda *args, **kwargs: open(output_file if args[0] == "repodata.json" else args[0], *kwargs.values())):
        await aggregator.run_aggregation_async(jobs=10)
    
    logging.info(f"✅ Aggregation finished, checking output file: {output_file}")
    with open(output_file, "r") as f:
        data = json.load(f)
        
    assert len(data) == 1
    assert "my-package" in data
    assert data["my-package"]["version"] == "1.0.0"
    logging.info("✅ repodata.json created correctly.")

@pytest.mark.asyncio
async def test_process_repo_logic():
    """Тестирует логику обработки одного репозитория."""
    logging.info("--- Running test: test_process_repo_logic ---")
    
    async with httpx.AsyncClient() as client:
        # Сценарий 1: Успех
        with respx.mock:
            respx.get(METADATA_URL_SUCCESS).mock(return_value=httpx.Response(200, json=MOCK_METADATA_SUCCESS))
            result = await metadata_processor.process_repo(client, MOCK_REPOS_PAYLOAD[0])
            assert result is not None
            key, data = result
            assert key == "my-package"
            assert data["name"] == "my-package"
            logging.info("✅ Correctly processed a valid repository.")

        # Сценарий 2: Пропуск
        result = await metadata_processor.process_repo(client, MOCK_REPOS_PAYLOAD[2])
        assert result is None
        logging.info("✅ Correctly skipped an ignored repository.")

if __name__ == "__main__":
    print("="*50)
    print("Running local async tests for listpkgs-aggregator...")
    print("Please ensure you have run 'uv pip install -e .ci/' with dev dependencies.")
    print("="*50)
    # Запускаем pytest для этого файла
    sys.exit(pytest.main(["-v", __file__]))
