export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    REFRESH: "/auth/refresh",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
  },
  USERS: {
    LIST: "/users",
    GET: (id: string) => `/users/${id}`,
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
  },
  PRODUCTS: {
    LIST: "/products",
    GET: (id: string) => `/products/${id}`,
    CREATE: "/products",
    UPDATE: (id: string) => `/products/${id}`,
    DELETE: (id: string) => `/products/${id}`,
  },
  INTEGRATIONS: {
    KIWIFY: {
      CONNECT: "/integrations/kiwify/connect",
      DISCONNECT: "/integrations/kiwify/disconnect",
    },
    HOTMART: {
      CONNECT: "/integrations/hotmart/connect",
      DISCONNECT: "/integrations/hotmart/disconnect",
    },
    FACEBOOK: {
      CONNECT: "/integrations/facebook/connect",
      DISCONNECT: "/integrations/facebook/disconnect",
      ADS: "/integrations/facebook/ads",
    },
    GOOGLE_ADS: {
      CONNECT: "/integrations/google-ads/connect",
      DISCONNECT: "/integrations/google-ads/disconnect",
    },
  },
  ORDERS: {
    LIST: "/orders",
    GET: (id: string) => `/orders/${id}`,
    CREATE: "/orders",
    UPDATE: (id: string) => `/orders/${id}`,
    DELETE: (id: string) => `/orders/${id}`,
  },
} as const;
