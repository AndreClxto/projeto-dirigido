# 🏛️ Portal da Transparência

Plataforma web para visualização de gastos públicos de deputados federais brasileiros.

## 📸 Screenshot

O projeto possui:
- ✨ **Splash Screen** animada com fonte bonita
- 🏠 **Home** com botões grandes para cada funcionalidade
- 👥 **Lista de Deputados** com filtro e fotos
- 🏆 **Ranking de Gastos** TOP 10 maiores gastadores
- 💰 **Gastos Detalhados** por deputado
- 📊 **Estatísticas Gerais** do sistema

## 🚀 Tecnologias

- **React 18** - Framework frontend
- **Vite** - Build tool ultra-rápido
- **Tailwind CSS** - Estilização moderna
- **Framer Motion** - Animações suaves
- **Axios** - Requisições HTTP
- **React Router** - Navegação entre páginas
- **API Câmara dos Deputados** - Dados públicos oficiais

## ⚙️ Como Rodar o Projeto

### Pré-requisitos

Você precisa ter instalado:
- **Node.js** versão 16 ou superior ([Download aqui](https://nodejs.org/))
- **npm** (já vem com o Node.js)

Para verificar se está instalado:
```bash
node --version
npm --version
```

### Passo a Passo

1. **Entre na pasta do projeto:**
```bash
cd portal_da_transparencia/frontend
```

2. **Instale as dependências:**
```bash
npm install
```
⏳ Isso vai demorar alguns minutos na primeira vez.

3. **Rode o projeto:**
```bash
npm run dev
```

4. **Abra no navegador:**
```
http://localhost:5173
```

🎉 **Pronto!** O projeto está rodando!

## 📱 Como Usar

1. Aguarde a **Splash Screen** (3 segundos)
2. Na **Home**, clique em qualquer botão grande:
   - 👥 **Listar Deputados** - Vê todos os deputados com foto
   - 🏆 **Ranking de Gastos** - TOP 10 que mais gastam (demora um pouco)
   - 💰 **Gastos por Deputado** - Busque por ID do deputado
   - 📊 **Estatísticas** - Números gerais do sistema
3. Use o botão **Voltar** para retornar à Home

## 📁 Estrutura do Projeto

```
frontend/
├── src/
│   ├── components/
│   │   └── SplashScreen.jsx      # Tela inicial animada
│   ├── pages/
│   │   ├── Home.jsx               # Página inicial com botões
│   │   ├── Deputados.jsx          # Lista de deputados
│   │   ├── Ranking.jsx            # Ranking de gastos
│   │   ├── Gastos.jsx             # Gastos detalhados
│   │   └── Estatisticas.jsx       # Estatísticas gerais
│   ├── services/
│   │   └── api.js                 # Chamadas para API Câmara
│   ├── App.jsx                    # Componente principal
│   ├── main.jsx                   # Entry point
│   └── index.css                  # Estilos globais
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## 🎨 Recursos Visuais

- **Fontes Google**: Poppins (títulos) e Inter (corpo)
- **Gradientes**: Cores vibrantes em cada página
- **Animações**: Fade-in, slide, hover effects
- **Responsivo**: Funciona em celular, tablet e desktop
- **Dark Theme**: Design escuro moderno

## 🌐 Fonte de Dados

Todos os dados vêm da **API de Dados Abertos da Câmara dos Deputados**:
- 📍 https://dadosabertos.camara.leg.br
- 🔓 API pública, sem necessidade de chave
- 📊 Dados atualizados em tempo real

## 🐛 Solução de Problemas

**Erro ao instalar dependências:**
```bash
# Limpe o cache e tente novamente
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Porta 5173 já está em uso:**
```bash
# O Vite vai oferecer outra porta automaticamente
# Ou mate o processo que está usando a porta 5173
```

**Dados não carregam:**
- Verifique sua conexão com a internet
- A API da Câmara pode estar temporariamente indisponível
- Tente novamente em alguns minutos

## 📝 Scripts Disponíveis

```bash
npm run dev      # Roda em modo desenvolvimento
npm run build    # Cria versão otimizada para produção
npm run preview  # Preview da versão de produção
```

## 👨‍💻 Desenvolvimento

Projeto desenvolvido para disciplina acadêmica.

**Autor:** [Seu Nome]
**RA:** [Seu RA]
**Data:** Dezembro 2025

## 📄 Licença

Projeto acadêmico - Livre para uso educacional.

---

**Feito com ❤️ e React**
# projeto-dirigido
