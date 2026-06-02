# Aula 06 — Autenticação com Supabase

## 🎯 Objetivo da Aula
Implementar autenticação completa (login, cadastro e logout) usando Supabase Auth, Context API do React e proteção de rotas.

---

## 1. O que é Autenticação?

**Autenticação** é o processo de verificar "quem é o usuário". No nosso app:

1. O usuário **se cadastra** com email e senha
2. O Supabase cria um registro na tabela `auth.users`
3. O usuário recebe um **token JWT** (como um "crachá digital")
4. A cada requisição, o token é enviado para provar que está logado
5. O Supabase verifica o token e permite/nega o acesso

> **Comparação:** É como entrar em um prédio com crachá. Primeiro você se registra na portaria (cadastro), recebe um crachá (token), e a cada andar que entra, mostra o crachá (autenticação).
>
> **O que é JWT?** JSON Web Token — é uma string codificada que contém informações do usuário (ID, email, data de expiração). É o padrão mais usado em APIs modernas.

---

## 2. Context API — Estado Global

### O que é e por que precisamos?

A autenticação precisa ser **acessível de qualquer tela** do app. Se o usuário está logado no Feed, a tela de Perfil também precisa saber disso.

> **Comparação com props:**
> - **Sem Context:** Você teria que passar os dados de `_layout.tsx` → `tabs` → `feed` → cada componente (prop drilling)
> - **Com Context:** Qualquer componente acessa os dados diretamente, sem precisar passar props

```
SEM Context (prop drilling):              COM Context:
┌─ App                                    ┌─ App
│  └─ Layout (user={user})                │  └─ AuthProvider ← dados ficam aqui
│     └─ Tabs (user={user})               │     └─ Layout
│        └─ Feed (user={user})            │        └─ Tabs
│           └─ PostCard (user={user})     │           └─ Feed ← usa useAuth()
│                                         │              └─ PostCard ← usa useAuth()
```

### Como funciona:

1. **Criar o Context** — define os dados e funções disponíveis
2. **Criar o Provider** — componente que provê os dados para toda a árvore
3. **Usar o Hook** — `useAuth()` para acessar os dados de qualquer lugar

---

## 3. Implementando o AuthContext

### `contexts/AuthContext.tsx`

```tsx
import { supabase } from '@/lib/supabase';
import type { Session, User } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useState } from 'react';

// 1. Definir o TIPO dos dados disponíveis
type AuthContextType = {
  session: Session | null;   // Sessão do Supabase (contém o token)
  user: User | null;         // Dados do usuário logado
  loading: boolean;          // Se está carregando a sessão
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (
    email: string,
    password: string,
    profile?: { name: string; username: string }
  ) => Promise<{ error: Error | null; confirmEmail: boolean }>;
  signOut: () => Promise<void>;
};

// 2. Criar o Context com valor inicial undefined
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Criar o Provider (componente que envolve o app)
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Buscar sessão existente (caso o app foi fechado e aberto)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Ouvir mudanças no estado de autenticação (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    // Limpar o listener quando o componente desmontar
    return () => subscription.unsubscribe();
  }, []);

  // Função de LOGIN
  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error as Error | null };
  };

  // Função de CADASTRO
  const signUp = async (
    email: string,
    password: string,
    profile?: { name: string; username: string }
  ) => {
    const { data, error } = await supabase.auth.signUp({ email, password });

    const confirmEmail = !error && !!data.user && data.user.identities?.length === 0;

    // Criar perfil no banco se o cadastro deu certo
    if (!error && data.user && profile) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        name: profile.name,
        username: profile.username,
        avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=random`,
        bio: '',
      });
    }

    return { error: error as Error | null, confirmEmail };
  };

  // Função de LOGOUT
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // 4. Prover os dados para toda a árvore de componentes
  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        loading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// 5. Hook customizado para usar o Context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

### Entendendo os conceitos:

