# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NestJS backend API for a Phonebook/Contact Manager. JWT authentication via HTTP-only cookies, PostgreSQL database with Prisma ORM. See `SPEC.md` for full requirements.

## Commands

```bash
# Development
npm run start:dev          # Start with watch mode (hot reload)
npm run build              # Compile TypeScript
npm run start:prod         # Run compiled production build

# Testing
npm test                   # Run unit tests (Jest)
npm test -- --testPathPattern='auth' # Run tests matching pattern
npm run test:watch         # Run tests in watch mode
npm run test:e2e           # Run e2e tests (uses test/jest-e2e.json config)
npm run test:cov           # Run tests with coverage

# Code Quality
npm run lint               # ESLint with auto-fix
npm run format             # Prettier formatting

# Database
npx prisma migrate dev     # Apply schema migrations (development)
npx prisma db pull         # Introspect existing database
npx prisma generate        # Regenerate Prisma client
```

## Architecture

- **Framework:** NestJS 11 with Express, TypeScript, module-based architecture
- **API prefix:** `api/v1`
- **Auth:** JWT tokens stored in HTTP-only cookies, protected routes use NestJS AuthGuards
- **Database:** PostgreSQL via Prisma ORM — schema in `prisma/schema.prisma`, generated client outputs to `generated/prisma/`
- **Validation:** DTOs with class-validator/class-transformer
- **Error handling:** Global exception filters returning structured `{ statusCode, message, errors[] }` responses
- **Config:** Environment variables via `.env`, loaded through `@nestjs/config`

### Entities

- **User:** id, email, hashed password, timestamps
- **Contact:** id, name, phone, email, address, notes, userId (owner), timestamps

### NestJS Conventions

- Unit tests colocated with source files as `*.spec.ts`
- E2E tests in `test/` directory as `*.e2e-spec.ts`
- Source root is `src/`, output to `dist/`
- Use `@nestjs/schematics` for generating modules/controllers/services (`nest generate`)

## Code Style

- Single quotes, trailing commas (Prettier config in `.prettierrc`)
- `@typescript-eslint/no-explicit-any` is disabled
- `@typescript-eslint/no-floating-promises` and `@typescript-eslint/no-unsafe-argument` are warnings
- ESLint uses flat config format (`eslint.config.mjs`)
- TypeScript target: ES2023, module: nodenext
