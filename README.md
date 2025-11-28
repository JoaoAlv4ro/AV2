# AEROCODE - Frontend

Aplicação React + Vite + TypeScript.

## Requisitos

- Node.js
- Navegador moderno

## Setup

1. Instalar dependências:
	```bash
	npm install
	```
2. Rodar ambiente de desenvolvimento:
	```bash
	npm run dev
	```
3. Acessar no navegador (porta padrão Vite):
	```
	http://localhost:5173
	```

## Scripts

```bash
npm run dev      # modo desenvolvimento
npm run build    # build de produção (gera dist/)
```

## Estrutura Resumida

- `src/pages/*` – páginas principais (Dashboards, Login, Gerência).
- `src/components/*` – layouts e componentes UI (Navbar, Sidebar, botões).
- `src/contexts/*` – contextos de autenticação, sidebar e dados (Aeronave, Funcionário).
- `src/services/mockApi.ts` – mock local para dados.

## Variáveis de Ambiente

No momento não há uso explícito de variáveis `.env` no frontend. Se futuramente consumir API real, adicionar por exemplo:
```
VITE_API_BASE_URL=http://localhost:3000
```
e acessar via `import.meta.env.VITE_API_BASE_URL`.

## Build Produção

```bash
npm run build
npm run preview
```

Deploy estático: publicar o conteúdo de `dist/` em serviço de hosting.

## Licença

Uso educacional / acadêmico.