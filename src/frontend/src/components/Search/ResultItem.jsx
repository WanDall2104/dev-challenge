import './ResultItem.css';

/**
 * Column label mapping for display
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
 * Format a value for display (add # prefix to IDs, format currency, etc.)
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
   * Highlight matching text in a string
   */
  function highlightText(text) {
    if (!query || query.length < 2) return text;

    const strText = String(text);
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = strText.split(regex);

    if (parts.length === 1) return text;

    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="result-item__highlight">{part}</mark>
      ) : (
        part
      )
    );
  }

  const idValue = item[idField];

  return (
    <div className="result-item">
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
