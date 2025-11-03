# HTTP Client & Services Documentation

## 📁 Estrutura

```
app/
├── lib/
│   └── http/
│       ├── api-client.ts    # Cliente HTTP Axios configurado
│       ├── endpoints.ts     # Constantes de endpoints da API
│       └── index.ts         # Exports públicos
├── services/
│   ├── auth.service.ts      # Serviço de autenticação
│   ├── user.service.ts      # Serviço de usuários
│   └── product.service.ts   # Serviço de produtos
└── hooks/
    ├── use-api.ts           # Hook genérico para chamadas API
    ├── use-auth.ts          # Hook de autenticação
    └── index.ts             # Exports públicos
```

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto `apps/web`:

```env
VITE_API_URL=http://localhost:3000
```

## 🚀 Como Usar

### 1. API Client Direto

```typescript
import { apiClient, API_ENDPOINTS } from '~/lib/http';

// GET request
const data = await apiClient.get('/users');

// POST request
const response = await apiClient.post('/auth/login', {
  email: 'user@example.com',
  password: 'password123',
});
```

### 2. Usando Serviços

```typescript
import { authService } from '~/services/auth.service';
import { userService } from '~/services/user.service';
import { productService } from '~/services/product.service';

// Login
const { data } = await authService.login({
  email: 'user@example.com',
  password: 'password123',
});

// Listar usuários
const users = await userService.list(1, 10);

// Criar produto
const product = await productService.create({
  name: 'Produto Teste',
  price: 99.90,
});
```

### 3. Usando Hooks (Recomendado)

```typescript
import { useAuth } from '~/hooks';

function LoginComponent() {
  const { login, isLoginLoading, loginError } = useAuth();

  const handleLogin = async () => {
    try {
      await login({ email, password });
      // Redirecionamento automático após sucesso
    } catch (err) {
      // Erro já está em loginError
    }
  };

  return (
    <div>
      {loginError && <p>{loginError.message}</p>}
      <button onClick={handleLogin} disabled={isLoginLoading}>
        {isLoginLoading ? 'Carregando...' : 'Entrar'}
      </button>
    </div>
  );
}
```

### 4. Hook Genérico para Outras APIs

```typescript
import { useApi } from '~/hooks';
import { productService } from '~/services/product.service';

function ProductList() {
  const {
    data,
    error,
    isLoading,
    execute: fetchProducts,
  } = useApi(productService.list);

  useEffect(() => {
    fetchProducts(1, 10);
  }, [fetchProducts]);

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error.message}</div>;

  return (
    <div>
      {data?.data.map((product) => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}
```

## 🔐 Autenticação

O cliente HTTP gerencia automaticamente:

- **Tokens de acesso**: Armazenados em `localStorage` como `access_token`
- **Tokens de refresh**: Armazenados em `localStorage` como `refresh_token`
- **Headers de autorização**: Adicionados automaticamente em todas as requisições
- **Redirecionamento 401**: Usuário é redirecionado para `/login` ao perder autenticação

### Métodos de Autenticação

```typescript
import { authService } from '~/services/auth.service';

// Login
await authService.login({ email, password });

// Registro
await authService.register({ name, email, password });

// Refresh token
await authService.refreshToken();

// Logout
await authService.logout();

// Verificar se está autenticado
const isAuth = authService.isAuthenticated();

// Obter usuário atual
const user = await authService.getCurrentUser();
```

## 📡 Endpoints Disponíveis

### Auth
- `POST /auth/login` - Login
- `POST /auth/register` - Registro
- `POST /auth/refresh` - Refresh token
- `POST /auth/logout` - Logout
- `GET /auth/me` - Usuário atual

### Users
- `GET /users?page=1&limit=10` - Listar usuários
- `GET /users/:id` - Obter usuário
- `PUT /users/:id` - Atualizar usuário
- `DELETE /users/:id` - Deletar usuário

### Products
- `GET /products?page=1&limit=10` - Listar produtos
- `GET /products/:id` - Obter produto
- `POST /products` - Criar produto
- `PUT /products/:id` - Atualizar produto
- `DELETE /products/:id` - Deletar produto

### Integrations
- Kiwify, Hotmart, Facebook, Google Ads
- Ver `app/lib/http/endpoints.ts` para detalhes

## 🎯 Interceptors

### Request Interceptor
- Adiciona token de autenticação automaticamente
- Formato: `Authorization: Bearer <token>`

### Response Interceptor
- Trata erros 401 (não autorizado)
- Redireciona para login
- Limpa tokens

## 📝 Tipos e Interfaces

```typescript
// Erro da API
interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

// Resposta paginada
interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
```

## 🛠️ Tratamento de Erros

```typescript
try {
  await authService.login({ email, password });
} catch (err) {
  const apiError = err as ApiError;
  console.error(apiError.message);
  console.error(apiError.statusCode);
  console.error(apiError.errors); // Erros de validação
}
```

## 🔄 Criando Novos Serviços

1. Adicione os endpoints em `app/lib/http/endpoints.ts`:

```typescript
export const API_ENDPOINTS = {
  // ... outros endpoints
  ORDERS: {
    LIST: '/orders',
    GET: (id: string) => `/orders/${id}`,
    CREATE: '/orders',
  },
};
```

2. Crie o serviço em `app/services/order.service.ts`:

```typescript
import { apiClient } from '~/lib/http/api-client';
import { API_ENDPOINTS } from '~/lib/http/endpoints';

export const orderService = {
  async list() {
    return apiClient.get(API_ENDPOINTS.ORDERS.LIST);
  },
  
  async create(data: any) {
    return apiClient.post(API_ENDPOINTS.ORDERS.CREATE, data);
  },
};
```

3. Use com o hook `useApi`:

```typescript
import { useApi } from '~/hooks';
import { orderService } from '~/services/order.service';

const { execute: createOrder, isLoading } = useApi(orderService.create);
```

## 📚 Boas Práticas

1. ✅ **Use hooks** para componentes React
2. ✅ **Use serviços** para lógica reutilizável
3. ✅ **Trate erros** adequadamente
4. ✅ **Tipos TypeScript** para todas as interfaces
5. ✅ **Constantes** para endpoints (não hardcode URLs)
6. ❌ **Nunca** armazene senhas em localStorage
7. ❌ **Nunca** faça chamadas API direto no componente sem tratamento de erro
