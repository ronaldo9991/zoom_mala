# Zoom Mala Gold & Diamonds Website

## Overview

A premium luxury jewelry website for **ZOOM MALA GOLD & DIAMONDS L.L.C**, a Dubai-based gold and diamond trading company located in the Gold Souk, Deira. The website showcases their collections of fine jewelry, diamonds, precious stones, and luxury watches with a cinematic, editorial design that works flawlessly in both dark and light modes.

The application follows a full-stack architecture with a React frontend and Express backend, designed for deployment on Replit with PostgreSQL database support.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with custom plugins for Replit integration
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state
- **Styling**: TailwindCSS with shadcn/ui component library
- **Animations**: Framer Motion for smooth, luxury-feel transitions
- **Theming**: Custom ThemeProvider supporting dark/light mode with CSS variables

### Backend Architecture
- **Framework**: Express 5 on Node.js
- **Server Setup**: HTTP server with middleware for JSON parsing
- **Static Serving**: Production builds served from `dist/public`
- **Development**: Vite dev server middleware with HMR support

### Database Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` for type sharing between frontend/backend
- **Migrations**: Drizzle Kit for schema management (`drizzle-kit push`)
- **Validation**: Zod schemas generated from Drizzle schemas via `drizzle-zod`

### Project Structure
```
├── client/               # React frontend
│   ├── src/
│   │   ├── components/   # UI components (shadcn + custom)
│   │   ├── pages/        # Route pages (Home, About, Collections, etc.)
│   │   ├── lib/          # Utilities, assets config, query client
│   │   └── hooks/        # Custom React hooks
├── server/               # Express backend
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API route definitions
│   ├── storage.ts        # Data access layer interface
│   └── vite.ts           # Vite dev server setup
├── shared/               # Shared code between frontend/backend
│   └── schema.ts         # Drizzle schema definitions
└── migrations/           # Database migrations
```

### Key Design Decisions
1. **Monorepo Structure**: Frontend and backend in single repo with shared TypeScript types
2. **Path Aliases**: `@/` for client, `@shared/` for shared code
3. **Component Library**: shadcn/ui provides accessible, customizable base components
4. **Image Strategy**: External URLs from Unsplash/Pexels for luxury imagery
5. **Single WhatsApp CTA**: Global floating button only, no inline CTAs

## External Dependencies

### Database
- **PostgreSQL**: Primary database accessed via `DATABASE_URL` environment variable
- **Session Storage**: `connect-pg-simple` for session persistence

### Frontend Libraries
- **@radix-ui/***: Headless UI primitives for accessible components
- **framer-motion**: Animation library for smooth transitions
- **embla-carousel-react**: Carousel functionality
- **react-day-picker**: Date picker component
- **wouter**: Lightweight router (2KB)

### Backend Libraries
- **express**: Web framework
- **drizzle-orm**: Type-safe ORM
- **express-session**: Session management
- **zod**: Runtime validation

### Development Tools
- **Vite**: Build tool with React plugin
- **esbuild**: Production bundling for server
- **tsx**: TypeScript execution for development

### External Services
- **WhatsApp Business**: Contact via `https://wa.me/971545510007`
- **Google Fonts**: Cinzel (serif) and Inter (sans-serif) fonts
- **Unsplash/Pexels**: External image hosting for luxury imagery