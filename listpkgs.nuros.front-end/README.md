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

### Dev режим с mock данными

Приложение включает mock файл `/public/repodata.json` с примерами пакетов. Это позволяет разрабатывать и тестировать функционал без необходимости реального бэкенда.

## Структура данных

Приложение ожидает получить JSON файл `/repodata.json` со следующей структурой:

### Интерфейс пакета

```typescript
interface Package {
  name: string;              // Имя пакета
  version: string;           // Версия пакета (e.g., "1.0.0")
  type?: string;             // Тип: "application", "library", "development"
  architecture?: string;     // Архитектуры: "x86_64", "aarch64" (comma-separated)
  description?: string;      // Описание пакета
  maintainer?: string;       // Сопровождающий пакета
  license?: string | null;   // Лицензия пакета
  homepage?: string;         // Домашняя страница
  dependencies?: string[];   // Зависимости
  conflicts?: string[];      // Конфликты с другими пакетами
  tags?: string[];          // Теги для категоризации
  provides?: string[];       // Что предоставляет пакет
  replaces?: string[];       // Какие пакеты заменяет
  conf?: string[];          // Конфиг файлы
  _source_repo?: string;    // Репозиторий источника
  _last_updated?: string;   // Дата последнего обновления (ISO 8601)
}
```

### Пример JSON структуры

```json
{
  "curl": {
    "name": "curl",
    "version": "8.5.0",
    "type": "application",
    "architecture": "x86_64,aarch64",
    "description": "Command line tool for transferring data with URLs",
    "maintainer": "NurOS Team",
    "license": "MIT",
    "homepage": "https://curl.se",
    "dependencies": ["openssl", "zlib"],
    "conflicts": [],
    "tags": ["networking", "http"],
    "provides": ["curl"],
    "replaces": [],
    "conf": [],
    "_source_repo": "stable",
    "_last_updated": "2026-02-21T10:30:00Z"
  },
  "git": {
    "name": "git",
    "version": "2.43.0",
    "type": "application",
    "architecture": "x86_64,aarch64",
    "description": "Version control system",
    "maintainer": "NurOS Team",
    "license": "GPL-2.0",
    "homepage": "https://git-scm.com",
    "dependencies": ["openssl", "zlib"],
    "conflicts": [],
    "tags": ["vcs", "development"],
    "provides": ["git"],
    "replaces": [],
    "conf": [],
    "_source_repo": "stable",
    "_last_updated": "2026-02-20T15:45:00Z"
  }
}
```

### В продакшене

Замените `/public/repodata.json` на запрос к API:

```typescript
// usePackageData.ts - изменить путь:
const response = await fetch('https://your-api.com/repodata.json');
```

## Сборка

Для сборки проекта выполните:

```bash
pnpm build
```

## Лицензия

MIT
