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
 * @property {string} source - Источник пакета (репозиторий)
 * @property {string[]} versions - Версии пакетов
 */
interface Filters {
  architecture: string;
  channel: string;
  packageType: string;
  source: string;
  maintainers: string[];
  licenses: string[];
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
    source: 'all',
    maintainers: [],
    licenses: [],
  });
  const [viewMode, setViewMode] = createSignal<'list' | 'grouped'>('list');
  const [dots, setDots] = createSignal('.');
  const [isDarkTheme, setIsDarkTheme] = createSignal(false);

  /**
   * @brief Эффект для инициализации темы из localStorage
   * @details Загружает сохраненное значение темы при загрузке компонента
   */
  createEffect(() => {
    const savedTheme = localStorage.getItem('nuros-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = savedTheme ? savedTheme === 'dark' : prefersDark;
    setIsDarkTheme(isDark);
    applyTheme(isDark);
  });

  /**
   * @brief Применение темы к DOM
   * @param {boolean} isDark - Использовать темную тему
   * @returns void
   */
  const applyTheme = (isDark: boolean) => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark-theme');
    } else {
      root.classList.remove('dark-theme');
    }
    localStorage.setItem('nuros-theme', isDark ? 'dark' : 'light');
  };

  /**
   * @brief Переключение темы
   * @returns void
   */
  const toggleTheme = () => {
    const newTheme = !isDarkTheme();
    setIsDarkTheme(newTheme);
    applyTheme(newTheme);
  };

  /**
   * @brief Эффект для анимации точек на экране загрузки
   * @details Обновляет состояние точек каждые 500мс, когда приложение находится в состоянии загрузки
   */
  createEffect(() => {
    if (loading()) {
      const interval = setInterval(() => {
        setDots(prev => (prev.length >= 3 ? '.' : prev + '.'));
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
  /**
   * @brief Обработчик переключения режима отображения
   * @param mode Режим отображения ('list' или 'grouped')
   * @returns void
   */
  const handleViewModeChange = (mode: 'list' | 'grouped') => {
    setViewMode(mode);
  };

  return (
    <>
      <Switch>
        <Match when={loading()}>
          <div class="loading-screen">
            <img src="./plymoth_adeki_logo.gif" alt="NurOS Logo" class="loading-logo" />
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
                <img src="./plymoth_adeki_logo.gif" alt="NurOS Logo" class="logo" />
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
                onFilterChange={filters => {
                  console.log('Sidebar filter change:', filters);
                  // Обновляем фильтры
                  setFilters(prev => ({
                    ...prev,
                    architecture:
                      filters.architectures.length > 0 ? filters.architectures.join(',') : 'all',
                    packageType:
                      filters.categories.length > 0 ? filters.categories.join(',') : 'all',
                    maintainers: filters.maintainers,
                    licenses: filters.licenses,
                  }));
                  console.log('Updated filters:', filters);
                }}
              />

              <main class="app-main">
                <SearchBar
                  onSearch={handleSearch}
                  onFilterChange={newFilters => {
                    console.log('SearchBar filter change:', newFilters);
                    setFilters(prev => ({
                      ...prev,
                      channel: newFilters.channel || prev.channel,
                      architecture: newFilters.architecture || prev.architecture,
                      packageType: newFilters.packageType || prev.packageType,
                      source: newFilters.source || prev.source,
                    }));
                    console.log('Updated filters:', newFilters);
                  }}
                />

                {/* View Mode Selector */}
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

      {/* Кнопка переключения темы */}
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

/**
 * @brief Экспорт компонента App
 * @details Экспортирует основной компонент приложения по умолчанию
 */ export default App;
