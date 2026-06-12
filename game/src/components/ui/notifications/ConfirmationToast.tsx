import { toast } from "react-hot-toast";

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
        <p className="font-semibold">{message}</p>
        <div className="flex gap-2">
          <button
            onClick={() => {
              onConfirm();
              toast.dismiss(t.id);
            }}
            className="rounded bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
          >
            {confirmText}
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="rounded bg-gray-300 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-400"
          >
            {cancelText}
          </button>
        </div>
      </div>
    ),
    {
      duration: Infinity,
      position: "top-center",
    }
  );
};

export default showConfirmationToast;
