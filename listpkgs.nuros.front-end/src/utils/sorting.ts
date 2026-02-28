/**
 * @file sorting.ts
 * @brief Утилиты для сортировки пакетов (экспортируются для обратной совместимости)
 * @author NurOS Team
 * @version 1.1
 */

// Re-export from search.ts for backward compatibility
export {
  sortPackagesByName,
  groupPackagesByFirstLetter,
  type Package,
  type PackageGroup,
} from './search';
