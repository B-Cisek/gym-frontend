import type { $Fetch } from "ofetch";

type ApiOptions = Omit<Parameters<$Fetch>[1], "method" | "body">;
type ApiBody = Record<string, unknown> | FormData;

export function useApiInstance(): $Fetch {
  return useNuxtApp().$api;
}

export function useApi() {
  const $api = useApiInstance();

  return {
    get: <T>(url: string, options?: ApiOptions) =>
      $api<T>(url, { ...options, method: "GET" }),

    post: <T>(url: string, body?: ApiBody, options?: ApiOptions) =>
      $api<T>(url, { ...options, method: "POST", body }),

    put: <T>(url: string, body?: ApiBody, options?: ApiOptions) =>
      $api<T>(url, { ...options, method: "PUT", body }),

    patch: <T>(url: string, body?: ApiBody, options?: ApiOptions) =>
      $api<T>(url, { ...options, method: "PATCH", body }),

    del: <T>(url: string, options?: ApiOptions) =>
      $api<T>(url, { ...options, method: "DELETE" }),
  };
}
