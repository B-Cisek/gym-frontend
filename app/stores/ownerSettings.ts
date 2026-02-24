import type { OwnerSettings } from "~/types";

export const useOwnerSettings = defineStore("ownerSettings", () => {
  useNuxtApp().hook("user:logout", () => clear());

  const { get, patch } = useApi();

  const settings = ref<OwnerSettings>({});
  const loading = ref<boolean>(false);

  async function fetchSettings(): Promise<void> {
    if (Object.keys(settings.value).length !== 0) return;

    loading.value = true;
    try {
      const response = await get<OwnerSettings>("/owner/settings");
      settings.value = response;
    } catch {
      console.error("Failed to fetch owner settings");
    } finally {
      loading.value = false;
    }
  }

  async function updateProfile(data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  }): Promise<void> {
    await patch("/owner/settings", data);
    Object.assign(settings.value, data);
  }

  async function updateCompany(data: {
    companyName: string;
    taxId: string;
    street: string;
    postalCode: string;
    city: string;
  }): Promise<void> {
    await patch("/owner/settings", data);
    Object.assign(settings.value, data);
  }

  function clear() {
    settings.value = {};
  }

  return {
    settings,
    loading,
    fetchSettings,
    updateProfile,
    updateCompany,
  };
});
