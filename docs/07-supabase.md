# Aula 05 — Configuração do Supabase (Backend na Nuvem)

## 🎯 Objetivo da Aula
Configurar o Supabase como backend do app: criar o projeto, definir as tabelas do banco de dados, configurar segurança (RLS) e conectar com o app React Native.

---

## 1. O que é o Supabase?

O **Supabase** é um **Backend as a Service (BaaS)** — ele fornece tudo que um backend precisa sem você escrever código de servidor:

| Recurso | O que faz | Comparação |
|---------|-----------|------------|
| **Database** | Banco de dados PostgreSQL | MySQL, MongoDB Atlas |
| **Auth** | Autenticação de usuários | Firebase Auth, Auth0 |
| **Storage** | Armazenamento de arquivos | AWS S3, Firebase Storage |
| **Realtime** | Atualizações em tempo real | WebSockets, Firebase Realtime DB |
| **Edge Functions** | Funções serverless | AWS Lambda, Cloud Functions |

> **Comparação principal:** O Supabase é como o **Firebase** da Google, mas com uma grande diferença: ele usa **PostgreSQL** (banco relacional com SQL) em vez de um banco NoSQL. Isso significa que se você já sabe SQL, vai se sentir em casa!

---

## 2. Criando o Projeto no Supabase

### Passo a passo:

