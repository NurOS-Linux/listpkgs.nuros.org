import { createSignal, createEffect } from 'solid-js';
import PackageCard from './PackageCard';
import GroupedPackageList from './GroupedPackageList';
import { type Package } from './PackageCard';
import { applyFilters, sortPackagesByName } from '~/utils/search';

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
    const result = applyFilters(props.packages, props.searchTerm, props.filters);
    const sorted = sortPackagesByName(result);
    setFilteredPackages(sorted);
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
