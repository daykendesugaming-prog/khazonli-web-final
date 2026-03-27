"use client";

import { useState } from 'react';

type ConfirmAction = () => Promise<void> | void;

type ConfirmModalState = {
  isOpen: boolean;
  message: string;
  onConfirm: ConfirmAction;
};

export function useAdminConfirm() {
  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>({
    isOpen: false,
    message: '',
    onConfirm: async () => {},
  });

  const askForConfirmation = (message: string, action: ConfirmAction) =>
    setConfirmModal({
      isOpen: true,
      message,
      onConfirm: async () => {
        await action();
      },
    });

  const executeConfirmation = async () => {
    setConfirmModal((prev) => ({ ...prev, isOpen: false }));
    await confirmModal.onConfirm();
  };

  const cancelConfirmation = () =>
    setConfirmModal((prev) => ({ ...prev, isOpen: false }));

  return {
    confirmModal,
    askForConfirmation,
    executeConfirmation,
    cancelConfirmation,
  };
}