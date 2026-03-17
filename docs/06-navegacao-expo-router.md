# Aula 04 — Navegação com Expo Router

## 🎯 Objetivo da Aula
Entender como funciona a navegação em aplicativos mobile usando Expo Router (file-based routing), implementando navegação por Stack, Tabs e Modais.

---

## 1. O que é Navegação em Apps Mobile?

Em um site web, a navegação é feita por **URLs** (`/home`, `/about`, `/login`). Em um app mobile, não temos URLs visíveis, mas o conceito é parecido — cada tela é uma "página".

> **Comparação:** O Expo Router funciona como o **Next.js** — a estrutura de pastas dentro de `app/` define automaticamente as rotas do app. É o que chamamos de **file-based routing** (roteamento baseado em arquivos).

---

## 2. Tipos de Navegação

| Tipo | Descrição | Visualização |
|------|-----------|-------------|
| **Stack** | Telas empilhadas (uma sobre a outra) | Como uma pilha de cartas — vai e volta |
| **Tabs** | Barra de abas na parte inferior | Como o Instagram (Feed, Buscar, Perfil) |
| **Modal** | Tela que aparece por cima (slide de baixo pra cima) | Como o "Criar post" do Twitter/X |

> **Comparação Web:**
> - **Stack** = navegação normal entre páginas (`/login` → `/home`)
> - **Tabs** = barra de navegação fixa na parte inferior
> - **Modal** = popup ou dialog que aparece sobre a tela

---

## 3. Estrutura de Pastas = Rotas

No Expo Router, **cada arquivo na pasta `app/` vira uma tela**:

```
app/
├── _layout.tsx           → Layout raiz (envolve TUDO)
├── index.tsx             → Tela "/" (ponto de entrada)
├── new-post.tsx          → Tela "/new-post" (modal)
├── (auth)/               → Grupo de autenticação
│   ├── _layout.tsx       → Layout do grupo auth
│   ├── login.tsx         → Tela "/login"
│   └── register.tsx      → Tela "/register"
└── (tabs)/               → Grupo de tabs
    ├── _layout.tsx       → Layout das tabs
    ├── index.tsx         → Tab "Feed" (tela principal)
    ├── new-post-placeholder.tsx → Placeholder para o botão "+"
    └── profile.tsx       → Tab "Perfil"
```

### Regras importantes:

| Arquivo/Pasta | Função |
|---------------|--------|
| `index.tsx` | Tela padrão de uma pasta (como `index.html`) |
| `_layout.tsx` | Layout que **envolve** todas as telas da mesma pasta |
| `(nome)/` | **Grupo de rotas** — os parênteses indicam que o nome NÃO aparece na URL |
| `arquivo.tsx` | Cada arquivo é uma tela acessível |

> **Exemplo:** O arquivo `app/(auth)/login.tsx` gera a rota `/(auth)/login`. Mas como `(auth)` tem parênteses, ele é um **grupo** — serve para organizar, não adiciona nada na URL.

---

## 4. Layouts (`_layout.tsx`)

O `_layout.tsx` é um arquivo especial que define **como as telas são apresentadas**. É como um "frame" que envolve as telas.

### 4.1. Layout Raiz — `app/_layout.tsx`

```tsx
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import "../global.css";

import { AuthProvider } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="new-post"
            options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}
```

**Entendendo cada parte:**

| Código | O que faz |
|--------|-----------|
| `<AuthProvider>` | Provê autenticação para todo o app (Context API) |
| `<ThemeProvider>` | Aplica tema claro/escuro |
| `<Stack>` | Define que a navegação principal é por **pilha** (empilhamento de telas) |
| `headerShown: false` | Esconde o cabeçalho padrão do React Navigation |
| `presentation: 'modal'` | A tela `new-post` abre como **modal** (por cima) |
| `animation: 'slide_from_bottom'` | O modal desliza de baixo para cima |
| `<StatusBar>` | Configura a barra de status do celular |

> **Comparação Web:** O layout raiz é como o `_app.tsx` do Next.js ou o `App.tsx` do React — onde colocamos providers e configurações globais.

### 4.2. Layout de Autenticação — `app/(auth)/_layout.tsx`

```tsx
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}
```

> Simples: é um Stack (pilha) com duas telas — login e cadastro. Sem cabeçalho.

### 4.3. Layout de Tabs — `app/(tabs)/_layout.tsx`

```tsx
import { Tabs, useRouter } from 'expo-router';
import { Home, Plus, User } from 'lucide-react-native';
import { View } from 'react-native';

export default function TabLayout() {
  const router = useRouter();

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Feed',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="new-post-placeholder"
        options={{
          title: '',
          tabBarIcon: () => (
            <View className="w-12 h-12 rounded-full bg-blue-500 items-center justify-center -mt-4 shadow-lg">
              <Plus size={28} color="#fff" strokeWidth={2.5} />
            </View>
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.push('/new-post');
          },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
```

**Entendendo cada parte:**

