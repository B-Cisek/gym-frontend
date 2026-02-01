import type { UseFetchOptions } from "nuxt/app";

export function useApi<T>(
  url: string | (() => string),
  options?: UseFetchOptions<T>,
) {
  return useFetch(url, {
    ...options,
    $fetch: useNuxtApp().$api as typeof $fetch,
  });
}

export function useApiCall() {
  return useNuxtApp().$api as typeof $fetch;
}

export async function apiCall<T>(
  url: string,
  options?: Parameters<typeof $fetch>[1],
): Promise<T> {
  const $api = useNuxtApp().$api as typeof $fetch;
  return $api<T>(url, options);
}
