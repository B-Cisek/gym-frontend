import type { UseFetchOptions } from "nuxt/app";

// For component setup (SSR-friendly, reactive)
export function useApi<T>(
  url: string | (() => string),
  options?: UseFetchOptions<T>,
) {
  return useFetch(url, {
    ...options,
    $fetch: useNuxtApp().$api as typeof $fetch,
  });
}

// For after mount (event handlers, onMounted, etc.)
export function useApiCall() {
  return useNuxtApp().$api as typeof $fetch;
}

// Convenience wrapper for common use case
export async function apiCall<T>(
  url: string,
  options?: Parameters<typeof $fetch>[1],
): Promise<T> {
  const $api = useNuxtApp().$api as typeof $fetch;
  return $api<T>(url, options);
}
