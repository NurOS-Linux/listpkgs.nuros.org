import { createSignal, createEffect, For } from 'solid-js';
import PackageCard from './PackageCard';
import { type Package } from './PackageCard';
import { groupPackagesByFirstLetter } from '~/utils/search';

interface PackageGroup {
  letter: string;
  packages: Package[];
}

interface GroupedPackageListProps {
  packages: Package[];
}

const GroupedPackageList = (props: GroupedPackageListProps) => {
  const [groupedPackages, setGroupedPackages] = createSignal<PackageGroup[]>([]);
  const [expandedGroups, setExpandedGroups] = createSignal<Set<string>>(new Set());

  createEffect(() => {
    console.log('GroupedPackageList effect triggered');
    console.log('Packages count:', props.packages.length);

    // Используем функцию из sorting.ts для группировки по первой букве
    const groups = groupPackagesByFirstLetter(props.packages);
    console.log(
      'Groups created:',
      groups.map(g => `${g.letter} (${g.packages.length})`)
    );

    setGroupedPackages(groups);
  });

  const toggleGroup = (groupLetter: string) => {
    const newExpandedGroups = new Set(expandedGroups());
    if (newExpandedGroups.has(groupLetter)) {
      newExpandedGroups.delete(groupLetter);
    } else {
      newExpandedGroups.add(groupLetter);
    }
    setExpandedGroups(newExpandedGroups);
  };

  return (
    <div class="grouped-package-list">
      <For each={groupedPackages()}>
        {group => (
          <div class="package-group">
            <div class="group-header" onClick={() => toggleGroup(group.letter)}>
              <h2 class="group-name">
                <span>{group.letter}</span>
                <span class="expand-icon">{expandedGroups().has(group.letter) ? '▼' : '▶'}</span>
              </h2>
              <div class="package-count">{group.packages.length} packages</div>
            </div>

            {expandedGroups().has(group.letter) && (
              <div class="group-packages">
                <For each={group.packages}>{pkg => <PackageCard packageData={pkg} />}</For>
              </div>
            )}
          </div>
        )}
      </For>

      {groupedPackages().length === 0 && <div class="no-results">No packages found</div>}
    </div>
  );
};

export default GroupedPackageList;
