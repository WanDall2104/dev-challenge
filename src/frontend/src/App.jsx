import './App.css'

function App() {
  return (
    <main className="app">
      <div className="app__container">
        <header className="app__header">
          <img
            src="/logo_multisearch.png"
            alt="MultiSearch Logo"
            className="app__logo"
          />
          <h1 className="app__title">MultiSearch</h1>
          <p className="app__subtitle">
            Busca inteligente para o seu ERP
          </p>
        </header>

        <div className="app__search-placeholder">
          <p className="app__coming-soon">🔍 Interface de busca em construção...</p>
        </div>
      </div>
    </main>
  )
}

export default App
