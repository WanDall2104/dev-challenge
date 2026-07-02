import ResultGroup from './ResultGroup';
import './SearchResults.css';

const CATEGORY_ORDER = ['salesOrders', 'purchaseOrders', 'materials', 'equipments', 'workforce'];

function SearchResults({ data, query }) {
  if (!data) return null;

  // Ordena as chaves de categorias de forma que aquelas que contêm resultados (count > 0) apareçam primeiro
  const sortedCategories = [...CATEGORY_ORDER].sort((a, b) => {
    const countA = data.results[a]?.count || 0;
    const countB = data.results[b]?.count || 0;
    
    if (countA > 0 && countB === 0) return -1;
    if (countA === 0 && countB > 0) return 1;
    
    return CATEGORY_ORDER.indexOf(a) - CATEGORY_ORDER.indexOf(b);
  });

  return (
    <section className="search-results" aria-label="Resultados da busca">
      <div className="search-results__summary">
        <p className="search-results__count">
          {data.totalResults === 0 ? (
            'Nenhum resultado encontrado'
          ) : (
            <>
              Foram encontrados <strong>{data.totalResults}</strong>{' '}
              {data.totalResults === 1 ? 'resultado' : 'resultados'}:
            </>
          )}
        </p>
      </div>

      <div className="search-results__groups">
        {sortedCategories.map((key, index) => (
          <ResultGroup
            key={key}
            categoryKey={key}
            data={data.results[key]}
            query={query}
            animationDelay={index * 80}
          />
        ))}
      </div>
    </section>
  );
}

export default SearchResults;