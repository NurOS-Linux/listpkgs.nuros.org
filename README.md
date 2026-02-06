# NurOS Packages Aggregator

Этот репозиторий содержит инструменты для агрегации метаданных пакетов из организации [NurOS-Packages](https://github.com/NurOS-Packages).

## Архитектура

- `.ci/main.py` - точка входа для CI/CD
- `.ci/listpkgs_aggregator/aggregator.py` - основная логика агрегации
- `.ci/pyproject.toml` - управление зависимостями и сборка
- `.github/workflows/update-list.yaml` - GitHub Actions workflow

## Как это работает

1. Скрипт агрегации извлекает все репозитории из организации NurOS-Packages
2. Для каждого репозитория пытается получить `metadata.json` из ветки `main`
3. Валидирует обязательные поля (`name`, `version`)
4. Генерирует уникальные ключи пакетов и создает `packages.json`
5. Результат публикуется на GitHub Pages в ветке `gh-pages`

## Запуск локально

```bash
# Установка зависимостей
pip install .ci/

# Запуск агрегации
listpkgs-aggregate
```

## CI/CD

GitHub Actions автоматически запускает агрегацию каждые 6 часов и при ручном вызове.
Результаты публикуются на GitHub Pages.