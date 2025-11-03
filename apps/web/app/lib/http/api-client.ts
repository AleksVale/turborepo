import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import axios, { AxiosError } from "axios";

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          await this.handleUnauthorized();
        }
        return Promise.reject(this.handleError(error));
      }
    );
  }

  private getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("access_token");
  }

  private setToken(token: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem("access_token", token);
  }

  private removeToken(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }

  private async handleUnauthorized(): Promise<void> {
    this.removeToken();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }

  private handleError(error: AxiosError): ApiError {
    if (error.response) {
      return {
        message: (error.response.data as any)?.message || "An error occurred",
        statusCode: error.response.status,
        errors: (error.response.data as any)?.errors,
      };
    }

    if (error.request) {
      return {
        message: "Network error. Please check your connection.",
        statusCode: 0,
      };
    }

    return {
      message: error.message || "An unexpected error occurred",
      statusCode: 500,
    };
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.get(url, config);
    return response.data;
  }

  async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(
      url,
      data,
      config
    );
    return response.data;
  }

  async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.client.put(url, data, config);
    return response.data;
  }

  async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.client.patch(
      url,
      data,
      config
    );
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.delete(url, config);
    return response.data;
  }

  setAuthToken(token: string): void {
    this.setToken(token);
  }

  clearAuthToken(): void {
    this.removeToken();
  }
}

export const apiClient = new ApiClient();
