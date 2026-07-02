/**
 * Service to handle search queries to the backend.
 */

/**
 * Searches the ERP database for the given query.
 * @param {string} query The search query string.
 * @param {object} options Additional options such as fetch `signal`.
 * @returns {Promise<object>} The JSON response from the API.
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
      // Try to parse error details from JSON response
      let errorMessage = 'Ocorreu um erro ao realizar a busca.';
      try {
        const errorData = await response.json();
        if (errorData && errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (e) {
        // Fallback to generic HTTP status text
        errorMessage = `Erro ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    // If the request was aborted, propagate the abort error so we can ignore it in the caller
    if (error.name === 'AbortError') {
      throw error;
    }
    
    // Otherwise, throw a general search error
    throw new Error(error.message || 'Falha de conexão com o servidor.');
  }
}
