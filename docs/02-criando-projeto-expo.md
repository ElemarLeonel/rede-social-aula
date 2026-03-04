# Aula 02 — Criando o Projeto com Expo

## 🎯 Objetivo da Aula
Criar o projeto React Native com Expo, entender a estrutura de pastas gerada e fazer as primeiras alterações.

---

## 1. Criando o Projeto

Abra o terminal na pasta onde deseja criar o projeto e execute:

```bash
npx create-expo-app@latest rede-social-mobile --template blank-typescript
```

> **O que acontece aqui?**
> - `npx` — executa um pacote npm sem precisar instalar globalmente
> - `create-expo-app` — script que cria um projeto Expo pré-configurado
> - `rede-social-mobile` — nome da pasta do projeto
> - `--template blank-typescript` — Cria um projeto em branco com Typescript.

> **Comparação com Web:** É como rodar `npx create-react-app meu-app` ou `npm create vite@latest meu-app` para criar um projeto React para web.

Após a criação, entre na pasta:

```bash
cd rede-social-mobile
```

---

## 2. Rodando o Projeto pela Primeira Vez

```bash
npx expo start
```

Isso abre o **Metro Bundler** — o servidor de desenvolvimento.

> **Comparação:** O Metro é como o **Webpack** ou **Vite** no mundo web — ele empacota todo o código JavaScript e envia para o celular/emulador.

### Para testar:
- **No celular:** Abra o Expo Go e escaneie o QR Code
- **No emulador Android:** Pressione `a` no terminal
- **No navegador:** Pressione `w` no terminal

---

## 3. Entendendo a Estrutura de Pastas

Após a criação, o projeto tem esta estrutura (simplificada):

```
rede-social-mobile/
├── app/                    ← Telas do app (cada arquivo = uma tela)
│   ├── _layout.tsx         ← Layout principal (envolve todas as telas)
│   └── index.tsx           ← Tela inicial
├── assets/                 ← Imagens, fontes, etc.
├── components/             ← Componentes reutilizáveis
├── constants/              ← Valores fixos (cores, temas)
├── hooks/                  ← Custom Hooks
├── app.json                ← Configuração do Expo
├── package.json            ← Dependências e scripts
└── tsconfig.json           ← Configuração do TypeScript
```

### O que é cada pasta?

| Pasta/Arquivo | Função | Comparação Web |
|---------------|--------|----------------|
| `app/` | Contém as telas (rotas) | Pasta `pages/` no Next.js |
| `_layout.tsx` | Layout que envolve as telas | `Layout` no Next.js, `App.tsx` no React |
| `components/` | Componentes reutilizáveis | Mesma coisa no React web |
| `constants/` | Valores constantes | Variáveis CSS, config files |
| `hooks/` | Custom Hooks | Mesma coisa no React web |
| `app.json` | Configurações do app (nome, ícone, splash) | `manifest.json` no PWA |
| `package.json` | Lista de dependências | Mesma coisa em qualquer projeto Node |
| `tsconfig.json` | Configuração do TypeScript | Mesma coisa no React web |

---

## 4. Entendendo o arquivo `app.json`

O `app.json` contém as configurações do app mobile:

```json
{
  "expo": {
    "name": "rede-social-mobile",
    "slug": "rede-social-mobile",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "redesocial",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "backgroundColor": "#E6F4FE",
        "foregroundImage": "./assets/images/android-icon-foreground.png"
      }
    },
    "plugins": [
      "expo-router",
      "expo-splash-screen",
      "expo-secure-store"
    ]
  }
}
```

| Campo | O que faz |
|-------|-----------|
| `name` | Nome do app que aparece no celular |
| `orientation` | Orientação da tela (`portrait` = apenas vertical) |
| `icon` | Ícone do app |
| `scheme` | URL scheme para deep linking |
| `userInterfaceStyle` | `"automatic"` = respeita modo claro/escuro do sistema |
| `plugins` | Plugins do Expo que o app utiliza |

---

## 5. Entendendo o TypeScript

O projeto usa **TypeScript** em vez de JavaScript puro. A diferença principal é a **tipagem**:

```typescript
// JavaScript puro
function soma(a, b) {
  return a + b;
}
soma("hello", 5); // Funciona, mas retorna "hello5" (bug!)

// TypeScript
function soma(a: number, b: number): number {
  return a + b;
}
soma("hello", 5); // ❌ ERRO! TypeScript avisa antes de rodar
```

> **Comparação:** TypeScript é para JavaScript o que **Java** é para uma linguagem dinâmica — adiciona tipagem que ajuda a **prevenir bugs** durante o desenvolvimento.

