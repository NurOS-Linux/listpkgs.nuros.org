/**
 * @file App.tsx
 * @brief Главный компонент приложения NurOS Search
 * @author NurOS Team
 * @version 1.2
 */

import { createSignal, createEffect, Switch, Match } from 'solid-js';
import SearchBar from './components/SearchBar';
import PackageList from './components/PackageList';
import Sidebar from './components/Sidebar';
import usePackageData from './hooks/usePackageData';
import './App.scss';

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
  const [dots, setDots] = createSignal('.');
  const [isDarkTheme, setIsDarkTheme] = createSignal(false);

  createEffect(() => {
    const savedTheme = localStorage.getItem('nuros-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = savedTheme ? savedTheme === 'dark' : prefersDark;
    setIsDarkTheme(isDark);
    applyTheme(isDark);
  });

  const applyTheme = (isDark: boolean) => {
    document.documentElement.classList.toggle('dark-theme', isDark);
    localStorage.setItem('nuros-theme', isDark ? 'dark' : 'light');
  };

  const toggleTheme = () => {
    setIsDarkTheme(prev => {
      const newTheme = !prev;
      applyTheme(newTheme);
      return newTheme;
    });
  };

  createEffect(() => {
    if (loading()) {
      const interval = setInterval(() => {
        setDots(prev => (prev.length >= 3 ? '.' : prev + '.'));
      }, 500);
      return () => clearInterval(interval);
    }
  });

  const handleSearch = (query: string) => {
    setSearchTerm(query);
  };

  const handleViewModeChange = (mode: 'list' | 'grouped') => {
    setViewMode(mode);
  };

  return (
    <>
      <Switch>
        <Match when={loading()}>
          <div class="loading-screen">
            <img src="/plymoth_adeki_logo.gif" alt="NurOS Logo" class="loading-logo" />
            <div class="loading-text">Loading packages{dots()}</div>
            <div class="packages-count">Found {packages().length} packages</div>
          </div>
        </Match>
        <Match when={error()}>
          <div class="error">Error: {error()}</div>
        </Match>
        <Match when={!loading() && !error()}>
          <div class="app">
            <header class="app-header">
              <a
                href="https://www.nuros.org/"
                target="_blank"
                rel="noopener noreferrer"
                class="logo-link"
                title="Visit NurOS Official Website"
              >
                <img src="/plymoth_adeki_logo.gif" alt="NurOS Logo" class="logo" />
              </a>
              <h1>NurOS Search</h1>
              <p>Независимый Linux дистрибутив - поиск пакетов</p>
              <p class="project-tagline">Скорость • Безопасность • Доступность</p>
              <div class="package-stats">
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
                <SearchBar onSearch={handleSearch} />

                <div class="view-mode-container">
                  <button
                    class={`view-mode-btn ${viewMode() === 'list' ? 'active' : ''}`}
                    onClick={() => handleViewModeChange('list')}
                  >
                    📋 List View
                  </button>
                  <button
                    class={`view-mode-btn ${viewMode() === 'grouped' ? 'active' : ''}`}
                    onClick={() => handleViewModeChange('grouped')}
                  >
                    📦 Grouped View
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

      <button
        class="theme-toggle-btn"
        onClick={toggleTheme}
        title={isDarkTheme() ? 'Switch to light mode' : 'Switch to dark mode'}
        aria-label={isDarkTheme() ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDarkTheme() ? '☀️' : '🌙'}
      </button>
    </>
  );
}

export default App;
