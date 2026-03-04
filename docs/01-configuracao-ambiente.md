# Aula 01 — Configuração do Ambiente de Desenvolvimento

## 🎯 Objetivo da Aula
Preparar todo o ambiente necessário para desenvolver aplicações mobile com React Native e Expo.

---

## 1. Instalando o Node.js

O **Node.js** é o motor que roda JavaScript fora do navegador. É a base de todo projeto React Native.

> **Comparação:** Assim como você precisa do **JDK** para rodar Java ou do **Python** para rodar scripts Python, você precisa do **Node.js** para rodar JavaScript no terminal.

### Passo a passo:
1. Acesse [https://nodejs.org](https://nodejs.org)
2. Baixe a versão **LTS** (Long Term Support) — é a versão estável
3. Instale seguindo o assistente (Next, Next, Finish)
4. Verifique a instalação abrindo o terminal:

```bash
node --version
# Esperado: v18.x.x ou superior

npm --version
# Esperado: 9.x.x ou superior
```

> **O que é o npm?** É o **gerenciador de pacotes** do Node.js — como o **pip** do Python ou o **Maven** do Java. Serve para instalar bibliotecas/dependências.

---

## 2. Instalando o VS Code

O **Visual Studio Code** é o editor de código mais popular para desenvolvimento web e mobile.

### Passo a passo:
1. Acesse [https://code.visualstudio.com](https://code.visualstudio.com)
2. Baixe e instale

### Extensões recomendadas:
| Extensão | Para que serve |
|----------|---------------|
| **ES7+ React/Redux/React-Native Snippets** | Atalhos para criar componentes rapidamente |
| **Tailwind CSS IntelliSense** | Autocomplete das classes Tailwind |
| **Prettier** | Formata o código automaticamente |
| **Error Lens** | Mostra erros diretamente no código |
| **TypeScript Hero** | Ajuda com imports no TypeScript |

---

## 3. Instalando o Expo CLI

O **Expo** é o framework que vamos usar para criar e rodar nosso projeto React Native.

> **Comparação:** O Expo é para React Native o que o `create-react-app` ou `Vite` é para projetos React web — ele configura tudo automaticamente.

```bash
# Instalar o Expo CLI globalmente
npm install -g expo-cli
```

> **Nota:** Com versões recentes do Expo, não é obrigatório instalar globalmente. Podemos usar `npx` para executar diretamente.

---

## 4. Configurando o Dispositivo de Teste

Você tem **duas opções** para testar o app:

### Opção A: Celular Físico (Recomendada para início)

1. Instale o app **Expo Go** no celular:
   - [Android (Google Play)](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - [iOS (App Store)](https://apps.apple.com/app/expo-go/id982107779)
2. Conecte o celular na **mesma rede Wi-Fi** do computador
3. Ao rodar o projeto, escaneie o QR Code que aparece no terminal

> **Importante:** Celular e computador devem estar na mesma rede Wi-Fi!

### Opção B: Emulador Android

1. Instale o [Android Studio](https://developer.android.com/studio)
2. Durante a instalação, marque **Android Virtual Device (AVD)**
3. Abra o Android Studio → **More Actions** → **Virtual Device Manager**
4. Crie um novo dispositivo virtual (ex: Pixel 7, API 34)
5. Inicie o emulador antes de rodar o projeto Expo

> **Comparação:** O emulador é como uma **máquina virtual** — ele simula um celular Android no seu computador.

---

## 5. Criando uma Conta no Supabase

O **Supabase** será nosso backend (servidor + banco de dados).

### Passo a passo:
1. Acesse [https://supabase.com](https://supabase.com)
2. Clique em **Start your project**
3. Faça login com sua conta **GitHub** (crie uma se não tiver)
4. Anote para uso futuro: a URL do projeto e a chave anônima (veremos isso na aula 05)

> **Comparação:** O Supabase é como um "Firebase com PostgreSQL". Ele fornece autenticação, banco de dados e API REST prontos para uso, sem precisar criar um servidor manualmente.

---

## 6. Criando uma Conta no GitHub

Se você ainda não tem uma conta no GitHub:

1. Acesse [https://github.com](https://github.com)
2. Crie uma conta gratuita
3. Instale o **Git** no computador: [https://git-scm.com](https://git-scm.com)
4. Configure o Git no terminal:

```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"
```

> **Para que serve o Git?** É um sistema de **controle de versão** — como um "histórico de alterações" do seu código. O GitHub é a plataforma onde você armazena esse histórico na nuvem.

---

## 7. Verificação Final

Abra o terminal e execute os comandos abaixo para verificar que tudo está instalado:

```bash
# Node.js
node --version

# npm
npm --version

# Git
git --version

# Expo (teste rápido)
npx expo --version
```

Se todos retornarem versões sem erros, o ambiente está pronto! ✅

---

## 📝 Resumo dos Conceitos

| Ferramenta | O que é | Comparação |
|------------|---------|------------|
| **Node.js** | Runtime JavaScript | JDK (Java), Python |
| **npm** | Gerenciador de pacotes | pip (Python), Maven (Java) |
| **Expo** | Framework React Native | Create React App, Vite |
| **Expo Go** | App para testar no celular | Live Server do VS Code |
| **Emulador** | Celular virtual | Máquina virtual (VirtualBox) |
| **Supabase** | Backend as a Service | Firebase, Heroku |
| **Git** | Controle de versão | Google Drive com histórico |
| **VS Code** | Editor de código | IntelliJ, NetBeans |

---

## ✅ Checklist da Aula

- [ ] Node.js instalado (v18+)
- [ ] VS Code instalado com extensões
- [ ] Expo Go instalado no celular OU emulador configurado
- [ ] Conta no Supabase criada
- [ ] Conta no GitHub criada
- [ ] Git instalado e configurado