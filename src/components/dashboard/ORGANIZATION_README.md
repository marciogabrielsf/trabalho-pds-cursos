# Dashboard Components Organization

## Nova Estrutura de Pastas

A pasta `components/dashboard` foi reorganizada para melhor organização e manutenibilidade:

```
src/components/dashboard/
├── layout/                     # Componentes de layout e estrutura
│   ├── Sidebar.tsx            # Barra lateral do dashboard
│   ├── DashboardHeader.tsx    # Cabeçalho do dashboard
│   ├── StudentDashboard.tsx   # Dashboard principal do estudante
│   └── index.ts
├── courses/                   # Componentes relacionados a cursos
│   ├── CourseCard.tsx         # Card individual de curso
│   ├── CoursesList.tsx        # Lista de cursos
│   ├── CourseSearch.tsx       # Busca de cursos
│   ├── Categories.tsx         # Categorias de cursos
│   ├── MyCourseCard.tsx       # Card de "Meus Cursos"
│   ├── MyCoursesList.tsx      # Lista de "Meus Cursos"
│   ├── MyCoursesPage.tsx      # Página de "Meus Cursos"
│   ├── CourseHeader.tsx       # Cabeçalho de curso
│   ├── CourseTabs.tsx         # Abas do curso
│   ├── CourseDescription.tsx  # Descrição do curso
│   ├── PurchasePanel.tsx      # Painel de compra
│   ├── CourseDetailsPage.tsx  # Página de detalhes do curso
│   ├── CourseDetailsHorizontal.tsx # Layout horizontal dos detalhes
│   └── index.ts
├── classroom/                 # Componentes da sala de aula virtual
│   ├── Classroom.tsx          # Componente principal da sala
│   ├── ClassroomPost.tsx      # Post individual da sala
│   ├── ActivitiesSidebar.tsx  # Menu lateral de atividades
│   ├── classroomTypes.ts      # Tipos e dados mock
│   └── index.ts
├── learning/                  # Componentes de aprendizado
│   ├── CourseLearningPage.tsx # Página de aprendizado
│   ├── CourseContents.tsx     # Conteúdo do curso
│   ├── LectureNotes.tsx       # Notas de aula
│   └── index.ts
├── shared/                    # Componentes compartilhados
│   ├── TabNavigator.tsx       # Navegador de abas
│   └── index.ts
├── index.ts                   # Exports centralizados
└── ORGANIZATION_README.md     # Esta documentação
```

## Benefícios da Reorganização

### ✅ **Organização por Funcionalidade**
- Componentes agrupados por área de responsabilidade
- Facilita encontrar e modificar componentes relacionados

### ✅ **Melhor Separação de Responsabilidades**
- **Layout**: Componentes de estrutura e navegação
- **Courses**: Tudo relacionado a cursos e listagens
- **Classroom**: Sala de aula virtual e atividades
- **Learning**: Experiência de aprendizado
- **Shared**: Componentes reutilizáveis

### ✅ **Imports Mais Limpos**
```typescript
// Antes
import CourseCard from './CourseCard';
import CoursesList from './CoursesList';
import Categories from './Categories';

// Depois
import { CourseCard, CoursesList, Categories } from './courses';
```

### ✅ **Escalabilidade**
- Fácil adicionar novos componentes na categoria correta
- Estrutura preparada para crescimento do projeto

### ✅ **Manutenibilidade**
- Easier to locate and modify related components
- Clear separation of concerns
- Better code organization

## Uso dos Componentes

### Importação Individual
```typescript
import { Sidebar, DashboardHeader } from '@/components/dashboard/layout';
import { CourseCard, CoursesList } from '@/components/dashboard/courses';
import { Classroom, ClassroomPost } from '@/components/dashboard/classroom';
```

### Importação Agrupada
```typescript
import { 
  Sidebar, 
  CourseCard, 
  Classroom,
  CourseLearningPage 
} from '@/components/dashboard';
```

## Arquivos de Índice

Cada subpasta possui seu próprio arquivo `index.ts` que:
- Exporta todos os componentes da pasta
- Mantém compatibilidade com imports existentes
- Permite importação seletiva ou em grupo

## Compatibilidade

A reorganização mantém **100% de compatibilidade** com código existente através do arquivo `index.ts` principal que re-exporta todos os componentes.

## Próximos Passos

1. **Adicionar Testes**: Criar testes específicos para cada categoria
2. **Documentação**: Criar READMEs específicos para cada subpasta
3. **Storybook**: Organizar stories por categoria
4. **Performance**: Implementar lazy loading por categoria
5. **TypeScript**: Melhorar tipagem específica por área

## Migração

Para migrar código existente (opcional):

### Antes
```typescript
import CourseCard from '@/components/dashboard/CourseCard';
import Sidebar from '@/components/dashboard/Sidebar';
```

### Depois (recomendado)
```typescript
import { CourseCard } from '@/components/dashboard/courses';
import { Sidebar } from '@/components/dashboard/layout';
```

### Ou (mais conciso)
```typescript
import { CourseCard, Sidebar } from '@/components/dashboard';
```
