"use client";

import { useEffect, useRef, useState } from 'react';
import NeonToast from '../../components/NeonToast';
import { getOrderType } from '../../components/admin/utils/adminHelpers';
import { supabase } from '../../lib/supabase';

import AdminHeader from '../../components/admin/AdminHeader';
import AdminTabs from '../../components/admin/AdminTabs';
import ConfirmModal from '../../components/admin/shared/ConfirmModal';
import PaymentModal from '../../components/admin/modals/PaymentModal';
import VariantModal from '../../components/admin/modals/VariantModal';
import EventParticipantsModal from '../../components/admin/modals/EventParticipantsModal';
import DashboardTab from '../../components/admin/tabs/DashboardTab';
import MmoTab from '../../components/admin/tabs/MmoTab';
import CatalogoTab from '../../components/admin/tabs/CatalogoTab';
import EventosTab from '../../components/admin/tabs/EventosTab';
import RatesPreviewCard from '../../components/admin/RatesPreviewCard';

import { useAdminToast } from '../../components/admin/hooks/useAdminToast';
import { useAdminAuth } from '../../components/admin/hooks/useAdminAuth';
import { useAdminConfirm } from '../../components/admin/hooks/useAdminConfirm';
import { useAdminLoaders } from '../../components/admin/hooks/useAdminLoaders';
import { useAdminActions } from '../../components/admin/hooks/useAdminActions';
import { useAdminFormHandlers } from '../../components/admin/hooks/useAdminFormHandlers';
import { useRatesPreviewDownload } from '../../components/admin/hooks/useRatesPreviewDownload';

