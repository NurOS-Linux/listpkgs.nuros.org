/**
 * @file Sidebar.tsx
 * @brief Компонент боковой панели с фильтрами и навигацией
 * @author NurOS Team
 * @version 1.0
 */

import { createSignal, createEffect } from 'solid-js';
import TreeNavigation from './TreeNavigation';

/**
 * @interface TreeNode
 * @brief Интерфейс узла дерева навигации
 * @property {string} id - Уникальный идентификатор узла
 * @property {string} label - Текстовое представление узла
 * @property {TreeNode[]} [children] - Дочерние узлы
 * @property {number} [count] - Количество элементов в узле
 */
interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
  count?: number;
}

/**
 * @interface SidebarProps
 * @brief Интерфейс свойств компонента Sidebar
 * @property {any[]} packages - Массив пакетов для фильтрации
 * @property {Function} onFilterChange - Функция для обработки изменения фильтров
 */
interface SidebarProps {
  packages: any[];
  onFilterChange: (filters: { architectures: string[]; categories: string[]; maintainers: string[]; licenses: string[] }) => void;
}

/**
 * @brief Компонент боковой панели
 * @details Отображает фильтры и навигационное дерево для группировки пакетов
 * @param {SidebarProps} props - Свойства компонента
 * @returns JSX.Element - Компонент боковой панели
 */
const Sidebar = (props: SidebarProps) => {
  const [selectedArchitectures, setSelectedArchitectures] = createSignal<string[]>([]);
  const [selectedCategories, setSelectedCategories] = createSignal<string[]>([]);
  const [selectedMaintainers, setSelectedMaintainers] = createSignal<string[]>([]);
  const [selectedLicenses, setSelectedLicenses] = createSignal<string[]>([]);
  const [treeNodes, setTreeNodes] = createSignal<TreeNode[]>([]);

  /**
   * @brief Эффект для обновления дерева при изменении пакетов
   * @details Группирует пакеты по различным аспектам, создает узлы дерева
   */
  createEffect(() => {
    const packages = props.packages;

    // Группируем пакеты по архитектуре
    const archMap = new Map<string, number>();
    packages.forEach(pkg => {
      const arch = pkg.architecture || 'unknown';
      archMap.set(arch, (archMap.get(arch) || 0) + 1);
    });

    // Группируем пакеты по категории (определяем на основе типа или других признаков)
    const categoryMap = new Map<string, number>();
    packages.forEach(pkg => {
      // Определяем категорию на основе типа или других признаков
      let category = 'other';
      if (pkg.type === 'system' || pkg.name.includes('kernel') || pkg.name.includes('core')) {
        category = 'core';
      } else if (pkg.type === 'application' || pkg.type === 'desktop') {
        category = 'applications';
      } else if (pkg.type === 'library') {
        category = 'libraries';
      } else if (pkg.type === 'development') {
        category = 'development';
      } else if (pkg.type === 'misc') {
        category = 'miscellaneous';
      }
      categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
    });

    // Группируем пакеты по мейнтейнерам
    const maintainerMap = new Map<string, number>();
    packages.forEach(pkg => {
      const maintainer = pkg.maintainer || 'unknown';
      maintainerMap.set(maintainer, (maintainerMap.get(maintainer) || 0) + 1);
    });

    // Группируем пакеты по лицензиям
    const licenseMap = new Map<string, number>();
    packages.forEach(pkg => {
      const license = pkg.license || 'unknown';
      licenseMap.set(license, (licenseMap.get(license) || 0) + 1);
    });

    // Создаем узлы дерева
    const nodes: TreeNode[] = [
      {
        id: 'architectures',
        label: 'Architectures',
        sortField: 'label', // Сортировка по алфавиту
        children: Array.from(archMap.entries()).map(([arch, count]) => ({
          id: `arch-${arch}`,
          label: arch,
          count: count
        }))
      },
      {
        id: 'categories',
        label: 'Categories',
        sortField: 'label', // Сортировка по алфавиту
        children: Array.from(categoryMap.entries()).map(([category, count]) => ({
          id: `cat-${category}`,
          label: category.charAt(0).toUpperCase() + category.slice(1),
          count: count
        }))
      },
      {
        id: 'maintainers',
        label: 'Maintainers',
        sortField: 'label', // Сортировка по алфавиту
        children: Array.from(maintainerMap.entries()).map(([maintainer, count]) => ({
          id: `maintainer-${maintainer}`,
          label: maintainer,
          count: count
        }))
      },
      {
        id: 'licenses',
        label: 'Licenses',
        sortField: 'label', // Сортировка по алфавиту
        children: Array.from(licenseMap.entries()).map(([license, count]) => ({
          id: `license-${license}`,
          label: license,
          count: count
        }))
      }
    ];

    setTreeNodes(nodes);
  });

  /**
   * @brief Обработчик выбора узла в дереве
   * @details Обновляет выбранные архитектуры, категории, мейнтейнеров или лицензии в зависимости от типа узла
   * @param {string} nodeId - Идентификатор выбранного узла
   */
  const handleNodeSelect = (nodeId: string) => {
    if (nodeId.startsWith('arch-')) {
      const arch = nodeId.substring(5); // убираем 'arch-'
      setSelectedArchitectures(prev => {
        if (prev.includes(arch)) {
          return prev.filter(a => a !== arch);
        } else {
          return [...prev, arch];
        }
      });
    } else if (nodeId.startsWith('cat-')) {
      const category = nodeId.substring(4); // убираем 'cat-'
      setSelectedCategories(prev => {
        if (prev.includes(category)) {
          return prev.filter(c => c !== category);
        } else {
          return [...prev, category];
        }
      });
    } else if (nodeId.startsWith('maintainer-')) {
      const maintainer = nodeId.substring(11); // убираем 'maintainer-'
      setSelectedMaintainers(prev => {
        if (prev.includes(maintainer)) {
          return prev.filter(c => c !== maintainer);
        } else {
          return [...prev, maintainer];
        }
      });
    } else if (nodeId.startsWith('license-')) {
      const license = nodeId.substring(8); // убираем 'license-'
      setSelectedLicenses(prev => {
        if (prev.includes(license)) {
          return prev.filter(c => c !== license);
        } else {
          return [...prev, license];
        }
      });
    }
  };

  /**
   * @brief Эффект для отправки фильтров при изменении
   * @details Вызывает функцию onFilterChange при изменении выбранных фильтров
   */
  createEffect(() => {
    props.onFilterChange({
      architectures: selectedArchitectures(),
      categories: selectedCategories(),
      maintainers: selectedMaintainers(),
      licenses: selectedLicenses()
    });
  });

  /**
   * @brief Рендеринг компонента
   * @details Возвращает JSX элемент боковой панели с фильтрами
   */
  return (
    <aside class="sidebar">
      <h3>Filters</h3>
      <TreeNavigation
        nodes={treeNodes()}
        onSelect={handleNodeSelect}
      />
    </aside>
  );
};

/**
 * @brief Экспорт компонента Sidebar
 * @details Экспортирует компонент по умолчанию
 */
export default Sidebar;