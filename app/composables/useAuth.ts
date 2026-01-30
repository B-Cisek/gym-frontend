import type {
  AuthResponse,
  CookieName,
  LoginCredentials,
  SignupCredentials,
  User,
  ApiError,
} from "~/types";

import {
  TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  AuthError,
  AuthErrorCode,
} from "~/types";

const setCookie = (name: CookieName, value: string) => {
  const cookie = useCookie(name);
  cookie.value = value;
};

const clearCookie = (name: CookieName) => {
  const cookie = useCookie(name);
  cookie.value = null;
};

export const useAuth = () => {
  const user = useState<User | null>("user", () => null);
  const isLoggedIn = computed(() => !!user.value);
  const loading = useState<boolean>("loading", () => false);

  async function signIn(credentials: LoginCredentials): Promise<void> {
    loading.value = true;

    try {
      const data = await apiCall<AuthResponse>("/auth/login", {
        method: "POST",
        body: credentials,
      });
      const { token, refresh_token } = data;
      setCookie(TOKEN_COOKIE, token);
      setCookie(REFRESH_TOKEN_COOKIE, refresh_token);
    } catch (error) {
      const apiError = error as ApiError;

      if (apiError.status === 401) {
        throw new AuthError(
          AuthErrorCode.INVALID_CREDENTIALS,
          "Nieprawidłowe dane logowania.",
          409,
        );
      }

      throw new AuthError(
        AuthErrorCode.UNKNOWN_ERROR,
        "Wystąpił błąd podczas logowania. Spróbuj ponownie.",
        apiError.status,
      );
    } finally {
      loading.value = false;
    }
  }

  async function signUpOwner(credentials: SignupCredentials): Promise<void> {
    loading.value = true;

    try {
      const data = await apiCall<AuthResponse>("/auth/owner/register", {
        method: "POST",
        body: credentials,
      });

      const { token, refresh_token } = data;
      setCookie(TOKEN_COOKIE, token);
      setCookie(REFRESH_TOKEN_COOKIE, refresh_token);
    } catch (error) {
      const apiError = error as ApiError;

      if (apiError.status === 409) {
        throw new AuthError(
          AuthErrorCode.EMAIL_ALREADY_TAKEN,
          "Ten email jest już zajęty.",
          409,
        );
      }

      if (apiError.status === 422) {
        throw new AuthError(
          AuthErrorCode.VALIDATION_ERROR,
          "Dane są nieprawidłowe.",
          422,
        );
      }

      throw new AuthError(
        AuthErrorCode.UNKNOWN_ERROR,
        "Wystąpił błąd podczas rejestracji. Spróbuj ponownie.",
        apiError.status,
      );
    } finally {
      loading.value = false;
    }
  }

  function logout(): void {
    loading.value = true;
    user.value = null;
    clearCookie(TOKEN_COOKIE);
    clearCookie(REFRESH_TOKEN_COOKIE);
    loading.value = false;
  }

  return {
    user,
    isLoggedIn,
    signIn,
    logout,
    signUpOwner,
    loading,
  };
};
