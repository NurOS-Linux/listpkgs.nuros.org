/**
 * @file sorting.ts
 * @brief Утилиты для сортировки пакетов
 * @author NurOS Team
 * @version 1.0
 */

export interface Package {
  name: string;
  version: string;
  [key: string]: unknown;
}

export interface PackageGroup {
  letter: string;
  packages: Package[];
}

/**
 * @brief Сортирует пакеты по названию в алфавитном порядке
 * @param packages Массив пакетов для сортировки
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
 * @param packages Массив пакетов для группировки
 * @returns Массив групп пакетов, отсортированный по буквам
 */
export const groupPackagesByFirstLetter = (packages: Package[]): PackageGroup[] => {
  // Сначала сортируем пакеты
  const sortedPackages = sortPackagesByName(packages);

  // Группируем по первой букве
  const groupsMap = new Map<string, Package[]>();

  sortedPackages.forEach(pkg => {
    const firstLetter = (pkg.name?.[0] || '#').toUpperCase();

    if (!groupsMap.has(firstLetter)) {
      groupsMap.set(firstLetter, []);
    }
    groupsMap.get(firstLetter)?.push(pkg);
  });

  // Преобразуем в массив групп и сортируем по буквам
  const groups: PackageGroup[] = Array.from(groupsMap.entries())
    .map(([letter, groupPackages]) => ({
      letter,
      packages: groupPackages,
    }))
    .sort((a, b) => {
      // Специальные символы в конце
      if (a.letter === '#' && b.letter !== '#') return 1;
      if (a.letter !== '#' && b.letter === '#') return -1;
      return a.letter.localeCompare(b.letter);
    });

  return groups;
};

/**
 * @brief Фильтрует пакеты по поисковому запросу
 * @param packages Массив пакетов
 * @param searchTerm Поисковый запрос
 * @returns Отфильтрованный массив
 */
export const filterPackagesBySearchTerm = (packages: Package[], searchTerm: string): Package[] => {
  if (!searchTerm.trim()) {
    return packages;
  }

  const term = searchTerm.toLowerCase();
  return packages.filter(
    pkg =>
      (pkg.name || '').toLowerCase().includes(term) ||
      (typeof pkg.description === 'string' ? pkg.description : '').toLowerCase().includes(term)
  );
};
