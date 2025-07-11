# Coursue - Sistema de Gestão de Cursos Online

Uma plataforma completa de gestão de cursos online construída com Next.js 15, TypeScript, TailwindCSS e Zustand.

##  Tecnologias

- **Next.js 15** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **TailwindCSS** - Framework de CSS utilitário
- **Zustand** - Gerenciamento de estado global
- **Lucide React** - Biblioteca de ícones

##  Pré-requisitos

Antes de começar, você precisa ter instalado em sua máquina:

- **Node.js** (versão 18 ou superior)
- **Yarn** (gerenciador de pacotes)

### Instalando o Yarn

Se você ainda não tem o Yarn instalado, siga as instruções abaixo:

#### No Windows:
```bash
# Via npm
npm install -g yarn

# Via Chocolatey
choco install yarn

# Via Scoop
scoop install yarn
```

#### No macOS:
```bash
# Via Homebrew
brew install yarn

# Via npm
npm install -g yarn
```

#### No Linux (Ubuntu/Debian):
```bash
# Via npm
npm install -g yarn

# Via apt (recomendado)
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt update && sudo apt install yarn
```

##  Instalação e Execução

1. **Clone o repositório:**
```bash
git clone <url-do-repositorio>
cd trabalho-pds-cursos
```

2. **Instale as dependências:**
```bash
yarn install
```

3. **Execute o projeto em modo de desenvolvimento:**
```bash
yarn dev
```

4. **Abra o navegador e acesse:**
```
http://localhost:3000
```

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
yarn dev              # Inicia servidor de desenvolvimento (com Turbopack)

# Build
yarn build            # Gera build de produção
yarn start            # Inicia servidor de produção

# Qualidade de código
yarn lint             # Executa ESLint
```

