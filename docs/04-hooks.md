# Módulo 4: Hooks no React Native (e Expo)

Neste módulo, vamos entender o conceito de **Hooks**, uma das ferramentas geniais e fundamentais no desenvolvimento moderno com React e React Native.

## O que são Hooks?

Hooks ("ganchos", em português) são funções especiais do React que permitem "pescar" ou "conectar-se" a recursos nativos da biblioteca, como o estado (`state`) e o ciclo de vida dos componentes, sem precisar criar e usar classes. Eles foram introduzidos na versão 16.8 do React.

Antes da existência dos Hooks, se você escrevesse um componente funcional (uma documentação de função simples) e logo percebesse que precisava adicionar algum "estado" a ele, você teria que convertê-lo para o modelo de Classes, resultando num código muito mais extenso. Agora, você pode usar um Hook dentro da sua função e adicionar recursos internos do React facilmente.

Por convenção, todos os Hooks construídos começam com a palavra **use** (por exemplo: `useState`, `useEffect`, `useContext`, etc).

## Para que são utilizados?

Hooks são utilizados para diversos propósitos fundamentais:

- **Gerenciar Estado em Componentes Funcionais:** O `useState` permite armazenar variáveis que impactam e disparam a re-renderização da interface.
- **Lidar com Efeitos Colaterais:** O `useEffect` é usado para executar código em diferentes etapas durante o ciclo de vida do seu componente. Ex: montar e renderizar algo na tela, quando alguma dependência é alterada, ou quando o componente é desmontado e retirado da tela (utilizado para: buscar dados em uma API, assinar eventos, etc).
- **Reutilizar Lógica de Estado:** Hooks customizados (Custom Hooks) permitem isolar e extrair lógicas de um determinado componente para serem compartilhadas e reaproveitadas em inúmeras partes da aplicação sem a necessidade de duplicar o código.
- **Acessar Contextos Globais:** O `useContext` permite que um componente consuma informações de um contexto global (como o tema do app, informações de um usuário autenticado, carrinho de compras) de maneira simples, em vez de ter que passar "propriedades" (props) à mão de nível em nível.

## Quando devem ser implementados dentro de um projeto?

Você deve utilizar ou criar Hooks nas seguintes situações:

1. **Precisar de estado ou ciclo de vida no modo visual.** A partir do momento que uma variável muda e isso tem que ser refletido na tela da UI para o usuário, ou se você precisar rodar algum código logo no primeiro segundo que a tela for exibida.
2. **Reduzir e evitar duplicação de lógica.** Se você percebe que mais de um componente utilizam lógicas muito parecidas de controle (como controlar a digitação de formulários, chamadas repetidas de API para puxar mesma informação, gerenciamento de autorizações), essa lógica central deve virar um **Custom Hook**.
3. **Mudar informações centrais da aplicação.** Sempre que lidar com mudança de cores (modo escuro/claro) e persistência de dados do usuário ao navegar por telas distintas (onde muitos arquivos compartilham essa informação), a criação de hooks simplifica e facilita o controle destas variáveis.

## Exemplo Prático: `useThemeColor`

Ao iniciarmos um projeto, o Expo e várias bibliotecas podem criar pequenos hooks utilitários por padrão. No nosso projeto, se olharmos a nossa pasta `hooks`, temos no momento o utilitário personalizado `use-theme-color.ts`.

Este é um excelente exemplo de um **Custom Hook** (Hook Personalizado) prático criado para injetar ou retornar cores corretas dependendo de qual é o tema atual que o usuário escolheu em seu telefone.

### Código do Hook `useThemeColor`

```tsx
// 📌 importações necessárias
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark,
) {
  // 1. Obtém qual é o esquema de cores ativo do dispositivo do usuário (ex: 'light' ou 'dark')
  const theme = useColorScheme() ?? "light";

  // 2. Extrai qual deve ser a cor do dispositivo partindo do parâmetro recebido
  const colorFromProps = props[theme];

  if (colorFromProps) {
    // 3. Se a cor do parâmetro existe para o tema atual, retorna essa cor específica que o desenvolvedor escolheu manual
    return colorFromProps;
  } else {
    // 4. Se não existir, ele vai acessar automaticamente nossa paleta padrão (`constants/theme.ts`) e buscar a cor certa para aquele modo
    return Colors[theme][colorName];
  }
}
```

### O que este Custom Hook faz e como ele facilita o nosso projeto?

1. **Reaproveitamento Integrado (`useColorScheme`):** Observe como ele chama internamente o hook base do Expo que "rastreia" ativamente em que cor seu sistema Android ou iOS está. Quando o modo de cor do celular for trocado para escuro (dark mode), esse hook será informado na mesma hora e atualizado.
2. **Isola Lógica Condicional e "Ifs":** Esse Hook encapsulou uma necessidade repetitiva da aplicação: "se estiver claro traga a cor clara, se estiver escuro pegue a cor escura". Se você escrevesse essa simples condição toda vez em todo componente do aplicativo (`if (theme === 'dark') { cor } else { cor2 }`), seu código ficaria imenso.
3. **Manutenção em Camadas:** Se um dia formos implementar novos estilos no aplicativo (ex: tema daltônico), você muda apenas no Custom Hook de Cores, e instantaneamente tudo é atualizado em centenas de arquivos da aplicação.

Desta maneira, os Hooks nos ajudam na arquitetura das aplicações, promovendo um código escalável, compreensível, fácil de testar, e extremamente profissional de se trabalhar.
