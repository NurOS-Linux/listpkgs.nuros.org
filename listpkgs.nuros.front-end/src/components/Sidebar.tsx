import { createSignal, createEffect } from 'solid-js';
import TreeNavigation from './TreeNavigation';

interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
  count?: number;
}

interface SidebarProps {
  packages: any[];
  onFilterChange: (filters: { architectures: string[]; categories: string[] }) => void;
}

const Sidebar = (props: SidebarProps) => {
  const [selectedArchitectures, setSelectedArchitectures] = createSignal<string[]>([]);
  const [selectedCategories, setSelectedCategories] = createSignal<string[]>([]);
  const [treeNodes, setTreeNodes] = createSignal<TreeNode[]>([]);

  // Обновляем дерево при изменении пакетов
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

    // Создаем узлы дерева
    const nodes: TreeNode[] = [
      {
        id: 'architectures',
        label: 'Architectures',
        children: Array.from(archMap.entries()).map(([arch, count]) => ({
          id: `arch-${arch}`,
          label: arch,
          count: count
        }))
      },
      {
        id: 'categories',
        label: 'Categories',
        children: Array.from(categoryMap.entries()).map(([category, count]) => ({
          id: `cat-${category}`,
          label: category.charAt(0).toUpperCase() + category.slice(1),
          count: count
        }))
      }
    ];

    setTreeNodes(nodes);
  });

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
    }
  };

  // Отправляем фильтры при изменении
  createEffect(() => {
    props.onFilterChange({
      architectures: selectedArchitectures(),
      categories: selectedCategories()
    });
  });

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

export default Sidebar;