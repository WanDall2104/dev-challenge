import { useState, useEffect, useRef } from 'react';
import './SearchBar.css';

function SearchBar({ onSearch, isLoading }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  // Focus input on Ctrl+K
  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setQuery('');
        onSearch('');
        inputRef.current?.blur();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSearch]);

  // Debounced search
  function handleChange(e) {
    const value = e.target.value;
    setQuery(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      onSearch(value.trim());
    }, 300);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    onSearch(query.trim());
  }

  function handleClear() {
    setQuery('');
    onSearch('');
    inputRef.current?.focus();
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit} role="search">
      <div className="search-bar__wrapper">
        <svg
          className={`search-bar__icon ${isLoading ? 'search-bar__icon--loading' : ''}`}
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {isLoading ? (
            <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="32">
              <animate attributeName="stroke-dashoffset" values="32;0" dur="1s" repeatCount="indefinite" />
            </circle>
          ) : (
            <>
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </>
          )}
        </svg>

        <input
          ref={inputRef}
          id="search-input"
          type="text"
          className="search-bar__input"
          placeholder="Buscar em pedidos, produtos, equipamentos..."
          value={query}
          onChange={handleChange}
          autoComplete="off"
          aria-label="Campo de busca MultiSearch"
        />

        {query && (
          <button
            type="button"
            className="search-bar__clear"
            onClick={handleClear}
            aria-label="Limpar busca"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}

        <span className="search-bar__shortcut" aria-hidden="true">Ctrl+K</span>
      </div>
    </form>
  );
}

export default SearchBar;