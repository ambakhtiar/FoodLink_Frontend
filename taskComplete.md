# FoodLink Frontend - Phase 1 Completion

## Completed Tasks

### 1. Next.js Folder Architecture Setup
- Created `src/components/` with subdirectories:
  - `ui/` - ShadCN UI components (button, input, card, dialog, dropdown-menu, label, sonner)
  - `shared/` - Reusable app components (ThemeProvider, ThemeToggle)
  - `layouts/` - Page layout components
- Created `src/lib/` with:
  - `utils.ts` - cn() helper for Tailwind class merging
  - `axios.ts` - API client with interceptors
  - `queryClient.ts` - React Query client configuration
- Created `src/store/` with:
  - `authStore.ts` - Zustand auth state management with persistence
- Created `src/hooks/` with:
  - `useAuth.ts` - Auth hook
- Created `src/services/` with:
  - `authService.ts` - API service layer for authentication
- Created `src/types/` with:
  - `user.ts` - User, Donor, Receiver interfaces
  - `donation.ts` - Donation types and interfaces

### 2. ShadCN UI Integration
- Initialized with `components.json` configuration
- Installed core components:
  - button, input, card, dialog, dropdown-menu, label, sonner (toast)
- Added required dependencies:
  - @radix-ui/react-dialog, @radix-ui/react-dropdown-menu, @radix-ui/react-label, @radix-ui/react-slot
  - class-variance-authority, clsx, tailwind-merge, lucide-react

### 3. Dark Mode Implementation
- Installed `next-themes` package
- Created `ThemeProvider` wrapper component
- Created `ThemeToggle` component with dropdown menu
- Updated `layout.tsx` with ThemeProvider and suppressHydrationWarning
- Integrated `Toaster` (Sonner) for toast notifications

### 4. Theming
- Updated `globals.css` with full ShadCN CSS variable system
- Applied Emerald/Green primary color palette (HSL: 160 84% 39%) for sustainability vibe
- Configured dark mode color variables

## Terminal Commands Executed

```bash
# Initialize ShadCN UI (recommended, but CLI had Windows terminal issues)
npx shadcn@latest init --yes --template next --base-color slate
npx shadcn@latest add button input card dialog toast dropdown-menu form label

# Install dependencies
npm install clsx tailwind-merge axios zustand @tanstack/react-query next-themes sonner
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-label @radix-ui/react-slot
npm install class-variance-authority lucide-react react-hook-form

# Type check
npx tsc --noEmit
```

## Dependencies Added
- @radix-ui/react-dialog
- @radix-ui/react-dropdown-menu
- @radix-ui/react-label
- @radix-ui/react-slot
- @tanstack/react-query
- axios
- class-variance-authority
- clsx
- lucide-react
- next-themes
- react-hook-form
- sonner
- tailwind-merge
- zustand

### 5. Axios Interceptors (Enhanced)
- Configured Axios instance with baseURL from env
- Request interceptor reads JWT token from Zustand store (`useAuthStore.getState().token`)
- Response interceptor handles 401 Unauthorized:
  - Calls `useAuthStore.getState().logout()` to clear auth state
  - Redirects to `/login` page

### 6. TanStack Query Provider
- Created `QueryProvider.tsx` client component with "use client"
- Configured `QueryClient` with `refetchOnWindowFocus: false`
- Integrated `ReactQueryDevtools` for debugging
- Wrapped app in `layout.tsx` with QueryProvider

### 7. Zustand Auth Store (Enhanced)
- Added `token: string | null` to auth state
- Added `setAuth(user, token)` method for login
- Added `isHydrated` flag for SSR safety
- Configured `partialize` to persist only user, token, isAuthenticated
- Added `onRehydrateStorage` callback to set hydrated flag

## Terminal Commands Executed

```bash
# Initialize ShadCN UI (recommended, but CLI had Windows terminal issues)
npx shadcn@latest init --yes --template next --base-color slate
npx shadcn@latest add button input card dialog toast dropdown-menu form label

# Install dependencies
npm install clsx tailwind-merge axios zustand @tanstack/react-query next-themes sonner
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-label @radix-ui/react-slot
npm install class-variance-authority lucide-react react-hook-form

# Phase 2 - Add devtools
npm install @tanstack/react-query-devtools

# Type check
npx tsc --noEmit
```

## Dependencies Added
- @radix-ui/react-dialog
- @radix-ui/react-dropdown-menu
- @radix-ui/react-label
- @radix-ui/react-slot
- @tanstack/react-query
- @tanstack/react-query-devtools
- axios
- class-variance-authority
- clsx
- lucide-react
- next-themes
- react-hook-form
- sonner
- tailwind-merge
- zustand

## Git Commit Messages
```
chore: setup frontend arch and shadcn ui
feat: setup zustand auth, axios interceptors, react query
```
