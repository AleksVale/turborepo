import { useCallback } from "react";
import { useNavigate } from "react-router";
import type { LoginCredentials, RegisterData } from "~/services/auth.service";
import { authService } from "~/services/auth.service";
import { useApi } from "./use-api";

export function useAuth() {
  const navigate = useNavigate();

  const loginMutation = useApi(authService.login, {
    onSuccess: () => {
      navigate("/");
    },
  });

  const registerMutation = useApi(authService.register, {
    onSuccess: () => {
      navigate("/");
    },
  });

  const login = useCallback(
    (credentials: LoginCredentials) => {
      return loginMutation.execute(credentials);
    },
    [loginMutation]
  );

  const register = useCallback(
    (data: RegisterData) => {
      return registerMutation.execute(data);
    },
    [registerMutation]
  );

  const logout = useCallback(async () => {
    await authService.logout();
  }, []);

  const isAuthenticated = useCallback(() => {
    return authService.isAuthenticated();
  }, []);

  return {
    login,
    register,
    logout,
    isAuthenticated,
    isLoginLoading: loginMutation.isLoading,
    isRegisterLoading: registerMutation.isLoading,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  };
}
