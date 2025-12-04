```markdown
# PROJETO: PLATAFORMA DE TRANSPARÊNCIA POLÍTICA

## 1. VISÃO GERAL DO PROJETO

### 1.1 Descrição
Plataforma web para fiscalização de gastos públicos e transparência política no Brasil. O sistema permite que cidadãos acessem, visualizem e analisem dados oficiais de gastos de deputados federais, emendas parlamentares, uso de cartões corporativos, patrimônio de políticos e rankings de gastos.

### 1.2 Objetivos
- Democratizar o acesso a dados públicos de forma simples e visual
- Permitir fiscalização cidadã de gastos políticos
- Apresentar informações complexas de forma acessível
- Criar rankings e comparações para facilitar análise
- Promover transparência e accountability política

### 1.3 Público-Alvo
- Cidadãos brasileiros interessados em política
- Jornalistas investigativos
- Pesquisadores e acadêmicos
- ONGs de transparência
- Eleitores em geral

---

## 2. ARQUITETURA TÉCNICA

### 2.1 Stack Tecnológica

#### Backend:
- **Linguagem**: Go (Golang) 1.21+
- **Framework HTTP**: Fiber v2
- **Banco de Dados**: PostgreSQL 15+ (para cache e dados processados)
- **Cache**: Redis 7+ (para otimização de requisições)
- **Validação**: go-playground/validator
- **HTTP Client**: net/http nativo

#### Frontend:
- **Framework**: React 18+
- **Linguagem**: JavaScript (ES6+) ou TypeScript
- **Build Tool**: Vite
- **Roteamento**: React Router v6
- **HTTP Client**: Axios
- **Gráficos**: Recharts ou Victory
- **Tabelas**: TanStack Table (React Table v8)
- **UI/Estilo**: Tailwind CSS 3+
- **Ícones**: Heroicons ou Lucide React
- **Animações**: Framer Motion

#### DevOps:
- **Containerização**: Docker + Docker Compose
- **Deploy Backend**: Railway, Fly.io ou Render
- **Deploy Frontend**: Vercel ou Netlify
- **CI/CD**: GitHub Actions

### 2.2 Estrutura de Diretórios

```
projeto-transparencia/
├── backend/
│   ├── cmd/
│   │   └── api/
│   │       └── main.go
│   ├── internal/
│   │   ├── handlers/
│   │   │   ├── deputados.go
│   │   │   ├── emendas.go
│   │   │   ├── cartoes.go
│   │   │   ├── patrimonio.go
│   │   │   ├── ranking.go
│   │   │   └── busca.go
│   │   ├── services/
│   │   │   ├── camara_service.go
│   │   │   ├── transparencia_service.go
│   │   │   ├── tse_service.go
│   │   │   └── cache_service.go
│   │   ├── models/
│   │   │   ├── deputado.go
│   │   │   ├── emenda.go
│   │   │   ├── cartao.go
│   │   │   └── patrimonio.go
│   │   ├── database/
│   │   │   ├── postgres.go
│   │   │   └── redis.go
│   │   ├── config/
│   │   │   └── config.go
│   │   └── utils/
│   │       ├── http_client.go
│   │       └── helpers.go
│   ├── migrations/
│   ├── go.mod
│   ├── go.sum
│   ├── .env.example
│   └── Dockerfile
│
├── frontend/
│   ├── public/
│   │   ├── logo.svg
│   │   └── favicon.ico
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── LoadingSpinner.jsx
│   │   │   │   ├── SplashScreen.jsx
│   │   │   │   └── SearchBar.jsx
│   │   │   ├── cards/
│   │   │   │   ├── NavigationCard.jsx
│   │   │   │   └── StatCard.jsx
│   │   │   ├── tables/
│   │   │   │   ├── DeputadosTable.jsx
│   │   │   │   └── GastosTable.jsx
│   │   │   └── charts/
│   │   │       ├── RankingChart.jsx
│   │   │       └── PatrimonioChart.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Deputados.jsx
│   │   │   ├── Ranking.jsx
│   │   │   ├── Emendas.jsx
│   │   │   ├── Cartoes.jsx
│   │   │   ├── Patrimonio.jsx
│   │   │   └── BuscaAvancada.jsx
│   │   ├── hooks/
│   │   │   ├── useDeputados.js
│   │   │   ├── useRanking.js
│   │   │   └── useApi.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── utils/
│   │   │   ├── formatters.js
│   │   │   └── constants.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── Dockerfile
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## 3. FONTES DE DADOS (APIs EXTERNAS)

### 3.1 API Câmara dos Deputados
**Base URL**: `https://dadosabertos.camara.leg.br/api/v2`

**Autenticação**: Não requer (pública)

**Endpoints Principais**:

1. **Listar Deputados**
   - Endpoint: `GET /deputados`
   - Parâmetros: `ordem`, `ordenarPor`, `itens` (max 100)
   - Retorna: Lista com ID, nome, partido, UF, foto, email

2. **Gastos de Deputado**
   - Endpoint: `GET /deputados/{id}/despesas`
   - Parâmetros: `ano`, `mes`, `itens`, `ordem`, `ordenarPor`
   - Retorna: Lista de despesas com tipo, data, valor, fornecedor

3. **Detalhes de Deputado**
   - Endpoint: `GET /deputados/{id}`
   - Retorna: Dados completos incluindo gabinete, biografia, redes sociais

**Estrutura de Resposta**:
```json
{
  "dados": [
    {
      "id": 204554,
      "nome": "Nome Completo",
      "siglaPartido": "PT",
      "siglaUf": "SP",
      "urlFoto": "https://...",
      "email": "email@camara.leg.br"
    }
  ],
  "links": [...],
  "total": 513
}
```

**Rate Limiting**: Sem limite oficial, mas recomenda-se máximo 100 req/min

### 3.2 API Portal da Transparência
**Base URL**: `https://api.portaldatransparencia.gov.br/api-de-dados`

**Autenticação**: Requer chave de API no header
```
chave-api-dados: SUA_CHAVE_AQUI
```

**Como obter chave**:
1. Acessar: https://portaldatransparencia.gov.br/api-de-dados/cadastrar-email
2. Cadastrar email
3. Receber chave por email

