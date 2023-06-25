import { toast } from "react-hot-toast";

import type { ToasterProps, DefaultToastOptions } from "react-hot-toast";

interface ToastComponentProps extends ToasterProps {
  type: "success" | "error";
  message: string;
}

export const ToastComponent = ({
  message,
  type,
  ...rest
}: ToastComponentProps) => {
  const toastType = type === "error" ? "error" : "success";

  return toast[toastType](message, rest as DefaultToastOptions);
};

export default ToastComponent;
