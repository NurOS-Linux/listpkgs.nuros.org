/**
 * @file App.tsx
 * @brief Главный компонент приложения NurOS Search
 * @author NurOS Team
 * @version 1.0
 */

import { createSignal, createEffect, Switch, Match } from 'solid-js';
import SearchBar from './components/SearchBar';
import PackageList from './components/PackageList';
import Sidebar from './components/Sidebar';
import usePackageData from './hooks/usePackageData';
import './App.scss';

/**
 * @interface Filters
 * @brief Интерфейс для фильтров пакетов
 * @property {string} architecture - Архитектура пакета
 * @property {string} channel - Канал обновлений
 * @property {string} packageType - Тип пакета
 * @property {string[]} versions - Версии пакетов
 */
interface Filters {
  architecture: string;
  channel: string;
  packageType: string;
  versions: string[];
}

/**
 * @brief Главная функция приложения NurOS Search
 * @details Этот компонент управляет основной логикой приложения, включая загрузку данных,
 *          отображение экрана загрузки, обработку фильтров и переключение между режимами просмотра
 * @returns JSX.Element - Основной интерфейс приложения
 */
function App() {
  const { packages, loading, error } = usePackageData();
  const [searchTerm, setSearchTerm] = createSignal('');
  const [filters, setFilters] = createSignal<Filters>({
    architecture: 'all',
    channel: 'all',
    packageType: 'all',
    versions: []
  });
  const [viewMode, setViewMode] = createSignal<'list' | 'grouped'>('list');
  const [dots, setDots] = createSignal('.');

  /**
   * @brief Эффект для анимации точек на экране загрузки
   * @details Обновляет состояние точек каждые 500мс, когда приложение находится в состоянии загрузки
   */
  createEffect(() => {
    if (loading()) {
      const interval = setInterval(() => {
        setDots(prev => prev.length >= 3 ? '.' : prev + '.');
      }, 500);

      return () => clearInterval(interval);
    }
  });

  /**
   * @brief Обработчик поискового запроса
   * @param query Поисковый запрос от пользователя
   * @returns void
   */
  const handleSearch = (query: string) => {
    setSearchTerm(query);
  };

  /**
   * @brief Обработчик изменения фильтров
   * @param newFilters Новые значения фильтров
   * @returns void
   */
  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  /**
   * @brief Обработчик переключения режима отображения
   * @param mode Режим отображения ('list' или 'grouped')
   * @returns void
   */
  const handleViewModeChange = (mode: 'list' | 'grouped') => {
    setViewMode(mode);
  };

  return (
    <Switch>
      <Match when={loading()}>
        <div class="loading-screen">
          <img src="/assets/nuros_logo.svg" alt="NurOS Logo" class="loading-logo" />
          <div class="loading-text">
            Loading packages{dots()}
          </div>
          <div class="packages-count">
            Found {packages().length} packages
          </div>
        </div>
      </Match>
      <Match when={error()}>
        <div class="error">Error: {error()}</div>
      </Match>
      <Match when={!loading() && !error()}>
        <div class="app">
          <header class="app-header">
            <a href="https://www.nuros.org/" target="_blank" rel="noopener noreferrer">
              <img src="/assets/nuros_logo.svg" alt="NurOS Logo" class="logo" />
            </a>
            <h1>NurOS Search</h1>
            <p>Search and browse NurOS packages</p>
          </header>

          <div class="app-layout">
            <Sidebar
              packages={packages()}
              onFilterChange={(filters: { architectures: string[]; categories: string[]; versions: string[] }) => {
                // Обновляем фильтры
                setFilters(prev => ({
                  ...prev,
                  architecture: filters.architectures.length > 0 ? filters.architectures.join(',') : 'all',
                  packageType: filters.categories.length > 0 ? filters.categories.join(',') : 'all',
                  versions: filters.versions
                }));
              }}
            />

            <main class="app-main">
              <SearchBar
                onSearch={handleSearch}
                onFilterChange={handleFilterChange}
                onViewModeChange={handleViewModeChange}
              />
              <PackageList
                packages={packages()}
                searchTerm={searchTerm()}
                filters={filters()}
                selectedVersions={filters().versions}
                grouped={viewMode() === 'grouped'}
              />
            </main>
          </div>
        </div>
      </Match>
    </Switch>
  );
}

/**
 * @brief Экспорт компонента App
 * @details Экспортирует основной компонент приложения по умолчанию
 */
export default App;
