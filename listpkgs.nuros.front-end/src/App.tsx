/**
 * @file App.tsx
 * @brief Главный компонент приложения NurOS Search
 * @author NurOS Team
 * @version 3.0 (Juldyz Edition)
 */

import { createSignal, Switch, Match } from 'solid-js';
import SearchBar from '~/components/SearchBar';
import PackageList from '~/components/PackageList';
import Sidebar from '~/components/Sidebar';
import usePackageData from '~/hooks/usePackageData';

// Type-safe debounce function
function debounce<F extends (...args: Parameters<F>) => ReturnType<F>>(fn: F, delay: number) {
  let timeoutId: number;
  return (...args: Parameters<F>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

interface Filters {
  architecture: string;
  packageType: string;
  maintainers: string[];
  licenses: string[];
  sources: string[];
}

function App() {
  const { packages, loading, error } = usePackageData();
  const [searchTerm, setSearchTerm] = createSignal('');
  const [filters, setFilters] = createSignal<Filters>({
    architecture: '',
    packageType: '',
    maintainers: [],
    licenses: [],
    sources: [],
  });
  const [viewMode, setViewMode] = createSignal<'list' | 'grouped'>('list');

  const debouncedSetSearchTerm = debounce((query: string) => {
    setSearchTerm(query);
  }, 300);

  const handleStatsClick = () => {
    const hasSeenAlert = sessionStorage.getItem('nuros-easter-egg-seen');
    if (!hasSeenAlert) {
      alert('You found a reference, to what you think for yourself ❄️');
      sessionStorage.setItem('nuros-easter-egg-seen', 'true');
    }
  };

  return (
    <>
      <Switch>
        <Match when={loading()}>
          <div class="loading-screen">
            <img src="/plymoth_adeki_logo.gif" alt="NurOS Logo" class="loading-logo" />
            <div class="loading-text">Loading Packages...</div>
          </div>
        </Match>
        <Match when={error()}>
          <div class="error">Error: {error()}</div>
        </Match>
        <Match when={!loading() && !error()}>
          <div class="app">
            <header class="app-header">
              <img src="/plymoth_adeki_logo.gif" alt="NurOS Logo" class="logo" />
              <h1>NurOS Package Search</h1>
              <p class="project-tagline">Speed • Security • Accessibility</p>
              <div class="package-stats" onClick={handleStatsClick}>
                Search more than <strong>{packages().length.toLocaleString()}</strong> packages
              </div>
              <SearchBar onSearch={debouncedSetSearchTerm} />
            </header>

            <div class="app-layout">
              <Sidebar
                packages={packages()}
                onFilterChange={newFilters => {
                  setFilters({
                    architecture: newFilters.architectures.join(','),
                    packageType: newFilters.categories.join(','),
                    maintainers: newFilters.maintainers,
                    licenses: newFilters.licenses,
                    sources: newFilters.sources,
                  });
                }}
              />

              <main class="app-main">
                <div class="view-mode-container">
                  <button
                    class={`view-mode-btn ${viewMode() === 'list' ? 'active' : ''}`}
                    onClick={() => setViewMode('list')}
                  >
                    List
                  </button>
                  <button
                    class={`view-mode-btn ${viewMode() === 'grouped' ? 'active' : ''}`}
                    onClick={() => setViewMode('grouped')}
                  >
                    Grouped
                  </button>
                </div>
                <PackageList
                  packages={packages()}
                  searchTerm={searchTerm()}
                  filters={filters()}
                  grouped={viewMode() === 'grouped'}
                />
              </main>
            </div>
          </div>
        </Match>
      </Switch>
    </>
  );
}

export default App;
