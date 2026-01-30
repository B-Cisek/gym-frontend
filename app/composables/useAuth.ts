import {
  type User,
  type LoginCredentials,
  type LoginResponse,
  type CookieName,
  TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
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

  async function signIn(credentials: LoginCredentials) {
    const { data, error } = await useApi<LoginResponse>("/auth/login", {
      method: "POST",
      body: credentials,
    });

    if (error.value) {
      throw new Error(error.value.data?.message || "Login failed");
    }

    const { token, refresh_token } = data.value!;
    setCookie(TOKEN_COOKIE, token);
    setCookie(REFRESH_TOKEN_COOKIE, refresh_token);
  }

  async function logout() {
    user.value = null;
    clearCookie(TOKEN_COOKIE);
    clearCookie(REFRESH_TOKEN_COOKIE);
  }

  return {
    user,
    isLoggedIn,
    signIn,
    logout,
  };
};
