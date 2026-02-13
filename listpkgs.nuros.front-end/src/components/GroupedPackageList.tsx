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
  maintainers: string[];
  licenses: string[];
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
    console.log('GroupedPackageList effect triggered');
    console.log('Initial packages count:', props.packages.length);
    console.log('Filters applied:', props.filters);
    console.log('Search term:', props.searchTerm);
    
    let result = [...props.packages];

    // Фильтрация по поисковому запросу
    if (props.searchTerm) {
      const term = props.searchTerm.toLowerCase();
      console.log('Applying search filter for term:', term);
      result = result.filter(pkg =>
        pkg.name.toLowerCase().includes(term) ||
        (pkg.description && pkg.description.toLowerCase().includes(term))
      );
      console.log('Packages after search filter:', result.length);
    }

    // Применение других фильтров
    if (props.filters.architecture && props.filters.architecture !== 'all') {
      const architectures = props.filters.architecture.split(',');
      console.log('Applying architecture filter:', architectures);
      result = result.filter(pkg => {
        if (architectures.includes('all')) return true;
        return pkg.architecture && architectures.some(arch => pkg.architecture?.includes(arch));
      });
      console.log('Packages after architecture filter:', result.length);
    }

    if (props.filters.channel && props.filters.channel !== 'all') {
      console.log('Applying channel filter:', props.filters.channel);
      // Фильтрация по репозиторию (берем из _source_repo)
      result = result.filter(pkg => {
        if (pkg._source_repo) {
          return pkg._source_repo.includes(props.filters.channel);
        }
        return true;
      });
      console.log('Packages after channel filter:', result.length);
    }

    // Фильтрация по типу пакета
    if (props.filters.packageType && props.filters.packageType !== 'all') {
      const categories = props.filters.packageType.split(',');
      console.log('Applying package type filter:', categories);
      result = result.filter(pkg => {
        if (categories.includes('all')) return true;
        // Определяем категорию пакета и проверяем соответствие
        let pkgCategory = 'other';
        if (pkg.type === 'system' || pkg.name.includes('kernel') || pkg.name.includes('core')) {
          pkgCategory = 'system';
        } else if (pkg.type === 'application' || pkg.type === 'desktop') {
          pkgCategory = 'application';
        } else if (pkg.type === 'library') {
          pkgCategory = 'library';
        } else if (pkg.type === 'development') {
          pkgCategory = 'development';
        } else if (pkg.type === 'misc') {
          pkgCategory = 'misc';
        }
        const match = categories.some(cat => pkgCategory.includes(cat) || cat.includes(pkgCategory));
        return match;
      });
      console.log('Packages after package type filter:', result.length);
    }

    // Фильтрация по мейнтейнерам
    if (props.filters.maintainers && props.filters.maintainers.length > 0) {
      console.log('Applying maintainers filter:', props.filters.maintainers);
      result = result.filter(pkg => {
        const pkgMaintainer = pkg.maintainer || 'unknown';
        return props.filters.maintainers.includes(pkgMaintainer);
      });
      console.log('Packages after maintainers filter:', result.length);
    }

    // Фильтрация по лицензиям
    if (props.filters.licenses && props.filters.licenses.length > 0) {
      console.log('Applying licenses filter:', props.filters.licenses);
      result = result.filter(pkg => {
        const pkgLicense = pkg.license || 'unknown';
        return props.filters.licenses.includes(pkgLicense);
      });
      console.log('Packages after licenses filter:', result.length);
    }

    console.log('Final packages count after all filters:', result.length);

    // Группировка пакетов по типу (умная группировка)
    const groupsMap = new Map<string, Package[]>();
    
    // Сначала попробуем сгруппировать по типу пакета
    result.forEach(pkg => {
      let category = 'Other';
      
      // Определяем категорию на основе типа пакета
      if (pkg.type) {
        switch(pkg.type) {
          case 'system':
            category = 'System';
            break;
          case 'application':
          case 'desktop':
            category = 'Applications';
            break;
          case 'library':
            category = 'Libraries';
            break;
          case 'development':
            category = 'Development';
            break;
          case 'shell':
            category = 'Shells';
            break;
          case 'misc':
            category = 'Miscellaneous';
            break;
          default:
            category = pkg.type.charAt(0).toUpperCase() + pkg.type.slice(1);
        }
      } else {
        // Если тип не указан, определяем на основе названия
        const nameLower = pkg.name.toLowerCase();
        if (nameLower.includes('kernel') || nameLower.includes('core') || nameLower.includes('system')) {
          category = 'System';
        } else if (nameLower.includes('lib')) {
          category = 'Libraries';
        } else if (nameLower.includes('dev') || nameLower.includes('devel') || nameLower.includes('sdk')) {
          category = 'Development';
        } else {
          category = 'Other';
        }
      }

      if (!groupsMap.has(category)) {
        groupsMap.set(category, []);
      }
      groupsMap.get(category)?.push(pkg);
    });

    console.log('Groups created:', Array.from(groupsMap.keys()));
    Array.from(groupsMap.entries()).forEach(([name, packages]) => {
      console.log(`Group "${name}" has ${packages.length} packages`);
    });

    // Умная сортировка групп на основе примененных фильтров
    const sortedGroups = Array.from(groupsMap.entries())
      .sort(([a], [b]) => {
        // Если применен фильтр по архитектуре, сортируем по архитектуре
        if (props.filters.architecture && props.filters.architecture !== 'all') {
          console.log('Sorting groups by architecture filter');
          return a.localeCompare(b);
        }
        // Если применен фильтр по мейнтейнерам, сортируем по мейнтейнерам
        else if (props.filters.maintainers && props.filters.maintainers.length > 0) {
          console.log('Sorting groups by maintainers filter');
          return a.localeCompare(b);
        }
        // Если применен фильтр по лицензиям, сортируем по лицензиям
        else if (props.filters.licenses && props.filters.licenses.length > 0) {
          console.log('Sorting groups by licenses filter');
          return a.localeCompare(b);
        }
        // Если применен фильтр по типу пакета, сортируем по типу
        else if (props.filters.packageType && props.filters.packageType !== 'all') {
          console.log('Sorting groups by package type filter');
          return a.localeCompare(b);
        }
        // В противном случае, сортируем по алфавиту
        else {
          console.log('Sorting groups alphabetically');
          return a.localeCompare(b);
        }
      })
      .map(([name, packages]) => {
        console.log(`Processing group "${name}" with ${packages.length} packages`);
        
        // Умная сортировка пакетов внутри групп на основе примененных фильтров
        let sortedPackages = packages;
        
        // Если применен фильтр по архитектуре, сортируем пакеты по архитектуре
        if (props.filters.architecture && props.filters.architecture !== 'all') {
          console.log('Sorting packages by architecture within group');
          sortedPackages = packages.sort((a, b) => {
            const aArch = a.architecture || 'unknown';
            const bArch = b.architecture || 'unknown';
            return aArch.localeCompare(bArch);
          });
        }
        // Если применен фильтр по мейнтейнерам, сортируем по мейнтейнерам
        else if (props.filters.maintainers && props.filters.maintainers.length > 0) {
          console.log('Sorting packages by maintainers within group');
          sortedPackages = packages.sort((a, b) => {
            const aMaintainer = a.maintainer || 'unknown';
            const bMaintainer = b.maintainer || 'unknown';
            return aMaintainer.localeCompare(bMaintainer);
          });
        }
        // Если применен фильтр по лицензиям, сортируем по лицензиям
        else if (props.filters.licenses && props.filters.licenses.length > 0) {
          console.log('Sorting packages by licenses within group');
          sortedPackages = packages.sort((a, b) => {
            const aLicense = a.license || 'unknown';
            const bLicense = b.license || 'unknown';
            return aLicense.localeCompare(bLicense);
          });
        }
        // Если применен фильтр по типу пакета, сортируем по имени
        else if (props.filters.packageType && props.filters.packageType !== 'all') {
          console.log('Sorting packages by name within group');
          sortedPackages = packages.sort((a, b) => a.name.localeCompare(b.name));
        }
        // В противном случае, сортируем по имени
        else {
          console.log('Default sorting by name within group');
          sortedPackages = packages.sort((a, b) => a.name.localeCompare(b.name));
        }
        
        return {
          name,
          packages: sortedPackages
        };
      });

    console.log('Final grouped packages:', sortedGroups.map(g => `${g.name} (${g.packages.length})`));
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
              <span>{group.name}</span>
              <span class="expand-icon">
                {expandedGroups().has(group.name) ? '▼' : '▶'}
              </span>
            </h2>
            <div class="package-count">{group.packages.length} packages</div>
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