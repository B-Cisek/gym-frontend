import type { ApiError } from "~/types";
import { AuthError, AuthErrorCode } from "~/types";

export const useAuth = () => {
  const nuxtApp = useNuxtApp();

  const user = useState<User | null>("user", () => null);
  const isLoggedIn = computed(() => !!user.value);
  const loading = useState<boolean>("loading", () => false);

  async function signIn(credentials: LoginCredentials): Promise<void> {
    loading.value = true;

    const config = useRuntimeConfig();

    try {
      const response = await $fetch<AuthResponse>("/auth/login", {
        baseURL: config.public.apiBaseUrl,
        method: "POST",
        body: credentials,
      });

      await $fetch("/api/setup-session", {
        method: "POST",
        body: response,
      });

      await fetchUser();
      await nuxtApp.callHook("user:login");
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

    const config = useRuntimeConfig();

    try {
      const response = await $fetch<AuthResponse>("/auth/owner/register", {
        baseURL: config.public.apiBaseUrl,
        method: "POST",
        body: credentials,
      });

      await $fetch("/api/setup-session", {
        method: "POST",
        body: response,
      });

      await fetchUser();
      await nuxtApp.callHook("user:login");
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

  async function logout(): Promise<void> {
    clearAuthState();
    await nuxtApp.callHook("user:logout");
  }

  function clearAuthState(): void {
    user.value = null;

    $fetch("/api/logout", {
      method: "POST",
    }).catch(() => {});
  }

  async function fetchUser(): Promise<void> {
    const { get } = useApi();

    try {
      const data = await get<User>("/auth/me");

      user.value = data;
    } catch {
      user.value = null;
    }
  }

  return {
    user,
    isLoggedIn,
    signIn,
    logout,
    signUpOwner,
    fetchUser,
    loading,
    clearAuthState,
  };
};
