import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Caminho para o diretório de dados (na raiz do projeto)
const DATA_DIR = join(__dirname, '..', '..', '..', 'data');

/**
 * Carrega e analisa um arquivo JSON do diretório de dados.
 * Os arquivos são lidos a cada requisição para refletir quaisquer mudanças em tempo real.
 */
function loadJsonFile(filename) {
  const filePath = join(DATA_DIR, filename);
  const buffer = readFileSync(filePath);
  
  let text = '';
  try {
    // Tenta decodificar o arquivo como UTF-8 primeiro
    const decoder = new TextDecoder('utf-8', { fatal: true });
    text = decoder.decode(buffer);
  } catch (e) {
    // Fallback para Windows-1252 (Latin-1) se a decodificação UTF-8 falhar
    const decoder = new TextDecoder('windows-1252');
    text = decoder.decode(buffer);
  }
  
  // Normaliza o caractere de interrogação/substituição corrompido para 'é'
  text = text.replace(/\uFFFD/g, 'é');
  
  return JSON.parse(text);
}

/**
 * Remove acentos (diacríticos) de uma string.
 */
function removeAccents(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Verifica se alguma propriedade de um objeto contém o termo buscado.
 * Faz uma busca case-insensitive e insensível a acentos em todas as propriedades.
 */
function matchesQuery(obj, query) {
  const normalizedQuery = removeAccents(query.toLowerCase());

  return Object.values(obj).some((value) => {
    const normalizedValue = removeAccents(String(value).toLowerCase());
    return normalizedValue.includes(normalizedQuery);
  });
}

function getRelevanceScore(item, query, nameField, idField) {
  const lowerQuery = query.toLowerCase();
  const normalizedQuery = removeAccents(lowerQuery);
  let score = 0;

  for (const [key, value] of Object.entries(item)) {
    const rawStrValue = String(value).toLowerCase();
    const strValue = removeAccents(rawStrValue);
    
    if (strValue.includes(normalizedQuery)) {
      let itemScore = 0;
      
      if (key === idField) {
        if (strValue === normalizedQuery) itemScore += 100;
        else if (strValue.startsWith(normalizedQuery)) itemScore += 80;
        else itemScore += 50;
      } else if (key === nameField) {
        if (strValue === normalizedQuery) itemScore += 90;
        else if (strValue.startsWith(normalizedQuery)) itemScore += 70;
        else itemScore += 40;
      } else {
        if (strValue.startsWith(normalizedQuery)) itemScore += 30;
        else itemScore += 10;
      }
      
      // Bônus por correspondência de acentuação exata (sem precisar de normalização de acentos)
      if (rawStrValue.includes(lowerQuery)) {
        itemScore += 20;
      }
      
      score += itemScore;
    }
  }
  return score;
}

/**
 * Configuração das categorias: mapeia cada fonte de dados com seu respectivo rótulo,
 * arquivo correspondente e propriedades de exibição na tela.
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
 * Endpoint principal de busca.
 * Lê todos os arquivos de dados, pesquisa em todas as tabelas e propriedades,
 * e retorna os resultados correspondentes agrupados por categoria.
 */
export function search(req, res) {
  const query = req.query.q;

  // Validação do parâmetro de busca obrigatório
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

      // Ordena por relevância
      matched.sort((a, b) => {
        const scoreA = getRelevanceScore(a, trimmedQuery, category.nameField, category.idField);
        const scoreB = getRelevanceScore(b, trimmedQuery, category.nameField, category.idField);
        return scoreB - scoreA;
      });

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
    console.error('Erro ao realizar busca:', error.message);
    return res.status(500).json({
      error: 'Erro interno ao realizar a busca.',
      details: error.message,
    });
  }
}