import './ResultItem.css';

/**
 * Mapeamento de rótulos de colunas para exibição amigável
 */
const COLUMN_LABELS = {
  SalesOrderID: 'Pedido',
  PurchaseOrderID: 'Pedido',
  MaterialID: 'Código',
  MaterialName: 'Material',
  EquipmentID: 'Código',
  EquipmentName: 'Equipamento',
  WorkforceID: 'ID',
  Name: 'Nome',
  Customer: 'Cliente',
  Supplier: 'Fornecedor',
  Quantity: 'Qtd',
  TotalValue: 'Valor Total',
  TotalCost: 'Custo Total',
  DeliveryDate: 'Entrega',
  Shift: 'Turno',
};

/**
 * Formata um valor para exibição (adiciona prefixo # para IDs, formata moedas, etc.)
 */
function formatValue(key, value) {
  if (key.endsWith('ID') || key.endsWith('Id')) {
    return `#${value}`;
  }
  if (key === 'TotalValue' || key === 'TotalCost') {
    return `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  }
  if (key === 'Quantity') {
    return `${value} pç`;
  }
  return String(value);
}

function ResultItem({ item, columns, idField, query }) {
  /**
   * Destaca o texto correspondente ao termo de busca na string, ignorando acentos
   */
  function highlightText(text) {
    if (!query || query.length < 1) return text;

    const strText = String(text);
    const removeAccents = (str) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    
    const normalizedText = removeAccents(strText).toLowerCase();
    const normalizedQuery = removeAccents(query).toLowerCase();

    if (!normalizedQuery || !normalizedText.includes(normalizedQuery)) {
      return text;
    }

    const parts = [];
    let currentIndex = 0;

    while (true) {
      const matchIndex = normalizedText.indexOf(normalizedQuery, currentIndex);
      if (matchIndex === -1) {
        parts.push(strText.substring(currentIndex));
        break;
      }

      if (matchIndex > currentIndex) {
        parts.push(strText.substring(currentIndex, matchIndex));
      }

      const matchLength = normalizedQuery.length;
      const originalMatch = strText.substring(matchIndex, matchIndex + matchLength);
      parts.push(
        <mark key={matchIndex} className="result-item__highlight">{originalMatch}</mark>
      );
      currentIndex = matchIndex + matchLength;
    }

    return parts;
  }

  const idValue = item[idField];

  return (
    <div className="result-item" tabIndex={0}>
      <span className="result-item__id">{formatValue(idField, idValue)}</span>
      <div className="result-item__fields">
        {columns
          .filter((col) => col !== idField)
          .map((col) => (
            <span key={col} className="result-item__field">
              <span className="result-item__label">{COLUMN_LABELS[col] || col}</span>
              <span className="result-item__value">{highlightText(formatValue(col, item[col]))}</span>
            </span>
          ))}
      </div>
    </div>
  );
}

export default ResultItem;