| Código | O que faz |
|--------|-----------|
| `<Tabs>` | Cria a navegação com barra inferior |
| `tabBarIcon` | Ícone que aparece na tab |
| `title` | Texto abaixo do ícone |
| `listeners → tabPress` | Intercepta o toque na tab do "+" |
| `e.preventDefault()` | Impede a navegação padrão |
| `router.push('/new-post')` | Navega para o modal de novo post |

> **Técnica interessante:** O botão "+" na barra de tabs não é uma tela real — é um **placeholder** que intercepta o toque e abre um **modal** em vez de navegar para uma tab.

---

## 5. Navegação entre Telas

### 5.1. Usando `useRouter()` (programático)

```tsx
import { useRouter } from 'expo-router';

export default function MinhaTelaScreen() {
  const router = useRouter();

  const irParaFeed = () => {
    router.push('/(tabs)');       // Adiciona na pilha (pode voltar)
    router.replace('/(tabs)');    // Substitui a tela atual (não pode voltar)
    router.back();                // Volta para a tela anterior
  };
}
```

| Método | O que faz | Quando usar |
|--------|-----------|-------------|
| `router.push()` | Navega para uma tela (adiciona na pilha) | Navegação normal |
| `router.replace()` | Substitui a tela atual | Após login (não quer que volte pra login) |
| `router.back()` | Volta para a tela anterior | Botão de voltar |

### 5.2. Usando `<Link>` (declarativo)

```tsx
import { Link } from 'expo-router';
import { TouchableOpacity, Text } from 'react-native';

<Link href="/register" asChild>
  <TouchableOpacity>
    <Text className="text-blue-500">Não tem conta? Cadastre-se</Text>
  </TouchableOpacity>
</Link>
```

> **Comparação Web:** `<Link>` do Expo Router é como o `<Link>` do Next.js ou do React Router. O `asChild` faz com que o componente filho receba as propriedades do Link.

### 5.3. Usando `<Redirect>` (redirecionamento automático)

```tsx
import { Redirect } from 'expo-router';

export default function Index() {
  const { session, loading } = useAuth();

  if (loading) return <ActivityIndicator />;
  if (session) return <Redirect href="/(tabs)" />;
  return <Redirect href="/(auth)/login" />;
}
```

> O `<Redirect>` navega automaticamente quando renderizado — é como um redirecionamento no servidor web.

---

## 6. O Conceito de Placeholder para o Botão "+"

Quando usamos `<Tabs>`, cada aba precisa de um arquivo correspondente. Mas o botão "+" não é uma tela real, então criamos um **placeholder**:

```tsx
// app/(tabs)/new-post-placeholder.tsx
import { Redirect } from 'expo-router';

// Placeholder: se alguém acessar diretamente, redireciona para o Feed
export default function NewPostPlaceholder() {
  return <Redirect href="/(tabs)" />;
}
```

E no layout das tabs, interceptamos o toque:

```tsx
listeners={{
  tabPress: (e) => {
    e.preventDefault();          // Bloqueia a navegação para o placeholder
    router.push('/new-post');    // Abre o modal de novo post
  },
}}
```

> **Analogia:** É como ter um botão num formulário web que, em vez de submeter, abre um modal JavaScript.

---

## 7. SafeAreaView — Respeitando as áreas seguras

Celulares modernos têm **notch** (entalhe da câmera) e **barra inferior**. O `SafeAreaView` garante que o conteúdo não fique escondido:

```tsx
import { SafeAreaView } from 'react-native-safe-area-context';

<SafeAreaView className="flex-1 bg-white">
  {/* Conteúdo seguro aqui */}
</SafeAreaView>
```

> **Comparação Web:** É como usar `padding-top: env(safe-area-inset-top)` no CSS para iPhones com notch.

---

## 8. Exercício Prático

1. Crie o layout raiz (`app/_layout.tsx`) com `Stack`
2. Crie o grupo `(auth)` com layout Stack e telas login/register vazias
3. Crie o grupo `(tabs)` com layout Tabs e telas feed/profile vazias
4. Adicione ícones do `lucide-react-native` nas tabs
5. Crie o placeholder do botão "+" e o modal `new-post.tsx`
6. Teste a navegação: `router.push()`, `router.replace()`, `<Link>` e `<Redirect>`

---

## 📝 Resumo dos Conceitos

| Conceito | O que aprendemos |
|----------|-----------------|
| **File-based routing** | Estrutura de pastas = rotas do app |
| **_layout.tsx** | Layout que envolve as telas da pasta |
| **Grupos `(nome)`** | Organização sem afetar a rota |
| **Stack** | Navegação por empilhamento |
| **Tabs** | Barra de abas inferior |
| **Modal** | Tela que abre por cima |
| **router.push/replace/back** | Navegação programática |
| **`<Link>` e `<Redirect>`** | Navegação declarativa |
| **SafeAreaView** | Respeita notch e barra inferior |

---

## ✅ Checklist da Aula

- [ ] Layout raiz criado com Stack e providers
- [ ] Grupo `(auth)` criado com login e register
- [ ] Grupo `(tabs)` criado com Feed e Perfil
- [ ] Botão "+" na tab bar abrindo modal
- [ ] Navegação entre telas funcionando
- [ ] SafeAreaView aplicado nas telas