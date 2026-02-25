import { createSignal, createEffect } from 'solid-js';
import PackageCard from './PackageCard';
import GroupedPackageList from './GroupedPackageList';
import { type Package } from './PackageCard'; // Импортируем интерфейс Package
import { sortPackagesByName } from '~/utils/sorting';

interface Filters {
  architecture: string;
  packageType: string;
  maintainers: string[];
  licenses: string[];
  sources: string[];
}

interface PackageListProps {
  packages: Package[];
  searchTerm: string;
  filters: Filters;
  grouped?: boolean;
}

const PackageList = (props: PackageListProps) => {
  const [filteredPackages, setFilteredPackages] = createSignal<Package[]>([]);

  createEffect(() => {
    let result = Array.isArray(props.packages) ? [...props.packages] : [];

    if (result.length === 0) {
      setFilteredPackages([]);
      return;
    }

    // Search term filter
    if (props.searchTerm && props.searchTerm.trim()) {
      const term = props.searchTerm.toLowerCase().trim();
      result = result.filter(
        pkg =>
          (pkg.name && pkg.name.toLowerCase().includes(term)) ||
          (pkg.description && pkg.description.toLowerCase().includes(term))
      );
    }

    // Architecture filter
    if (props.filters.architecture) {
      const architectures = props.filters.architecture.split(',').filter(a => a);
      if (architectures.length > 0) {
        result = result.filter(pkg => 
          pkg.architecture && architectures.some(arch => pkg.architecture?.includes(arch))
        );
      }
    }

    // Package Type (Category) filter
    if (props.filters.packageType) {
      const categories = props.filters.packageType.split(',').filter(c => c);
      if (categories.length > 0) {
        result = result.filter(pkg => {
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
    }
    
    // Sources filter
    if (props.filters.sources && props.filters.sources.length > 0) {
      result = result.filter(pkg => {
        const pkgSource = pkg._source_repo || 'unknown';
        return props.filters.sources.includes(pkgSource);
      });
    }

    // Maintainers filter
    if (props.filters.maintainers && props.filters.maintainers.length > 0) {
      result = result.filter(pkg => {
        const pkgMaintainer = pkg.maintainer || 'unknown';
        return props.filters.maintainers.includes(pkgMaintainer);
      });
    }

    // Licenses filter
    if (props.filters.licenses && props.filters.licenses.length > 0) {
      result = result.filter(pkg => {
        const pkgLicense = pkg.license || 'unknown';
        return props.filters.licenses.includes(pkgLicense);
      });
    }

    result = sortPackagesByName(result);
    setFilteredPackages(result);
  });

  return (
    <div class="package-list">
      {props.grouped ? (
        <GroupedPackageList packages={filteredPackages()} />
      ) : filteredPackages().length > 0 ? (
        filteredPackages().map(pkg => <PackageCard packageData={pkg} />)
      ) : (
        <div class="no-results">No packages found for the selected criteria.</div>
      )}
    </div>
  );
};

export default PackageList;
