export const useAppToast = () => {
  const toast = useToast();

  return {
    success: (description: string, title: string = "Sukces") => {
      toast.add({
        title: title,
        description: description,
        color: "success",
        icon: "i-heroicons-check-circle",
      });
    },
    error: (description: string, title: string = "Błąd") => {
      toast.add({
        title: title,
        description: description,
        color: "error",
        icon: "i-heroicons-x-circle",
      });
    },
  };
};
