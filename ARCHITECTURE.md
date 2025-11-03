# 📐 Estrutura de Código do Projeto

## ✅ O que foi implementado

### 1. **Documentação de Arquitetura**

📄 **`.github/CODE_STRUCTURE.md`**
- Regras completas de separação de responsabilidades
- Exemplos práticos de cada camada
- Checklist para novas funcionalidades
- Padrões e anti-padrões
- Fluxo de dados detalhado

### 2. **Copilot Instructions Atualizadas**

📄 **`.github/copilot-instructions.md`**
- Seção de Frontend Architecture adicionada
- Regras de 3 camadas documentadas
- Exemplos de código correto e incorreto
- Integração com shadcn/ui
- Referências cruzadas com documentação

### 3. **Estrutura Implementada**

```
apps/web/app/
├── routes/              # 🎨 UI Layer (Apenas apresentação)
├── hooks/               # 🧠 Logic Layer (Orquestração e estado)
├── services/            # 📡 Data Layer (Chamadas API)
└── lib/http/           # 🔧 HTTP Infrastructure
```

## 🎯 Regra de Ouro: 3 Camadas Obrigatórias

### Routes → Hooks → Services

```tsx
// ✅ SEMPRE ASSIM:

// 1. SERVICE (app/services/order.service.ts)
export const orderService = {
  async list() {
    return apiClient.get(API_ENDPOINTS.ORDERS.LIST);
  }
};

// 2. HOOK (app/hooks/use-orders.ts)
export function useOrders() {
  const { data, isLoading, execute } = useApi(orderService.list);
  return { orders: data?.data, isLoading, fetchOrders: execute };
}

// 3. ROUTE (app/routes/orders.tsx)
export default function OrdersPage() {
  const { orders, isLoading, fetchOrders } = useOrders();
  return <div>{orders?.map(o => <OrderCard {...o} />)}</div>;
}
```

## 🚫 O que NUNCA fazer

❌ **Chamar API na Route:**
```tsx
// ERRADO!
export default function OrdersPage() {
  useEffect(() => {
    apiClient.get('/orders').then(setOrders); // NÃO!
  }, []);
}
```

❌ **Importar apiClient no Hook:**
```tsx
// ERRADO!
import { apiClient } from '~/lib/http';

export function useOrders() {
  const fetch = () => apiClient.get('/orders'); // NÃO!
}
```

❌ **Usar hooks do React no Service:**
```tsx
// ERRADO!
import { useState } from 'react';

export const orderService = {
  list: () => {
    const [data, setData] = useState([]); // NÃO!
  }
};
```

## 📋 Checklist para Nova Funcionalidade

- [ ] 1. Adicionar endpoints em `app/lib/http/endpoints.ts`
- [ ] 2. Criar service em `app/services/*.service.ts`
- [ ] 3. Criar hook em `app/hooks/*.ts`
- [ ] 4. Criar route em `app/routes/*.tsx`
- [ ] 5. Verificar se não está importando `apiClient` em hooks
- [ ] 6. Verificar se não está usando hooks React em services
- [ ] 7. Verificar se route está apenas renderizando UI

## 📚 Exemplos Implementados

### ✅ Exemplo Completo: Sistema de Pedidos

**1. Endpoints** (`app/lib/http/endpoints.ts`)
```typescript
ORDERS: {
  LIST: '/orders',
  GET: (id: string) => `/orders/${id}`,
  CREATE: '/orders',
}
```

**2. Service** (`app/services/order.service.ts`)
```typescript
export const orderService = {
  async list(page = 1, limit = 10) {
    return apiClient.get(`${API_ENDPOINTS.ORDERS.LIST}?page=${page}&limit=${limit}`);
  },
  async create(data: CreateOrderData) {
    return apiClient.post(API_ENDPOINTS.ORDERS.CREATE, data);
  },
};
```

**3. Hook** (`app/hooks/use-orders.ts`)
```typescript
export function useOrders() {
  const { data, isLoading, execute } = useApi(orderService.list);
  const { execute: createOrder, isLoading: isCreating } = useApi(orderService.create);
  
  return {
    orders: data?.data,
    isLoading,
    fetchOrders: execute,
    createOrder,
    isCreating,
  };
}
```

**4. Route** (`app/routes/orders-example.tsx`)
```typescript
export default function OrdersPage() {
  const { orders, isLoading, fetchOrders, createOrder } = useOrders();
  
  useEffect(() => {
    fetchOrders(1, 10);
  }, [fetchOrders]);
  
  return (
    <div>
      {isLoading && <Loader />}
      {orders?.map(order => <OrderCard key={order.id} order={order} />)}
      <CreateOrderForm onSubmit={createOrder} />
    </div>
  );
}
```

## 🎨 Integração shadcn/ui

**SEMPRE use variáveis CSS do shadcn:**

```tsx
// ✅ CORRETO
<div className="bg-card text-card-foreground border-border">

// ❌ ERRADO
<div className="bg-white text-gray-900 border-gray-200">
```

## 📖 Documentação Relacionada

- **Arquitetura Detalhada**: `.github/CODE_STRUCTURE.md`
- **HTTP Client**: `apps/web/HTTP_SERVICES.md`
- **Copilot Instructions**: `.github/copilot-instructions.md`

## 🎓 Arquivos de Referência

Use estes arquivos como exemplo do padrão correto:

- **Route**: `app/routes/login.tsx`
- **Hook**: `app/hooks/use-auth.ts`
- **Service**: `app/services/auth.service.ts`
- **Exemplo Completo**: `app/routes/orders-example.tsx`

## 🔍 Validação

Antes de fazer commit, verifique:

✅ Routes só contêm UI e chamadas a hooks?  
✅ Hooks orquestram lógica e chamam services?  
✅ Services só fazem chamadas à API?  
✅ Não há importação de `apiClient` em hooks?  
✅ Não há uso de hooks React em services?  
✅ Cores estão usando variáveis shadcn?  

## 🚀 Próximos Passos

1. Sempre siga a estrutura de 3 camadas
2. Use os exemplos como referência
3. Consulte `.github/CODE_STRUCTURE.md` em caso de dúvida
4. Mantenha a separação de responsabilidades

---

**Esta estrutura garante:**
- 🧹 Código limpo e organizado
- 🔄 Fácil manutenção e testes
- 📚 Código autodocumentado
- 🎯 Responsabilidades bem definidas
- ♻️ Máxima reutilização de código
