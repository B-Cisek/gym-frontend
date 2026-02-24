declare module "#app" {
  interface RuntimeNuxtHooks {
    "user:logout": () => void;
    "user:login": () => void;
  }
}
export {};