export default function AdminDashboard() {
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'mmo' | 'catalogo' | 'eventos'>('dashboard');

  const [servers, setServers] = useState<any[]>([]);
  const [newServer, setNewServer] = useState({ game: '', name: '', buy: '', sell: '' });

  const [stocks, setStocks] = useState<any[]>([]);
  const [newStock, setNewStock] = useState({
    game: '',
    server_name: '',
    price_usd: '',
    stock_mk: '',
  });

  const [routes, setRoutes] = useState<any[]>([]);
  const [newRoute, setNewRoute] = useState({
    server_from: '',
    server_to: '',
    mode: 'fijo',
    rate: '',
  });

  const [rates, setRates] = useState({ id: null as number | null, buy: 0, sell: 0 });
  const [storeStatus, setStoreStatus] = useState<string>('activo');
  const [payments, setPayments] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    description: '',
    icon: '',
    tag: '',
  });

  const [metrics, setMetrics] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    cancelled: 0,
    buyMk: 0,
    sellMk: 0,
    exchanges: 0,
    p2p: 0,
    wallet: 0,
    volumeBs: 0,
    volumeUsd: 0,
  });

  const [events, setEvents] = useState<any[]>([]);
  const [newEvent, setNewEvent] = useState({
    title: '',
    slug: '',
    event_type: 'sorteo',
    status: 'draft',
    description: '',
    rules: '',
    banner_url: '',
    game_name: '',
    mode_name: '',
    prize: '',
    entry_price_usd: '',
    entry_price_bs: '',
    start_date: '',
    end_date: '',
    max_participants: '',
    registration_mode: 'form',
    phone_required: false,
    requires_number_selection: false,
    number_range_min: '',
    number_range_max: '',
    is_featured: false,
  });

  const [registrations, setRegistrations] = useState<any[]>([]);
  const [isParticipantsModalOpen, setIsParticipantsModalOpen] = useState(false);
  const [selectedEventForParticipants, setSelectedEventForParticipants] = useState<any>(null);

  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [variantForm, setVariantForm] = useState({
    name: '',
    priceText: '',
    priceUsd: '',
  });

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    name: '',
    details: '',
  });

  const { toast, setToast, showToast } = useAdminToast();

  const {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    session,
    handleLogin,
    handleLogout,
  } = useAdminAuth();

  const {
    confirmModal,
    askForConfirmation,
    executeConfirmation,
    cancelConfirmation,
  } = useAdminConfirm();

  const cardRef = useRef<HTMLDivElement>(null);

  const { downloadImage } = useRatesPreviewDownload({
    cardRef,
    showToast,
  });

  const {
    refreshDashboardData,
    loadServers,
    loadStocks,
    loadRoutes,
    loadProducts,
    loadPayments,
    loadEvents,
    loadMetrics,
  } = useAdminLoaders({
    setServers,
    setStocks,
    setRoutes,
    setRates,
    setStoreStatus,
    setProducts,
    setPayments,
    setEvents,
    setMetrics,
    getOrderType,
  });

  const {
    handleSaveServer,
    handleCreateServer,
    handleDeleteServer,
    handleSaveStock,
    handleCreateStock,
    handleDeleteStock,
    handleSaveRoute,
    handleCreateRoute,
    handleDeleteRoute,
    handleSaveRates,
    handleUpdateStatus,
    handleSavePayment,
    handleDeletePayment,
    handleUploadImage,
    handleCreateProduct,
    openVariantModal,
    handleSaveVariant,
    handleDeleteVariant,
    handleDeleteProduct,
    handleCreateEvent,
    handleUpdateEventStatus,
    handleToggleFeatured,
    handleDeleteEvent,
    openParticipantsModal,
  } = useAdminActions({
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
  });

  const {
    handleServerInputChange,
    handleStockInputChange,
    handleRouteInputChange,
    handleEventFieldChange,
  } = useAdminFormHandlers({
    servers,
    setServers,
    stocks,
    setStocks,
    routes,
    setRoutes,
    setNewEvent,
  });

  useEffect(() => {
  if (session) {
    refreshDashboardData();
  }
}, [session]);

  const wrappedDeleteServer = (serverName: string) =>
    askForConfirmation(`¿Eliminar servidor ${serverName}?`, async () => {
      await handleDeleteServer(serverName);
    });

  const wrappedDeleteStock = (id: number) =>
    askForConfirmation('¿Eliminar este inventario?', async () => {
      await handleDeleteStock(id);
    });

  const wrappedDeleteRoute = (id: number) =>
    askForConfirmation('¿Eliminar ruta de intercambio?', async () => {
      await handleDeleteRoute(id);
    });

  const wrappedDeletePayment = (id: number) =>
    askForConfirmation('¿Eliminar método de pago?', async () => {
      await handleDeletePayment(id);
    });

  const wrappedDeleteVariant = (id: number) =>
    askForConfirmation('¿Borrar variante?', async () => {
      await handleDeleteVariant(id);
    });

  const wrappedDeleteProduct = (id: number) =>
    askForConfirmation('⚠️ ¿Eliminar producto y variantes?', async () => {
      await handleDeleteProduct(id);
    });

  const wrappedDeleteEvent = (eventId: string, title: string) =>
    askForConfirmation(`¿Eliminar el evento "${title}"?`, async () => {
      await handleDeleteEvent(eventId, title);
    });

  if (!session) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center p-4">
        <div className="bg-[#121826] border border-gray-800 p-8 rounded-3xl w-full max-w-md shadow-2xl">
          <h1 className="text-2xl font-black text-white text-center mb-6 uppercase italic">
            KHAZ <span className="text-[#00A8FF]">BÓVEDA</span>
          </h1>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0B0F19] border border-gray-700 rounded-xl p-4 text-white outline-none"
              placeholder="Email"
              required
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0B0F19] border border-gray-700 rounded-xl p-4 text-white outline-none"
              placeholder="Password"
              required
            />
         <div className="flex justify-end -mt-1">
           <a
               href="/forgot-password"
    className="text-[10px] font-black uppercase tracking-widest text-[#00A8FF] hover:text-white transition-colors"
  >
    ¿Olvidaste tu contraseña?
  </a>
