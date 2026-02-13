/**
 * @file usePackageData.ts
 * @brief Хук для загрузки и управления данными пакетов
 * @author NurOS Team
 * @version 1.0
 */

import { createSignal, onMount } from 'solid-js';

/**
 * @interface Package
 * @brief Интерфейс данных пакета
 * @property {string} key - Уникальный ключ пакета
 * @property {string} name - Название пакета
 * @property {string} version - Версия пакета
 * @property {string} [type] - Тип пакета
 * @property {string | null} [architecture] - Архитектура пакета
 * @property {string} [description] - Описание пакета
 * @property {string} [maintainer] - Мейнтейнер пакета
 * @property {string | null} [license] - Лицензия пакета
 * @property {string} [homepage] - Домашняя страница пакета
 * @property {string[]} dependencies - Зависимости пакета
 * @property {string[]} conflicts - Конфликты пакета
 * @property {string} _source_repo - Репозиторий источника
 * @property {string} [_last_updated] - Дата последнего обновления
 */
interface Package {
  key: string;
  name: string;
  version: string;
  type?: string;
  architecture?: string | null;
  description?: string;
  maintainer?: string;
  license?: string | null;
  homepage?: string;
  dependencies: string[];
  conflicts: string[];
  _source_repo: string;
  _last_updated?: string;
  [key: string]: any;
}

/**
 * @interface PackageData
 * @brief Интерфейс данных пакетов
 * @property {any} [key: string] - Произвольные данные пакета
 */
interface PackageData {
  [key: string]: any;
}

/**
 * @brief Хук для загрузки и управления данными пакетов
 * @details Загружает данные пакетов из JSON файла и управляет состоянием загрузки и ошибок
 * @returns {Object} - Объект с состояниями пакетов, загрузки и ошибки
 * @returns {Package[]} return.packages - Массив пакетов
 * @returns {boolean} return.loading - Состояние загрузки
 * @returns {string | null} return.error - Сообщение об ошибке
 */
const usePackageData = () => {
  const [packages, setPackages] = createSignal<Package[]>([]);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal<string | null>(null);

  /**
   * @brief Эффект монтирования для загрузки данных
   * @details Выполняет загрузку данных пакетов при монтировании компонента
   */
  onMount(async () => {
    try {
      console.log('Starting to fetch repodata.json');
      // Используем относительный путь к файлу в публичной папке
      const response = await fetch('/repodata.json');
      console.log('Response received:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: PackageData = await response.json();
      console.log('Data parsed, number of packages:', Object.keys(data).length);

      // Преобразование объекта в массив пакетов
      const packageArray = Object.entries(data).map(([key, pkg]) => {
        // Убедимся, что у каждого пакета есть все необходимые поля
        return {
          key,
          name: pkg.name || key,
          version: pkg.version || 'unknown',
          type: pkg.type || 'unknown',
          architecture: pkg.architecture || 'N/A',
          description: pkg.description || 'No description available',
          maintainer: pkg.maintainer || 'Unknown',
          license: pkg.license || 'Not specified',
          homepage: pkg.homepage || '#',
          dependencies: pkg.dependencies || [],
          conflicts: pkg.conflicts || [],
          tags: pkg.tags || [],
          provides: pkg.provides || [],
          replaces: pkg.replaces || [],
          conf: pkg.conf || [],
          _source_repo: pkg._source_repo || '#',
          _last_updated: pkg._last_updated || null,
          ...pkg
        };
      });

      console.log('Setting packages and updating loading state');
      setPackages(packageArray);
      setLoading(false);
      console.log('Loading state updated to false');
    } catch (err) {
      console.error('Error loading repodata:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setLoading(false);
      console.log('Loading state updated to false due to error');
    }
  });

  return { packages, loading, error };
};

/**
 * @brief Экспорт хука usePackageData
 * @details Экспортирует хук по умолчанию
 */
export default usePackageData;