### Diferenças no arquivo:
- `.ts` — arquivo TypeScript puro (sem JSX)
- `.tsx` — arquivo TypeScript com JSX (componentes React)

---

## 6. Entendendo os Componentes do React Native

No React Native, **não usamos HTML**. Em vez disso, temos componentes nativos:

| HTML (Web) | React Native | Função |
|------------|-------------|--------|
| `<div>` | `<View>` | Container/agrupador |
| `<p>`, `<span>`, `<h1>` | `<Text>` | Texto (obrigatório para qualquer texto!) |
| `<img>` | `<Image>` | Imagem |
| `<input>` | `<TextInput>` | Campo de texto |
| `<button>` | `<TouchableOpacity>` ou `<Pressable>` | Botão tocável |
| `<ul>` + `<li>` | `<FlatList>` | Lista com scroll otimizado |
| `<div style="...">` | `<ScrollView>` | Área com scroll |

### Exemplo prático:

```tsx
// Web (React)
<div>
  <h1>Olá Mundo</h1>
  <p>Bem-vindo ao meu app</p>
  <button onClick={handleClick}>Clique aqui</button>
</div>

// Mobile (React Native)
<View>
  <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Olá Mundo</Text>
  <Text>Bem-vindo ao meu app</Text>
  <Pressable onPress={handlePress}>
    <Text>Clique aqui</Text>
  </Pressable>
</View>
```

> **Regra importante:** No React Native, todo texto **DEVE** estar dentro de um `<Text>`. Se você colocar texto direto numa `<View>`, vai dar erro!

---

## 7. Criando a Estrutura de Pastas do Projeto

Vamos criar as pastas que usaremos ao longo do curso:

```bash
# Na raiz do projeto, crie as pastas
mkdir contexts
mkdir lib
mkdir supabase
mkdir supabase/migrations
```

| Pasta | Para que serve |
|-------|---------------|
| `contexts/` | Guardar os Contexts do React (estado global) |
| `lib/` | Funções de conexão com o Supabase e lógica de dados |
| `supabase/migrations/` | Scripts SQL do banco de dados |

---

## 8. Instalando as Dependências do Projeto

Vamos instalar todas as bibliotecas que precisaremos:

```bash
# Supabase (backend)
npx expo install @supabase/supabase-js expo-secure-store react-native-url-polyfill

# Navegação
npx expo install expo-router @react-navigation/native @react-navigation/bottom-tabs @react-navigation/elements react-native-screens react-native-safe-area-context react-native-gesture-handler

# Estilização (NativeWind / Tailwind)
npx expo install nativewind tailwindcss

# Ícones
npx expo install lucide-react-native react-native-svg

# Animações
npx expo install react-native-reanimated
```

Caso algum comando acima não execute da forma esperada, crie um arquivo na raiz do projeto com o nome `.npmrc` e configure o seguinte parâmetro:

```bash
legacy-peer-deps=true
```

Dessa forma, todos os próximos comandos que usem o NPM (incluindo o `npx expo install`) sempre ignorarão os conflitos de peer dependencies automaticamente, então não precisará ficar lembrando de passar as flags.

> **Por que `npx expo install` e não `npm install`?**
>
> O `npx expo install` garante que a versão da biblioteca seja **compatível** com a versão do Expo que estamos usando. É como um `npm install` mais inteligente.

---

## 9. Exercício Prático

1. Crie o projeto com `npx create-expo-app@latest rede-social-mobile`
2. Rode com `npx expo start`
3. Abra no celular ou emulador
4. Modifique o texto na tela `app/index.tsx` e veja a atualização ao vivo
5. Experimente trocar `<Text>` por `<View>` e observe o erro
6. Instale todas as dependências listadas na seção 8

---

## 📝 Resumo dos Conceitos

| Conceito | O que aprendemos |
|----------|-----------------|
| `npx create-expo-app` | Cria o projeto automaticamente |
| Metro Bundler | Servidor de desenvolvimento que envia código para o app |
| `app/` | Pasta de telas (file-based routing) |
| `_layout.tsx` | Layout que envolve as telas |
| TypeScript | JavaScript com tipos (previne bugs) |
| Componentes nativos | `View`, `Text`, `Image` em vez de HTML |

---

## ✅ Checklist da Aula

- [ ] Projeto criado com `create-expo-app`
- [ ] Projeto rodando no celular ou emulador
- [ ] Entendeu a estrutura de pastas
- [ ] Entendeu a diferença entre HTML e componentes nativos
- [ ] Pastas extras criadas (`contexts`, `lib`, `supabase`)
- [ ] Dependências instaladas