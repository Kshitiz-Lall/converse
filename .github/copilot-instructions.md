# DevToolkit - AI Agent Instructions

## Project Overview
DevToolkit is a comprehensive suite of web-based developer utilities with a **modular monorepo architecture**. The codebase consists of a TypeScript Express backend and React 19 + TypeScript frontend, designed for easy expansion with new tools.

## Architecture & Key Patterns

### Backend Structure (`/backend`)
- **Express + TypeScript** with strict type checking
- **Controller-Service-Model pattern**: Controllers handle requests, services contain business logic, utilities handle reusable functions
- **Standardized responses**: Use `responseUtils.successResponse()` and `responseUtils.errorResponse()` - never return raw JSON
- **Middleware chain**: `helmet` → `compression` → `cors` → `morgan` → routes → `errorHandler`
- **MongoDB + Mongoose**: Models in `/models` with comprehensive schemas (see `User.ts` for reference patterns)

### Frontend Structure (`/frontend`)
- **React 19 + Vite + TypeScript** with path aliases (`@/` → `src/`)
- **Route-based architecture**: All routes defined in `/routes/index.tsx` with lazy loading and `RequireAuth` wrapper
- **shadcn/ui + Tailwind**: Use `cn()` utility from `/lib/utils.ts` for conditional classes
- **Tool categorization**: Tools are organized by categories in `toolCategories` export - always update this when adding new features

### Authentication & Authorization
- **JWT-based auth**: Tokens stored in localStorage/sessionStorage
- **Role-based access**: `user|admin|moderator` roles in User model
- **Protected routes**: Wrap with `<RequireAuth>` component for authenticated access
- **Middleware**: `authMiddleware.ts` and `adminMiddleware.ts` for backend protection

## Development Workflows

### Backend Development
```bash
# Development with hot reload
npm run dev

# Build TypeScript
npm run build

# Production start
npm start

# LLM Poller (unique feature)
npm run poller:dev    # Development
npm run poller:start  # Production
```

### Frontend Development
```bash
# Development server
npm run dev

# Build for production
npm run build

# Lint and format
npm run lint:fix
npm run format
```

## Critical Project-Specific Conventions

### API Patterns
- **Always use responseUtils**: `successResponse(res, data, message)` and `errorResponse(res, error, statusCode)`
- **Controller validation**: Validate all required fields before processing
- **Error handling**: Global error handler catches all unhandled errors
- **Route structure**: `/api/{feature}` for main routes, `/api/admin/{feature}` for admin routes

### Frontend Component Patterns
- **Lazy loading**: All page components use `lazy()` with Suspense fallback
- **Tool availability**: Use `available: boolean` flag in tool configs - disabled tools show "Coming Soon"
- **Theme consistency**: Dark theme by default, uses `ThemeProvider` context
- **Navigation**: Central `NavMenu` with dropdown categories for tools

### Data Flow Patterns
- **Frontend config**: API_URL from `VITE_API_URL` env var or localhost:3000 fallback
- **Image processing**: Use Sharp library in `imageService.ts` with comprehensive options
- **JWT handling**: `jwtUtils.ts` for token operations, automatic token validation

## Integration Points & External Dependencies

### Backend Dependencies
- **MongoDB**: Primary database with Mongoose ODM
- **Redis**: Planned for caching (ioredis package installed)
- **Sharp**: Image processing and optimization
- **JWT**: Authentication tokens
- **Axios**: HTTP client for external APIs

### Frontend Dependencies
- **Radix UI**: Accessible UI primitives (all `@radix-ui/react-*` packages)
- **Lucide React**: Icon system
- **React Router DOM**: Navigation with v7
- **Zod**: Runtime type validation
- **Sonner**: Toast notifications

### Unique Features
- **LLM Leaderboard Poller**: Background service that fetches and caches LLM performance data
- **Multi-format converters**: JSON/YAML/XML with comprehensive error handling
- **Image optimizer**: Web-optimized image processing with multiple format support
- **Tool categorization system**: Extensible category-based tool organization

## File Organization Patterns

### Adding New Tools
1. **Backend**: Create controller in `/controllers`, service in `/services`, routes in `/routes`
2. **Frontend**: Create page in `/pages`, add to `toolCategories` in `/routes/index.tsx`
3. **Types**: Define interfaces in `/types` (backend) or component-level types (frontend)
4. **Documentation**: Add docs page in `/pages/documentation`

### Configuration Files
- **Backend**: `tsconfig.json` with ES2020 target, strict mode enabled
- **Frontend**: Vite config with Tailwind plugin and path aliases
- **Environment**: Use `.env` files, prefix frontend vars with `VITE_`

## Testing & Quality
- **ESLint**: Configured for TypeScript with React hooks
- **Prettier**: Code formatting with lint-staged pre-commit hooks
- **Husky**: Git hooks for automated quality checks
- **TypeScript**: Strict mode enabled across both frontend and backend

## Key Commands & Scripts
- Backend poller is unique: `npm run poller:watch` for development
- Frontend has comprehensive linting: `npm run lint:fix` fixes most issues
- Build both projects independently: separate package.json files
- Use absolute paths with `@/` alias in frontend for imports