**Endpoints Principais**:

1. **Emendas Parlamentares**
   - Endpoint: `GET /emendas`
   - Parâmetros: `ano`, `autor`, `codigoMunicipio`, `pagina`
   - Retorna: Número, autor, partido, município, valores

2. **Cartões Corporativos (CPGF)**
   - Endpoint: `GET /cartoes`
   - Parâmetros: `mesExtratoInicio` (MM/AAAA), `mesExtratoFim`, `cpf`, `pagina`
   - Retorna: Portador, data, valor, estabelecimento, órgão

**Estrutura de Resposta Emendas**:
```json
[
  {
    "numero": "12340001",
    "ano": 2024,
    "autor": "NOME DO PARLAMENTAR",
    "tipoAutor": "Deputado",
    "partido": "PT",
    "uf": "SP",
    "municipioFavorecido": "São Paulo",
    "valorEmpenhado": 500000.00,
    "valorPago": 450000.00
  }
]
```

**Rate Limiting**: ~100 requisições/hora por chave

### 3.3 API TSE (Dados Eleitorais)
**Base URL**: `https://divulgacandcontas.tse.jus.br/divulga/rest/v1`

**Autenticação**: Não requer (pública)

**Endpoints Principais**:

1. **Candidatos por Eleição**
   - Endpoint: `GET /candidatura/listar/{ano}/{tipo_eleicao}/{uf}/{cargo}`
   - Parâmetros:
     - ano: 2022, 2020, 2018, etc
     - tipo_eleicao: 2 (federal), 1 (municipal)
     - uf: Sigla ou "BR"
     - cargo: 6 (dep. federal), 5 (senador), 1 (presidente)

2. **Bens de Candidato**
   - Endpoint: `GET /candidatura/buscar/{ano}/{tipo}/{uf}/{cargo}/{sqCandidato}/bens`
   - Retorna: Lista de bens declarados com tipo, descrição, valor

**IMPORTANTE**: API do TSE é complexa. Alternativa recomendada:
- Baixar CSVs prontos: `https://cdn.tse.jus.br/estatistica/sead/odsele/bem_candidato/bem_candidato_2022.zip`
- Importar para banco PostgreSQL
- Criar endpoints próprios consultando banco

**Estrutura CSV Bens**:
```csv
ANO_ELEICAO,SQ_CANDIDATO,NM_CANDIDATO,CPF_CANDIDATO,DS_BEM,VR_BEM_CANDIDATO
2022,100000,João Silva,12345678900,Apartamento,800000.00
```

### 3.4 Códigos de Órgãos (Portal Transparência)
```go
const (
    PRESIDENCIA         = "20000"
    MINISTERIO_FAZENDA = "36000"
    MINISTERIO_JUSTICA = "30000"
    MINISTERIO_SAUDE   = "36000"
    MINISTERIO_EDUCACAO = "26000"
    MINISTERIO_DEFESA  = "52000"
    CGU                = "18000"
)
```

---

## 4. ENDPOINTS DO BACKEND (API PRÓPRIA)

### 4.1 Deputados

**GET /api/deputados**
- Descrição: Lista todos os deputados federais atuais
- Query params: `ordenarPor` (nome|partido|uf), `ordem` (asc|desc)
- Response: Array de deputados

**GET /api/deputados/:id**
- Descrição: Detalhes de um deputado específico
- Response: Objeto com dados completos

**GET /api/deputados/:id/gastos**
- Descrição: Lista gastos de um deputado
- Query params: `ano` (2024), `mes` (1-12), `limite` (padrão 100)
- Response: Array de despesas + total gasto

### 4.2 Ranking

**GET /api/ranking/gastos**
- Descrição: Top deputados que mais gastam
- Query params: `ano` (2024), `limite` (padrão 20)
- Response: Array ordenado por total gasto
- Estrutura:
```json
[
  {
    "id": 204554,
    "nome": "Nome Deputado",
    "partido": "PT",
    "uf": "SP",
    "foto": "url",
    "totalGasto": 150000.50,
    "posicao": 1
  }
]
```

**GET /api/ranking/emendas**
- Descrição: Top parlamentares por valor de emendas
- Query params: `ano`, `limite`
- Response: Similar ao ranking de gastos

**GET /api/ranking/cartoes**
- Descrição: Top pessoas que mais usam cartão corporativo
- Query params: `ano`, `limite`
- Response: Array com CPF, nome, órgão, total

### 4.3 Emendas

**GET /api/emendas**
- Descrição: Lista emendas parlamentares
- Query params: `ano`, `autor`, `municipio`, `pagina`, `limite`
- Response: Array de emendas paginado

**GET /api/emendas/mapa**
- Descrição: Dados agregados por estado/município para visualização em mapa
- Query params: `ano`
- Response: 
```json
{
  "estados": {
    "SP": {"total": 5000000.00, "quantidade": 150},
    "RJ": {"total": 3000000.00, "quantidade": 100}
  },
  "municipios": [...]
}
```

### 4.4 Cartões Corporativos

**GET /api/cartoes**
- Descrição: Lista gastos com cartão corporativo
- Query params: `mesInicio` (MM/AAAA), `mesFim`, `cpf`, `pagina`, `limite`
- Response: Array de transações

**GET /api/cartoes/suspeitos**
- Descrição: Gastos acima da média ou em estabelecimentos incomuns
- Query params: `ano`, `limite`
- Response: Array de gastos flagados como suspeitos
- Critérios: Valor > R$ 5.000 em única transação, estabelecimentos tipo bar/boate, finais de semana

### 4.5 Patrimônio

**GET /api/patrimonio/:cpf**
- Descrição: Bens declarados de um candidato
- Query params: `ano` (2022, 2018, etc)
- Response: Total e lista de bens

**GET /api/patrimonio/:cpf/evolucao**
- Descrição: Evolução patrimonial ao longo de eleições
- Response:
```json
{
  "cpf": "12345678900",
  "nome": "Nome Candidato",
  "evolucao": [
    {"ano": 2014, "total": 500000.00},
    {"ano": 2018, "total": 800000.00},
    {"ano": 2022, "total": 1500000.00}
  ],
  "variacao_percentual": 200.0
}
```

### 4.6 Busca

