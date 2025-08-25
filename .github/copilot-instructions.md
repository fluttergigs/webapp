# FlutterGigs Web Application

FlutterGigs is a comprehensive Flutter job board platform built with Nuxt 3, TypeScript, and Vue.js. The platform enables job seekers to find Flutter opportunities, companies to post jobs, and developers to share code snippets (Fluppets) and learning resources.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Bootstrap, Build, and Test the Repository

Prerequisites:

- Node.js v20.19.4 (tested and confirmed working)
- Yarn v1.22.22 (required package manager)

Initial setup:

- `yarn install` -- takes 30-95 seconds depending on cache. NEVER CANCEL. Set timeout to 10+ minutes for safety.
- `yarn dev` -- starts development server on http://localhost:3000. Takes ~1 minute to start. NEVER CANCEL. Set timeout to 5+ minutes.

Production build:

- `yarn build` -- takes 5-7 minutes to complete. NEVER CANCEL. Set timeout to 15+ minutes.
- Build generates `.output/` directory with production assets
- `yarn start` -- runs the production build (requires prior `yarn build`)

### Development and Testing

Run the development server:

- ALWAYS run `yarn install` first if working with a fresh clone
- `yarn dev` -- development server with hot reload
- Application will be available at http://localhost:3000
- Expect font-related warnings due to network restrictions (Google Fonts, Bunny Fonts blocked) - these are normal and do not prevent functionality

Code quality:

- `npx prettier --check .` -- check code formatting
- `npx prettier --write .` -- fix formatting issues
- NO test suite is currently configured in the project
- NO ESLint configuration is present in package.json

### Known Network Limitations and Warnings

The following network-related warnings are EXPECTED and do NOT indicate build failures:

- Font provider failures (Google Fonts, Bunny, Fontsource, Fontshare): "Could not initialize provider"
- Sentry.io connection timeouts: "Failed to connect to sentry.io port 443"
- These warnings do not prevent the application from building or running successfully

## Validation

### Manual Validation Requirements

After making ANY changes to the application:

1. ALWAYS start the development server: `yarn dev`
2. Navigate to http://localhost:3000 in browser
3. Test core functionality:
   - Browse the homepage and navigation (Home, Jobs, Fluppets, Learn)
   - Navigate to /jobs and verify jobs page loads with filters
   - Navigate to /fluppets and verify code snippets section works
   - Navigate to /learn and verify learning resources section works
   - Navigate to /jobs/post - should redirect to login (expected behavior)

For user authentication flows:

- Navigate to /auth/login and verify login form loads

### Expected Warnings and Errors

During development and build, these warnings are NORMAL and should be IGNORED:

- Font provider failures: "Could not initialize provider `google`", "Failed to download font"
- Sentry connection timeouts: "Failed to connect to sentry.io port 443"
- API endpoint errors: "[GET] '/companies': 500 Server Error", "[GET] '/setting': 404"
- Vue component registration warnings: "Component 'i18n-t' has already been registered"
- Hydration mismatches when using browser interactions (due to missing backend)

These warnings do NOT prevent the application from building or running successfully.

### Build Validation

Before completing work:

1. ALWAYS run `yarn build` to ensure production build succeeds
2. Check for any NEW errors (ignore font and Sentry warnings)
3. Verify `.output/` directory is created with build artifacts

## Common Tasks

### Repository Structure

Key directories and their purposes:

```
├── pages/           # Route components (index, jobs, companies, fluppets, learn, auth)
├── components/      # Reusable Vue components organized by feature
├── stores/          # Pinia state management (auth, job, company, user, learn, fluppets)
├── composables/     # Vue composables for reusable logic
├── core/            # Core utilities, constants, helpers, network clients
├── services/        # External service integrations (AI, analytics)
├── features/        # Domain-specific business logic and types
├── layouts/         # Vue layout components
├── middleware/      # Nuxt middleware
├── plugins/         # Nuxt plugins
└── server/          # Server-side API routes
```

### Key Files Reference

Configuration files:

