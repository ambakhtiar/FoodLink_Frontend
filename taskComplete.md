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
- Added `status: AccountStatus | null` (active | suspended | pending | inactive)
- Added `setAuth(user, token)` method for login
- Added `updateUser(user)` method for profile updates
- Added `isHydrated` flag for SSR safety
- Storage key renamed to `foodlink-auth`
- Configured `partialize` to persist user, token, isAuthenticated, status
- Added `onRehydrateStorage` callback to set hydrated flag

### 8. SSR Hydration Safety (`useAuth` hook)
- Created `useAuth()` hook with explicit return type `UseAuthReturn`
- Exposes `isHydrated` flag to prevent hydration mismatch in components
- Use pattern: `const { isHydrated, user } = useAuth(); if (!isHydrated) return null;`

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

### 9. Authentication UI (Login/Register Pages)
- Created `src/lib/validations/auth.ts` with Zod schemas matching backend:
  - `loginSchema`: email/phone + password
  - `registerSchema`: discriminated union for USER vs ORGANIZATION
  - `UserRole`: USER | ORGANIZATION
- Updated `src/services/authService.ts`:
  - `loginUser`, `registerUser`, `googleLogin` methods
  - Using backend types (User, AuthResponse)
- Created `src/hooks/useAuthMutations.ts`:
  - `useLoginMutation`: TanStack Query mutation with toast + redirect
  - `useRegisterMutation`: TanStack Query mutation with toast + redirect
  - `useGoogleLoginMutation`: Google OAuth mutation
- Created `src/app/(auth)/login/page.tsx`:
  - TanStack Form with Zod validation
  - Email/Password form fields with error messages
  - **Demo Login button**: auto-fills `demo@foodlink.com`/`demo123` and submits
  - Google Login button with OAuth popup flow
  - Loading states with spinners on buttons
  - Toast notifications for success/error
  - Link to register page
- Created `src/app/(auth)/register/page.tsx`:
  - Role toggle: USER vs ORGANIZATION (RadioGroup)
  - Conditional fields: name (USER) or orgName (ORGANIZATION)
  - Common fields: email, password (min 6), phone
  - Location fields: latitude, longitude
  - Optional org fields: establishedYear, registrationNumber
  - TanStack Form with Zod validation
  - Loading states and error messages
  - Link to login page
- Created `src/app/(auth)/layout.tsx`:
  - Minimal centered layout with gradient background
  - Full-screen auth container

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

# Phase 3 - Auth UI dependencies
npm install zod @tanstack/react-form @tanstack/zod-form-adapter
npm install @radix-ui/react-radio-group

# Type check
npx tsc --noEmit
```

## Dependencies Added
- @radix-ui/react-dialog
- @radix-ui/react-dropdown-menu
- @radix-ui/react-label
- @radix-ui/react-radio-group
- @radix-ui/react-slot
- @tanstack/react-form
- @tanstack/react-query
- @tanstack/react-query-devtools
- @tanstack/zod-form-adapter
- axios
- class-variance-authority
- clsx
- lucide-react
- next-themes
- sonner
- tailwind-merge
- zod
- zustand

## Git Commit Messages
```
chore: setup frontend arch and shadcn ui
feat: setup zustand auth, axios interceptors, react query
feat: implement login/register pages with tanstack form and demo login
```
