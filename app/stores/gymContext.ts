import type { GymMenu } from "~/types";

const GYM_SELECTED_COOKIE_NAME = "CURRENT_GYM_ID";

export const useGymContext = defineStore("gymContext", () => {
  const { get } = useApi();

  const selectedGymId = useCookie<string | null>(GYM_SELECTED_COOKIE_NAME, {
    default: () => null,
  });

  const loading = ref<boolean>(false);
  const gyms = ref<GymMenu[]>([]);
  const selectedGym = computed<GymMenu | null>(() => {
    return (
      gyms.value.find((g: GymMenu) => g.id === selectedGymId.value) ??
      gyms.value[0] ??
      null
    );
  });

  async function fetchGyms(): Promise<void> {
    loading.value = true;
    try {
      const result = await get<{ gyms: GymMenu[] }>("/gyms");

      gyms.value = result.gyms;

      if (!selectedGymId.value && result.gyms[0]) {
        selectedGymId.value = result.gyms[0].id;
      }

      if (gyms.value.length === 0) {
        selectedGymId.value = null;
      }
    } finally {
      loading.value = false;
    }
  }

  function setGym(gym: GymMenu) {
    selectedGymId.value = gym.id;
  }

  return { fetchGyms, setGym, loading, gyms, selectedGym };
});