**GET /api/buscar**
- Descrição: Busca unificada por nome, CPF ou cargo
- Query params: `q` (termo de busca), `tipo` (deputado|senador|todos)
- Response: Array de resultados de diferentes fontes

**GET /api/estatisticas**
- Descrição: Estatísticas gerais para hero section
- Response:
```json
{
  "totalGastoDeputados": 2300000000.00,
  "totalDeputados": 513,
  "totalSenadores": 81,
  "totalGastosAnalisados": 125487,
  "ultimaAtualizacao": "2024-12-01T10:30:00Z"
}
```

---

## 5. MODELOS DE DADOS (GOLANG)

### 5.1 Deputado
```go
type Deputado struct {
    ID           int     `json:"id"`
    Nome         string  `json:"nome"`
    NomeCivil    string  `json:"nomeCivil"`
    Partido      string  `json:"siglaPartido"`
    UF           string  `json:"siglaUf"`
    Foto         string  `json:"urlFoto"`
    Email        string  `json:"email"`
    Situacao     string  `json:"situacao"`
    Condicao     string  `json:"condicaoEleitoral"`
}

type Despesa struct {
    ID              int       `json:"id"`
    TipoDespesa     string    `json:"tipoDespesa"`
    DataDocumento   string    `json:"dataDocumento"`
    ValorDocumento  float64   `json:"valorDocumento"`
    ValorLiquido    float64   `json:"valorLiquido"`
    ValorGlosa      float64   `json:"valorGlosa"`
    NomeFornecedor  string    `json:"nomeFornecedor"`
    CNPJFornecedor  string    `json:"cnpjCPFFornecedor"`
    NumDocumento    string    `json:"numDocumento"`
}

type RankingDeputado struct {
    Deputado
    TotalGasto  float64 `json:"totalGasto"`
    Posicao     int     `json:"posicao"`
    NumGastos   int     `json:"numeroGastos"`
}
```

### 5.2 Emenda
```go
type Emenda struct {
    Numero              string  `json:"numero"`
    Ano                 int     `json:"ano"`
    Autor               string  `json:"autor"`
    TipoAutor           string  `json:"tipoAutor"`
    Partido             string  `json:"partido"`
    UF                  string  `json:"uf"`
    TipoEmenda          string  `json:"tipoEmenda"`
    Funcao              string  `json:"funcao"`
    Subfuncao           string  `json:"subfuncao"`
    MunicipioFavorecido string  `json:"municipioFavorecido"`
    CodigoMunicipio     string  `json:"codigoMunicipio"`
    ValorEmpenhado      float64 `json:"valorEmpenhado"`
    ValorLiquidado      float64 `json:"valorLiquidado"`
    ValorPago           float64 `json:"valorPago"`
    ValorRestoPagar     float64 `json:"valorRestoPagar"`
}

type RankingEmenda struct {
    Autor       string  `json:"autor"`
    Partido     string  `json:"partido"`
    UF          string  `json:"uf"`
    TotalPago   float64 `json:"totalPago"`
    Quantidade  int     `json:"quantidade"`
    Posicao     int     `json:"posicao"`
}
```

### 5.3 Cartão Corporativo
```go
type CartaoGasto struct {
    ID                  int     `json:"id"`
    NomePortador        string  `json:"nomePortador"`
    CPFPortador         string  `json:"cpfPortador"`
    OrgaoSuperior       string  `json:"orgaoSuperior"`
    OrgaoSubordinado    string  `json:"orgaoSubordinado"`
    DataTransacao       string  `json:"dataTransacao"`
    ValorTransacao      float64 `json:"valorTransacao"`
    NomeEstabelecimento string  `json:"nomeEstabelecimento"`
    CNPJEstabelecimento string  `json:"cnpjEstabelecimento"`
    TipoGasto           string  `json:"tipoGasto"`
}

type RankingCartao struct {
    Nome        string  `json:"nome"`
    CPF         string  `json:"cpf"`
    Orgao       string  `json:"orgao"`
    TotalGasto  float64 `json:"totalGasto"`
    NumGastos   int     `json:"numeroGastos"`
    Posicao     int     `json:"posicao"`
}
```

### 5.4 Patrimônio
```go
type Candidato struct {
    CPF         string  `json:"cpf"`
    Nome        string  `json:"nome"`
    NomeUrna    string  `json:"nomeUrna"`
    Numero      string  `json:"numero"`
    Partido     string  `json:"partido"`
    UF          string  `json:"uf"`
    Cargo       string  `json:"cargo"`
    Ano         int     `json:"ano"`
    TotalBens   float64 `json:"totalBens"`
}

type BemDeclarado struct {
    ID          int     `json:"id"`
    CPF         string  `json:"cpf"`
    Ano         int     `json:"ano"`
    TipoBem     string  `json:"tipoBem"`
    Descricao   string  `json:"descricao"`
    Valor       float64 `json:"valor"`
}

type EvolucaoPatrimonial struct {
    CPF                 string                 `json:"cpf"`
    Nome                string                 `json:"nome"`
    Evolucao            []PatrimonioAno        `json:"evolucao"`
    VariacaoPercentual  float64                `json:"variacaoPercentual"`
    VariacaoAbsoluta    float64                `json:"variacaoAbsoluta"`
}

type PatrimonioAno struct {
    Ano     int     `json:"ano"`
    Total   float64 `json:"total"`
}
```

---

## 6. DESIGN DA INTERFACE (FRONTEND)

### 6.1 Splash Screen

**Componente**: `SplashScreen.jsx`

