import { createSignal } from 'solid-js';

interface Filters {
  architecture: string;
  channel: string; // repository name
  packageType: string;
}

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: Filters) => void;
  onViewModeChange?: (mode: 'list' | 'grouped') => void;
}

const SearchBar = (props: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = createSignal('');
  const [viewMode, setViewMode] = createSignal<'list' | 'grouped'>('list');

  // Фильтры
  const [architecture, setArchitecture] = createSignal('all');
  const [channel, setChannel] = createSignal('all');
  const [packageType, setPackageType] = createSignal('all');

  const handleSearch = () => {
    props.onSearch(searchQuery());
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleFiltersChange = () => {
    props.onFilterChange({
      architecture: architecture(),
      channel: channel(),
      packageType: packageType(),
    });
  };

  const handleViewModeChange = (mode: 'list' | 'grouped') => {
    setViewMode(mode);
    props.onViewModeChange?.(mode);
  };

  return (
    <div class="search-bar">
      <div class="search-input-container">
        <input
          type="text"
          class="search-input"
          placeholder="Search packages..."
          value={searchQuery()}
          onInput={e => setSearchQuery(e.currentTarget.value)}
          onKeyUp={handleKeyPress}
        />
        <button class="search-button" onClick={handleSearch}>
          Search
        </button>
      </div>

      <div class="controls">
        <div class="filters">
          <select
            class="filter-select"
            value={packageType()}
            onChange={e => setPackageType(e.target.value)}
            onBlur={handleFiltersChange}
          >
            <option value="all">All Types</option>
            <option value="package">Package</option>
            <option value="option">Option</option>
          </select>

          <select
            class="filter-select"
            value={channel()}
            onChange={e => setChannel(e.target.value)}
            onBlur={handleFiltersChange}
          >
            <option value="all">All Repositories</option>
            <option value="NurOS-Packages">NurOS-Packages</option>
          </select>

          <select
            class="filter-select"
            value={architecture()}
            onChange={e => setArchitecture(e.target.value)}
            onBlur={handleFiltersChange}
          >
            <option value="all">All Architectures</option>
            <option value="x86_64-linux">x86_64-linux</option>
            <option value="aarch64-linux">aarch64-linux</option>
          </select>
        </div>

        <div class="view-mode-selector">
          <button
            class={`view-mode-btn ${viewMode() === 'list' ? 'active' : ''}`}
            onClick={() => handleViewModeChange('list')}
          >
            List View
          </button>
          <button
            class={`view-mode-btn ${viewMode() === 'grouped' ? 'active' : ''}`}
            onClick={() => handleViewModeChange('grouped')}
          >
            Grouped View
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
