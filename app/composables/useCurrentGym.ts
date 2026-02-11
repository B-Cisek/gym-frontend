import { createSharedComposable } from "@vueuse/core";
import type { GymMenu } from "~/types";

const GYM_SELECTED_COOKIE_NAME = "CURRENT_GYM_ID";

const _useCurrentGym = () => {
  const { get } = useApi();

  const selectedGymId = useCookie<string | null>(GYM_SELECTED_COOKIE_NAME, {
    default: () => null,
  });

  const gyms = useState<GymMenu[]>("gyms", () => []);
  const loading = ref<boolean>(false);

  const currentGym = computed<GymMenu | null>(
    () =>
      gyms.value.find((g) => g.id === selectedGymId.value) ??
      gyms.value[0] ??
      null,
  );

  async function fetchGyms() {
    loading.value = true;

    try {
      const result = await get<{ gyms: GymMenu[] }>("/gyms");

      gyms.value = result.gyms;

      if (!selectedGymId.value && result.gyms[0]) {
        selectedGymId.value = result.gyms[0].id;
      }
    } finally {
      loading.value = false;
    }
  }

  function selectGym(gym: GymMenu) {
    selectedGymId.value = gym.id;
  }

  return { gyms, currentGym, loading, fetchGyms, selectGym };
};

export const useCurrentGym = createSharedComposable(_useCurrentGym);