**Características**:
- Duração: 2-3 segundos
- Fundo: Gradiente azul escuro (#1e3a8a) para roxo (#7c3aed)
- Logo centralizado com animação fade-in
- Slogan abaixo: "Transparência ao alcance de um clique"
- Spinner de carregamento discreto
- Transição suave (fade out) para Home

**Animações** (Framer Motion):
```jsx
<motion.div
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.5 }}
>
  {/* Logo */}
</motion.div>
```

### 6.2 Página Home (Dashboard)

**Componente**: `Home.jsx`

**Seções**:

1. **Header** (fixo no topo):
   - Logo pequeno à esquerda
   - Barra de busca central
   - Menu: Sobre | Como Usar | Compartilhar
   - Toggle tema claro/escuro

2. **Hero Section**:
   - Título: "Fiscalize Seus Representantes"
   - Subtítulo explicativo (2-3 linhas)
   - 4 StatCards animados:
     - Total gasto deputados
     - Número de deputados
     - Número de senadores
     - Total de gastos analisados
   - Animação: Números sobem de 0 ao valor real

3. **Grid de 6 Botões** (NavigationCard):
   - Layout responsivo:
     - Desktop: 3 colunas × 2 linhas (gap-6)
     - Tablet: 2 colunas × 3 linhas
     - Mobile: 1 coluna × 6 linhas
   
   **Card 1: Gastos de Deputados**
   - Cor: Azul (#3b82f6)
   - Ícone: 💰 (wallet/briefcase)
   - Título: "Gastos de Deputados"
   - Descrição: "Veja quanto cada deputado federal gastou"
   - Link: `/deputados`
   
   **Card 2: Ranking de Gastos** 🔥
   - Cor: Vermelho/Laranja (#ef4444)
   - Ícone: 🏆 (trophy/podium)
   - Título: "Ranking de Gastos"
   - Descrição: "TOP 20 deputados que mais gastam"
   - Badge: "MAIS ACESSADO"
   - Link: `/ranking`
   
   **Card 3: Emendas Parlamentares**
   - Cor: Verde (#10b981)
   - Ícone: 📍 (map-pin)
   - Título: "Emendas Parlamentares"
   - Descrição: "Para onde vão os bilhões em emendas"
   - Link: `/emendas`
   
   **Card 4: Cartões Corporativos**
   - Cor: Roxo (#8b5cf6)
   - Ícone: 💳 (credit-card)
   - Título: "Cartões Corporativos"
   - Descrição: "Gastos do dia a dia com cartão governamental"
   - Link: `/cartoes`
   
   **Card 5: Patrimônio de Políticos**
   - Cor: Dourado/Amarelo (#f59e0b)
   - Ícone: 🏦 (vault/coins)
   - Título: "Patrimônio de Políticos"
   - Descrição: "Evolução patrimonial ao longo dos anos"
   - Link: `/patrimonio`
   
   **Card 6: Busca Avançada**
   - Cor: Cinza escuro (#374151)
   - Ícone: 🔍 (search/filter)
   - Título: "Busca Avançada"
   - Descrição: "Busque por nome, CPF ou cargo"
   - Link: `/busca`

**Estilo dos Cards**:
```jsx
// Tailwind classes
className="
  group relative
  bg-white dark:bg-gray-800
  p-6 rounded-xl
  shadow-lg hover:shadow-2xl
  transition-all duration-300
  hover:-translate-y-2
  cursor-pointer
  border-2 border-transparent
  hover:border-blue-500
"
```

4. **Footer**:
   - Links úteis
   - Créditos de dados
   - Última atualização
   - Redes sociais

### 6.3 Página Deputados

**Componente**: `Deputados.jsx`

**Layout**:
1. Breadcrumb: Home > Gastos de Deputados
2. Título da página
3. Filtros:
   - Busca por nome
   - Filtro por partido (dropdown)
   - Filtro por UF (dropdown)
   - Ordenação (nome|partido|gastos)
4. Tabela com:
   - Foto (thumbnail)
   - Nome
   - Partido
   - UF
   - Email
   - Botão "Ver Gastos" → Abre modal ou nova página
5. Paginação

**Modal/Página de Gastos**:
- Cabeçalho com foto e dados do deputado
- Filtro de ano/mês
- Gráfico de gastos por tipo (pizza ou barras)
- Tabela detalhada:
   - Data
   - Tipo de despesa
   - Fornecedor
   - Valor
- Total gasto no período
- Botão "Baixar CSV"
- Botão "Compartilhar"

### 6.4 Página Ranking

**Componente**: `Ranking.jsx`

**Layout**:
1. Breadcrumb: Home > Ranking de Gastos
2. Título: "🏆 TOP 20 Maiores Gastadores"
3. Filtros:
   - Ano (dropdown: 2024, 2023, 2022...)
   - Tipo (todos|deputados|senadores)
4. Gráfico de barras horizontal (Recharts):
   - Eixo Y: Nomes dos deputados
   - Eixo X: Valores em reais
   - Cores: Gradiente vermelho
   - Animação ao carregar
5. Tabela detalhada:
   - Posição (#)
   - Foto
   - Nome
   - Partido
   - UF
   - Total Gasto (destaque em vermelho)
   - Número de gastos
   - Botão "Ver Detalhes"
6. Cards de destaque:
   - Maior gastador individual
   - Partido que mais gasta
   - Estado que mais gasta
   - Média de gastos

### 6.5 Página Emendas

**Componente**: `Emendas.jsx`

**Layout**:
1. Breadcrumb: Home > Emendas Parlamentares
2. Título da página
3. Mapa do Brasil interativo:
   - Biblioteca: react-simple-maps ou similar
   - Estados coloridos por intensidade de emendas (heatmap)
   - Tooltip ao passar mouse: Total e quantidade
   - Click no estado: Filtra dados
4. Filtros laterais:
   - Ano
   - Parlamentar (autocomplete)
   - Estado
   - Município (se estado selecionado)
5. Tabela de emendas:
   - Número
   - Autor
   - Partido
   - Município favorecido
   - Valor empenhado
   - Valor pago
   - % executado
6. Gráficos:
   - Top 10 parlamentares por valor
   - Top 10 municípios beneficiados

### 6.6 Página Cartões

**Componente**: `Cartoes.jsx`

**Layout**:
1. Breadcrumb: Home > Cartões Corporativos
2. Título da página
3. Alertas de gastos suspeitos (se houver):
   - Cards vermelhos destacados
   - Ícone de alerta
   - Valor alto ou estabelecimento incomum
4. Filtros:
   - Período (mês/ano início e fim)
   - CPF (opcional)
   - Órgão (dropdown)
   - Valor mínimo
5. Tabela:
   - Data
   - Portador
   - Órgão
   - Estabelecimento
   - Valor
   - Tag (se suspeito)
6. Gráficos:
   - Gastos por tipo de estabelecimento (pizza)
   - Timeline de gastos (linha)
   - Top 10 estabelecimentos mais usados

### 6.7 Página Patrimônio

**Componente**: `Patrimonio.jsx`

**Layout**:
1. Breadcrumb: Home > Patrimônio de Políticos
2. Título da página
3. Busca por candidato:
   - Input de busca (autocomplete)
   - Filtros: Ano da eleição, Cargo
4. Resultado da busca:
   - Card do candidato com foto
   - Nome, partido, cargo
   - Total de bens declarados
5. Gráfico de evolução patrimonial:
   - Linha do tempo
   - Eixo X: Anos (2014, 2018, 2022...)
   - Eixo Y: Valor total
   - Destaque de variação percentual
   - Cor: Verde se crescimento moderado, Vermelho se crescimento excessivo
6. Tabela de bens:
   - Tipo
   - Descrição
   - Valor
   - Ano
7. Comparação (opcional):
   - Adicionar outro candidato
   - Gráfico comparativo

### 6.8 Página Busca Avançada

**Componente**: `BuscaAvancada.jsx`

**Layout**:
1. Breadcrumb: Home > Busca Avançada
2. Título da página
3. Formulário de busca:
   - Nome/CPF (texto livre)
   - Tipo (deputado|senador|candidato|todos)
   - Partido (multiselect)
   - UF (multiselect)
   - Período (data início/fim)
   - Valor mínimo de gastos
4. Botão "Buscar" grande e destacado
5. Resultados:
   - Tabs: Deputados | Senadores | Candidatos
   - Cards ou tabela com resultados
   - Paginação
   - Botões de ação: "Ver Gastos", "Ver Patrimônio"

---

## 7. FUNCIONALIDADES ESPECIAIS

### 7.1 Sistema de Cache

**Objetivo**: Reduzir chamadas às APIs externas e melhorar performance

**Estratégias**:

1. **Cache em Redis**:
   - Chave: `deputados:lista` (TTL: 24h)
   - Chave: `deputado:{id}:gastos:{ano}` (TTL: 6h)
   - Chave: `ranking:gastos:{ano}` (TTL: 12h)
   - Chave: `emendas:{ano}:pagina:{num}` (TTL: 24h)

2. **Cache em PostgreSQL**:
   - Tabela `cached_rankings`:
     - tipo (gastos|emendas|cartoes)
     - ano
     - dados (JSONB)
     - created_at
   - Tabela `cached_deputados`:
     - Lista completa atualizada diariamente
   - Tabela `cached_estatisticas`:
     - Para hero section

3. **Jobs Agendados** (Cron):
   - Diário 02:00: Atualizar lista de deputados
   - Diário 03:00: Recalcular rankings
   - Semanal: Limpar cache expirado

**Implementação Go**:
```go
func GetComCache(ctx context.Context, chave string, ttl time.Duration, fn func() (interface{}, error)) (interface{}, error) {
    // 1. Tentar buscar do Redis
    val, err := rdb.Get(ctx, chave).Result()
    if err == nil {
        var resultado interface{}
        json.Unmarshal([]byte(val), &resultado)
        return resultado, nil
    }
    
    // 2. Se não existe, executar função
    resultado, err := fn()
    if err != nil {
        return nil, err
    }
    
    // 3. Salvar no Redis
    data, _ := json.Marshal(resultado)
    rdb.Set(ctx, chave, data, ttl)
    
    return resultado, nil
}
```

### 7.2 Rate Limiting

**Objetivo**: Proteger backend de abuso e respeitar limites das APIs externas

**Estratégia**:
- Limite por IP: 100 req/min
- Limite por endpoint: Varia conforme complexidade
  - `/api/estatisticas`: 1000/min (cache pesado)
  - `/api/ranking/gastos`: 10/min (processamento pesado)
  - `/api/deputados`: 100/min (normal)

**Implementação** (Fiber middleware):
```go
import "github.com/gofiber/fiber/v2/middleware/limiter"

app.Use(limiter.New(limiter.Config{
    Max:        100,
    Expiration: 1 * time.Minute,
    KeyGenerator: func(c *fiber.Ctx) string {
        return c.IP()
    },
}))
```

### 7.3 Tratamento de Erros

**Padrão de resposta de erro**:
```json
{
  "error": true,
  "message": "Descrição do erro em português",
  "code": "ERRO_ESPECIFICO",
  "timestamp": "2024-12-01T10:30:00Z"
}
```

**Códigos de erro**:
- `API_EXTERNA_INDISPONIVEL`: API externa fora do ar
- `RATE_LIMIT_EXCEDIDO`: Cliente excedeu limite
- `PARAMETRO_INVALIDO`: Parâmetro inválido na requisição
- `NAO_ENCONTRADO`: Recurso não encontrado
- `ERRO_INTERNO`: Erro inesperado no servidor

**Frontend**: Toasts/Notificações para erros

### 7.4 Logging

**Biblioteca**: logrus ou zap

**Níveis**:
- INFO: Requisições normais
- WARN: Rate limit próximo, cache miss
- ERROR: Falhas em APIs externas
- FATAL: Erros críticos (banco down)

**Formato**:
```json
{
  "level": "info",
  "timestamp": "2024-12-01T10:30:00Z",
  "endpoint": "/api/deputados",
  "method": "GET",
  "ip": "192.168.1.1",
  "duration_ms": 245,
  "status": 200
}
```

### 7.5 Compartilhamento Social

**Funcionalidade**: Botões de compartilhamento em páginas de detalhes

**Implementação**:
- Gerar URLs amigáveis: `/ranking/2024/top-gastadores`
- Meta tags Open Graph para preview bonito
- Botões: WhatsApp, Twitter/X, Facebook, Copiar link

**Exemplo meta tags**:
```html
<meta property="og:title" content="João Silva - R$ 150 mil em gastos públicos" />
<meta property="og:description" content="Veja os gastos detalhados deste deputado federal" />
<meta property="og:image" content="https://seusite.com/og-image.jpg" />
```

### 7.6 Exportação de Dados

**Funcionalidade**: Baixar dados em CSV/Excel

**Implementação Go**:
```go
import "encoding/csv"

func ExportarCSV(c *fiber.Ctx) error {
    // 1. Buscar dados
    dados := buscarDados()
    
    // 2. Criar CSV
    c.Set("Content-Type", "text/csv")
    c.Set("Content-Disposition", "attachment; filename=gastos.csv")
    
    writer := csv.NewWriter(c)
    writer.Write([]string{"Nome", "Data", "Valor"})
    for _, d := range dados {
        writer.Write([]string{d.Nome, d.Data, fmt.Sprintf("%.2f", d.Valor)})
    }
    writer.Flush()
    
    return nil
}
```

**Botões no frontend**: "📥 Baixar CSV" em tabelas

---

## 8. CONFIGURAÇÕES E VARIÁVEIS DE AMBIENTE

### 8.1 Backend (.env)

```env
# Server
PORT=8080
ENV=development # development | production

# Database
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=transparencia_user
POSTGRES_PASSWORD=senha_segura
POSTGRES_DB=transparencia_db

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# APIs Externas
PORTAL_TRANSPARENCIA_API_KEY=sua_chave_aqui

# CORS
CORS_ORIGINS=http://localhost:5173,https://seudominio.com

# Cache
CACHE_TTL_DEPUTADOS=24h
CACHE_TTL_RANKING=12h
CACHE_TTL_EMENDAS=24h

# Rate Limiting
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=1m

# Logs
LOG_LEVEL=info # debug | info | warn | error
LOG_FORMAT=json # json | text
```

### 8.2 Frontend (.env)

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_NAME=Política Transparente
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

---

## 9. DEPLOYMENT

### 9.1 Docker Compose (Desenvolvimento)

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: transparencia_user
      POSTGRES_PASSWORD: senha_dev
      POSTGRES_DB: transparencia_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  backend:
    build: ./backend
    ports:
      - "8080:8080"
    depends_on:
      - postgres
      - redis
    environment:
      - POSTGRES_HOST=postgres
      - REDIS_HOST=redis
    env_file:
      - ./backend/.env

  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    depends_on:
      - backend
    environment:
      - VITE_API_BASE_URL=http://localhost:8080/api

volumes:
  postgres_data:
```

### 9.2 Produção

**Backend** (Railway/Fly.io):
1. Criar conta
2. Conectar repositório GitHub
3. Configurar variáveis de ambiente
4. Deploy automático em push na main

**Frontend** (Vercel):
1. Importar projeto do GitHub
2. Configurar build command: `npm run build`
3. Output directory: `dist`
4. Variáveis de ambiente: `VITE_API_BASE_URL`
5. Deploy automático

**Banco de Dados**:
- Railway PostgreSQL (gratuito até 500MB)
- Ou Supabase (gratuito até 500MB + 2GB bandwidth)

**Redis**:
- Upstash (gratuito até 10k comandos/dia)
- Ou Redis Labs (gratuito até 30MB)

---

## 10. TESTES

### 10.1 Backend (Go)

```go
// handlers/deputados_test.go
func TestListarDeputados(t *testing.T) {
    app := fiber.New()
    app.Get("/api/deputados", ListarDeputados)
    
    req := httptest.NewRequest("GET", "/api/deputados", nil)
    resp, _ := app.Test(req)
    
    assert.Equal(t, 200, resp.StatusCode)
}
```

**Comandos**:
```bash
go test ./... -v
go test -cover ./...
```

### 10.2 Frontend (React)

```jsx
// __tests__/Home.test.jsx
import { render, screen } from '@testing-library/react'
import Home from '../pages/Home'

test('renderiza título principal', () => {
  render(<Home />)
  const titulo = screen.getByText(/Fiscalize Seus Representantes/i)
  expect(titulo).toBeInTheDocument()
})
```

**Comandos**:
```bash
npm test
npm run test:coverage
```

---

## 11. DOCUMENTAÇÃO ADICIONAL

### 11.1 README.md

Deve conter:
- Descrição do projeto
- Screenshots
- Como rodar localmente
- Como contribuir
- Licença (sugestão: MIT)
- Créditos

### 11.2 API Docs

Considerar:
- Swagger/OpenAPI
- Postman Collection
- Exemplos de requisições

### 11.3 Guia de Contribuição

- Code style (gofmt, prettier)
- Processo de PR
- Testes obrigatórios
- Convenções de commit

---

## 12. ROADMAP (FUTURAS FEATURES)

### Fase 1 (MVP - 4 semanas):
- ✅ Splash screen
- ✅ Home com 6 botões
- ✅ Página deputados
- ✅ Página ranking
- ✅ Backend básico (5 endpoints)

### Fase 2 (6 semanas):
- Página emendas com mapa
- Página cartões
- Página patrimônio
- Sistema de cache completo
- Deploy produção

### Fase 3 (Futuro):
- Login de usuários
- Sistema de alertas (email quando deputado gastar muito)
- Comparações personalizadas
- API pública para terceiros
- App mobile (React Native)
- Senadores (adicionar API Senado)
- Visualizações 3D/VR de dados
- IA para detectar padrões suspeitos

---

## 12.1 VERSÃO SIMPLIFICADA PARA ENTREGA ACADÊMICA (3 DIAS)

### ⚠️ IMPORTANTE: Escopo Reduzido para Prazo Curto

O projeto completo acima é para desenvolvimento profissional (10+ semanas). Para entrega acadêmica em **3 dias**, use este escopo simplificado:

### O que DEVE ser implementado (Mínimo Viável):

#### DIA 1 - Backend Básico:
- ✅ Setup inicial do projeto Go + Fiber
- ✅ Endpoint `/api/deputados` (lista deputados da API Câmara)
- ✅ Endpoint `/api/deputados/:id/gastos` (gastos de um deputado)
- ✅ Endpoint `/api/ranking/gastos` (top 10 gastadores)
- ✅ CORS habilitado
- ⚠️ **SEM banco de dados** (apenas chamadas diretas às APIs)
- ⚠️ **SEM Redis** (cache pode ficar para depois)

#### DIA 2 - Frontend Básico:
- ✅ Setup React + Vite + Tailwind
- ✅ Página Home com 3 cards (não 6):
  1. Lista de Deputados
  2. Ranking de Gastos
  3. Buscar Deputado
- ✅ Página Deputados (tabela simples)
- ✅ Página Ranking (tabela ou gráfico básico)
- ✅ Modal de gastos ao clicar em deputado
- ⚠️ **SEM splash screen** (economizar tempo)
- ⚠️ **SEM animações complexas**
- ⚠️ **SEM Emendas/Cartões/Patrimônio**

#### DIA 3 - Docker + Documentação:
- ✅ Dockerfile para backend
- ✅ Dockerfile para frontend
- ✅ Docker Compose funcional
- ✅ README.md com instruções de execução
- ✅ Apresentação (slides ou vídeo curto)
- ✅ Testes manuais e ajustes finais

### Stack SIMPLIFICADA para 3 dias:

```
Backend:
- Go + Fiber (sem PostgreSQL, sem Redis)
- Apenas consumo direto das APIs externas

Frontend:
- React + Vite + Tailwind
- Axios para requisições
- Recharts (OPCIONAL, pode usar tabelas puras)

Deploy:
- Docker Compose (rodar localmente)
- NÃO fazer deploy em nuvem (sem tempo)
```

### Estrutura de Pastas SIMPLIFICADA:

```
portal-transparencia/
├── backend/
│   ├── main.go                    # Arquivo único (simplicidade)
│   ├── go.mod
│   ├── go.sum
│   ├── .env.example
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Deputados.jsx
│   │   │   └── Ranking.jsx
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   └── DeputadoCard.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── Dockerfile
├── docker-compose.yml
├── README.md
└── APRESENTACAO.md              # Slides em markdown ou PDF
```

### Funcionalidades CORTADAS (não dá tempo):

- ❌ Emendas Parlamentares (API complexa)
- ❌ Cartões Corporativos (requer chave API)
- ❌ Patrimônio (API TSE muito complexa)
- ❌ Busca Avançada
- ❌ Sistema de cache (Redis/PostgreSQL)
- ❌ Exportação CSV
- ❌ Compartilhamento social
- ❌ Testes automatizados
- ❌ CI/CD
- ❌ Deploy em produção

### O que mostrar na apresentação:

1. **Objetivo**: "Facilitar acesso a dados públicos de deputados federais"
2. **Tecnologias**: Go, React, Docker, API Câmara dos Deputados
3. **Demonstração**:
   - Listar todos os deputados
   - Buscar deputado específico
   - Ver gastos detalhados
   - Ranking dos top 10 gastadores
4. **Como rodar**: `docker-compose up` (pronto!)
5. **Código**: Mostrar arquivos principais (main.go, App.jsx)

### Critério de Sucesso (mínimo):

- [ ] Backend roda em `http://localhost:8080`
- [ ] Frontend roda em `http://localhost:5173`
- [ ] Consegue listar deputados
- [ ] Consegue ver gastos de pelo menos 1 deputado
- [ ] Ranking funciona
- [ ] Docker Compose sobe tudo com 1 comando
- [ ] README explica como executar

### Entrega Física/Digital:

**Opção 1 - Repositório Git** (Recomendado):
```bash
# Criar repositório GitHub
# Fazer commit de todo código
# Compartilhar link com professor
# Incluir README.md completo
```

**Opção 2 - ZIP**:
```bash
# Compactar pasta do projeto
# Incluir arquivo INSTRUCOES.txt
# Garantir que docker-compose.yml está incluído
```

**Opção 3 - Apresentação + Código**:
- PDF/PPTX com slides explicativos
- Link para repositório GitHub
- Vídeo de 5min demonstrando funcionamento (opcional)

---

## 12.2 INSTRUÇÕES DE ENTREGA PARA FACULDADE

### Como Executar o Projeto (para o professor avaliar):

#### Pré-requisitos:
```bash
# 1. Instalar Docker Desktop
# Windows/Mac: https://www.docker.com/products/docker-desktop
# Linux: sudo apt-get install docker docker-compose

# 2. Verificar instalação
docker --version
docker-compose --version
```

#### Executar Projeto:

```bash
# 1. Clonar/extrair projeto
cd portal_da_transparencia

# 2. Subir aplicação completa
docker-compose up --build

# 3. Acessar no navegador
# Frontend: http://localhost:5173
# Backend API: http://localhost:8080/api/deputados
```

#### Parar Projeto:
```bash
# Ctrl+C no terminal
# Ou em outro terminal:
docker-compose down
```

### Estrutura do Docker Compose (versão simplificada):

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8080:8080"
    environment:
      - PORT=8080
      - ENV=development
    restart: unless-stopped

  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    depends_on:
      - backend
    environment:
      - VITE_API_BASE_URL=http://localhost:8080/api
    restart: unless-stopped
```

### Dockerfile Backend (Go):

```dockerfile
FROM golang:1.21-alpine

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o main .

EXPOSE 8080

CMD ["./main"]
```

### Dockerfile Frontend (React):

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
```

### README.md para Entrega:

```markdown
# Portal da Transparência - Projeto Acadêmico

## 📋 Descrição
Plataforma web para visualização de gastos públicos de deputados federais brasileiros.

## 🚀 Tecnologias
- **Backend**: Go 1.21 + Fiber
- **Frontend**: React 18 + Vite + Tailwind CSS
- **Containerização**: Docker + Docker Compose
- **API Externa**: Câmara dos Deputados (dados abertos)

## ⚙️ Como Executar

### Pré-requisitos
- Docker Desktop instalado
- Portas 8080 e 5173 disponíveis

### Passos
1. Clone ou extraia o projeto
2. Execute: `docker-compose up --build`
3. Acesse: http://localhost:5173

## 📦 Estrutura
- `/backend` - API em Go
- `/frontend` - Interface em React
- `/docker-compose.yml` - Orquestração dos containers

## 👥 Equipe
[Seu Nome] - [Seu RA]

## 📅 Data
Dezembro 2024
```

### Checklist Final para Entrega:

- [ ] Código commitado no Git com mensagens descritivas
- [ ] Docker Compose testado (sobe tudo corretamente)
- [ ] README.md completo com instruções
- [ ] Remover arquivos desnecessários (.env com senhas, node_modules, etc)
- [ ] .gitignore configurado
- [ ] Apresentação preparada (slides ou vídeo)
- [ ] Testar em máquina limpa (se possível)
- [ ] Arquivo .env.example com variáveis necessárias
- [ ] Comentários no código explicando partes importantes

### Argumentos para Defender na Apresentação:

**Se perguntarem "Por que não tem banco de dados?"**
> "Para este MVP, optei por consumir diretamente as APIs governamentais, reduzindo complexidade e tempo de desenvolvimento. Em produção, implementaríamos cache com PostgreSQL."

**Se perguntarem "Por que não tem todas as funcionalidades?"**
> "Foquei em entregar um núcleo funcional e bem feito: listagem de deputados e ranking de gastos. É melhor ter 3 features funcionando perfeitamente do que 10 pela metade."

**Se perguntarem "Por que Docker?"**
> "Docker garante que o projeto rode em qualquer máquina sem conflitos de versões. O professor só precisa executar `docker-compose up` e tudo funciona."

### Pontos Fortes para Destacar:

✅ **Arquitetura moderna** (Go + React)
✅ **Containerização** (fácil execução)
✅ **API RESTful** bem estruturada
✅ **Dados reais** (não mock/fake)
✅ **Interface responsiva** (mobile-friendly)
✅ **Código limpo** e comentado
✅ **Documentação completa**

### Forma de Entrega Recomendada:

**Repositório GitHub Público**:
```
https://github.com/seu-usuario/portal-transparencia

Conteúdo:
- Todo código fonte
- README.md detalhado
- docker-compose.yml funcional
- .gitignore configurado
- APRESENTACAO.md ou PDF com slides
```

**Entregar para o professor**:
1. Link do GitHub
2. PDF com apresentação
3. Vídeo demo de 3-5min (opcional, mas impressiona)

---

### ⏰ Cronograma Realista para 3 Dias:

**DIA 1 (8 horas)**:
- 2h: Setup Go + Fiber + endpoints básicos
- 2h: Integração com API Câmara
- 2h: Endpoint de ranking com ordenação
- 2h: Testes manuais e correções

**DIA 2 (8 horas)**:
- 2h: Setup React + Vite + Tailwind
- 3h: Página Home + Deputados + Ranking
- 2h: Integração frontend-backend
- 1h: Estilização e responsividade

**DIA 3 (8 horas)**:
- 2h: Dockerfiles + docker-compose
- 2h: README.md + documentação
- 2h: Apresentação (slides/vídeo)
- 2h: Testes finais e ajustes

**TOTAL: 24 horas de trabalho efetivo**

### Dica Final:

**NÃO tente implementar o projeto completo**. Foque no MVP simplificado acima. Um projeto pequeno funcionando 100% vale mais que um grande funcionando 30%.

---

## 13. SEGURANÇA

### 13.1 Checklist

- [ ] Sanitização de inputs (prevenir SQL injection)
- [ ] Rate limiting ativo
- [ ] CORS configurado corretamente
- [ ] HTTPS em produção
- [ ] Secrets em variáveis de ambiente (nunca no código)
- [ ] Validação de tokens/chaves de API
- [ ] Headers de segurança (helmet no Fiber)
- [ ] Logs não expõem dados sensíveis
- [ ] Dependências atualizadas (sem vulnerabilidades)

### 13.2 Headers de Segurança

```go
import "github.com/gofiber/helmet/v2"

app.Use(helmet.New(helmet.Config{
    XSSProtection:             "1; mode=block",
    ContentTypeNosniff:        "nosniff",
    XFrameOptions:             "SAMEORIGIN",
    HSTSMaxAge:                31536000,
}))
```

---

## 14. MÉTRICAS E MONITORAMENTO

### 14.1 Métricas Importantes

- Tempo de resposta por endpoint
- Taxa de erro (%)
- Número de requisições/dia
- Cache hit ratio
- Páginas mais acessadas
- Gastos mais visualizados

### 14.2 Ferramentas

- Google Analytics (frontend)
- Prometheus + Grafana (backend)
- Sentry (error tracking)
- Uptime monitoring (UptimeRobot)

---

## 15. CONSIDERAÇÕES FINAIS

### 15.1 Boas Práticas

- **DRY** (Don't Repeat Yourself): Criar funções reutilizáveis
- **Comentários**: Explicar lógica complexa
- **Naming**: Nomes descritivos em português ou inglês (consistência)
- **Git**: Commits frequentes e descritivos
- **Branches**: feature/nome-feature, bugfix/descricao

### 15.2 Performance

- Lazy loading de imagens (React)
- Code splitting (React.lazy)
- Compressão gzip no backend
- CDN para assets estáticos
- Otimização de queries SQL (índices)
- Paginação em todas as listas

### 15.3 Acessibilidade

- Semântica HTML correta
- ARIA labels
- Contraste de cores adequado
- Navegação por teclado
- Textos alternativos em imagens
- Suporte a leitores de tela

---

## 16. GLOSSÁRIO

- **Emenda Parlamentar**: Recurso que deputado/senador destina a município/estado
- **CPGF**: Cartão de Pagamento do Governo Federal
- **TSE**: Tribunal Superior Eleitoral
- **Valor Empenhado**: Comprometido mas não pago
- **Valor Liquidado**: Confirmado para pagamento
- **Valor Pago**: Efetivamente transferido
- **CEIS**: Cadastro de Empresas Inidôneas e Suspensas
- **UF**: Unidade Federativa (estado)

---

## 17. CONTATOS E RECURSOS

### APIs Oficiais:
- Câmara: https://dadosabertos.camara.leg.br
- Portal Transparência: https://portaldatransparencia.gov.br/api-de-dados
- TSE: https://dadosabertos.tse.jus.br

### Documentação:
- Go Fiber: https://docs.gofiber.io
- React: https://react.dev
- Tailwind: https://tailwindcss.com

### Comunidades:
- Discord Go Brasil
- Reddit r/golang
- Reddit r/reactjs

---

**VERSÃO DO DOCUMENTO**: 1.0  
**DATA**: Dezembro 2024  
**AUTOR**: Equipe de Desenvolvimento  
**STATUS**: Pronto para implementação

---

Este documento deve ser usado como guia completo para desenvolvimento. Qualquer dúvida ou ajuste necessário, consulte as documentações oficiais das tecnologias ou entre em contato com a equipe.
```

---