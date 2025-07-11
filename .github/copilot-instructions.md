# Copilot Instructions - Coursue LMS Platform

## Architecture Overview

This is a Next.js 15 course management system built with TypeScript, TailwindCSS, and Zustand for state management. The platform serves both students and teachers with separate dashboards.

### Key Technologies

-   **Next.js 15** with App Router (`src/app/`)
-   **Zustand** for global state management (persisted in localStorage)
-   **TailwindCSS** for styling with custom theme colors
-   **Lucide React** for icons
-   **TypeScript** for type safety

### State Management Pattern

Uses Zustand stores with specific patterns:

-   `useAuthStore` - User authentication and profile data
-   `useCourseStore` - Course data, categories, search, and filtering
-   Stores use `persist` middleware for localStorage persistence

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── dashboard/         # Protected dashboard routes
│   │   ├── student/       # Student-specific pages
│   │   └── teacher/       # Teacher-specific pages (planned)
│   └── page.tsx          # Landing/login page
├── components/           # Reusable UI components
│   ├── ui/              # Base UI components (Button, Input, etc.)
│   ├── auth/            # Authentication components
│   └── dashboard/       # Dashboard-specific components
├── stores/              # Zustand state management
├── types/               # TypeScript type definitions
├── data/                # Mock data and fixtures
├── hooks/               # Custom React hooks
├── services/            # API service layer
└── config/              # App configuration
```

## Key Patterns

### Component Organization

-   **Barrel exports**: Each component folder has `index.ts` for clean imports
-   **Componentized architecture**: UI broken into reusable pieces (CourseCard, Categories, etc.)
-   **TypeScript interfaces**: All props and data structures are typed

### Authentication Flow

```typescript
// Auto-login demo user on page load
useEffect(() => {
    if (!isAuthenticated) {
        login({
            id: "1",
            name: "Natália Ruth",
            email: "natalia@email.com",
            role: "student",
        });
    }
}, [isAuthenticated, login]);
```

### Route Protection

-   Dashboard routes use `layout.tsx` to check authentication
-   Redirects to login if not authenticated
-   Separate student/teacher dashboard paths

### Data Flow

1. Mock data in `src/data/mockData.ts` simulates API responses
2. Zustand stores manage global state
3. Components subscribe to stores for reactive updates
4. Search and filtering handled in store computed functions

## Development Commands

```bash
yarn dev          # Start development server with Turbopack
yarn build        # Production build
yarn lint         # ESLint checking
```

## Custom Styles

Uses TailwindCSS with custom theme colors:

-   `text-secondary`, `bg-secondary` - Primary brand purple
-   `text-highlight`, `bg-highlight` - Orange accent color
-   Custom gradients for hero sections and cards

## Component Patterns

### Course Cards

-   Hover effects with `hover:-translate-y-2`
-   Gradient backgrounds for course thumbnails
-   Progress bars for enrolled courses
-   Price formatting with `Intl.NumberFormat`

### Search & Filtering

-   Real-time search in course store
-   Category filtering with visual selection states
-   Combined search + category filtering logic

### Icons & Styling

-   Lucide React icons with consistent sizing
-   Rounded corners (`rounded-xl`, `rounded-3xl`)
-   Consistent spacing and shadow patterns
-   Portuguese language for UI text

## Mock Data Structure

Courses have complete metadata including:

-   Instructor, rating, student count, duration
-   Enrollment status and progress tracking
-   Category classification and pricing
-   Thumbnail placeholders with consistent styling

## Common Gotchas

-   All dashboard pages need `"use client"` directive
-   Zustand stores require proper TypeScript typing
-   Component props interfaces should extend common patterns
-   Mock data simulates real API structure for easy replacement