</div>

            <button
              type="submit"
              className="w-full py-4 bg-[#00A8FF] text-[#0B0F19] font-black rounded-xl uppercase hover:bg-blue-400 transition-colors"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>

            {error && <p className="text-red-500 text-sm text-center font-bold">{error}</p>}
          </form>
        </div>
      </div>
    );
  }

  const activeServers = servers.filter((s) => s.is_active);

  return (
    <div className="min-h-screen bg-[#0B0F19] p-4 md:p-8 relative">
      <NeonToast
        open={toast.open}
        type={toast.type}
        title={toast.title}
        message={toast.message}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        message={confirmModal.message}
        onCancel={cancelConfirmation}
        onConfirm={executeConfirmation}
      />

      <VariantModal
        isOpen={isVariantModalOpen}
        variantForm={variantForm}
        setVariantForm={setVariantForm}
        onClose={() => setIsVariantModalOpen(false)}
        onSave={handleSaveVariant}
      />

      <PaymentModal
        isOpen={isPaymentModalOpen}
        paymentForm={paymentForm}
        setPaymentForm={setPaymentForm}
        onClose={() => setIsPaymentModalOpen(false)}
        onSave={handleSavePayment}
      />

      <EventParticipantsModal
        isOpen={isParticipantsModalOpen}
        registrations={registrations}
        selectedEventForParticipants={selectedEventForParticipants}
        onClose={() => setIsParticipantsModalOpen(false)}
        onCopyList={() => {
          const text = registrations
            .map(
              (r, i) =>
                `${i + 1}. ${r.character_name || r.full_name} ${r.selected_number ? `(#${r.selected_number})` : ''}`
            )
            .join('\n');

          navigator.clipboard.writeText(text);
          showToast('success', 'Lista copiada', 'Los participantes fueron copiados al portapapeles.');
        }}
      />

      <div className="max-w-7xl mx-auto space-y-6">
        <AdminHeader onLogout={handleLogout} />
        <AdminTabs activeTab={activeTab} onChange={setActiveTab} />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
          <div className="xl:col-span-2 space-y-8 min-h-[500px]">
            {activeTab === 'dashboard' && (
              <DashboardTab
                metrics={metrics}
                storeStatus={storeStatus}
                rates={rates}
                setRates={setRates}
                payments={payments}
                onUpdateStatus={handleUpdateStatus}
                onSaveRates={handleSaveRates}
                onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
                onDeletePayment={wrappedDeletePayment}
              />
            )}

            {activeTab === 'mmo' && (
              <MmoTab
                servers={servers}
                newServer={newServer}
                setNewServer={setNewServer}
                onServerInputChange={handleServerInputChange}
                onSaveServer={handleSaveServer}
                onCreateServer={handleCreateServer}
                onDeleteServer={wrappedDeleteServer}
                stocks={stocks}
                newStock={newStock}
                setNewStock={setNewStock}
                onStockInputChange={handleStockInputChange}
                onSaveStock={handleSaveStock}
                onCreateStock={handleCreateStock}
                onDeleteStock={wrappedDeleteStock}
                routes={routes}
                newRoute={newRoute}
                setNewRoute={setNewRoute}
                onRouteInputChange={handleRouteInputChange}
                onSaveRoute={handleSaveRoute}
                onCreateRoute={handleCreateRoute}
                onDeleteRoute={wrappedDeleteRoute}
              />
            )}

            {activeTab === 'catalogo' && (
              <CatalogoTab
                products={products}
                newProduct={newProduct}
                setNewProduct={setNewProduct}
                uploading={uploading}
                rates={rates}
                onUploadImage={handleUploadImage}
                onCreateProduct={handleCreateProduct}
                onOpenVariantModal={openVariantModal}
                onDeleteProduct={wrappedDeleteProduct}
                onDeleteVariant={wrappedDeleteVariant}
              />
            )}

            {activeTab === 'eventos' && (
              <EventosTab
                events={events}
                newEvent={newEvent}
                uploading={uploading}
                setUploading={setUploading}
                handleEventFieldChange={handleEventFieldChange}
                handleCreateEvent={handleCreateEvent}
                handleUpdateEventStatus={handleUpdateEventStatus}
                openParticipantsModal={openParticipantsModal}
                handleToggleFeatured={handleToggleFeatured}
                handleDeleteEvent={wrappedDeleteEvent}
                showToast={showToast}
                supabase={supabase}
              />
            )}
          </div>

          <div className="xl:col-span-1">
            <RatesPreviewCard
              cardRef={cardRef}
              activeServers={activeServers}
              rates={rates}
              onDownload={downloadImage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}