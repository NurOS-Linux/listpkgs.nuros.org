/**
 * @file App.tsx
 * @brief Главный компонент приложения NurOS Search
 * @author NurOS Team
 * @version 3.2
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
  
  // Initialize theme from localStorage or system preference
  const savedTheme = typeof window !== 'undefined' 
    ? localStorage.getItem('theme') 
    : 'dark';
  const [darkTheme, setDarkTheme] = createSignal(savedTheme !== 'light');

  // Apply theme on mount and when it changes
  const applyTheme = (isDark: boolean) => {
    const theme = isDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  };

  // Initialize theme on mount
  applyTheme(darkTheme());

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

  const toggleTheme = () => {
    const newTheme = !darkTheme();
    setDarkTheme(newTheme);
    applyTheme(newTheme);
  };

  // Get base path for assets
  const basePath = import.meta.env.BASE_URL;
  const logoSrc = `${basePath}plymoth_adeki_logo.gif`;

  return (
    <>
      <Switch>
        <Match when={loading()}>
          <div class="loading-screen">
            <img src={logoSrc} alt="NurOS Logo" class="loading-logo" />
            <div class="loading-text">Loading Packages...</div>
          </div>
        </Match>
        <Match when={error()}>
          <div class="error">Error: {error()}</div>
        </Match>
        <Match when={!loading() && !error()}>
          <div class="app">
            <header class="app-header">
              <a href="https://www.nuros.org/" target="_blank" rel="noopener noreferrer" class="logo-link" title="Visit NurOS.org">
                <img src={logoSrc} alt="NurOS Logo" class="logo" />
              </a>
              <h1>NurOS Package Search</h1>
              <p class="project-tagline">Speed • Security • Accessibility</p>
              <div class="package-stats" onClick={handleStatsClick}>
                Search more than <strong>{packages().length.toLocaleString()}</strong> packages
              </div>
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
                <SearchBar onSearch={debouncedSetSearchTerm} />
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

            <button class="theme-toggle-fixed" onClick={toggleTheme} title="Toggle theme">
              {darkTheme() ? '☀️' : '🌙'}
            </button>
          </div>
        </Match>
      </Switch>
    </>
  );
}

export default App;
