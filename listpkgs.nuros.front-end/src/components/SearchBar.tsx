import { createSignal } from 'solid-js';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar = (props: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = createSignal('');

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    props.onSearch(value);
  };

  const handleClear = () => {
    setSearchQuery('');
    props.onSearch('');
  };

  return (
    <div class="search-bar">
      <div class="search-input-container">
        <input
          type="text"
          class="search-input"
          placeholder="Search packages by name, description, or key..."
          value={searchQuery()}
          onInput={e => handleSearchChange(e.currentTarget.value)}
        />
        {searchQuery() && (
          <button class="search-clear-btn" onClick={handleClear} type="button">
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
