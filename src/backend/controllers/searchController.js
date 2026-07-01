import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Path to the data directory (root of the project)
const DATA_DIR = join(__dirname, '..', '..', '..', 'data');

/**
 * Load and parse a JSON data file from the data directory.
 * Files are re-read on each request to reflect any changes.
 */
function loadJsonFile(filename) {
  const filePath = join(DATA_DIR, filename);
  const raw = readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}

/**
 * Check if any property value of an object contains the search query.
 * Searches case-insensitive across all string and number values.
 */
function matchesQuery(obj, query) {
  const lowerQuery = query.toLowerCase();

  return Object.values(obj).some((value) => {
    const strValue = String(value).toLowerCase();
    return strValue.includes(lowerQuery);
  });
}

/**
 * Category configuration: maps each data source to its label,
 * filename, and display properties.
 */
const CATEGORIES = [
  {
    key: 'salesOrders',
    label: 'Pedidos de Venda',
    file: 'sales_orders.json',
    idField: 'SalesOrderID',
    nameField: 'MaterialName',
    columns: ['SalesOrderID', 'MaterialName', 'Customer', 'Quantity', 'TotalValue', 'DeliveryDate'],
  },
  {
    key: 'purchaseOrders',
    label: 'Pedidos de Compra',
    file: 'purchase_orders.json',
    idField: 'PurchaseOrderID',
    nameField: 'MaterialName',
    columns: ['PurchaseOrderID', 'MaterialName', 'Supplier', 'Quantity', 'TotalCost', 'DeliveryDate'],
  },
  {
    key: 'materials',
    label: 'Produtos',
    file: 'materials.json',
    idField: 'MaterialID',
    nameField: 'MaterialName',
    columns: ['MaterialID', 'MaterialName'],
  },
  {
    key: 'equipments',
    label: 'Equipamentos',
    file: 'equipments.json',
    idField: 'EquipmentID',
    nameField: 'EquipmentName',
    columns: ['EquipmentID', 'EquipmentName'],
  },
  {
    key: 'workforce',
    label: 'Mão de Obra',
    file: 'workforce.json',
    idField: 'WorkforceID',
    nameField: 'Name',
    columns: ['WorkforceID', 'Name', 'Shift'],
  },
];

/**
 * Main search handler.
 * Reads all data files, searches for the query across all properties,
 * and returns results grouped by category.
 */
export function search(req, res) {
  const query = req.query.q;

  // Validate query parameter
  if (!query || query.trim() === '') {
    return res.status(400).json({
      error: 'O parâmetro de busca "q" é obrigatório.',
      example: '/api/search?q=mesa',
    });
  }

  const trimmedQuery = query.trim();

  try {
    const results = {};
    let totalResults = 0;

    for (const category of CATEGORIES) {
      const data = loadJsonFile(category.file);
      const matched = data.filter((item) => matchesQuery(item, trimmedQuery));

      results[category.key] = {
        label: category.label,
        idField: category.idField,
        nameField: category.nameField,
        columns: category.columns,
        count: matched.length,
        items: matched,
      };

      totalResults += matched.length;
    }

    return res.json({
      query: trimmedQuery,
      totalResults,
      results,
    });
  } catch (error) {
    console.error('Search error:', error.message);
    return res.status(500).json({
      error: 'Erro interno ao realizar a busca.',
      details: error.message,
    });
  }
}
