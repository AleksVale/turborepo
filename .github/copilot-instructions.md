# Copilot Instructions

## Project Overview

This is a Turborepo monorepo for a digital product management SIG (Sistema Integrado de Gestão) with NestJS backend, React frontend, and shared TypeScript types. The backend follows **Clean Architecture** principles with strict layer separation.

## Architecture

### Backend Structure (Clean Architecture)

The backend (`backend/src/`) is organized in layers, **NOT** using NestJS module-per-feature pattern:

```
backend/src/
├── domain/              # Pure business logic, zero external dependencies
│   ├── entities/        # Rich domain models (User, Role) with behavior
│   ├── repositories/    # Repository interfaces (contracts)
│   └── value-objects/   # Email, Password with validation
├── application/         # Use cases and orchestration
│   ├── use-cases/       # Business workflows (RegisterUser, LoginUser)
│   └── dtos/            # Input/output DTOs with class-validator + Swagger
├── infrastructure/      # Technical implementations
│   ├── database/prisma/ # Prisma repos + mappers (Domain ↔ Prisma)
│   └── auth/            # HashService, TokenService (bcrypt, JWT)
├── presentation/        # HTTP layer (NestJS)
│   ├── controllers/     # REST endpoints
│   ├── guards/          # JwtGuard, RolesGuard
│   ├── decorators/      # @CurrentUser, @Roles
│   └── modules/         # NestJS modules for DI wiring
└── config/              # Zod-based env validation
```

**Critical Rules:**

- Domain layer never imports from infrastructure or presentation
- Repositories use **abstract classes** in domain, implementations in infrastructure
- Use abstract classes for repository contracts to enable NestJS DI without `@Inject` decorator
- Mappers (`UserMapper`, `RoleMapper`) live in `infrastructure/database/prisma/mappers/`
- Value objects (Email, Password) enforce validation in constructors

### Database & Prisma

- Schema: `backend/prisma/schema.prisma` (PostgreSQL)
- Generated client: `@prisma/client` (default output, NOT custom path)
- Nx targets handle Prisma workflow:
  - `nx run backend:prisma-generate` - Generate client (runs before build)
  - `nx run backend:prisma-migrate-dev -- --name <migration-name>` - Create + apply migration
  - `nx run backend:prisma-studio` - Open Prisma Studio

**Never edit `backend/generated/` manually** - it's Prisma's output directory (git-ignored).

### DTOs & Validation

All DTOs use:

- `class-validator` decorators (`@IsEmail`, `@IsNotEmpty`, etc.)
- `@nestjs/swagger` `@ApiProperty` for OpenAPI docs
- Properties marked with `!` for strict TypeScript: `email!: string`
- For nested objects in responses, create separate DTO classes (e.g., `AuthUserDto` inside `AuthResponseDto`)

### Environment Configuration

- Env vars validated via Zod schema in `backend/src/infrastructure/config/env.validation.ts`
- Registered in `AppModule` via `ConfigModule.forRoot({ validate: validateEnv })`
- Required vars: `DATABASE_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `NODE_ENV`, `PORT`, `ADMIN_DEFAULT_PASSWORD`

## Turborepo Workflows & Best Practices

### Estrutura do Monorepo

```
apps/
  backend/      # NestJS API (src/, prisma/, etc)
  web/          # Next.js frontend
  docs/         # Documentação/landing
packages/
  shared-types/ # Tipos TypeScript compartilhados
  eslint-config/# Configuração ESLint compartilhada
  typescript-config/ # Configuração TS compartilhada
  ui/           # Componentes React compartilhados
