# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Flutter Gigs is a job platform built with **Nuxt 3**, **TypeScript**, **Vue 3**, and **Tailwind CSS**. The application includes multiple features:
- **Jobs**: Job posting, browsing, and application system
- **Companies**: Company profiles and job listings
- **Fluppets**: Code snippet sharing feature (similar to GitHub Gists)
- **User Authentication**: Login, registration, and profile management
- **Analytics**: PostHog integration for tracking user behavior

## Common Development Commands

### Development Server
```bash
yarn dev  # or npm run dev
```

### Build Commands
```bash
yarn build       # Production build
yarn generate    # Static site generation
yarn preview     # Preview production build
```

### Linting & Type Checking
The project uses TypeScript and Prettier for code formatting. Always run these commands before committing:
```bash
yarn typecheck   # Type checking with vue-tsc
yarn format      # Format code with prettier
```

## Architecture Overview

### Core Directory Structure
- **`core/`** - Core application utilities and shared logic
  - `network/` - HTTP client, interceptors, and API endpoints
  - `validations/` - Form validation schemas using Yup
  - `helpers/` - Utility functions and i18n helpers
  - `ui/` - Toast notifications and UI utilities
- **`features/`** - Feature-specific types and transformers organized by domain
- **`services/`** - Business logic services (analytics, auth, AI, error tracking)
- **`stores/`** - Pinia stores for state management
- **`composables/`** - Reusable Vue 3 composition functions
- **`components/`** - Vue components organized by feature/domain
- **`pages/`** - File-based routing (Nuxt 3 pages)
- **`middleware/`** - Route middleware for authentication and authorization

### Key Technologies & Patterns
- **Nuxt 3** with TypeScript and auto-imports enabled
- **Pinia** for state management with persistence
- **Strapi** headless CMS integration for content management
- **Nuxt UI** component library with Tailwind CSS
- **Vue 3 Composition API** with `<script setup>` syntax
- **File-based routing** with dynamic routes using `[slug].vue` pattern
- **Server-side rendering** with selective client-side hydration
- **WebSocket** support for real-time features

### Authentication & Authorization
- **Strapi-based authentication** with JWT tokens
- **Middleware protection** for authenticated routes (`auth.ts`, `loggedIn.ts`)
- **Role-based access** with company ownership checks (`noCompany.ts`)
- **User profile management** with education and experience tracking

### Data Fetching Strategy
- Use `useFetch` for SSR-optimized data fetching with caching
- Use `$fetch` for client-side API calls in event handlers
- Use `useAsyncData` for complex data operations
- Set `server: false` to disable SSR for client-only data
- Set `lazy: true` for non-critical data that can load after initial render

### Component Organization
Components are organized by feature domains:
- `job/` - Job-related components (cards, filters, forms)
- `company/` - Company profile and listing components
- `fluppets/` - Code snippet sharing components
- `auth/` - Authentication forms and flows
- `profile/` - User profile management
- `ui/` - Reusable UI components

### State Management
- **App Store** (`stores/app.ts`) - Global app state (UI state)
- **Auth Store** (`stores/auth.ts`) - User authentication state
- **Feature Stores** - Domain-specific state (jobs, companies, fluppets)
- **Persisted State** - Critical state is persisted using `@pinia-plugin-persistedstate/nuxt`

### Form Handling
- **Vuelidate** for form validation
- **Yup schemas** in `core/validations/` for validation rules
- **Custom form components** in `components/forms/`
- **Toast notifications** for user feedback

### Content Management
- **Strapi CMS** integration via `@nuxtjs/strapi`
- **Rich text editing** with Quill.js and TipTap
- **Image handling** with `@nuxt/image` for optimization
- **File uploads** with preview functionality

### Analytics & Monitoring
- **PostHog** for user analytics and feature flags
- **Sentry** for error tracking and performance monitoring
- **Custom analytics service** in `services/analytics/`
- **Feature flag system** for A/B testing

## Code Style Guidelines

### TypeScript Best Practices
- Use **interfaces over types** for better extendability
- Avoid enums; use maps for type safety
- Prefer functional components with TypeScript interfaces
- Leverage auto-imports (no need to import `ref`, `useState`, etc.)

### Vue 3 Patterns
- Use **Composition API** with `<script setup>` syntax
- Create **composables** for reusable logic (prefix with `use`)
- Use **PascalCase** for component file names
- Prefer **named exports** for functions

### Styling
- Use **Tailwind CSS** with mobile-first approach
- Use **Nuxt UI** components for consistency
- Configure theme via `app.config.ts`
- Use **responsive design** patterns

### File Naming
- Components: `PascalCase.vue`
- Composables: `use<Name>.ts`
- Stores: `<domain>.ts`
- Pages: `kebab-case.vue` or `[slug].vue` for dynamic routes

## Development Notes

### Environment Configuration
- Use `useRuntimeConfig()` for environment variables
- Configure runtime config in `nuxt.config.ts`
- Separate public and private configuration values

### SEO & Meta Tags
- Use `useHead()` and `useSeoMeta()` for page metadata
- Configure OpenGraph images with `nuxt-og-image`
- Use `@nuxt/image` for optimized images

### Internationalization
- **i18n** support with `@nuxtjs/i18n`
- Language files in `i18n/locales/`
- Use `no_prefix` strategy for default locale

### WebSocket Integration
- Real-time features using WebSocket in `server/routes/_ws.ts`
- WebSocket manager in `server/utils/websocket_manager.ts`

## Testing & Quality Assurance

Always run type checking and ensure no TypeScript errors before committing:
```bash
yarn typecheck
```

Use Prettier for consistent code formatting:
```bash
yarn format
```

The project includes comprehensive error handling and monitoring through Sentry integration.