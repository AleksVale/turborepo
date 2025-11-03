# Estrutura de Código e Padrões de Desenvolvimento

## 📋 Arquitetura de Componentes

### Regra Fundamental: Separação de Responsabilidades

Toda funcionalidade deve seguir a estrutura de 3 camadas:

```
Pages/Routes → Hooks → Services
```

### 1. **Pages/Routes** (`app/routes/*.tsx`)

**Responsabilidade:** Apenas UI e apresentação

✅ **Permitido:**
- Renderização de componentes UI
- Estrutura visual (layout, grids, cards)
- Chamadas de hooks customizados
- Estados locais de UI (modais, tooltips, tabs)
- Validação visual de formulários

❌ **Proibido:**
- Lógica de negócio
- Chamadas diretas a APIs/serviços
- Manipulação complexa de dados
- Lógica de autenticação
- Transformações de dados

**Exemplo:**
```tsx
// ✅ CORRETO
export default function ProductsPage() {
  const { products, isLoading, error, fetchProducts } = useProducts();
  
  return (
    <div>
      {isLoading && <Loader />}
      {error && <ErrorMessage error={error} />}
      {products?.map(product => <ProductCard key={product.id} product={product} />)}
    </div>
  );
}

// ❌ ERRADO
export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    // NÃO fazer chamadas diretas à API aqui!
    apiClient.get('/products').then(setProducts);
  }, []);
  
  return <div>...</div>;
}
```

### 2. **Hooks** (`app/hooks/*.ts`)

**Responsabilidade:** Lógica de apresentação e orquestração

✅ **Permitido:**
- Chamar services
- Gerenciar estados relacionados à UI
- Callbacks e event handlers
- Transformações de dados para apresentação
- Navegação (useNavigate)
- Efeitos colaterais (useEffect)
- Composição de múltiplos hooks

❌ **Proibido:**
- Chamadas diretas ao Axios/API client
- Lógica de negócio complexa
- Importar `apiClient` diretamente

**Exemplo:**
```tsx
// ✅ CORRETO - app/hooks/use-products.ts
import { useApi } from './use-api';
import { productService } from '~/services/product.service';

export function useProducts() {
  const {
    data: productsData,
    error,
    isLoading,
    execute: fetchProducts,
  } = useApi(productService.list);

  const createProduct = useCallback(async (data: CreateProductData) => {
    return productService.create(data);
  }, []);

  return {
    products: productsData?.data,
    meta: productsData?.meta,
    error,
    isLoading,
    fetchProducts,
    createProduct,
  };
}

// ❌ ERRADO
import { apiClient } from '~/lib/http';

export function useProducts() {
  const fetchProducts = async () => {
    // NÃO chamar apiClient diretamente!
    return apiClient.get('/products');
  };
  
  return { fetchProducts };
}
```

### 3. **Services** (`app/services/*.service.ts`)

**Responsabilidade:** Comunicação com API e lógica de dados

✅ **Permitido:**
- Chamadas ao `apiClient`
- Uso de constantes de `API_ENDPOINTS`
- Transformações de dados da API
- Tipagem de requests/responses
- Validações de dados

❌ **Proibido:**
- Lógica de UI
- Uso de hooks do React
- Navegação
- Estados de loading/error (isso é responsabilidade dos hooks)

**Exemplo:**
```tsx
// ✅ CORRETO - app/services/product.service.ts
import { apiClient } from '~/lib/http/api-client';
import { API_ENDPOINTS } from '~/lib/http/endpoints';

export interface Product {
  id: string;
  name: string;
  price: number;
}

export const productService = {
  async list(page = 1, limit = 10): Promise<PaginatedResponse<Product>> {
    return apiClient.get<PaginatedResponse<Product>>(
      `${API_ENDPOINTS.PRODUCTS.LIST}?page=${page}&limit=${limit}`
    );
  },

  async create(data: CreateProductData): Promise<{ data: Product }> {
    return apiClient.post<{ data: Product }>(API_ENDPOINTS.PRODUCTS.CREATE, data);
  },
};

// ❌ ERRADO
import { useState } from 'react'; // NÃO importar hooks do React!

export const productService = {
  async list() {
    const [data, setData] = useState([]); // Services não usam hooks!
    return data;
  },
};
```

## 🔄 Fluxo de Dados Completo

```
┌─────────────────────────────────────────────────────────────┐
│                          USER ACTION                         │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  PAGE/ROUTE (routes/*.tsx)                                  │
│  - Renderiza UI                                             │
│  - Chama hooks customizados                                 │
│  - const { data, isLoading, execute } = useProducts()       │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  HOOK (hooks/*.ts)                                          │
│  - Gerencia estado (loading, error, data)                  │
│  - Orquestra chamadas aos services                         │
│  - const { execute } = useApi(productService.list)         │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  SERVICE (services/*.service.ts)                            │
│  - Faz requisição HTTP                                      │
│  - apiClient.get(API_ENDPOINTS.PRODUCTS.LIST)              │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  API CLIENT (lib/http/api-client.ts)                       │
│  - Executa requisição Axios                                │
│  - Adiciona headers de autenticação                        │
│  - Trata erros globalmente                                 │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
                    BACKEND
```

## 📁 Estrutura de Arquivos