```

### Instalação de Dependências

- Sempre use `npm install <package> --workspace=<app-ou-lib>` para instalar dependências em apps/libs específicos.
- Para dependências compartilhadas, instale em `packages/` ou no root se for global.
- Evite dependências duplicadas entre apps/libs; prefira instalar no workspace correto.

### Scripts e Build

- Use scripts do root para rodar builds, lint, test, etc. Exemplo:
  - `npm run build` (roda build em todos apps/libs)
  - `npm run dev` (roda todos apps/libs em modo dev)
- Cada app/lib pode ter seus próprios scripts em seu `package.json`.

### Caching e Pipeline

- Aproveite o cache inteligente do Turborepo para builds, lint, test e outros scripts.
- Configure `turbo.json` para pipelines customizadas e dependências entre tarefas.
- Use `dependsOn` para garantir ordem de build entre libs e apps.

### Integração entre Apps e Libs

- Apps e libs se comunicam via importação direta dos pacotes (ex: `@tcc/shared-types`).
- Garanta que cada lib tem `package.json` com nome único e exporta tipos/componentes corretamente.
- Use `paths` no `tsconfig.json` dos apps para facilitar importação absoluta das libs internas.

### Boas Práticas Turborepo

- Centralize configurações de ESLint e TypeScript em `packages/eslint-config` e `packages/typescript-config`.
- Use `prettier` e `eslint` compartilhados para padronizar o código.
- Evite duplicação de código entre apps/libs; extraia para pacotes em `packages/`.
- Use tipagem forte e DTOs para comunicação entre backend e frontend.
- Aproveite o cache e paralelismo do Turborepo para builds/testes rápidos.

### Exemplos de Scripts

- `npm run build --workspace=apps/backend` (build só do backend)
- `npm run lint --workspace=apps/web` (lint só do web)
- `npm run dev` (dev em todos apps/libs)

### CI/CD

- Configure pipelines para rodar scripts em paralelo e aproveitar o cache do Turborepo.
- Use `turbo prune` para deploys otimizados.

### Referências

- Docs Turborepo: https://turbo.build/repo/docs

## Shared Types Library

`shared-types` exports TypeScript interfaces matching Prisma schema + DTOs. Frontend and backend consomem via importação direta:

- Adicione `@tcc/shared-types` como dependência nos apps/libs que precisam das tipagens.
- Importe tipos normalmente: `import { User } from '@tcc/shared-types';`

## Development Patterns

### Authentication Flow

1. **Register**: `RegisterUserUseCase` → validate Email/Password value objects → hash password → save via repository
2. **Login**: `LoginUserUseCase` → find user → verify password → generate JWT pair (access + refresh)
3. **Refresh**: `RefreshTokenUseCase` → verify refresh token → issue new token pair

Token secrets must be ≥32 chars (enforced by Zod validation).

### Adding New Features

When creating new domain modules:

1. Define entities in `domain/entities/` with rich behavior (not anemic models)
2. Create repository interface in `domain/repositories/`
3. Implement Prisma repository in `infrastructure/database/prisma/repositories/`
4. Create mapper in `infrastructure/database/prisma/mappers/` for Prisma ↔ Domain conversion
5. Build use cases in `application/use-cases/`
6. Wire up in presentation layer (controller → use case)
7. Register providers in a NestJS module with proper DI tokens

### File Creation

Ao criar novas libs ou apps, use `npm create workspace <name>` ou crie a pasta manualmente em `apps/` ou `packages/`.
Evite duplicação de código; extraia para libs em `packages/`.

## Common Pitfalls

- ❌ Não importar tipos do `@prisma/client` na camada de domínio; use entidades do domínio.
- ❌ Não criar libs dentro de `apps/backend`; mantenha libs em `packages/`.
- ❌ Não duplicar dependências entre apps/libs; instale no workspace correto.
- ✅ Use scripts do Turborepo para build/lint/test.
- ✅ Centralize configurações em `packages/eslint-config` e `packages/typescript-config`.
- ✅ Use DTOs e tipagem forte para comunicação entre camadas.

## Code Style Guidelines

**Self-Documenting Code:**

- **NEVER add comments to explain code** - if code needs comments, refactor it to be self-explanatory
- Use descriptive variable and function names that reveal intent
- Break complex logic into small, well-named functions
- Good: `const isUserEligibleForDiscount = user.totalPurchases > 100`
- Bad: `const x = user.tp > 100 // check if user can get discount`

**Exceptions where comments ARE allowed:**

- Complex business rules mandated by external requirements
- Workarounds for known third-party library bugs (include issue link)
- TODO/FIXME with ticket reference

## API Response Decorators

**ALWAYS use custom response decorators instead of NestJS built-in decorators:**

- ❌ **NEVER use** `@ApiOkResponse()` from NestJS - it will cause errors
- ✅ **ALWAYS use** `@ApiOkResponseDecorator()` for success responses (single entity or arrays)
- ✅ **ALWAYS use** `@ApiOkResponsePaginated()` for paginated responses
- ✅ **ALWAYS return** `ControllerResponseDto<T>` wrapper for all responses

**Critical Rules:**

- All controller methods returning data must use `@ApiOkResponseDecorator()` or `@ApiOkResponsePaginated()`
- Paginated endpoints must use `@ApiOkResponsePaginated()` decorator
- Single entity or array responses must use `@ApiOkResponseDecorator()` decorator
- Never mix custom and NestJS built-in response decorators
- Always wrap response data in `ControllerResponseDto<T>` format

## Commit Message Guidelines

This project uses **Conventional Commits** with strict validation via commitlint.

**Format:**

```
<type>[optional scope]: <description>

[optional body]

[optional footer]
```

**Rules:**

- Header: max 100 characters
- Subject: max 50 characters, lowercase, no period
- Body: max 100 chars per line, blank line before body
- Footer: max 100 chars per line, blank line before footer

**Types:**

