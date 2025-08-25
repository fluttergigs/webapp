# FlutterGigs - The #1 Flutter Jobs Platform

[![Nuxt 3](https://img.shields.io/badge/Nuxt-3-black?logo=nuxt.js)](https://nuxt.com/docs/getting-started/introduction)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-Ready-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

FlutterGigs is a comprehensive Flutter job board platform that connects Flutter developers with opportunities worldwide. Built with modern web technologies, it provides a seamless experience for job seekers, companies, and the Flutter developer community.

## 🚀 Features

- **Job Board**: Browse and search Flutter job opportunities with advanced filtering
- **Company Profiles**: Comprehensive company showcases with branding and culture information
- **Fluppets**: Community-driven code snippet sharing platform for Flutter developers
- **Learning Hub**: Curated Flutter learning resources and educational content
- **AI-Powered**: Intelligent job description generation using Google Generative AI
- **Multi-language**: Internationalization support (English/French)
- **Real-time**: WebSocket support for live updates and notifications

## 🛠️ Tech Stack

- **Frontend**: Nuxt 3, Vue.js 3, TypeScript
- **Styling**: Tailwind CSS, @nuxt/ui component library
- **State Management**: Pinia with persistence
- **Backend**: Nuxt server routes + Strapi CMS
- **Database**: Strapi with configurable database adapters
- **AI**: Google Generative AI for content generation
- **Analytics**: PostHog for user behavior tracking
- **Error Tracking**: Sentry for production monitoring
- **Image Optimization**: Sharp via @nuxt/image

## 📋 Prerequisites

- **Node.js**: v20.19.4 (tested and confirmed working)
- **Package Manager**: Yarn v1.22.22 (required)
- **Strapi Backend**: Set up and running (optional for frontend development)

## 🏗️ Setup

### 1. Install Dependencies

```bash
yarn install
```

_Note: Installation takes 30-95 seconds depending on cache. Allow up to 10 minutes for safety._

### 2. Environment Configuration

Create a `.env` file in the root directory:

```bash
# Strapi CMS Configuration
STRAPI_URL=http://localhost:1337

# API Configuration
NUXT_PUBLIC_API_BASE_URL=your_api_base_url

# AI Integration
NUXT_PUBLIC_GOOGLE_GENERATIVE_API_KEY=your_google_ai_key

# Analytics
NUXT_PUBLIC_POSTHOG_KEY=your_posthog_key
NUXT_PUBLIC_POSTHOG_PROJECT_ID=your_project_id

# Error Tracking
NUXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
```

### 3. Development Server

Start the development server on `http://localhost:3000`:

```bash
yarn dev
```

_Note: Server startup takes ~1 minute. The application will be available once the compilation is complete._

## 🏗️ Production

### Build for Production

```bash
yarn build
```

_Note: Build process takes 5-7 minutes. Allow up to 15 minutes for safety._

### Preview Production Build

```bash
yarn start
```

_Note: Requires a successful `yarn build` first._

## 🧪 Development Guidelines

### Code Quality

```bash
# Check code formatting
npx prettier --check .

# Fix formatting issues
npx prettier --write .
```

### Project Structure

```
├── pages/           # Route components (jobs, companies, fluppets, learn, auth)
├── components/      # Feature-organized Vue components
├── stores/          # Pinia state management (auth, job, company, user, etc.)
├── composables/     # Reusable Vue composables
├── core/            # Utilities, constants, network clients, validations
├── services/        # External integrations (AI, analytics, auth)
├── features/        # Domain-specific business logic and types
├── middleware/      # Route protection and navigation guards
├── server/          # Server-side API routes and utilities
└── assets/          # Static assets and stylesheets
```

### Key Development Patterns

- **TypeScript First**: All new code should be TypeScript
- **Feature-Based Organization**: Group related functionality together
- **Pinia for State**: Use existing stores or create new feature-specific stores
- **Tailwind for Styling**: Follow existing design system patterns
- **Component Composition**: Leverage Vue 3 Composition API

## 🔧 Common Development Tasks

### Adding New Job Types

1. Update `WorkType` enum in `features/jobs/job.types.ts`
2. Add transformer in `features/jobs/transformers.ts`
3. Update constants in `core/constants.ts`

### Creating Company Features

1. Extend types in `features/companies/company.types.ts`
2. Update store in `stores/company.ts`
3. Add UI components in `components/companies/`

### Adding Learning Resources

1. Define types in `features/learn/`
2. Update learn store for state management
3. Create components in `components/learn/`

## ⚠️ Known Limitations

During development, these warnings are **NORMAL** and should be **IGNORED**:

- Font provider failures (Google Fonts, Bunny, Fontsource blocked by network)
- Sentry connection timeouts (Sentry.io blocked)
- API endpoint errors when backend is not configured
- Hydration mismatches due to missing backend configuration

These warnings do **NOT** prevent the application from building or running successfully.

## 🚀 Deployment

The application is optimized for serverless deployment on platforms like:

- Vercel
- Netlify
- Digital Ocean Apps
- AWS Amplify

Static generation is also supported via `yarn generate` for JAMstack deployments.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes following the established patterns
4. Run formatting: `npx prettier --write .`
5. Test your changes locally: `yarn build && yarn dev`
6. Submit a pull request

## 📝 License

This project is proprietary software. All rights reserved.

## 🔗 Links

- [FlutterGigs Website](https://fluttergigs.com)
- [Nuxt 3 Documentation](https://nuxt.com/docs)
- [Vue.js Documentation](https://vuejs.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