```
app/
├── routes/                      # CAMADA DE APRESENTAÇÃO
│   ├── login.tsx               # Tela de login
│   ├── products.tsx            # Lista de produtos
│   └── product-details.tsx     # Detalhes do produto
│
├── hooks/                       # CAMADA DE LÓGICA
│   ├── use-api.ts              # Hook genérico para APIs
│   ├── use-auth.ts             # Hook de autenticação
│   ├── use-products.ts         # Hook de produtos
│   └── index.ts                # Barrel exports
│
├── services/                    # CAMADA DE DADOS
│   ├── auth.service.ts         # Serviço de autenticação
│   ├── user.service.ts         # Serviço de usuários
│   ├── product.service.ts      # Serviço de produtos
│   └── integration.service.ts  # Serviço de integrações
│
├── lib/
│   └── http/                    # INFRAESTRUTURA HTTP
│       ├── api-client.ts       # Cliente Axios configurado
│       ├── endpoints.ts        # Constantes de endpoints
│       └── index.ts            # Exports públicos
│
└── components/
    └── ui/                      # COMPONENTES REUTILIZÁVEIS
        ├── button.tsx
        ├── input.tsx
        └── ...
```

## 🎯 Checklist para Nova Funcionalidade

Ao criar uma nova feature, siga esta ordem:

### 1️⃣ Definir Endpoints
```typescript
// app/lib/http/endpoints.ts
export const API_ENDPOINTS = {
  ORDERS: {
    LIST: '/orders',
    GET: (id: string) => `/orders/${id}`,
    CREATE: '/orders',
  },
};
```

### 2️⃣ Criar Service
```typescript
// app/services/order.service.ts
export const orderService = {
  async list() {
    return apiClient.get(API_ENDPOINTS.ORDERS.LIST);
  },
};
```

### 3️⃣ Criar Hook
```typescript
// app/hooks/use-orders.ts
export function useOrders() {
  const { data, isLoading, execute } = useApi(orderService.list);
  
  return {
    orders: data?.data,
    isLoading,
    fetchOrders: execute,
  };
}
```

### 4️⃣ Criar Page/Route
```typescript
// app/routes/orders.tsx
export default function OrdersPage() {
  const { orders, isLoading, fetchOrders } = useOrders();
  
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);
  
  return <div>{/* UI aqui */}</div>;
}
```

## 🚫 Anti-Padrões (NÃO FAZER)

### ❌ Chamar API diretamente na Page
```tsx
// ERRADO!
export default function ProductsPage() {
  useEffect(() => {
    apiClient.get('/products').then(setProducts);
  }, []);
}
```

### ❌ Lógica de negócio na Page
```tsx
// ERRADO!
export default function ProductsPage() {
  const calculateTotal = (products) => {
    // Lógica complexa aqui - deveria estar em um hook!
    return products.reduce((sum, p) => sum + p.price, 0);
  };
}
```

### ❌ Usar hooks do React em Services
```tsx
// ERRADO!
export const productService = {
  list: () => {
    const [data, setData] = useState([]); // Services não usam hooks!
  }
};
```

### ❌ Importar apiClient em Hooks
```tsx
// ERRADO!
import { apiClient } from '~/lib/http';

export function useProducts() {
  const fetch = () => apiClient.get('/products'); // Use services!
}
```

## ✅ Padrões Recomendados

### 1. **Composição de Hooks**
```tsx
// Combinar múltiplos hooks para funcionalidades complexas
export function useProductManagement() {
  const { products, fetchProducts } = useProducts();
  const { categories } = useCategories();
  const { isAdmin } = useAuth();
  
  return { products, categories, canEdit: isAdmin, fetchProducts };
}
```

### 2. **Callbacks Memoizados**
```tsx
export function useProducts() {
  const deleteProduct = useCallback(async (id: string) => {
    return productService.delete(id);
  }, []);
  
  return { deleteProduct };
}
```

### 3. **Tipagem Forte**
```tsx
// Sempre exportar tipos dos services
export interface Product {
  id: string;
  name: string;
  price: number;
}

export interface CreateProductData {
  name: string;
  price: number;
}
```

### 4. **Tratamento de Erros**
```tsx
// Pages apenas exibem erros, hooks gerenciam
export default function ProductsPage() {
  const { error } = useProducts();
  
  return (
    <>
      {error && <ErrorMessage message={error.message} />}
      {/* resto da UI */}
    </>
  );
}
```

## 📝 Nomenclatura

### Hooks
- Prefixo `use` obrigatório
- Nome descritivo da funcionalidade
- Exemplos: `useProducts`, `useAuth`, `useOrderManagement`

### Services
- Sufixo `.service.ts` obrigatório
- Nome no singular
- Exemplos: `product.service.ts`, `auth.service.ts`, `user.service.ts`

### Pages/Routes
- Nome descritivo da tela
- Kebab-case para arquivos
- PascalCase para componentes
- Exemplos: `product-list.tsx` → `ProductList()`, `login.tsx` → `Login()`

### Tipos/Interfaces
- PascalCase
- Sufixo descritivo quando necessário
- Exemplos: `Product`, `CreateProductData`, `ProductResponse`, `ApiError`

## 🔍 Code Review Checklist

Antes de fazer commit, verifique:

- [ ] Pages/Routes só contêm UI e chamadas a hooks?
- [ ] Hooks orquestram lógica e chamam services?
- [ ] Services só fazem chamadas à API?
- [ ] Não há importação de `apiClient` em hooks?
- [ ] Não há uso de hooks do React em services?
- [ ] Todos os tipos estão exportados?
- [ ] Erros são tratados em hooks e exibidos em pages?
- [ ] Loading states são gerenciados em hooks?

## 🎓 Exemplos Práticos

Ver documentação completa em `HTTP_SERVICES.md` e código de referência em:
- `app/routes/login.tsx` - Exemplo de página
- `app/hooks/use-auth.ts` - Exemplo de hook
- `app/services/auth.service.ts` - Exemplo de service
