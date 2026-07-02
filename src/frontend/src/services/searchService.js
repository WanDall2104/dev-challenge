/**
 * Serviço para gerenciar requisições de busca para o backend.
 */

/**
 * Busca no banco de dados do ERP de acordo com o termo informado.
 * @param {string} query O termo de busca enviado pelo usuário.
 * @param {object} options Opções adicionais como o `signal` do AbortController.
 * @returns {Promise<object>} Resposta JSON formatada da API.
 */
export async function search(query, options = {}) {
  const { signal } = options;
  
  try {
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
      signal,
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      // Tenta extrair detalhes do erro retornados pelo JSON da API
      let errorMessage = 'Ocorreu um erro ao realizar a busca.';
      try {
        const errorData = await response.json();
        if (errorData && errorData.error) {
          errorMessage = errorData.error;
        }
      } catch {
        // Fallback para o status HTTP genérico caso não seja um JSON válido
        errorMessage = `Erro ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    // Se a requisição foi abortada, propaga o erro para o chamador ignorar
    if (error.name === 'AbortError') {
      throw error;
    }
    
    // Caso contrário, propaga o erro de conexão/busca genérico
    throw new Error(error.message || 'Falha de conexão com o servidor.');
  }
}