| Conceito | Explicação | Comparação |
|----------|------------|------------|
| `createContext()` | Cria o "canal" de comunicação global | Variável global, mas organizada |
| `Provider` | Componente que "publica" os dados | Servidor que envia dados |
| `useContext()` | Hook que "lê" os dados do Provider | Cliente que recebe dados |
| `useEffect()` | Roda código quando o componente monta | `window.onload` na web |
| `onAuthStateChange()` | Listener de mudanças na autenticação | `addEventListener` na web |
| `useState()` | Estado local do componente | Variável que re-renderiza ao mudar |

> **O que é `session?.user ?? null`?**
> - `?.` = **optional chaining** — se `session` for `null`, não dá erro
> - `??` = **nullish coalescing** — se for `null` ou `undefined`, usa o valor da direita (`null`)
>
> **Comparação:** Em Java seria `session != null ? session.getUser() : null`

---

## 4. Tela de Login

### `app/(auth)/login.tsx`

```tsx
import { useAuth } from '@/contexts/AuthContext';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();  // Pegar função signIn do Context

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // Validação simples
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      Alert.alert('Erro ao entrar', error.message);
    } else {
      router.replace('/(tabs)');  // Replace para não voltar ao login
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white justify-center items-center p-4">
      <Text className="text-2xl font-bold mb-8">Social App</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        className="w-full bg-gray-100 p-4 rounded-lg mb-4"
      />

      <TextInput
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        className="w-full bg-gray-100 p-4 rounded-lg mb-6"
      />

      <TouchableOpacity
        onPress={handleLogin}
        disabled={loading}
        className="w-full bg-blue-500 p-4 rounded-lg items-center mb-4"
        style={loading ? { opacity: 0.7 } : undefined}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-bold">Entrar</Text>
        )}
      </TouchableOpacity>

      <Link href="/register" asChild>
        <TouchableOpacity>
          <Text className="text-blue-500">Não tem conta? Cadastre-se</Text>
        </TouchableOpacity>
      </Link>
    </SafeAreaView>
  );
}
```

### Props importantes do TextInput:

| Prop | O que faz |
|------|-----------|
| `placeholder` | Texto placeholder (dica) |
| `value` / `onChangeText` | Controla o valor (controlled component) |
| `keyboardType="email-address"` | Mostra teclado com @ |
| `autoCapitalize="none"` | Não capitaliza automaticamente |
| `secureTextEntry` | Esconde o texto (campo de senha) |
| `autoCorrect={false}` | Desliga autocorreção |

> **O que é `router.replace()`?** Navega para outra tela, mas **remove a tela atual da pilha**. Assim, ao apertar "voltar", o usuário não volta para a tela de login.

---

## 5. Tela de Cadastro

### `app/(auth)/register.tsx`

```tsx
import { useAuth } from '@/contexts/AuthContext';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RegisterScreen() {
  const router = useRouter();
  const { signUp } = useAuth();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha email e senha.');
      return;
    }

    setLoading(true);
    const { error, confirmEmail } = await signUp(email, password, { name, username });
    setLoading(false);

    if (error) {
      Alert.alert('Erro ao cadastrar', error.message);
    } else if (confirmEmail) {
      Alert.alert(
        'Verifique seu email',
        'Enviamos um link de confirmação para o seu email.',
        [{ text: 'OK', onPress: () => router.replace('/(auth)/login') }]
      );
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white justify-center items-center p-4">
      <Text className="text-2xl font-bold mb-8">Criar Conta</Text>

      <TextInput
        placeholder="Nome completo"
        value={name}
        onChangeText={setName}
        className="w-full bg-gray-100 p-4 rounded-lg mb-4"
      />

      <TextInput
        placeholder="Nome de usuário"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        className="w-full bg-gray-100 p-4 rounded-lg mb-4"
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        className="w-full bg-gray-100 p-4 rounded-lg mb-4"
      />

      <TextInput
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        className="w-full bg-gray-100 p-4 rounded-lg mb-6"
      />

      <TouchableOpacity
        onPress={handleRegister}
        disabled={loading}
        className="w-full bg-blue-500 p-4 rounded-lg items-center mb-4"
        style={loading ? { opacity: 0.7 } : undefined}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-bold">Cadastrar</Text>
        )}
      </TouchableOpacity>

      <Link href="/login" asChild>
        <TouchableOpacity>
          <Text className="text-blue-500">Já tem conta? Entrar</Text>
        </TouchableOpacity>
      </Link>
    </SafeAreaView>
  );
}
```

