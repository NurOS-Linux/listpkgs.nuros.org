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

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      props.onSearch(searchQuery());
    }
  };

  return (
    <div class="search-bar">
      <div class="search-input-container">
        <input
          type="text"
          class="search-input"
          placeholder="Search packages by name or description..."
          value={searchQuery()}
          onInput={e => handleSearchChange(e.currentTarget.value)}
          onKeyUp={handleKeyPress}
        />
        <button class="search-button" onClick={() => props.onSearch(searchQuery())}>
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