1. Acesse [https://supabase.com](https://supabase.com) e faça login
2. Clique em **New Project**
3. Preencha:
   - **Name:** `rede-social-mobile`
   - **Database Password:** (guarde essa senha!)
   - **Region:** `South America (São Paulo)` (mais próximo de nós)
4. Clique em **Create new project**
5. Aguarde a criação (pode levar ~2 minutos)

### Obtendo as credenciais:

Após a criação, vá em **Settings** → **API** e copie:

| Campo | O que é |
|-------|---------|
| **Project URL** | Endereço do seu projeto (API REST) |
| **anon public key** | Chave pública para o app se conectar |

> **Importante:** A `anon key` é **pública** — pode ficar no código do app. Ela tem permissões limitadas e é controlada pelas políticas de segurança (RLS).

---

## 3. Modelagem do Banco de Dados

Nosso app precisa de **3 tabelas**:

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   profiles   │     │    posts     │     │  post_likes  │
├──────────────┤     ├──────────────┤     ├──────────────┤
│ id (PK)      │◄────│ user_id (FK) │     │ user_id (FK) │
│ name         │     │ id (PK)      │◄────│ post_id (FK) │
│ username     │     │ content      │     │ created_at   │
│ avatar_url   │     │ created_at   │     └──────────────┘
│ bio          │     │ updated_at   │
│ created_at   │     │ deleted_at   │
│ updated_at   │     └──────────────┘
└──────────────┘
```

### Explicando cada tabela:

| Tabela | Função | Comparação |
|--------|--------|------------|
| `profiles` | Dados públicos do usuário | Tabela de "Clientes" ou "Usuários" |
| `posts` | Posts publicados | Tabela de "Mensagens" ou "Publicações" |
| `post_likes` | Curtidas nos posts | Tabela intermediária (relação N:N) |

> **O que é relação N:N?** Um usuário pode curtir **vários** posts, e um post pode ser curtido por **vários** usuários. Isso cria uma relação **muitos-para-muitos**, que requer uma tabela intermediária (`post_likes`).

---

## 4. Script SQL de Criação das Tabelas

Vá ao **SQL Editor** no Supabase (menu lateral) e execute o script abaixo:

### 4.1. Tabela `profiles`

```sql
-- Perfil público do usuário, vinculado a auth.users
create table if not exists public.profiles (
  id         uuid        not null references auth.users(id) on delete cascade,
  name       text        not null default '',
  username   text        not null default '',
  avatar_url text        not null default '',
  bio        text        not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint profiles_pkey primary key (id)
);

-- Username deve ser único (para buscas e menções)
create unique index if not exists profiles_username_uniq
  on public.profiles (lower(username));
```

**Entendendo cada campo:**

| Campo | Tipo | O que é |
|-------|------|---------|
| `id` | `uuid` | ID único (mesmo do `auth.users` do Supabase) |
| `name` | `text` | Nome completo do usuário |
| `username` | `text` | Nome de usuário (@joao) |
| `avatar_url` | `text` | URL da foto de perfil |
| `bio` | `text` | Biografia/descrição |
| `created_at` | `timestamptz` | Data de criação (automática) |
| `updated_at` | `timestamptz` | Data de última atualização |

> **O que é UUID?** É um identificador único universal — como um CPF, mas para dados no banco. Exemplo: `a3b8d1b6-0b3b-4b1a-9c1a-1a2b3c4d5e6f`
>
> **O que é `references auth.users(id)`?** É uma **chave estrangeira** (FK) — significa que o `id` do perfil deve existir na tabela de autenticação do Supabase. É como dizer: "esse perfil pertence a um usuário que existe no sistema de login".
>
> **O que é `on delete cascade`?** Se o usuário for deletado da autenticação, o perfil também é deletado automaticamente.

### 4.2. Tabela `posts`

```sql
-- Posts dos usuários com suporte a soft-delete
create table if not exists public.posts (
  id         uuid        not null default gen_random_uuid(),
  user_id    uuid        not null references public.profiles(id) on delete cascade,
  content    text        not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz          default null,

  constraint posts_pkey primary key (id),
  constraint posts_content_not_empty check (char_length(trim(content)) > 0)
);

-- Índice para buscar posts de um usuário (tela de perfil)
create index if not exists posts_user_id_idx on public.posts (user_id);

-- Índice para o feed: posts não deletados, ordenados por data
create index if not exists posts_feed_idx
  on public.posts (created_at desc) where deleted_at is null;
```

**Conceitos importantes:**

| Conceito | Explicação |
|----------|------------|
| `gen_random_uuid()` | Gera um ID único automaticamente ao criar um post |
| `deleted_at` | **Soft-delete** — em vez de deletar o registro, marca a data de exclusão. O dado ainda existe no banco, mas fica "invisível" |
| `check (char_length(...) > 0)` | **Constraint** — regra que impede posts com conteúdo vazio |
| `create index` | **Índice** — acelera buscas (como um índice de livro) |

> **O que é Soft-Delete?** Em vez de usar `DELETE FROM posts WHERE id = ...` (que apaga permanentemente), marcamos `deleted_at = now()`. Assim podemos recuperar o post se necessário. É como mover para a lixeira em vez de apagar definitivamente.

### 4.3. Tabela `post_likes`

```sql
-- Curtidas dos usuários em posts (relação N:N)
create table if not exists public.post_likes (
  user_id    uuid        not null references public.profiles(id) on delete cascade,
  post_id    uuid        not null references public.posts(id)    on delete cascade,
  created_at timestamptz not null default now(),

  constraint post_likes_pkey primary key (user_id, post_id)
);

-- Índice reverso para contar likes de um post rapidamente
create index if not exists post_likes_post_id_idx on public.post_likes (post_id);
```

> **Chave primária composta:** `primary key (user_id, post_id)` significa que a combinação de usuário + post deve ser **única**. Ou seja, um usuário não pode curtir o mesmo post duas vezes — a base de dados garante isso automaticamente!

---

## 5. Triggers (Gatilhos Automáticos)

### 5.1. Atualizar `updated_at` automaticamente

```sql
create or replace function public.handle_updated_at()
returns trigger language plpgsql security definer as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Aplica em profiles
create or replace trigger on_profiles_updated
  before update on public.profiles
  for each row execute function public.handle_updated_at();

-- Aplica em posts
create or replace trigger on_posts_updated
  before update on public.posts
  for each row execute function public.handle_updated_at();
```

> **O que é um Trigger?** É uma **função automática** que roda quando algo acontece no banco. Neste caso, toda vez que um perfil ou post é atualizado, o campo `updated_at` é preenchido automaticamente com a data/hora atual.
>
> **Comparação:** É como um `addEventListener` no JavaScript — "quando acontecer X, faça Y".

### 5.2. Criar perfil automaticamente ao registrar

```sql
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, name, username, avatar_url, bio)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', ''),
    coalesce(new.raw_user_meta_data ->> 'username', ''),
    coalesce(
      new.raw_user_meta_data ->> 'avatar_url',
      'https://ui-avatars.com/api/?name=' || coalesce(new.raw_user_meta_data ->> 'name', 'U') || '&background=random'
    ),
    ''
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
```

> **O que esse trigger faz?** Quando um novo usuário se registra (`auth.users`), ele automaticamente cria um perfil na tabela `profiles`. Isso garante que todo usuário autenticado tenha um perfil público.

---

## 6. Row Level Security (RLS) — Segurança no Banco

O **RLS** é como um **middleware de autorização** que roda no nível do banco de dados:

```sql
-- Ativar RLS nas tabelas
alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.post_likes enable row level security;
```

### Políticas de segurança:

```sql
-- Qualquer usuário autenticado pode VER perfis
create policy "Perfis são visíveis para usuários autenticados"
  on public.profiles for select to authenticated using (true);

-- Usuários só podem ATUALIZAR o próprio perfil
create policy "Usuários podem atualizar o próprio perfil"
  on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

