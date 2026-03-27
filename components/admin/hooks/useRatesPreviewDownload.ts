"use client";

import { RefObject } from 'react';
import { domToPng } from 'modern-screenshot';

type ShowToast = (
  type: 'success' | 'error' | 'info',
  title: string,
  message: string
) => void;

type UseRatesPreviewDownloadParams = {
  cardRef: RefObject<HTMLDivElement | null>;
  showToast: ShowToast;
};

export function useRatesPreviewDownload({
  cardRef,
  showToast,
}: UseRatesPreviewDownloadParams) {
  const downloadImage = async () => {
    if (!cardRef.current) return;

    try {
      const dataUrl = await domToPng(cardRef.current, {
        scale: 3,
        backgroundColor: '#0B0F19',
      });

      const link = document.createElement('a');
      link.download = 'Khazonli-Tasas.png';
      link.href = dataUrl;
      link.click();

      showToast('success', 'PNG generado', 'La imagen de tasas fue descargada correctamente.');
    } catch {
      showToast('error', 'No se pudo generar la imagen', 'Hubo un problema al exportar el PNG.');
    }
  };

  return { downloadImage };
}