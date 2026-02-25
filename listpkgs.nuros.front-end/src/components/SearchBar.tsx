import { createSignal } from 'solid-js';

interface Filters {
  architecture: string;
  channel: string;
  packageType: string;
  source: string;
}

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: Filters) => void;
}

const SearchBar = (props: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = createSignal('');

  // Фильтры
  const [architecture, setArchitecture] = createSignal('all');
  const [channel, setChannel] = createSignal('all');
  const [packageType, setPackageType] = createSignal('all');
  const [source, setSource] = createSignal('all');

  // Real-time поиск и фильтрация
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    triggerSearch(value);
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      triggerSearch(searchQuery());
    }
  };

  const triggerSearch = (query: string) => {
    props.onSearch(query);
  };

  const handleFiltersChange = () => {
    props.onFilterChange({
      architecture: architecture(),
      channel: channel(),
      packageType: packageType(),
      source: source(),
    });
  };

  return (
    <div class="search-bar">
      <div class="search-input-container">
        <input
          type="text"
          class="search-input"
          placeholder="Search packages..."
          value={searchQuery()}
          onInput={e => handleSearchChange(e.currentTarget.value)}
          onKeyUp={handleKeyPress}
        />
        <button class="search-button" onClick={() => triggerSearch(searchQuery())}>
          Search
        </button>
      </div>

      <div class="filters-container">
        <div class="filters">
          <select
            class="filter-select"
            value={packageType()}
            onChange={e => {
              setPackageType(e.target.value);
              handleFiltersChange();
            }}
          >
            <option value="all">All Types</option>
            <option value="package">Package</option>
            <option value="option">Option</option>
          </select>

          <select
            class="filter-select"
            value={source()}
            onChange={e => {
              setSource(e.target.value);
              handleFiltersChange();
            }}
          >
            <option value="all">All Sources</option>
            <option value="NurOS-Packages">NurOS-Packages</option>
            <option value="NixOS">NixOS</option>
            <option value="custom">Custom Repository</option>
          </select>

          <select
            class="filter-select"
            value={channel()}
            onChange={e => {
              setChannel(e.target.value);
              handleFiltersChange();
            }}
          >
            <option value="all">All Repositories</option>
            <option value="NurOS-Packages">NurOS-Packages</option>
          </select>

          <select
            class="filter-select"
            value={architecture()}
            onChange={e => {
              setArchitecture(e.target.value);
              handleFiltersChange();
            }}
          >
            <option value="all">All Architectures</option>
            <option value="x86_64-linux">x86_64-linux</option>
            <option value="aarch64-linux">aarch64-linux</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
