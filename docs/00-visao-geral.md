# Aula 00 — Visão Geral do Projeto

## 🎯 Objetivo

Neste curso, vamos construir uma **rede social mobile** completa usando **React Native** com **Expo**. O app terá funcionalidades reais: cadastro de usuário, login, feed de posts, curtidas e perfil — tudo conectado a um banco de dados na nuvem.

---

## 📱 O que vamos construir?

Um aplicativo parecido com o **Twitter/X** simplificado, com as seguintes telas:

| Tela | Descrição |
|------|-----------|
| **Login** | Autenticação com email e senha |
| **Cadastro** | Registro de novos usuários |
| **Feed** | Lista de posts de todos os usuários |
| **Novo Post** | Tela modal para escrever um post |
| **Perfil** | Dados do usuário e seus posts |

---

## 🛠️ Tecnologias Utilizadas

### React Native + Expo

| Conceito | Comparação com Web |
|----------|--------------------|
| **React Native** | É como o React, mas em vez de gerar HTML (`<div>`, `<p>`), gera **componentes nativos** do celular (`<View>`, `<Text>`) |
| **Expo** | É como o **Create React App** ou **Vite** do mundo mobile — facilita a criação, configuração e execução do projeto |
| **Expo Router** | É como o **Next.js** — usa a **estrutura de pastas** para definir as rotas/telas do app automaticamente |

### Estilização — NativeWind (Tailwind CSS)

| Conceito | Comparação com Web |
|----------|--------------------|
| **NativeWind** | É o **Tailwind CSS** adaptado para React Native. Em vez de escrever `style={{ padding: 16 }}`, você escreve `className="p-4"` |
| **Tailwind CSS** | Framework de classes utilitárias. Em vez de criar um arquivo CSS separado, você estiliza direto no componente |

### Backend — Supabase

| Conceito | Comparação |
|----------|------------|
| **Supabase** | É como o **Firebase** da Google, mas usando **PostgreSQL** (banco relacional) em vez de NoSQL |
| **Auth do Supabase** | Sistema de autenticação pronto — como usar **Firebase Auth** ou **Auth0** |
| **RLS (Row Level Security)** | São regras de segurança no banco — como se fossem **middlewares** de autenticação, mas no nível do banco de dados |

### TypeScript

| Conceito | Comparação |
|----------|------------|
| **TypeScript** | É o JavaScript com **tipagem estática** — parecido com Java ou C# nesse aspecto. Ajuda a pegar erros antes de rodar o código |

---

## 🏗️ Arquitetura do Projeto

```
rede-social-mobile/
├── app/                    ← 📱 Telas do app (rotas automáticas)
│   ├── _layout.tsx         ← Layout raiz (providers, tema)
│   ├── index.tsx           ← Ponto de entrada (redireciona)
│   ├── new-post.tsx        ← Tela modal de novo post
│   ├── (auth)/             ← Grupo de telas de autenticação
│   │   ├── _layout.tsx
│   │   ├── login.tsx
│   │   └── register.tsx
│   └── (tabs)/             ← Grupo de telas com barra inferior
│       ├── _layout.tsx
│       ├── index.tsx       ← Feed
│       └── profile.tsx     ← Perfil
├── components/             ← 🧩 Componentes reutilizáveis
├── constants/              ← 📌 Constantes (tipos, tema)
├── contexts/               ← 🔐 Context API (estado global)
│   └── AuthContext.tsx
├── hooks/                  ← 🪝 Custom Hooks
├── lib/                    ← 📚 Lógica de dados (Supabase)
│   ├── supabase.ts
│   └── posts.ts
├── supabase/               ← 🗃️ Migrations SQL
│   └── migrations/
├── app.json                ← ⚙️ Configuração do Expo
├── tailwind.config.js      ← 🎨 Configuração do Tailwind
├── babel.config.js         ← 🔧 Configuração do Babel
├── metro.config.js         ← 📦 Configuração do Metro bundler
├── tsconfig.json           ← 📝 Configuração do TypeScript
└── package.json            ← 📋 Dependências do projeto
```

---

## 🗓️ Cronograma das Aulas

| Aula | Tema | Duração |
|------|------|---------|
| 00 | Visão geral do projeto e tecnologias | ~30 min |
| 01 | Configuração do ambiente de desenvolvimento | ~3h |
| 02 | Criando o projeto com Expo | ~3h |
| 03 | Estilização com NativeWind (Tailwind CSS) | ~3h |
| 04 | Navegação com Expo Router | ~3h |
| 05 | Configuração do Supabase (banco de dados) | ~3h |
| 06 | Autenticação (login e cadastro) | ~3h |
| 07 | Feed de posts e criação de posts | ~3h |
| 08 | Sistema de curtidas e interações | ~3h |
| 09 | Tela de perfil do usuário | ~3h |
| 10 | Revisão geral e próximos passos | ~3h |

---

## 💡 Conceitos que você vai aprender

1. **Desenvolvimento Mobile** — Como criar apps nativos para Android e iOS
2. **Componentização** — Dividir a interface em peças reutilizáveis
3. **Gerenciamento de Estado** — Context API e Hooks do React
4. **Navegação Mobile** — Stack, Tabs e Modais
5. **Integração com API/Backend** — Conexão com banco de dados na nuvem
6. **Autenticação** — Login, cadastro e controle de sessão
7. **CRUD** — Create, Read, Update, Delete de dados
8. **Segurança** — Row Level Security no banco de dados
9. **TypeScript** — Tipagem estática para código mais seguro
10. **Boas práticas** — Organização de pastas, separação de responsabilidades

---

## ⚡ Pré-requisitos

- Conhecimentos básicos de **JavaScript**
- Noções de **HTML/CSS** (para entender a lógica de estilização)
- Familiaridade com **React** (componentes, props, state) é um diferencial, mas não obrigatório
- **Node.js** instalado (versão 18+)
- **VS Code** ou editor de código similar
- Celular com **Expo Go** instalado OU emulador Android/iOS