# Backend - Portal da Transparência

Backend em **Go + Fiber + SQLite** com paginação completa da API da Câmara.

## 🚀 Como Rodar

### 1. Instalar dependências:
```bash
cd backend
go mod download
```

### 2. Rodar o servidor:
```bash
go run main.go
```

Servidor roda em: `http://localhost:8080`

### 3. Sincronizar dados (PRIMEIRA VEZ):
```bash
curl -X POST http://localhost:8080/api/sync
```

⏳ **Isso vai demorar 5-10 minutos** (busca TODOS os deputados e gastos de 2024/2025 com paginação)

## 📡 Endpoints

### `GET /api/deputados`
Lista todos os deputados (do banco local, RÁPIDO!)

### `GET /api/deputados/:id/gastos?ano=2024`
Gastos de um deputado em um ano

### `GET /api/ranking?ano=2024&limite=20`
Ranking TOP N gastadores de um ano

### `GET /api/estatisticas`
Estatísticas gerais (total deputados, total gastos)

### `POST /api/sync`
Sincroniza dados da API Câmara (rodar manualmente quando quiser atualizar)

## 💾 Banco de Dados

- **SQLite** (`transparencia.db`)
- Armazena deputados e despesas localmente
- Muito rápido (milissegundos)
- Não precisa de servidor separado

## 🔄 Paginação

O backend faz **paginação automática**:
- Busca 100 itens por vez da API
- Continua buscando até acabar
- Salva tudo no SQLite
- Frontend consulta do SQLite (instantâneo!)

## ⚡ Vantagens

- ✅ MUITO mais rápido que chamar API direta
- ✅ Sem limite de dados (armazena tudo)
- ✅ Funciona offline depois de sincronizar
- ✅ Reduz carga na API da Câmara
