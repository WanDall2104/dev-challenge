# MultiSearch - Guia de Execução do Projeto

Este diretório contém o código-fonte da aplicação **MultiSearch** dividida em duas partes principais: **Backend** (API REST em Express) e **Frontend** (Interface do Usuário em React + Vite).

---

## Pré-requisitos

Para rodar este projeto em outro computador, você precisará ter instalado:
- **Node.js** (versão 18 ou superior recomendada)
- **NPM** (gerenciador de pacotes, já vem instalado com o Node.js)

---

## Como Executar o Projeto

Você precisará rodar o **Backend** e o **Frontend** em paralelo. Siga os passos abaixo:

### Passo 1: Executando o Backend (Porta 3001)

O backend é responsável por ler os arquivos JSON locais da pasta `data` na raiz do projeto e fornecer a API de busca inteligente.

1. Abra um terminal e navegue até a pasta do backend:
   ```bash
   cd src/backend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor em modo de desenvolvimento:
   ```bash
   npm run dev
   ```
   *O backend estará rodando em [http://localhost:3001](http://localhost:3001).*
   *Você pode testar a API acessando a URL de busca: [http://localhost:3001/api/search?q=mesa](http://localhost:3001/api/search?q=mesa).*

---

### Passo 2: Executando o Frontend (Porta 5173)

O frontend é a interface da aplicação que realiza as requisições para a API e exibe os resultados agrupados de maneira moderna e responsiva.

1. Abra um **segundo terminal** (sem fechar o primeiro) e navegue até a pasta do frontend:
   ```bash
   cd src/frontend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento do Vite:
   ```bash
   npm run dev
   ```
   *O frontend estará rodando em [http://localhost:5173](http://localhost:5173).*
   *Abra essa URL no seu navegador para utilizar o buscador.*

---

## Como Funciona a Integração

- **Vite Proxy**: O frontend foi configurado para redirecionar automaticamente qualquer requisição para caminhos iniciados com `/api` para `http://localhost:3001/api`. Isso evita problemas de CORS e permite um desenvolvimento integrado simplificado.
- **Normalização Automática**: O backend detecta dinamicamente a codificação dos arquivos do banco de dados (UTF-8 ou Windows-1252/Latin-1) ao ler os dados de exemplo, corrigindo acentuações corrompidas antes de enviar a resposta à tela.
- **Cancelamento de Busca**: O frontend utiliza `AbortController` para interromper chamadas de busca antigas caso o usuário continue digitando ativamente, economizando largura de banda e evitando conflitos visuais.