- `feat`: new feature
- `fix`: bug fix
- `docs`: documentation only
- `style`: formatting, whitespace (no code change)
- `refactor`: code refactor (no feat/fix)
- `perf`: performance improvement
- `test`: add/update tests
- `build`: build system/dependencies
- `ci`: CI configuration
- `chore`: other changes (no src/test)
- `revert`: revert previous commit

**Examples:**

- `feat(auth): add JWT token generation`
- `fix(database): resolve connection timeout`
- `docs: update API documentation`
- `refactor(user): extract validation to value object`

**Breaking changes:** Add `!` after type/scope: `feat(api)!: change response format`

**When generating commit messages:**

- **ALWAYS use Conventional Commits format** - never use generic messages like "update files" or "fix errors"
- Include appropriate scope based on affected area: `(auth)`, `(database)`, `(user)`, `(config)`, etc.
- Keep description clear and concise (max 50 chars)
- Use imperative mood: "add", "fix", "update", not "added", "fixed", "updated"
- For TypeScript/lint fixes: use `fix(scope): resolve typescript errors in <component>`
- For refactoring: use `refactor(scope): <what was improved>`
- For new features: use `feat(scope): <what was added>`

## Project Context

SaaS para gestão de produtos digitais, integrações com Kiwify, Hotmart, Eduzz, Facebook Ads. Autorização RBAC. Autenticação JWT self-hosted.

## Frontend Structure (React Router v7 + shadcn/ui)

The frontend (`apps/web/`) follows a **strict 3-layer architecture** with clear separation of concerns:

```
apps/web/app/
├── routes/              # PRESENTATION LAYER
│   └── *.tsx            # Pages/Routes - ONLY UI rendering
├── hooks/               # LOGIC LAYER
│   └── *.ts             # Custom hooks - orchestration & state management
├── services/            # DATA LAYER
│   └── *.service.ts     # API calls - HTTP communication only
├── lib/
│   └── http/            # HTTP INFRASTRUCTURE
│       ├── api-client.ts    # Axios instance with interceptors
│       └── endpoints.ts     # API endpoint constants
└── components/
    └── ui/              # shadcn/ui components
```

### 🎯 Critical Frontend Architecture Rules

**MANDATORY 3-LAYER STRUCTURE:**

```
Routes (UI) → Hooks (Logic) → Services (API)
```

#### 1. **Routes/Pages** (`app/routes/*.tsx`)

**ONLY allowed:**

- ✅ UI rendering (JSX/components)
- ✅ Calling custom hooks
- ✅ Local UI state (modals, tabs, tooltips)
- ✅ Visual layout and styling

**NEVER allowed:**

- ❌ Direct API calls
- ❌ Importing `apiClient` or services
- ❌ Complex data transformations
- ❌ Business logic

```tsx
// ✅ CORRECT
export default function ProductsPage() {
  const { products, isLoading, error } = useProducts();

  return (
    <div>
      {products?.map((p) => (
        <ProductCard {...p} />
      ))}
    </div>
  );
}

// ❌ WRONG - calling API directly
export default function ProductsPage() {
  useEffect(() => {
    apiClient.get("/products").then(setProducts); // NO!
  }, []);
}
```

#### 2. **Hooks** (`app/hooks/*.ts`)

**ONLY allowed:**

- ✅ Calling services (via `useApi` hook)
- ✅ Managing UI-related state
- ✅ Data transformations for presentation
- ✅ Navigation (`useNavigate`)
- ✅ Side effects (`useEffect`)

**NEVER allowed:**

- ❌ Importing `apiClient` directly
- ❌ Direct Axios calls
- ❌ Complex business logic (move to backend)

```tsx
// ✅ CORRECT
import { useApi } from "./use-api";
import { productService } from "~/services/product.service";

export function useProducts() {
  const { data, error, isLoading, execute } = useApi(productService.list);

  return {
    products: data?.data,
    error,
    isLoading,
    fetchProducts: execute,
  };
}

// ❌ WRONG - calling apiClient directly
import { apiClient } from "~/lib/http";

export function useProducts() {
  const fetch = () => apiClient.get("/products"); // NO!
}
```

#### 3. **Services** (`app/services/*.service.ts`)

**ONLY allowed:**

- ✅ Calling `apiClient` methods
- ✅ Using `API_ENDPOINTS` constants
- ✅ Data transformations
- ✅ TypeScript interfaces for requests/responses

**NEVER allowed:**

