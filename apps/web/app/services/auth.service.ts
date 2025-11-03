import { apiClient } from "~/lib/http/api-client";
import { API_ENDPOINTS } from "~/lib/http/endpoints";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  data: {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
    accessToken: string;
    refreshToken: string;
  };
}

export interface RefreshTokenResponse {
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );

    if (response.data.accessToken) {
      apiClient.setAuthToken(response.data.accessToken);
      if (typeof window !== "undefined") {
        localStorage.setItem("refresh_token", response.data.refreshToken);
      }
    }

    return response;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      data
    );

    if (response.data.accessToken) {
      apiClient.setAuthToken(response.data.accessToken);
      if (typeof window !== "undefined") {
        localStorage.setItem("refresh_token", response.data.refreshToken);
      }
    }

    return response;
  },

  async refreshToken(): Promise<RefreshTokenResponse> {
    const refreshToken =
      typeof window !== "undefined"
        ? localStorage.getItem("refresh_token")
        : null;

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await apiClient.post<RefreshTokenResponse>(
      API_ENDPOINTS.AUTH.REFRESH,
      { refreshToken }
    );

    if (response.data.accessToken) {
      apiClient.setAuthToken(response.data.accessToken);
      if (typeof window !== "undefined") {
        localStorage.setItem("refresh_token", response.data.refreshToken);
      }
    }

    return response;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } finally {
      apiClient.clearAuthToken();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
  },

  async getCurrentUser(): Promise<AuthResponse["data"]["user"]> {
    const response = await apiClient.get<{
      data: AuthResponse["data"]["user"];
    }>(API_ENDPOINTS.AUTH.ME);
    return response.data;
  },

  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("access_token");
  },
};