- `nuxt.config.ts` -- Main Nuxt configuration
- `tailwind.config.js` -- Tailwind CSS configuration
- `.prettierrc` -- Code formatting rules
- `package.json` -- Dependencies and scripts
- `tsconfig.json` -- TypeScript configuration

Application entry points:

- `app.vue` -- Root application component
- `pages/index.vue` -- Homepage
- `layouts/main-layout.vue` -- Main layout wrapper

State management:

- `stores/job.ts` -- Job posting and searching logic
- `stores/auth.ts` -- Authentication state
- `stores/company.ts` -- Company management
- `stores/user.ts` -- User profile management
- `stores/fluppets.ts` -- Code snippets management
- `stores/learn.ts` -- Learning resources

### Environment Variables

Required for full functionality (check `nuxt.config.ts` for complete list):

- `STRAPI_URL` -- CMS backend URL (defaults to http://localhost:1337)
- `NUXT_PUBLIC_API_BASE_URL` -- API endpoint URL
- Google Generative AI API key for job description generation
- PostHog keys for analytics
- Sentry DSN for error tracking

### Common Development Patterns

When working with this codebase:

- Use TypeScript throughout -- all files should be .ts or .vue with TypeScript
- State management via Pinia stores -- import and use existing stores
- API calls through HTTP client in `core/network/http_client.ts`
- Component organization follows feature-based structure
- Use Tailwind CSS for styling
- Follow existing code patterns for consistency

### Debugging Tips

If development server fails to start:

1. Clear Nuxt cache: `rm -rf .nuxt`
2. Reinstall dependencies: `rm -rf node_modules && yarn install`
3. Check Node.js version matches v20.19.4

If build fails with NEW errors (not font/Sentry warnings):

1. Check for TypeScript compilation errors
2. Verify all imports are correctly typed
3. Ensure all environment variables are properly configured

Common issues:

- Hydration errors in browser: Normal due to missing backend API configuration
- 404/500 API errors: Expected when backend services are not running
- Font loading failures: Network restrictions, does not affect functionality
- Sentry timeouts: Network restrictions, does not prevent builds

### Architecture Overview

FlutterGigs implements a modern full-stack architecture:

- Frontend: Nuxt 3 with Vue.js and TypeScript
- Styling: Tailwind CSS with custom design system
- State: Pinia for client-side state management
- Backend: Nuxt server routes + external Strapi CMS
- AI Integration: Google Generative AI for content generation
- Analytics: PostHog for user behavior tracking
- Error Tracking: Sentry for production monitoring

The platform supports:

- Job posting and searching
- Company profiles and management
- User authentication and profiles
- Code snippet sharing (Fluppets)
- Learning resource curation
- AI-powered job description generation

## Domain-Specific Business Logic

### Core Business Entities

**Job Offers** (`features/jobs/job.types.ts`):

- Work types: full-time, part-time, freelance, contract, internship
- Seniority levels: junior, medium, senior, lead
- Remote options: no remote, full remote, hybrid
- Salary ranges, application deadlines, work permits
- Company association and featured job capabilities

**Companies** (`features/companies/company.types.ts`):

- Company profiles with logos, descriptions, and locations
- Company sizes: startup, small, medium, large, enterprise
- Job posting capabilities and company verification
- Company-specific branding and social links

**Fluppets** (`features/fluppets/`):

- Code snippet sharing platform for Flutter developers
- Syntax highlighting with Prism.js
- Community-driven code examples and tutorials
- Categorization and tagging system

**Learning Resources** (`features/learn/`):

- Curated Flutter learning materials
- Tutorial links, documentation, and educational content
- Community-contributed learning paths

### State Management Architecture

**Core Stores** (all in `stores/` directory):

- `auth.ts` -- User authentication state, JWT handling, login/logout flows
- `job.ts` -- Job search filters, job listings, application tracking
- `company.ts` -- Company profiles, job posting management
- `user.ts` -- User profiles, preferences, saved jobs/companies
- `fluppets.ts` -- Code snippet management and community features
- `learn.ts` -- Learning resource organization and progress tracking
- `app.ts` -- Global application state, notifications, UI state
- `setting.ts` -- User preferences, theme settings, configuration

Each store uses Pinia with persistence via `@pinia-plugin-persistedstate/nuxt`.

### AI Integration Details

**Google Generative AI** (`services/ai/`):

- Job description generation for employers
- Content enhancement and suggestion capabilities
- Implemented through abstract `GenerativeAI` class with Google implementation
- Configured via `NUXT_PUBLIC_GOOGLE_GENERATIVE_API_KEY` environment variable

**Usage Patterns**:

```typescript
const aiService = new GoogleGenerativeAIImpl();
const jobDescription = await aiService.generateText(prompt);
```

### Authentication & Authorization

**Middleware System** (`middleware/`):

- `auth.ts` -- Protects authenticated routes, redirects to login
- `loggedIn.ts` -- Redirects authenticated users away from auth pages
- `noCompany.ts` -- Ensures company profile exists for company-specific actions

**Authentication Flow**:

- JWT-based authentication via Strapi
- Token persistence in cookies (`strapi_jwt`)
- Automatic redirect handling with return URL preservation
- Role-based access control for job posting and company management

### API Integration Patterns

**Strapi CMS Integration**:

- Content management for jobs, companies, and learning resources
- RESTful API endpoints via `/api` prefix
- Automatic authentication header injection
- File upload capabilities for company logos and user avatars

**Server Routes** (`server/api/` and `server/routes/`):

- Custom API endpoints for complex business logic
- Proxy endpoints for external service integration
- WebSocket support for real-time features

### Component Organization

**Feature-Based Structure**:

```
components/
├── jobs/           # Job-related UI components
├── companies/      # Company profile and management
├── fluppets/       # Code snippet sharing interface
├── learn/          # Learning resource displays
├── auth/           # Authentication forms and flows
├── shared/         # Reusable cross-feature components
└── ui/             # Base design system components
```

**UI Library Integration**:

- `@nuxt/ui` for base component library
- Custom Tailwind CSS extensions for branding
- Consistent design tokens across all features

### Development Workflows

**Adding New Job Types**:

1. Update `WorkType` enum in `features/jobs/job.types.ts`
2. Add transformer function in `features/jobs/transformers.ts`
3. Update `workTypeOptions` in `core/constants.ts`
4. Add validation rules in `core/validations/`

**Creating New Company Features**:

1. Extend `Company` type in `features/companies/company.types.ts`
2. Update company store in `stores/company.ts`
3. Add corresponding UI components in `components/companies/`
4. Update Strapi content types if backend changes needed

**Adding Learning Resources**:

1. Define resource types in `features/learn/`
2. Update learn store for state management
3. Create display components in `components/learn/`
4. Add API endpoints in `server/api/` if needed

### Testing Strategy

**Current State**: No test suite configured
**Recommended Setup**:

- Vitest for unit testing Vue components and composables
- Playwright for end-to-end testing of user workflows
- Testing focus areas:
  - Job search and filtering functionality
  - Company registration and job posting flows
  - User authentication and profile management
  - Fluppets code snippet sharing
  - AI-powered content generation

**Test Organization**:

```
tests/
├── unit/           # Component and function tests
├── integration/    # API and store tests
└── e2e/           # End-to-end user workflow tests
```

### Performance Considerations

**Optimization Patterns**:

- Image optimization via `@nuxt/image` with Sharp
- Code splitting with dynamic imports for heavy components
- Lazy loading of non-critical features (Fluppets editor, charts)
- Service worker caching for offline job browsing

**Build Optimization**:

- Bundle analysis available via Nuxt DevTools
- Runtime chunk optimization configured
- Tree shaking for unused dependencies

### Internationalization

**i18n Setup** (`@nuxtjs/i18n`):

- English (default) and French language support
- Lazy loading of translation files
- No prefix strategy for clean URLs
- Currency and date formatting for job salaries
