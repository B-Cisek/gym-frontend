import { ConfirmModal } from "#components";

export interface ConfirmModalOptions {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmColor?: "error" | "primary" | "secondary" | "success" | "info" | "warning" | "neutral";
}

export const useConfirmModal = () => {
  const overlay = useOverlay();

  return (options: ConfirmModalOptions): Promise<boolean> => {
    const modal = overlay.create(ConfirmModal, {
      destroyOnClose: true,
      props: options,
    });

    return modal.open();
  };
};
