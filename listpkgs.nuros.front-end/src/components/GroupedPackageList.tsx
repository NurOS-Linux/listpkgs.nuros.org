import { createSignal, createEffect } from 'solid-js';
import PackageCard from './PackageCard';
import { type Package } from './PackageCard'; // Импортируем интерфейс Package

interface PackageGroup {
  name: string;
  packages: Package[];
}

interface Filters {
  architecture: string;
  channel: string;
  packageType: string;
}

interface GroupedPackageListProps {
  packages: Package[];
  searchTerm: string;
  filters: Filters;
}

const GroupedPackageList = (props: GroupedPackageListProps) => {
  const [groupedPackages, setGroupedPackages] = createSignal<PackageGroup[]>([]);
  const [expandedGroups, setExpandedGroups] = createSignal<Set<string>>(new Set());

  createEffect(() => {
    let result = [...props.packages];
    
    // Фильтрация по поисковому запросу
    if (props.searchTerm) {
      const term = props.searchTerm.toLowerCase();
      result = result.filter(pkg => 
        pkg.name.toLowerCase().includes(term) ||
        (pkg.description && pkg.description.toLowerCase().includes(term))
      );
    }
    
    // Применение других фильтров
    if (props.filters.architecture && props.filters.architecture !== 'all') {
      const architectures = props.filters.architecture.split(',');
      result = result.filter(pkg => {
        if (architectures.includes('all')) return true;
        return pkg.architecture && architectures.some(arch => pkg.architecture?.includes(arch));
      });
    }

    // Группировка пакетов по категории (умная группировка)
    const groupsMap = new Map<string, Package[]>();
    result.forEach(pkg => {
      // Определяем категорию пакета на основе различных признаков
      let category = 'Other';
      if (pkg.type === 'system' || pkg.name.includes('kernel') || pkg.name.includes('core')) {
        category = 'System Packages';
      } else if (pkg.type === 'application' || pkg.type === 'desktop') {
        category = 'Applications';
      } else if (pkg.type === 'library') {
        category = 'Libraries';
      } else if (pkg.type === 'development') {
        category = 'Development Tools';
      } else if (pkg.type === 'shell' || pkg.name.includes('shell')) {
        category = 'Shells';
      } else if (pkg.type === 'misc') {
        category = 'Utilities';
      } else {
        // Дополнительная эвристика: определение категории по названию
        const nameLower = pkg.name.toLowerCase();
        if (nameLower.includes('driver') || nameLower.includes('firmware')) {
          category = 'Drivers & Firmware';
        } else if (nameLower.includes('tool') || nameLower.includes('util')) {
          category = 'Utilities';
        } else if (nameLower.includes('game')) {
          category = 'Games';
        } else if (nameLower.includes('theme') || nameLower.includes('icon') || nameLower.includes('font')) {
          category = 'Themes & Fonts';
        } else if (nameLower.includes('security') || nameLower.includes('crypto')) {
          category = 'Security Tools';
        } else if (nameLower.includes('network') || nameLower.includes('net')) {
          category = 'Network Tools';
        } else if (nameLower.includes('media')) {
          category = 'Media Tools';
        } else {
          category = 'Other';
        }
      }

      if (!groupsMap.has(category)) {
        groupsMap.set(category, []);
      }
      groupsMap.get(category)?.push(pkg);
    });

    // Сортировка групп
    const sortedGroups = Array.from(groupsMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([name, packages]) => ({
        name,
        packages: packages.sort((a, b) => a.name.localeCompare(b.name))
      }));

    setGroupedPackages(sortedGroups);
  });

  const toggleGroup = (groupName: string) => {
    const newExpandedGroups = new Set(expandedGroups());
    if (newExpandedGroups.has(groupName)) {
      newExpandedGroups.delete(groupName);
    } else {
      newExpandedGroups.add(groupName);
    }
    setExpandedGroups(newExpandedGroups);
  };

  return (
    <div class="grouped-package-list">
      {groupedPackages().map(group => (
        <div class="package-group">
          <div class="group-header" onClick={() => toggleGroup(group.name)}>
            <h2 class="group-name">
              {group.name} ({group.packages.length})
              <span class="expand-icon">
                {expandedGroups().has(group.name) ? '▼' : '▶'}
              </span>
            </h2>
          </div>
          
          {expandedGroups().has(group.name) && (
            <div class="group-packages">
              {group.packages.map(pkg => (
                <PackageCard packageData={pkg} />
              ))}
            </div>
          )}
        </div>
      ))}
      
      {groupedPackages().length === 0 && (
        <div class="no-results">No packages found</div>
      )}
    </div>
  );
};

export default GroupedPackageList;