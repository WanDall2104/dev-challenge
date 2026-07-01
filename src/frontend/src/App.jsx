import { useState } from 'react';
import SearchBar from './components/Search/SearchBar';
import SearchResults from './components/Search/SearchResults';
import mockData from './data/data.json';
import './App.css';

function App() {
  const [searchData, setSearchData] = useState(null);
  const [activeQuery, setActiveQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function handleSearch(query) {
    if (!query) {
      setSearchData(null);
      setActiveQuery('');
      return;
    }

    setIsLoading(true);
    setActiveQuery(query);

    // Simulate API delay, will be replaced by real API call in Commit 4
    setTimeout(() => {
      setSearchData(mockData);
      setIsLoading(false);
    }, 400);
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

        {!searchData && !isLoading && (
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

        {searchData && (
          <SearchResults data={searchData} query={activeQuery} />
        )}
      </div>
    </main>
  );
}

export default App;