-- Usuários podem CRIAR seus próprios posts
create policy "Usuários podem criar seus próprios posts"
  on public.posts for insert to authenticated
  with check (user_id = auth.uid());

-- Qualquer autenticado pode VER posts (não deletados)
create policy "Posts visíveis para todos os autenticados"
  on public.posts for select to authenticated
  using (deleted_at is null);
```

> **O que é `auth.uid()`?** Retorna o ID do usuário logado. Assim, `user_id = auth.uid()` significa "apenas se o registro pertencer ao usuário logado".
>
> **Comparação com backend tradicional:** Em uma API Express/Node.js, você escreveria um middleware como `if (req.user.id !== post.userId) return res.status(403)`. Com RLS, essa verificação é feita **automaticamente pelo banco**.

### Tabela resumo de permissões:

| Tabela | SELECT (ler) | INSERT (criar) | UPDATE (editar) | DELETE (apagar) |
|--------|:---:|:---:|:---:|:---:|
| **profiles** | ✅ Todos podem ver | ✅ Só o próprio | ✅ Só o próprio | ❌ |
| **posts** | ✅ Todos (não deletados) | ✅ Só os seus | ✅ Só os seus | ✅ Só os seus |
| **post_likes** | ✅ Todos podem ver | ✅ Só as suas | ❌ | ✅ Só as suas |

---

## 7. Conectando o App ao Supabase

### 7.1. Variáveis de ambiente — `.env`

Crie o arquivo `.env` na raiz do projeto:

```env
EXPO_PUBLIC_SUPABASE_URL=https://SEU_PROJETO.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_aqui
```

> **Por que `EXPO_PUBLIC_`?** No Expo, variáveis de ambiente que começam com `EXPO_PUBLIC_` ficam acessíveis no código do app. É como o `REACT_APP_` ou `NEXT_PUBLIC_` nos projetos web.
>
> **Importante:** Adicione `.env` ao `.gitignore` para não subir suas chaves para o GitHub!

### 7.2. Cliente Supabase — `lib/supabase.ts`

```typescript
import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

// Adaptador para armazenar tokens de forma segura no celular
const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    SecureStore.deleteItemAsync(key);
  },
};

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,  // Salva tokens com criptografia
    autoRefreshToken: true,           // Renova o token automaticamente
    persistSession: true,             // Mantém a sessão ao fechar o app
    detectSessionInUrl: false,        // Desliga pois não é web
  },
});
```

**Entendendo cada parte:**

| Código | O que faz |
|--------|-----------|
| `react-native-url-polyfill` | Corrige a API URL do React Native para funcionar com Supabase |
| `SecureStore` | Armazena tokens de autenticação com **criptografia** no dispositivo |
| `createClient()` | Cria a conexão com o Supabase |
| `autoRefreshToken` | Quando o token expira, renova automaticamente |
| `persistSession` | Ao fechar e abrir o app, o usuário continua logado |

> **Comparação:** `SecureStore` é como o `localStorage` do navegador, mas com **criptografia nativa** do dispositivo. É muito mais seguro para armazenar tokens.

---

## 8. Exercício Prático

1. Crie o projeto no Supabase
2. Execute o script SQL completo no SQL Editor
3. Verifique que as 3 tabelas foram criadas em **Table Editor**
4. Crie o arquivo `.env` com suas credenciais
5. Crie o arquivo `lib/supabase.ts` com o cliente
6. Teste a conexão adicionando temporariamente no seu `app/index.tsx`:
   ```tsx
   import { supabase } from '@/lib/supabase';
   console.log('Supabase conectado:', supabase.supabaseUrl);
   ```

---

## 📝 Resumo dos Conceitos

| Conceito | O que aprendemos |
|----------|-----------------|
| **Supabase** | Backend completo na nuvem (BaaS) |
| **PostgreSQL** | Banco de dados relacional (SQL) |
| **UUID** | Identificador único universal |
| **FK (Foreign Key)** | Chave estrangeira (relacionamento entre tabelas) |
| **Soft-Delete** | Marcar como deletado em vez de apagar |
| **Trigger** | Função automática no banco |
| **RLS** | Segurança no nível do banco (quem pode fazer o quê) |
| **SecureStore** | Armazenamento seguro (criptografado) no dispositivo |
| **Variáveis de ambiente** | Credenciais fora do código fonte |

---

## ✅ Checklist da Aula

- [ ] Projeto criado no Supabase
- [ ] Tabelas criadas (profiles, posts, post_likes)
- [ ] Triggers configurados
- [ ] RLS ativado com políticas
- [ ] Arquivo `.env` criado
- [ ] Cliente Supabase (`lib/supabase.ts`) configurado
- [ ] Conexão testada com sucesso