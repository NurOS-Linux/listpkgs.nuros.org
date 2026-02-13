import { createSignal, createEffect } from 'solid-js';
import PackageCard from './PackageCard';
import GroupedPackageList from './GroupedPackageList';
import { type Package } from './PackageCard'; // Импортируем интерфейс Package

interface Filters {
  architecture: string;
  channel: string;
  packageType: string;
  maintainers: string[];
  licenses: string[];
}

interface PackageListProps {
  packages: Package[];
  searchTerm: string;
  filters: Filters;
  grouped: boolean;
}

const PackageList = (props: PackageListProps) => {
  // Если включена группировка, используем GroupedPackageList
  if (props.grouped) {
    return (
      <GroupedPackageList
        packages={props.packages}
        searchTerm={props.searchTerm}
        filters={props.filters}
      />
    );
  }

  // Иначе используем обычный список
  const [filteredPackages, setFilteredPackages] = createSignal<Package[]>([]);

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

    if (props.filters.channel && props.filters.channel !== 'all') {
      // Фильтрация по репозиторию (берем из _source_repo)
      result = result.filter(pkg => {
        if (pkg._source_repo) {
          return pkg._source_repo.includes(props.filters.channel);
        }
        return true;
      });
    }

    if (props.filters.packageType && props.filters.packageType !== 'all') {
      const categories = props.filters.packageType.split(',');
      result = result.filter(pkg => {
        if (categories.includes('all')) return true;
        // Определяем категорию пакета и проверяем соответствие
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
        return categories.some(cat => pkgCategory.includes(cat) || cat.includes(pkgCategory));
      });
    }

    // Фильтрация по мейнтейнерам
    if (props.filters.maintainers && props.filters.maintainers.length > 0) {
      result = result.filter(pkg => {
        const pkgMaintainer = pkg.maintainer || 'unknown';
        return props.filters.maintainers.includes(pkgMaintainer);
      });
    }

    // Фильтрация по лицензиям
    if (props.filters.licenses && props.filters.licenses.length > 0) {
      result = result.filter(pkg => {
        const pkgLicense = pkg.license || 'unknown';
        return props.filters.licenses.includes(pkgLicense);
      });
    }

    // Сортировка по имени
    result.sort((a, b) => a.name.localeCompare(b.name));

    setFilteredPackages(result);
  });

  return (
    <div class="package-list">
      {filteredPackages().length > 0 ? (
        filteredPackages().map(pkg => (
          <PackageCard packageData={pkg} />
        ))
      ) : (
        <div class="no-results">No packages found</div>
      )}
    </div>
  );
};

export default PackageList;