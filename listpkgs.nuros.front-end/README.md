# NurOS Search Frontend

Это веб-приложение для поиска и просмотра пакетов в экосистеме NurOS. Приложение реализует функционал, аналогичный NixOS Search, но адаптированный для NurOS пакетов.

## Особенности

- Поиск пакетов по названию и описанию
- Фильтрация по архитектуре, типу и каналу
- Группировка пакетов по первой букве названия
- Отображение детальной информации о каждом пакете
- Возможность просмотра полного JSON-представления пакета
- Адаптивный дизайн для разных устройств

## Архитектура

Проект построен с использованием:
- [SolidJS](https://www.solidjs.com/) - реактивная библиотека для построения пользовательских интерфейсов
- [TypeScript](https://www.typescriptlang.org/) - язык программирования с типизацией
- [SCSS](https://sass-lang.com/) - препроцессор CSS
- [Vite](https://vitejs.dev/) - инструмент сборки

### Компоненты

- `App.tsx` - основной компонент приложения
- `SearchBar.tsx` - компонент строки поиска и фильтров
- `PackageCard.tsx` - компонент карточки пакета
- `PackageList.tsx` - компонент списка пакетов
- `GroupedPackageList.tsx` - компонент группированного списка пакетов
- `usePackageData.ts` - хук для загрузки и управления данными пакетов

## Запуск локально

1. Установите зависимости:
   ```bash
   pnpm install
   ```

2. Запустите сервер разработки:
   ```bash
   pnpm dev
   ```

3. Откройте [http://localhost:5173](http://localhost:5173) в браузере

## Сборка

Для сборки проекта выполните:
```bash
pnpm build
```

## Автоматические процессы

Проект интегрирован с GitHub Actions:

1. `update-list.yaml` - обновляет список пакетов каждые 6 часов
2. `build_frontend.yaml` - собирает фронтенд после обновления списка пакетов
3. `deploy_on_pages.yaml` - размещает собранный фронтенд на GitHub Pages

## Структура данных

Приложение ожидает получить файл `packages.json` со следующей структурой:

```json
{
  "package-name": {
    "name": "package-name",
    "version": "1.0.0",
    "type": "application",
    "architecture": "x86_64",
    "description": "Package description",
    "maintainer": "Maintainer Name",
    "license": "MIT",
    "homepage": "https://example.com",
    "dependencies": ["dependency1", "dependency2"],
    "conflicts": ["conflicting-package"],
    "_source_repo": "https://github.com/user/repo",
    "_last_updated": "2023-01-01T00:00:00Z"
  }
}
```

## Лицензия

MIT