import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { Toaster } from "react-hot-toast";
import showConfirmationToast from "../../components/ui/notifications/ConfirmationToast";

describe("ConfirmationToast", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("displays the confirmation message", async () => {
    const onConfirm = jest.fn();

    render(<Toaster />);
    showConfirmationToast({
      message: "Are you sure?",
      onConfirm,
    });

    await waitFor(() => {
      expect(screen.getByText("Are you sure?")).toBeInTheDocument();
    });
  });

  it("displays custom button text", async () => {
    const onConfirm = jest.fn();

    render(<Toaster />);
    showConfirmationToast({
      message: "Delete this item?",
      onConfirm,
      confirmText: "Delete",
      cancelText: "Keep",
    });

    await waitFor(() => {
      expect(screen.getByText("Delete")).toBeInTheDocument();
      expect(screen.getByText("Keep")).toBeInTheDocument();
    });
  });

  it("calls onConfirm and dismisses toast when confirm button is clicked", async () => {
    const onConfirm = jest.fn();

    render(<Toaster />);
    showConfirmationToast({
      message: "Proceed?",
      onConfirm,
      confirmText: "Yes",
    });

    await waitFor(() => {
      expect(screen.getByText("Yes")).toBeInTheDocument();
    });

    const confirmButton = screen.getByText("Yes");
    fireEvent.click(confirmButton);

    expect(onConfirm).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(screen.queryByText("Proceed?")).not.toBeInTheDocument();
    });
  });

  it("dismisses toast without calling onConfirm when cancel button is clicked", async () => {
    const onConfirm = jest.fn();

    render(<Toaster />);
    showConfirmationToast({
      message: "Proceed?",
      onConfirm,
      cancelText: "No",
    });

    await waitFor(() => {
      expect(screen.getByText("No")).toBeInTheDocument();
    });

    const cancelButton = screen.getByText("No");
    fireEvent.click(cancelButton);

    expect(onConfirm).not.toHaveBeenCalled();

    await waitFor(() => {
      expect(screen.queryByText("Proceed?")).not.toBeInTheDocument();
    });
  });

  it("uses default button text when not provided", async () => {
    const onConfirm = jest.fn();

    render(<Toaster />);
    showConfirmationToast({
      message: "Default buttons?",
      onConfirm,
    });

    await waitFor(() => {
      expect(screen.getByText("Confirm")).toBeInTheDocument();
      expect(screen.getByText("Cancel")).toBeInTheDocument();
    });
  });
});
