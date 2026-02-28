/**
 * @file search.ts
 * @brief Утилиты для поиска и фильтрации пакетов
 * @author NurOS Team
 * @version 2.0
 */

/**
 * Интерфейс данных пакета
 */
export interface Package {
  key: string;
  name: string;
  version: string;
  type?: string;
  architecture?: string | null;
  description?: string;
  maintainer?: string;
  license?: string | null;
  homepage?: string;
  dependencies?: string[];
  conflicts?: string[];
  _source_repo?: string;
  _last_updated?: string;
  [key: string]: unknown;
}

/**
 * Интерфейс фильтров
 */
export interface Filters {
  architecture: string;
  packageType: string;
  maintainers: string[];
  licenses: string[];
  sources: string[];
}

/**
 * @brief Фильтрует пакеты по поисковому запросу
 * @param packages Массив пакетов
 * @param searchTerm Поисковый запрос
 * @returns Отфильтрованный массив пакетов
 */
export const filterBySearchTerm = (packages: Package[], searchTerm: string): Package[] => {
  const term = searchTerm.toLowerCase().trim();

  if (!term) {
    return packages;
  }

  return packages.filter(pkg => {
    const nameMatch = pkg.name?.toLowerCase().includes(term);
    const descriptionMatch = pkg.description?.toLowerCase().includes(term);
    const keyMatch = pkg.key?.toLowerCase().includes(term);

    return nameMatch || descriptionMatch || keyMatch;
  });
};

/**
 * @brief Фильтрует пакеты по архитектуре
 * @param packages Массив пакетов
 * @param architecture Строка с архитектурами (через запятую)
 * @returns Отфильтрованный массив пакетов
 */
export const filterByArchitecture = (packages: Package[], architecture: string): Package[] => {
  if (!architecture?.trim()) {
    return packages;
  }

  const architectures = architecture
    .split(',')
    .map(a => a.trim())
    .filter(Boolean);

  return packages.filter(pkg => {
    const pkgArch = pkg.architecture || 'unknown';
    return architectures.some(arch => pkgArch.includes(arch));
  });
};

/**
 * @brief Определяет категорию для пакета
 * @param pkg Пакет
 * @returns Название категории
 */
export const getCategoryForPackage = (pkg: Package): string => {
  const name = pkg.name?.toLowerCase() || '';
  const type = pkg.type?.toLowerCase() || '';

  if (type === 'system' || name.includes('kernel') || name.includes('core')) {
    return 'core';
  }
  if (type === 'application' || type === 'desktop' || type === 'gui') {
    return 'applications';
  }
  if (type === 'library' || name.includes('lib')) {
    return 'libraries';
  }
  if (type === 'development' || type === 'devel') {
    return 'development';
  }
  if (type === 'server') {
    return 'server';
  }
  if (type === 'runtime' || type === 'lang') {
    return 'runtime';
  }
  if (type === 'editor') {
    return 'editor';
  }
  if (type === 'browser') {
    return 'browser';
  }

  return 'other';
};

/**
 * @brief Фильтрует пакеты по категории (типу)
 * @param packages Массив пакетов
 * @param packageType Строка с категориями (через запятую)
 * @returns Отфильтрованный массив пакетов
 */
export const filterByCategory = (packages: Package[], packageType: string): Package[] => {
  if (!packageType?.trim()) {
    return packages;
  }

  const categories = packageType
    .split(',')
    .map(c => c.trim())
    .filter(Boolean);

  return packages.filter(pkg => {
    const pkgCategory = getCategoryForPackage(pkg);
    return categories.some(
      cat => pkgCategory.includes(cat.toLowerCase()) || cat.toLowerCase().includes(pkgCategory)
    );
  });
};

/**
 * @brief Фильтрует пакеты по мейнтейнерам
 * @param packages Массив пакетов
 * @param maintainers Массив мейнтейнеров
 * @returns Отфильтрованный массив пакетов
 */
export const filterByMaintainers = (packages: Package[], maintainers: string[]): Package[] => {
  if (!maintainers || maintainers.length === 0) {
    return packages;
  }

  return packages.filter(pkg => {
    const pkgMaintainer = pkg.maintainer || 'unknown';
    return maintainers.includes(pkgMaintainer);
  });
};

/**
 * @brief Фильтрует пакеты по лицензиям
 * @param packages Массив пакетов
 * @param licenses Массив лицензий
 * @returns Отфильтрованный массив пакетов
 */
export const filterByLicenses = (packages: Package[], licenses: string[]): Package[] => {
  if (!licenses || licenses.length === 0) {
    return packages;
  }

  return packages.filter(pkg => {
    const pkgLicense = pkg.license || 'unknown';
    return licenses.includes(pkgLicense);
  });
};

/**
 * @brief Фильтрует пакеты по источникам
 * @param packages Массив пакетов
 * @param sources Массив источников
 * @returns Отфильтрованный массив пакетов
 */
export const filterBySources = (packages: Package[], sources: string[]): Package[] => {
  if (!sources || sources.length === 0) {
    return packages;
  }

  return packages.filter(pkg => {
    const pkgSource = pkg._source_repo || 'unknown';
    return sources.includes(pkgSource);
  });
};

/**
 * @brief Применяет все фильтры к пакетам
 * @param packages Массив пакетов
 * @param searchTerm Поисковый запрос
 * @param filters Объект с фильтрами
 * @returns Отфильтрованный массив пакетов
 */
export const applyFilters = (
  packages: Package[],
  searchTerm: string,
  filters: Filters
): Package[] => {
  let result = [...packages];

  // Применяем поисковый запрос
  result = filterBySearchTerm(result, searchTerm);

  // Применяем фильтр по архитектуре
  result = filterByArchitecture(result, filters.architecture);

  // Применяем фильтр по категории
  result = filterByCategory(result, filters.packageType);

  // Применяем фильтр по источникам
  result = filterBySources(result, filters.sources);

  // Применяем фильтр по мейнтейнерам
  result = filterByMaintainers(result, filters.maintainers);

  // Применяем фильтр по лицензиям
  result = filterByLicenses(result, filters.licenses);

  return result;
};

/**
 * @brief Сортирует пакеты по названию
 * @param packages Массив пакетов
 * @returns Отсортированный массив пакетов
 */
export const sortPackagesByName = (packages: Package[]): Package[] => {
  return [...packages].sort((a, b) => {
    const nameA = (a.name || '').toLowerCase();
    const nameB = (b.name || '').toLowerCase();
    return nameA.localeCompare(nameB, undefined, { numeric: true });
  });
};

/**
 * @brief Группирует пакеты по первой букве названия
 * @param packages Массив пакетов
 * @returns Массив групп пакетов
 */
export interface PackageGroup {
  letter: string;
  packages: Package[];
}

export const groupPackagesByFirstLetter = (packages: Package[]): PackageGroup[] => {
  const sortedPackages = sortPackagesByName(packages);
  const groupsMap = new Map<string, Package[]>();

  sortedPackages.forEach(pkg => {
    const firstLetter = (pkg.name?.[0] || '#').toUpperCase();

    if (!groupsMap.has(firstLetter)) {
      groupsMap.set(firstLetter, []);
    }
    groupsMap.get(firstLetter)?.push(pkg);
  });

  return Array.from(groupsMap.entries())
    .map(([letter, groupPackages]) => ({
      letter,
      packages: groupPackages,
    }))
    .sort((a, b) => {
      if (a.letter === '#' && b.letter !== '#') return 1;
      if (a.letter !== '#' && b.letter === '#') return -1;
      return a.letter.localeCompare(b.letter);
    });
};
