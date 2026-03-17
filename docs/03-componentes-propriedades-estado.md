# 03 - Componentes, Propriedades e Estados (no React Native)

Antes de mergulhar na estilização com recursos como o NativeWind, é fundamental entender os blocos de construção de qualquer projeto em React ou React Native: **Componentes**, **Propriedades (Props)** e **Estados (State)**.

Este projeto já foi inicializado com alguns componentes embutidos que utilizam esses conceitos de forma prática. Vamos analisá-los para entender como eles se encaixam no desenvolvimento da nossa rede social.

---

## 1. Componentes (Components)

Componentes são trechos de código independentes e reutilizáveis. Eles funcionam da mesma forma que funções JavaScript, mas retornam código JSX (a sintaxe do React que parece HTML, mas é traduzida para os elementos nativos ou web). No nosso caso, usando React Native, retornamos elementos nativos, como `<View>`, `<Text>`, etc.

Neste projeto, podemos encontrar nossos próprios componentes nas pastas `components/` e `components/ui/`.

**Exemplo Prático: `HelloWave`**
Arquivo: `components/hello-wave.tsx`

```tsx
import Animated from "react-native-reanimated";

export function HelloWave() {
  return (
    <Animated.Text
      style={
        {
          /* estilos de animação... */
        }
      }
    >
      👋
    </Animated.Text>
  );
}
```

**O que acontece aqui?**

- `HelloWave` é um Componente Funcional.
- Ele encapsula toda a lógica (no caso, de animação) e a representação visual (o emoji tchauzinho).
- Em qualquer outro lugar do aplicativo, sempre que escrevermos `<HelloWave />`, o ícone aparecerá animado sem precisarmos reescrever a lógica.

---

## 2. Propriedades (Props)

As propriedades (ou "props") são a maneira como passamos dados ou configurações de um componente "Pai" para um componente "Filho". Pense nelas como os argumentos ou parâmetros que você passa para uma função. As props **são somente leitura** (imutáveis).

**Exemplo Prático: `ThemedText`**
Arquivo: `components/themed-text.tsx`

O componente `ThemedText` foi criado no nosso app para facilitar a criação de textos que se adaptem automaticamente ao tema claro e escuro.

```tsx
export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: ThemedTextProps) {
  // lógica interna para capturar a cor dependendo do tema do celular
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return (
    <Text
      style={[
        { color },
        type === "default" ? styles.default : undefined,
        type === "title" ? styles.title : undefined,
        style,
      ]}
      {...rest}
    />
  );
}
```

**Como as Props funcionam na prática aqui?**

- `type="title"` : Você diz a ele como deve ser seu comportamento hierárquico.
- `lightColor` e `darkColor` : Parametrização customizada injetada por quem estiver usando o componente.
- _Aplicação:_ Para usar no aplicativo `<ThemedText type="title">Bem Vindo!</ThemedText>`. O "Mundo" é passado internamente como `{children}` além de passar o `type`.

---

## 3. Estados (State)

Diferente das Props, que são injetadas no componente, o **Estado** (State) é interno ao componente e **pode mudar**. Quando um estado muda, o React avisa as engrenagens a atualizar, e o componente se "re-renderiza" exibindo a nova informação visual na tela do seu aplicativo.

Usamos a função `useState` do React para definir e manipular dados de estado na aplicação.

**Exemplo Prático: `Collapsible`**
Arquivo: `components/ui/collapsible.tsx`

Esse componente permite ocultar (colapsar) ou expandir conteúdos, algo extremamente comum em mobile.

```tsx
import { PropsWithChildren, useState } from "react";
/* outros imports */

export function Collapsible({
  children,
  title,
}: PropsWithChildren & { title: string }) {
  // 1. Definição do Estado
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ThemedView>
      <TouchableOpacity
        style={styles.heading}
        // 2. Mudando o Estado ao clicar
        onPress={() => setIsOpen((value) => !value)}
        activeOpacity={0.8}
      >
        {/* Usando os Componentes (exemplo de reaproveitamento) */}
        <IconSymbol
          name="chevron.right"
          /* 3. Reação Visual: o ícone gira dependendo do estado */
          style={{ transform: [{ rotate: isOpen ? "90deg" : "0deg" }] }}
        />

        <ThemedText type="defaultSemiBold">{title}</ThemedText>
      </TouchableOpacity>

      {/* 4. Renderização Condicional com base no Estado */}
      {isOpen && <ThemedView style={styles.content}>{children}</ThemedView>}
    </ThemedView>
  );
}
```

**Passo a passo do Estado neste exemplo:**

1. `const [isOpen, setIsOpen] = useState(false);`: Criamos o estado `isOpen` (se está aberto). Ele começa como `false` (fechado).
2. `onPress={() => setIsOpen((value) => !value)}`: O evento de apertar o botão dispara a atualização de estado para o inverso do que era. Se era _falso_ agora é _verdadeiro_.
3. **Reatividade:** Como o botão foi apertado e agora o `isOpen` é `true`, o React re-renderiza o componente `<Collapsible />`:
   - O ícone gira de `0deg` para `90deg` apontando para baixo.
   - O bloco condicional `{isOpen && <ThemedView>...}</ThemedView>}` agora desenha o conteúdo (`children`) que estava invisível dentro do app.

---

## Conclusão de Fundamentos UI

Nesta etapa, analisamos como nosso app estrutura UI usando **Componentes** modulares, os configura usando **Propriedades (Props)** de fora para dentro, e dá a eles vida/interatividade e dados com **Estados (States)** internos.

Com essa base sólida para trabalhar em pedaços injetáveis, no próximo material focaremos num dos detalhes listados acima que parecia um pouco complexo: "A forma clássica como as caixas estão tomando `style={styles}`". Vamos aprender como simplificar e acelerar radicalmente essa construção visual com **NativeWind** (Tailwind para React Native).

_(Prossiga com a leitura para o módulo de "Estilização com NativeWind")_