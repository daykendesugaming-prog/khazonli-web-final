"use client";

import { useEffect, useRef, useState } from 'react';

type ToastType = 'success' | 'error' | 'info';

type ToastState = {
  open: boolean;
  type: ToastType;
  title: string;
  message: string;
};

export function useAdminToast() {
  const [toast, setToast] = useState<ToastState>({
    open: false,
    type: 'success',
    title: '',
    message: '',
  });

  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (type: ToastType, title: string, message: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);

    setToast({
      open: true,
      type,
      title,
      message,
    });

    toastTimeoutRef.current = setTimeout(() => {
      setToast((prev) => ({ ...prev, open: false }));
    }, 4200);
  };

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  return {
    toast,
    setToast,
    showToast,
  };
}