- ❌ React hooks (`useState`, `useEffect`, etc.)
- ❌ UI logic or navigation
- ❌ Loading/error state management (that's for hooks)

```tsx
// ✅ CORRECT
import { apiClient } from "~/lib/http/api-client";
import { API_ENDPOINTS } from "~/lib/http/endpoints";

export const productService = {
  async list(page = 1, limit = 10) {
    return apiClient.get(
      `${API_ENDPOINTS.PRODUCTS.LIST}?page=${page}&limit=${limit}`
    );
  },
};

// ❌ WRONG - using React hooks
import { useState } from "react";

export const productService = {
  list: () => {
    const [data, setData] = useState([]); // NO! Services don't use hooks
  },
};
```

### 🔄 Frontend Data Flow

```
User clicks button in ROUTE
    ↓
ROUTE calls hook method: fetchProducts()
    ↓
HOOK executes service: productService.list()
    ↓
SERVICE calls API: apiClient.get('/products')
    ↓
apiClient adds auth headers & makes request
    ↓
Response flows back up the chain
    ↓
HOOK updates state (data, loading, error)
    ↓
ROUTE re-renders with new data
```

### 📋 Frontend Development Checklist

When creating a new feature:

1. **Define endpoints** in `app/lib/http/endpoints.ts`
2. **Create service** in `app/services/*.service.ts` (API calls only)
3. **Create hook** in `app/hooks/*.ts` (orchestration & state)
4. **Create route** in `app/routes/*.tsx` (UI only)

### 🎨 shadcn/ui Integration

- **ALWAYS use shadcn/ui color system** (never hardcode Tailwind colors)
- Use CSS variables: `bg-card`, `text-foreground`, `border-border`, etc.
- Install components: `npx shadcn@latest add <component>`
- Components location: `app/components/ui/`

**Color System:**

```tsx
// ✅ CORRECT - using shadcn variables
<div className="bg-card text-card-foreground border-border">

// ❌ WRONG - hardcoded Tailwind colors
<div className="bg-white text-gray-900 border-gray-200">
```

### 🔐 Authentication Pattern

```tsx
// Hook handles auth logic
const { login, isLoginLoading, loginError } = useAuth();

// Route only displays UI
<Button onClick={() => login({ email, password })} disabled={isLoginLoading}>
  {isLoginLoading ? <Loader /> : "Login"}
</Button>;
```

### 📦 Frontend Dependencies

- **React Router v7** for routing
- **Axios** for HTTP requests
- **shadcn/ui** for UI components
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **React Hook Form** for form state management
- **Zod** for schema validation

### � Form Management with React Hook Form + Zod

**MANDATORY form pattern:**

1. **Validation Schema** - Create in `routes/<route-name>/validation.ts`
2. **useForm Hook** - Manage form state with React Hook Form
3. **Zod Resolver** - Validate with `zodResolver`
4. **shadcn/ui Form** - Use Form components for consistency

#### Form Structure Example:

```typescript
// ✅ CORRECT - app/routes/login/validation.ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "E-mail é obrigatório").email("E-mail inválido"),
  password: z
    .string()
    .min(1, "Senha é obrigatória")
    .min(6, "A senha deve ter no mínimo 6 caracteres"),
  rememberMe: z.boolean().default(false),
});

export type LoginFormData = z.infer<typeof loginSchema>;
```

```tsx
// ✅ CORRECT - app/routes/login.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { loginSchema, type LoginFormData } from "./login/validation";

export default function LoginPage() {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    // Handle form submission
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input type="email" placeholder="seu@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Enviar</Button>
      </form>
    </Form>
  );
}
```

**Form Rules:**

- ✅ Always create validation schema in `routes/<route-name>/validation.ts`
- ✅ Use Zod for all form validations
- ✅ Use `zodResolver` to integrate with React Hook Form
- ✅ Use shadcn/ui `Form` components (`FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormMessage`)
- ✅ Export types with `z.infer<typeof schema>`
- ✅ Use descriptive error messages in Portuguese for user-facing forms
- ❌ Never use uncontrolled forms or manual `useState` for form data
- ❌ Never mix validation libraries (only Zod)
- ❌ Never put validation schemas inside route files

**Validation Schema Location:**

```
app/routes/
├── login/
│   └── validation.ts     # Login form schema
├── login.tsx
├── register/
│   └── validation.ts     # Register form schema
└── register.tsx
```

### �🚫 Frontend Anti-Patterns

❌ **NEVER do these:**

- Call APIs directly in routes/pages
- Import `apiClient` in hooks (use services instead)
- Use React hooks in services
- Hardcode API URLs (use `API_ENDPOINTS`)
- Hardcode Tailwind colors (use shadcn variables)
- Mix business logic with UI rendering
- Use `useState` for form data (use React Hook Form)
- Create validation schemas inside route files
- Mix validation libraries (only Zod)

### 📚 Reference Documentation

See detailed architecture guide: `.github/CODE_STRUCTURE.md`
See HTTP client guide: `apps/web/HTTP_SERVICES.md`
