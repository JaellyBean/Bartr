# Bartr Copilot Instructions

## Repository Overview

Bartr is a barter/skill-trading platform with a monorepo structure containing:
- **web**: Next.js 16 frontend (React 19) for the main application
- **mobile**: Expo/React Native mobile app
- **supabase**: Backend infrastructure and database configurations

The project integrates with Supabase for authentication and database operations.

## Build & Test Commands

### Web (Next.js)
```bash
cd web

# Development server (http://localhost:3000)
npm run dev

# Production build
npm run build

# Run production server
npm start

# Linting only
npm run lint

# Run specific lint rule
npx eslint src/ --no-config-comments
```

**Note**: The web project uses Next.js 16.2.1 with significant API changes from earlier versions. Always check `node_modules/next/dist/docs/` for current patterns before writing code.

### Mobile (Expo)
```bash
cd mobile

# Start Expo dev server (interactive menu for iOS/Android/Web)
npm run start

# Build for Android
npm run android

# Build for iOS
npm run ios

# Web variant
npm run web
```

### Database
```bash
cd supabase

# Supabase configuration is in config.toml
# Check Supabase dashboard for migrations and schema
```

## Architecture & Key Patterns

### Next.js App Structure (web/)
- **src/app**: App Router pages (Next.js 13+ style with file-based routing)
  - `page.tsx`: Root landing page with hero, features, and CTA sections
  - `onboarding/`, `signup/`: Feature routes
  - `layout.tsx`: Root layout with metadata, fonts (Geist + Inter), and global styles
- **src/components/ui**: Shadcn/Base-UI component library (Base-UI React components)
- **src/lib**: Utilities like `cn()` for classname merging (clsx + tailwind-merge pattern)

### Styling
- **Tailwind CSS 4** with PostCSS integration
- **Dark theme by default**: Root uses `bg-[#030712]` (near-black with subtle blue tint)
- **Indigo/purple accent colors**: Gradients and shadows often use `indigo-500` and `purple-600`
- Class utility pattern: Use `cn()` helper from `@/lib/utils` to merge Tailwind classes safely

### UI Components
- **Base-UI React** (`@base-ui/react`) for unstyled, accessible components
- **Shadcn** configured but components live in `src/components/ui`
- **Lucide React** for icons
- All styled with Tailwind CSS

### Authentication & Backend
- **Supabase** for database, auth, and realtime features
- Client integration via `@supabase/supabase-js`
- Environment variables in `.env` and `.env.local` (check `.gitignore` for secrets)

### Mobile Architecture
- **React Native** with **Expo** for cross-platform builds (iOS/Android/Web)
- **React Navigation**: Bottom tabs + native stack for routing
- **Async Storage**: Local data persistence
- **Location & Image Picker**: Expo native modules
- Maps support via `react-native-maps`
- TypeScript for type safety

### Path Aliases
```json
{
  "@/*": ["./src/*"]  // Both web and mobile
}
```
Use `@/components`, `@/lib`, etc. for imports to avoid relative paths.

## Conventions & Important Notes

### Code Style
- **TypeScript strict mode** enabled across both projects
- **ESLint** with Next.js config (web only) — no additional linters configured
- **No Prettier**: Rely on manual formatting or ESLint's limited formatting rules
- Component naming: PascalCase for React components, camelCase for utilities

### React 19 Changes
Web uses React 19.2.4 and Next.js 16.2.1. Key differences from older versions:
- New `use()` hook for promises
- Updated JSX transform
- Server Components are default in Next.js App Router
- Always read deprecation notices in Next.js docs

### Mobile Development
- Expo version 55.0.8+ — stay current with dependency versions
- TypeScript is loose (`skipLibCheck: true`) on mobile for compatibility
- Test on physical devices or emulators; web variant via `npm run web`

### Environment Configuration
- Web and mobile each have `.env` and `.env.local` (Git-ignored)
- No secrets should be committed
- Supabase credentials typically stored in these env files

### Import Patterns
- Avoid deep relative imports (`../../components/`)
- Always use path aliases (`@/components`, `@/lib`) when available
- Group imports: React/third-party, local aliases, side effects

## Supabase Integration

The project includes a Supabase skill/configuration folder. Reference `.agents/skills/supabase-postgres-best-practices/` for:
- Postgres query optimization patterns
- Index recommendations
- Common schema design decisions
- Performance considerations

Check `supabase/config.toml` for database configuration and use the Supabase CLI/dashboard for migrations.
