"use client";

import { supabase } from '@/lib/supabase';
import { translateText } from '@/lib/translate';
import {
  NewProductState,
  ShowToast,
  VariantFormState,
} from './types';

type UseAdminCatalogActionsParams = {
  showToast: ShowToast;
  newProduct: NewProductState;
  setNewProduct: React.Dispatch<React.SetStateAction<NewProductState>>;
  setUploading: React.Dispatch<React.SetStateAction<boolean>>;
  loadProducts: () => Promise<void>;
  selectedProductId: number | null;
  setSelectedProductId: React.Dispatch<React.SetStateAction<number | null>>;
  variantForm: VariantFormState;
  setVariantForm: React.Dispatch<React.SetStateAction<VariantFormState>>;
  setIsVariantModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export function useAdminCatalogActions({
  showToast,
  newProduct,
  setNewProduct,
  setUploading,
  loadProducts,
  selectedProductId,
  setSelectedProductId,
  variantForm,
  setVariantForm,
  setIsVariantModalOpen,
}: UseAdminCatalogActionsParams) {
  
  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!e.target.files || e.target.files.length === 0) return;

      const file = e.target.files[0];
      const fileName = `${Math.random()}.${file.name.split('.').pop()}`;

      const { error: uploadError } = await supabase.storage
        .from('productos')
        .upload(fileName, file);

      if (uploadError) {
        showToast('error', 'No se pudo subir la imagen', uploadError.message || 'Error de carga');
        return;
      }

      const { data } = supabase.storage.from('productos').getPublicUrl(fileName);
      setNewProduct((prev) => ({ ...prev, icon: data.publicUrl }));
      showToast('success', 'Imagen subida', 'El logo del producto quedó cargado correctamente.');
    } finally {
      setUploading(false);
    }
  };

  const handleCreateProduct = async () => {
    if (!newProduct.name || !newProduct.icon || !newProduct.category) {
      showToast('info', 'Producto incompleto', 'Debes indicar nombre, categoría y logo.');
      return;
    }

    setUploading(true);
    try {
      showToast('info', 'Traduciendo...', 'La IA está generando las descripciones internacionales.');

      const [nameEn, nameFr, namePt] = await Promise.all([
        translateText(newProduct.name, 'en'),
        translateText(newProduct.name, 'fr'),
        translateText(newProduct.name, 'pt'),
      ]);

      const [descEn, descFr, descPt] = await Promise.all([
        translateText(newProduct.description || '', 'en'),
        translateText(newProduct.description || '', 'fr'),
        translateText(newProduct.description || '', 'pt'),
      ]);

      const [tagEn, tagFr, tagPt] = await Promise.all([
        translateText(newProduct.tag || '', 'en'),
        translateText(newProduct.tag || '', 'fr'),
        translateText(newProduct.tag || '', 'pt'),
      ]);

      const { error: insertError } = await supabase.from('digital_catalog').insert([
        {
          ...newProduct,
          name_en: nameEn,
          name_fr: nameFr,
          name_pt: namePt,
          description_en: descEn,
          description_fr: descFr,
          description_pt: descPt,
          tag_en: tagEn,
          tag_fr: tagFr,
          tag_pt: tagPt
        }
      ]);

      if (insertError) throw insertError;

      setNewProduct({ name: '', category: '', description: '', icon: '', tag: '' });
      await loadProducts();
      showToast('success', 'Servicio Global Creado', 'Producto guardado y traducido correctamente.');
    } catch (err: any) {
      showToast('error', 'Error al crear', err?.message || 'Error inesperado');
    } finally {
      setUploading(false);
    }
  };

  const openVariantModal = (productId: number) => {
    setSelectedProductId(productId);
    setIsVariantModalOpen(true);
  };

  const handleSaveVariant = async () => {
    if (!selectedProductId || !variantForm.name || !variantForm.priceText || !variantForm.priceUsd) {
      showToast('info', 'Variante incompleta', 'Debes llenar nombre, precio visible y valor en USD.');
      return;
    }

    setUploading(true);
    try {
      const [vEn, vFr, vPt] = await Promise.all([
        translateText(variantForm.name, 'en'),
        translateText(variantForm.name, 'fr'),
        translateText(variantForm.name, 'pt'),
      ]);

      const { error: varError } = await supabase.from('product_variants').insert([
        {
          product_id: selectedProductId,
          variant_name: variantForm.name,
          variant_name_en: vEn,
          variant_name_fr: vFr,
          variant_name_pt: vPt,
          price_text: variantForm.priceText,
          price_usd: parseFloat(variantForm.priceUsd),
        },
      ]);

      if (varError) throw varError;

      setIsVariantModalOpen(false);
      setVariantForm({ name: '', priceText: '', priceUsd: '' });
      await loadProducts();
      showToast('success', 'Variante Global', 'Plan añadido con éxito.');
    } catch (err: any) {
      showToast('error', 'Error', err?.message || 'No se pudo guardar la variante.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteVariant = async (id: number) => {
    const { error: delError } = await supabase.from('product_variants').delete().eq('id', id);
    if (delError) {
      showToast('error', 'Error', delError.message || 'No se pudo eliminar');
      return;
    }
    await loadProducts();
    showToast('success', 'Variante eliminada', 'La variante fue retirada.');
  };

  const handleDeleteProduct = async (id: number) => {
    const { error: vError } = await supabase.from('product_variants').delete().eq('product_id', id);
    if (vError) {
      showToast('error', 'Error', vError.message || 'Error en variantes');
      return;
    }
    const { error: pError } = await supabase.from('digital_catalog').delete().eq('id', id);
    if (pError) {
      showToast('error', 'Error', pError.message || 'Error en producto');
      return;
    }
    await loadProducts();
    showToast('success', 'Producto eliminado', 'El producto fue retirado.');
  };

  return {
    handleUploadImage,
    handleCreateProduct,
    openVariantModal,
    handleSaveVariant,
    handleDeleteVariant,
    handleDeleteProduct,
  };
}