---

## 6. Proteção de Rotas — Redirecionamento Automático

### `app/index.tsx`

```tsx
import { useAuth } from '@/contexts/AuthContext';
import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
  const { session, loading } = useAuth();

  // Enquanto verifica se tem sessão, mostra loading
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Se tem sessão (logado) → vai pro Feed
  if (session) {
    return <Redirect href="/(tabs)" />;
  }

  // Se não tem sessão → vai pro Login
  return <Redirect href="/(auth)/login" />;
}
```

**Fluxo de decisão:**

```
App inicia
   │
   ├─ Loading? → Mostra spinner ⏳
   │
   ├─ Tem sessão? → Redireciona pro Feed 📱
   │
   └─ Sem sessão? → Redireciona pro Login 🔐
```

> **Comparação Web:** No Next.js, faríamos isso com `middleware.ts` ou `getServerSideProps`. No React Router, usaríamos um componente `ProtectedRoute`. O conceito é o mesmo: **verificar se está logado antes de mostrar a tela**.

---

## 7. Usando o Provider no Layout

### `app/_layout.tsx`

```tsx
import { AuthProvider } from '@/contexts/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      {/* Tudo dentro do AuthProvider pode usar useAuth() */}
      <Stack>...</Stack>
    </AuthProvider>
  );
}
```

> O `AuthProvider` precisa envolver **todo o app** para que qualquer tela possa acessar os dados de autenticação com `useAuth()`.

---

## 8. Fluxos de Autenticação

### Fluxo de Login:
```
1. Usuário digita email e senha
2. App chama signIn(email, password)
3. Supabase verifica as credenciais
4. Se correto → retorna session com token JWT
5. AuthContext atualiza o estado (session)
6. App navega para /(tabs) com router.replace()
```

### Fluxo de Cadastro:
```
1. Usuário preenche nome, username, email e senha
2. App chama signUp(email, password, { name, username })
3. Supabase cria o usuário em auth.users
4. Trigger cria o perfil em public.profiles
5. App também faz upsert no profiles (com avatar)
6. App navega para /(tabs)
```

### Fluxo de Logout:
```
1. Usuário clica em "Sair"
2. App mostra Alert de confirmação
3. Se confirmar → chama signOut()
4. Supabase remove a sessão
5. AuthContext atualiza (session = null)
6. App redireciona para /(auth)/login
```

---

## 9. Exercício Prático

1. Crie o `contexts/AuthContext.tsx` com todas as funções
2. Envolva o app com `<AuthProvider>` no layout raiz
3. Crie a tela de login com campos de email e senha
4. Crie a tela de cadastro com campos adicionais (nome, username)
5. Implemente a proteção de rotas no `app/index.tsx`
6. Teste: cadastre um novo usuário e verifique no painel do Supabase
7. Teste: faça logout e verifique que redireciona para login

---

## 📝 Resumo dos Conceitos

| Conceito | O que aprendemos |
|----------|-----------------|
| **Autenticação** | Verificar identidade do usuário |
| **JWT** | Token que prova que o usuário está logado |
| **Context API** | Estado global acessível de qualquer componente |
| **Provider** | Componente que distribui dados |
| **useAuth()** | Hook customizado para acessar autenticação |
| **Proteção de rotas** | Redirecionar baseado no estado de login |
| **router.replace()** | Navegar sem poder voltar |
| **Alert.alert()** | Diálogo nativo do celular |

---

## ✅ Checklist da Aula

- [ ] AuthContext criado com signIn, signUp e signOut
- [ ] Provider envolvendo todo o app
- [ ] Tela de login funcional
- [ ] Tela de cadastro funcional
- [ ] Proteção de rotas implementada
- [ ] Testou cadastro + login + logout