import { createSignal, createEffect } from 'solid-js';
import PackageCard from './PackageCard';
import GroupedPackageList from './GroupedPackageList';
import { type Package } from './PackageCard'; // Импортируем интерфейс Package
import { sortPackagesByName } from '../utils/sorting';

interface Filters {
  architecture: string;
  channel: string;
  packageType: string;
  source: string;
  maintainers: string[];
  licenses: string[];
}

interface PackageListProps {
  packages: Package[];
  searchTerm: string;
  filters: Filters;
  grouped?: boolean;
}

const PackageList = (props: PackageListProps) => {
  // Используем обычный список
  const [filteredPackages, setFilteredPackages] = createSignal<Package[]>([]);

  createEffect(() => {
    console.log('PackageList effect triggered');
    console.log('Initial packages count:', props.packages.length);
    console.log('Filters applied:', props.filters);
    console.log('Search term:', props.searchTerm);
    console.log('Grouped mode:', props.grouped);

    // Гарантируем что packages - это массив
    let result = Array.isArray(props.packages) ? [...props.packages] : [];

    // Если пакетов нет, устанавливаем пустой массив
    if (result.length === 0) {
      console.log('No packages available');
      setFilteredPackages([]);
      return;
    }

    // Фильтрация по поисковому запросу
    if (props.searchTerm && props.searchTerm.trim()) {
      const term = props.searchTerm.toLowerCase().trim();
      console.log('Applying search filter for term:', term);
      result = result.filter(
        pkg =>
          (pkg.name && pkg.name.toLowerCase().includes(term)) ||
          (pkg.description && pkg.description.toLowerCase().includes(term))
      );
      console.log('Packages after search filter:', result.length);
    }

    // Применение других фильтров
    if (props.filters.architecture && props.filters.architecture !== 'all') {
      const architectures = props.filters.architecture.split(',').filter(a => a);
      console.log('Applying architecture filter:', architectures);
      if (architectures.length > 0) {
        result = result.filter(pkg => {
          if (architectures.includes('all')) return true;
          return pkg.architecture && architectures.some(arch => pkg.architecture?.includes(arch));
        });
      }
      console.log('Packages after architecture filter:', result.length);
    }

    if (props.filters.channel && props.filters.channel !== 'all') {
      console.log('Applying channel filter:', props.filters.channel);
      result = result.filter(pkg => {
        if (pkg._source_repo && typeof pkg._source_repo === 'string') {
          return pkg._source_repo.includes(props.filters.channel);
        }
        return true;
      });
      console.log('Packages after channel filter:', result.length);
    }

    if (props.filters.source && props.filters.source !== 'all') {
      console.log('Applying source filter:', props.filters.source);
      result = result.filter(pkg => {
        const pkgSource = pkg._source_repo || pkg.source;
        if (typeof pkgSource === 'string') {
          return pkgSource.toLowerCase().includes(props.filters.source.toLowerCase());
        }
        return false;
      });
      console.log('Packages after source filter:', result.length);
    }

    if (props.filters.packageType && props.filters.packageType !== 'all') {
      const categories = props.filters.packageType.split(',').filter(c => c);
      console.log('Applying package type filter:', categories);
      if (categories.length > 0) {
        result = result.filter(pkg => {
          if (categories.includes('all')) return true;
          let pkgCategory = 'other';
          if (pkg.type === 'system' || pkg.name.includes('kernel') || pkg.name.includes('core')) {
            pkgCategory = 'core';
          } else if (pkg.type === 'application' || pkg.type === 'desktop') {
            pkgCategory = 'applications';
          } else if (pkg.type === 'library') {
            pkgCategory = 'libraries';
          } else if (pkg.type === 'development') {
            pkgCategory = 'development';
          } else if (pkg.type === 'misc') {
            pkgCategory = 'miscellaneous';
          }
          const match = categories.some(
            cat => pkgCategory.includes(cat) || cat.includes(pkgCategory)
          );
          return match;
        });
      }
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

    // Сортировка по имени
    result = sortPackagesByName(result);
    console.log('Final packages count after all filters:', result.length);

    setFilteredPackages(result);
  });

  return (
    <div class="package-list">
      {props.grouped ? (
        <GroupedPackageList packages={filteredPackages()} />
      ) : filteredPackages().length > 0 ? (
        filteredPackages().map(pkg => <PackageCard packageData={pkg} />)
      ) : (
        <div class="no-results">No packages found</div>
      )}
    </div>
  );
};

export default PackageList;
