import ResultGroup from './ResultGroup';
import './SearchResults.css';

const CATEGORY_ORDER = ['salesOrders', 'purchaseOrders', 'materials', 'equipments', 'workforce'];

function SearchResults({ data, query }) {
  if (!data) return null;

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
        {CATEGORY_ORDER.map((key, index) => (
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
