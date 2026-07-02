import { useState, useEffect, useRef } from 'react';
import SearchBar from './components/Search/SearchBar';
import SearchResults from './components/Search/SearchResults';
import { search } from './services/searchService';
import './App.css';

function App() {
  const [searchData, setSearchData] = useState(null);
  const [activeQuery, setActiveQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const abortControllerRef = useRef(null);

  // Cleanup pending requests on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  async function handleSearch(query) {
    // Cancel previous request if any
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (!query) {
      setSearchData(null);
      setActiveQuery('');
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setActiveQuery(query);
    setError(null);

    // Create a new AbortController for this request
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const data = await search(query, { signal: controller.signal });
      setSearchData(data);
      setIsLoading(false);
    } catch (err) {
      // Ignore AbortError since it means a newer search request was made
      if (err.name === 'AbortError') {
        return;
      }
      console.error('Search request failed:', err);
      setError(err.message);
      setSearchData(null);
      setIsLoading(false);
    }
  }

  return (
    <main className="app">
      <div className="app__container">
        <header className="app__header">
          <img
            src="/logo_multisearch.png"
            alt="MultiSearch Logo"
            className="app__logo"
          />
          <p className="app__subtitle">
            Busca inteligente para o seu ERP
          </p>
        </header>

        <SearchBar onSearch={handleSearch} isLoading={isLoading} />

        {error && !isLoading && (
          <div className="app__error-state">
            <div className="app__error-icon">⚠️</div>
            <h3 className="app__error-title">Erro na busca</h3>
            <p className="app__error-text">{error}</p>
            <button className="app__retry-button" onClick={() => handleSearch(activeQuery)}>
              Tentar novamente
            </button>
          </div>
        )}

        {!searchData && !isLoading && !error && (
          <div className="app__empty-state">
            <div className="app__empty-icon">🔍</div>
            <p className="app__empty-text">
              Digite algo para buscar em pedidos, produtos, equipamentos e mão de obra
            </p>
            <p className="app__empty-hint">
              Experimente buscar por <button className="app__suggestion" onClick={() => handleSearch('Mesa Ret')}>Mesa Ret</button> ou <button className="app__suggestion" onClick={() => handleSearch('Turno A')}>Turno A</button>
            </p>
          </div>
        )}

        {searchData && !error && (
          <SearchResults data={searchData} query={activeQuery} />
        )}
      </div>
    </main>
  );
}

export default App;

