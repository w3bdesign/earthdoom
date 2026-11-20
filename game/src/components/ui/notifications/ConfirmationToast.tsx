import { toast } from "react-hot-toast";

import Button from "@/components/common/Button";

interface ConfirmationToastProps {
  message: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
}

export const showConfirmationToast = ({
  message,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
}: ConfirmationToastProps) => {
  toast(
    (t) => (
      <div className="flex flex-col gap-3">
        <p className="font-semibold text-ink">{message}</p>
        <div className="flex gap-2">
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              onConfirm();
              toast.dismiss(t.id);
            }}
          >
            {confirmText}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => toast.dismiss(t.id)}
          >
            {cancelText}
          </Button>
        </div>
      </div>
    ),
    {
      duration: Infinity,
      position: "top-center",
    },
  );
};

export default showConfirmationToast;
