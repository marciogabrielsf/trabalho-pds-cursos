# Copilot Instructions - Sistema de Gestão de Cursos Online

## � Visão Geral do Sistema

Sistema de gestão de cursos online com **conteúdo modular** - trabalho acadêmico focado na implementação de padrões de design. A plataforma permite que professores criem cursos com módulos reutilizáveis, alunos se inscrevam e progridam sequencialmente, com comunicação dinâmica e sistema de pagamento.

### Stack Principal

-   **Next.js 15** com App Router e Turbopack
-   **TypeScript** com strict mode
-   **Zustand** para estado global (com persistência localStorage)
-   **TanStack Query** para cache e queries
-   **TailwindCSS** para estilização
-   **Framer Motion** para animações
-   **Dados mockados** (backend em desenvolvimento)

## �️ Arquitetura e Padrões de Design

### Padrões Obrigatórios a Implementar:

1. **Composite** - Estrutura hierárquica: Curso → Módulos → Aulas (vídeo, texto, quiz)
2. **Observer** - Notificações dinâmicas (professor ↔ alunos para trabalhos/respostas)
3. **Mediator** - Comunicação desacoplada entre participantes do curso
4. **Strategy** - Formas de pagamento (cartão 3x, Pix 5% desconto, boleto integral)
5. **Prototype** - Reutilização de módulos entre cursos
6. **Chain of Responsibility** - Controle sequencial de progresso (módulo/aula anterior obrigatório)
7. **DAO** - Abstração de acesso a dados (CursoDAO, AlunoDAO, etc.)
8. **BO** - Lógica de negócio encapsulada (CursoBO, AlunoBO, PagamentoBO)
9. **MVC** - Separação apresentação/controle/modelo

### Regras de Negócio Críticas:

-   **Progresso Sequencial**: Módulo/aula só libera após anterior completar
-   **Comunicação Dinâmica**: Novos alunos podem entrar a qualquer momento
-   **Notificações**: Professor ↔ alunos para trabalhos e respostas
-   **Reutilização**: Módulos podem ser copiados entre cursos

## 🎯 Padrões de Desenvolvimento

### 1. Estrutura de Domínio (Padrões BO + DAO)

```typescript
// Camada de Negócio (BO)
src/business/
├── CursoBO.ts          // Criar cursos, adicionar módulos, inscrições
├── AlunoBO.ts          // Progresso, verificação sequencial
├── PagamentoBO.ts      // Estratégias de pagamento
├── MensagemBO.ts       // Comunicação via Mediator
└── TrabalhoBO.ts       // Envio/recebimento de trabalhos

// Camada de Dados (DAO)
src/dao/
├── CursoDAO.ts         // CRUD cursos
├── AlunoDAO.ts         // CRUD alunos e progresso
├── ModuloDAO.ts        // CRUD módulos
├── AulaDAO.ts          // CRUD aulas
└── PagamentoDAO.ts     // CRUD pagamentos
```

### 2. Implementação de Padrões Core

```typescript
// Composite - Hierarquia de conteúdo
interface ComponenteCurso {
    id: string;
    nome: string;
    podeAcessar(aluno: Aluno): boolean;
    marcarConcluido(aluno: Aluno): void;
}

// Strategy - Formas de pagamento
interface EstrategiaPagamento {
    calcularValor(valorBase: number): number;
    processar(dados: DadosPagamento): ResultadoPagamento;
}

// Chain of Responsibility - Controle de progresso
interface VerificadorProgresso {
    verificar(aluno: Aluno, conteudo: ComponenteCurso): boolean;
    setProximo(verificador: VerificadorProgresso): void;
}
```

### 3. Estrutura de Rotas e Autenticação

```typescript
// Fluxo de autenticação: página principal → dashboard baseado em role
src/app/page.tsx              // Login + auto-redirect para dashboard
src/app/dashboard/layout.tsx  // Guard de autenticação
src/app/dashboard/student/    // Rotas específicas do estudante
src/app/dashboard/teacher/    // Rotas específicas do professor
```

### 4. Gerenciamento de Estado

Use **Zustand** para estado global com persistência:

```typescript
// Pattern: stores/<feature>Store.ts
export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            // State logic
        }),
        {
            name: "auth-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);
```

### 5. Organização de Componentes

```typescript
// Estrutura hierárquica por funcionalidade
src/components/
├── dashboard/
│   ├── layout/     // Sidebar, Header, etc.
│   ├── courses/    // Course cards, lists, search
│   ├── classroom/  // Virtual classroom components
│   ├── learning/   // Learning experience
│   └── shared/     // Reusable dashboard components
├── auth/           // Login, forms
└── ui/             // Base UI components
```

### 6. Imports Centralizados

```typescript
// Use barrel exports para imports limpos
import { CourseCard, CoursesList } from "@/components/dashboard/courses";
import { Sidebar, DashboardHeader } from "@/components/dashboard/layout";
```

## 🔧 Comandos de Desenvolvimento

```bash
# Desenvolvimento com Turbopack (mais rápido)
yarn dev

# Build e produção
yarn build && yarn start

# Linting
yarn lint
```

## 📊 Data Flow & Mock Data

### Dados Mockados

-   **Cursos**: `src/data/mockData.ts` - array de cursos com categorias, preços, progress
-   **Usuários**: Simulado no `authStore` com auto-login
-   **Categorias**: Part of course data structure

### Estados Relacionados

```typescript
// authStore: user, isAuthenticated, role-based routing
// courseStore: courses, categories, search, filters
```

## 🎨 Padrões de UI

### Convenções TailwindCSS

-   **Classes utilitárias**: Prefira atomic classes
-   **Responsividade**: Mobile-first approach
-   **Cores**: Sistema baseado em `secondary` (visto no loading spinner)

### Animações

-   **Framer Motion**: Para transições e micro-interações
-   **CSS Classes**: `animate-spin` para loading states

## 🔧 Configurações Específicas

### React Query

-   **Stale Time**: 1 minuto
-   **Cache Time**: 10 minutos
-   **Retry**: 1 tentativa
-   **DevTools**: Habilitado em desenvolvimento

### TypeScript

-   **Strict mode**: Ativado
-   **Path mapping**: `@/*` para `./src/*`
-   **Target**: ES2017

### Next.js

-   **App Router**: Exclusivo (não Pages Router)
-   **Turbopack**: Habilitado no dev mode
-   **Font**: Inter com variable font

## 📝 Ao Desenvolver

1. **Novos Componentes**: Organize por funcionalidade em `components/dashboard/<area>/`
2. **Estado Global**: Use Zustand com persistência quando apropriado
3. **Tipos**: Defina interfaces em arquivos dedicados (`types/`, `stores/`)
4. **Rotas**: Siga pattern role-based em `app/dashboard/<role>/`
5. **Imports**: Use barrel exports para imports limpos
6. **Mock Data**: Adicione dados em `src/data/mockData.ts`

## 🚀 Padrões de Desenvolvimento

### Client Components

```typescript
// Sempre use "use client" para componentes com:
// - Hooks de estado (useState, useEffect)
// - Stores do Zustand
// - Interações do usuário
```

### Error Boundaries e Loading States

```typescript
// Pattern para loading states
if (!isAuthenticated) {
    return <LoadingSpinner />;
}
```

### Role-Based Navigation

```typescript
// Redirect pattern baseado em role
useEffect(() => {
    if (isAuthenticated) {
        router.push("/dashboard/student"); // ou /teacher
    }
}, [isAuthenticated, router]);
```
