import { useState } from 'react';
import ResultItem from './ResultItem';
import './ResultGroup.css';

/**
 * SVG icons for each category
 */
const CATEGORY_ICONS = {
  salesOrders: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  ),
  purchaseOrders: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
    </svg>
  ),
  materials: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  ),
  equipments: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  ),
  workforce: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  ),
};

function ResultGroup({ categoryKey, data, query, animationDelay }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const icon = CATEGORY_ICONS[categoryKey];
  const hasResults = data.count > 0;

  return (
    <div
      className={`result-group result-group--${categoryKey}`}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <button
        className="result-group__header"
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-expanded={!isCollapsed}
        aria-controls={`group-${categoryKey}`}
      >
        <div className="result-group__header-left">
          <span className={`result-group__icon result-group__icon--${categoryKey}`}>
            {icon}
          </span>
          <h2 className="result-group__title">{data.label}</h2>
        </div>
        <div className="result-group__header-right">
          <span className={`result-group__count ${!hasResults ? 'result-group__count--empty' : ''}`}>
            {hasResults
              ? `${data.count} ${data.count === 1 ? 'item encontrado' : 'itens encontrados'}`
              : 'nenhum item encontrado'}
          </span>
          <svg
            className={`result-group__chevron ${isCollapsed ? 'result-group__chevron--collapsed' : ''}`}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>

      {!isCollapsed && (
        <div className="result-group__body" id={`group-${categoryKey}`}>
          {hasResults ? (
            data.items.map((item, index) => (
              <ResultItem
                key={`${item[data.idField]}-${index}`}
                item={item}
                columns={data.columns}
                idField={data.idField}
                query={query}
              />
            ))
          ) : (
            <p className="result-group__empty">nenhum item encontrado</p>
          )}
        </div>
      )}
    </div>
  );
}

export default ResultGroup;
