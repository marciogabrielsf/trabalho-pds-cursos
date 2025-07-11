# Copilot Instructions - Coursue (Sistema de Gestão de Cursos)

## Architecture Overview

This is a **Next.js 15 + TypeScript** educational platform with a **component-driven architecture**. The app uses **App Router** with role-based dashboard routes (`/dashboard/student`, `/dashboard/teacher`) and **Zustand** for state management with **TanStack Query** for server state.

## Key Technologies & Patterns

- **Next.js 15**: App Router, Server Components, client components marked with `"use client"`
- **State Management**: Zustand stores with persistence (`authStore`, `courseStore`)
- **Data Fetching**: TanStack Query v5 with configured defaults (1min staleTime, 10min gcTime)
- **Styling**: TailwindCSS v4 with custom CSS variables (`--color-highlight: #FF6636`, `--color-secondary: #702DFF`)
- **Animation**: Framer Motion for component transitions
- **Icons**: Lucide React throughout

## Component Organization

Components are organized by **functional domains** in `src/components/dashboard/`:

```
dashboard/
├── layout/        # Sidebar, DashboardHeader, StudentDashboard
├── courses/       # CourseCard, CoursesList, CourseSearch, Categories
├── classroom/     # Classroom, ClassroomPost, ActivitiesSidebar
├── learning/      # CourseLearningPage, CourseContents, LectureNotes
└── shared/        # TabNavigator, reusable components
```

**Import Pattern**: Use barrel exports via `index.ts` files:
```typescript
import { CourseCard, CoursesList } from '@/components/dashboard/courses';
import { Classroom, ClassroomPost } from '@/components/dashboard/classroom';
```

## Authentication Flow

- **Auto-login**: `src/app/page.tsx` simulates login for demo (`login()` in useEffect)
- **Route Protection**: `src/app/dashboard/layout.tsx` checks `isAuthenticated` and redirects
- **Zustand Persistence**: Auth state persists to localStorage via `persist` middleware
- **User Roles**: `"student" | "teacher"` determine dashboard access

## Data Patterns

### Mock Data Structure
- **Courses**: `src/data/mockData.ts` - contains `mockCourses[]` and `mockCategories[]`
- **Classroom**: `src/components/dashboard/classroom/classroomTypes.ts` - posts and activities
- **Typing**: Interfaces co-located with components (e.g., `ClassroomPost`, `Activity`)

### State Management
```typescript
// Zustand stores follow this pattern:
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // state and actions
    }),
    { name: "auth-storage", storage: createJSONStorage(() => localStorage) }
  )
);
```

## Classroom Component System

The **Classroom** is a complex component with:
- **Posts**: Three types (`"announcement" | "assignment" | "material"`)
- **Comments**: Support line breaks via `whitespace-pre-wrap`, Enter/Shift+Enter UX
- **Activities Sidebar**: Right-aligned activities panel
- **State Management**: Local state for comments, passed via props to child components

## Development Commands

```bash
yarn dev          # Development with Turbopack
yarn build        # Production build
yarn lint         # ESLint
```

## UI/UX Patterns

### Design System
- **Orange Theme**: Primary `#FF6636`, Secondary `#702DFF`
- **Gradient Avatars**: `bg-gradient-to-br from-orange-400 to-red-400`
- **Cards**: `bg-white rounded-lg shadow-sm border-2 hover:shadow-md`
- **Buttons**: Orange variants with hover states

### Animation Patterns
```typescript
// Framer Motion standard pattern:
<motion.div
  initial={{ opacity: 0, height: 0 }}
  animate={{ opacity: 1, height: "auto" }}
  transition={{ duration: 0.3 }}
>
```

## File Routing

- **Student Routes**: `/dashboard/student/[page]`
- **Dynamic Routes**: `/dashboard/student/courses/[id]` → `CourseDetailsPage`
- **Nested Layouts**: Dashboard layout wraps all `/dashboard/*` routes
- **Page Components**: Thin wrappers importing from `@/components/dashboard`

## Critical Development Notes

1. **Component Exports**: Always use barrel exports via `index.ts` files
2. **State Updates**: Use Zustand actions, not direct state mutation
3. **TanStack Query**: Leverage configured defaults, avoid overriding staleTime/gcTime
4. **Comments**: Use `whitespace-pre-wrap` for line break support
5. **Responsive**: All components should be mobile-first responsive
6. **Loading States**: Include loading/error states for async operations

## Integration Points

- **QueryProvider**: Wraps entire app in `src/app/layout.tsx`
- **Route Guards**: Dashboard layout checks authentication
- **Mock Services**: `src/services/authService.ts` ready for real API integration
- **LocalStorage**: Zustand persist middleware for auth state

When adding new features, follow the established patterns: organize by domain, use TypeScript interfaces, leverage existing state management, and maintain responsive design.
