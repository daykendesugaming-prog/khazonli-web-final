"use client";

import { useAdminMmoActions } from './useAdminMmoActions';
import { useAdminStockActions } from './useAdminStockActions';
import { useAdminRouteActions } from './useAdminRouteActions';
import { useAdminCatalogActions } from './useAdminCatalogActions';
import { useAdminEventActions } from './useAdminEventActions';
import { useAdminPaymentActions } from './useAdminPaymentActions';
import { useAdminStoreActions } from './useAdminStoreActions';
import {
  NewEventState,
  NewProductState,
  NewRouteState,
  NewServerState,
  NewStockState,
  PaymentFormState,
  RatesState,
  ShowToast,
  VariantFormState,
} from './types';

type UseAdminActionsParams = {
  showToast: ShowToast;

  newServer: NewServerState;
  setNewServer: React.Dispatch<React.SetStateAction<NewServerState>>;
  loadServers: () => Promise<void>;

  newStock: NewStockState;
  setNewStock: React.Dispatch<React.SetStateAction<NewStockState>>;
  loadStocks: () => Promise<void>;

  newRoute: NewRouteState;
  setNewRoute: React.Dispatch<React.SetStateAction<NewRouteState>>;
  loadRoutes: () => Promise<void>;

  rates: RatesState;
  setRates: React.Dispatch<React.SetStateAction<RatesState>>;
  setStoreStatus: React.Dispatch<React.SetStateAction<string>>;

  paymentForm: PaymentFormState;
  setPaymentForm: React.Dispatch<React.SetStateAction<PaymentFormState>>;
  setIsPaymentModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  loadPayments: () => Promise<void>;

  newProduct: NewProductState;
  setNewProduct: React.Dispatch<React.SetStateAction<NewProductState>>;
  setUploading: React.Dispatch<React.SetStateAction<boolean>>;
  loadProducts: () => Promise<void>;

  selectedProductId: number | null;
  setSelectedProductId: React.Dispatch<React.SetStateAction<number | null>>;
  variantForm: VariantFormState;
  setVariantForm: React.Dispatch<React.SetStateAction<VariantFormState>>;
  setIsVariantModalOpen: React.Dispatch<React.SetStateAction<boolean>>;

  newEvent: NewEventState;
  setNewEvent: React.Dispatch<React.SetStateAction<NewEventState>>;
  loadEvents: () => Promise<void>;

  setRegistrations: React.Dispatch<React.SetStateAction<any[]>>;
  setSelectedEventForParticipants: React.Dispatch<React.SetStateAction<any>>;
  setIsParticipantsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;

  loadMetrics: () => Promise<void>;
};

export function useAdminActions({
  showToast,

  newServer,
  setNewServer,
  loadServers,

  newStock,
  setNewStock,
  loadStocks,

  newRoute,
  setNewRoute,
  loadRoutes,

  rates,
  setRates,
  setStoreStatus,

  paymentForm,
  setPaymentForm,
  setIsPaymentModalOpen,
  loadPayments,

  newProduct,
  setNewProduct,
  setUploading,
  loadProducts,

  selectedProductId,
  setSelectedProductId,
  variantForm,
  setVariantForm,
  setIsVariantModalOpen,

  newEvent,
  setNewEvent,
  loadEvents,

  setRegistrations,
  setSelectedEventForParticipants,
  setIsParticipantsModalOpen,

  loadMetrics,
}: UseAdminActionsParams) {
  const mmoActions = useAdminMmoActions({
    showToast,
    newServer,
    setNewServer,
    loadServers,
    loadMetrics,
  });

  const stockActions = useAdminStockActions({
    showToast,
    newStock,
    setNewStock,
    loadStocks,
    loadMetrics,
  });

  const routeActions = useAdminRouteActions({
    showToast,
    newRoute,
    setNewRoute,
    loadRoutes,
    loadMetrics,
  });

  const catalogActions = useAdminCatalogActions({
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
  });

  const eventActions = useAdminEventActions({
    showToast,
    newEvent,
    setNewEvent,
    loadEvents,
    setRegistrations,
    setSelectedEventForParticipants,
    setIsParticipantsModalOpen,
  });

  const paymentActions = useAdminPaymentActions({
    showToast,
    paymentForm,
    setPaymentForm,
    setIsPaymentModalOpen,
    loadPayments,
  });

  const storeActions = useAdminStoreActions({
    showToast,
    rates,
    setRates,
    setStoreStatus,
    loadProducts,
    loadMetrics,
  });

  return {
    ...mmoActions,
    ...stockActions,
    ...routeActions,
    ...catalogActions,
    ...eventActions,
    ...paymentActions,
    ...storeActions,
  };
}