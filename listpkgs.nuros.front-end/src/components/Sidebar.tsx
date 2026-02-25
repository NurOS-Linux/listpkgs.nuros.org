/**
 * @file Sidebar.tsx
 * @brief Компонент боковой панели с фильтрами и навигацией
 * @author NurOS Team
 * @version 1.1
 */

import { createSignal, createEffect } from 'solid-js';
import TreeNavigation from './TreeNavigation';

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
  [key: string]: unknown;
}

interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
  count?: number;
  sortField?: string;
}

interface SidebarProps {
  packages: Package[];
  onFilterChange: (filters: {
    architectures: string[];
    categories: string[];
    maintainers: string[];
    licenses: string[];
    sources: string[];
  }) => void;
}

const Sidebar = (props: SidebarProps) => {
  const [selectedArchitectures, setSelectedArchitectures] = createSignal<string[]>([]);
  const [selectedCategories, setSelectedCategories] = createSignal<string[]>([]);
  const [selectedMaintainers, setSelectedMaintainers] = createSignal<string[]>([]);
  const [selectedLicenses, setSelectedLicenses] = createSignal<string[]>([]);
  const [selectedSources, setSelectedSources] = createSignal<string[]>([]);
  const [treeNodes, setTreeNodes] = createSignal<TreeNode[]>([]);

  createEffect(() => {
    const packages = props.packages;

    const archMap = new Map<string, number>();
    const categoryMap = new Map<string, number>();
    const maintainerMap = new Map<string, number>();
    const licenseMap = new Map<string, number>();
    const sourceMap = new Map<string, number>();

    packages.forEach(pkg => {
      const arch = pkg.architecture || 'unknown';
      archMap.set(arch, (archMap.get(arch) || 0) + 1);

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

      const maintainer = pkg.maintainer || 'unknown';
      maintainerMap.set(maintainer, (maintainerMap.get(maintainer) || 0) + 1);

      const license = pkg.license || 'unknown';
      licenseMap.set(license, (licenseMap.get(license) || 0) + 1);

      const source = pkg._source_repo || 'unknown';
      sourceMap.set(source, (sourceMap.get(source) || 0) + 1);
    });

    const nodes: TreeNode[] = [
      {
        id: 'architectures',
        label: 'Architectures',
        sortField: 'label',
        children: Array.from(archMap.entries()).map(([arch, count]) => ({
          id: `arch-${arch}`,
          label: arch,
          count: count,
        })),
      },
      {
        id: 'categories',
        label: 'Categories',
        sortField: 'label',
        children: Array.from(categoryMap.entries()).map(([category, count]) => ({
          id: `cat-${category}`,
          label: category.charAt(0).toUpperCase() + category.slice(1),
          count: count,
        })),
      },
      {
        id: 'sources',
        label: 'Sources',
        sortField: 'label',
        children: Array.from(sourceMap.entries()).map(([source, count]) => ({
          id: `source-${source}`,
          label: source,
          count: count,
        })),
      },
      {
        id: 'maintainers',
        label: 'Maintainers',
        sortField: 'label',
        children: Array.from(maintainerMap.entries()).map(([maintainer, count]) => ({
          id: `maintainer-${maintainer}`,
          label: maintainer,
          count: count,
        })),
      },
      {
        id: 'licenses',
        label: 'Licenses',
        sortField: 'label',
        children: Array.from(licenseMap.entries()).map(([license, count]) => ({
          id: `license-${license}`,
          label: license,
          count: count,
        })),
      },
    ];

    setTreeNodes(nodes);
  });

  const handleNodeSelect = (nodeId: string) => {
    if (nodeId.startsWith('arch-')) {
      const arch = nodeId.substring(5);
      setSelectedArchitectures(prev =>
        prev.includes(arch) ? prev.filter(a => a !== arch) : [...prev, arch]
      );
    } else if (nodeId.startsWith('cat-')) {
      const category = nodeId.substring(4);
      setSelectedCategories(prev =>
        prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
      );
    } else if (nodeId.startsWith('maintainer-')) {
      const maintainer = nodeId.substring(11);
      setSelectedMaintainers(prev =>
        prev.includes(maintainer) ? prev.filter(m => m !== maintainer) : [...prev, maintainer]
      );
    } else if (nodeId.startsWith('license-')) {
      const license = nodeId.substring(8);
      setSelectedLicenses(prev =>
        prev.includes(license) ? prev.filter(l => l !== license) : [...prev, license]
      );
    } else if (nodeId.startsWith('source-')) {
      const source = nodeId.substring(7);
      setSelectedSources(prev =>
        prev.includes(source) ? prev.filter(s => s !== source) : [...prev, source]
      );
    }
  };

  createEffect(() => {
    props.onFilterChange({
      architectures: selectedArchitectures(),
      categories: selectedCategories(),
      maintainers: selectedMaintainers(),
      licenses: selectedLicenses(),
      sources: selectedSources(),
    });
  });

  return (
    <aside class="sidebar">
      <h3>Filters</h3>
      <TreeNavigation nodes={treeNodes()} onSelect={handleNodeSelect} />
    </aside>
  );
};

export default Sidebar;
