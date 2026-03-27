"use client";

import Footer from '@/components/Footer';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import TradingBoard from '@/components/TradingBoard';

import { useTiendaData } from '@/components/tienda/hooks/useTiendaData';
import { useTiendaFilters } from '@/components/tienda/hooks/useTiendaFilters';
import { useTiendaOrder } from '@/components/tienda/hooks/useTiendaOrder';
import { useTiendaEvents } from '@/components/tienda/hooks/useTiendaEvents';

import StoreHero from '@/components/tienda/StoreHero';
import CategoryTabs from '@/components/tienda/CategoryTabs';
import SearchBar from '@/components/tienda/SearchBar';
import ProductCard from '@/components/tienda/ProductCard';
import EventCard from '@/components/tienda/EventCard';
import ProductModal from '@/components/tienda/ProductModal';
import EventModal from '@/components/tienda/EventModal';

export default function TiendaGamer() {
  const t = useTranslations('Tienda');
  const tCommon = useTranslations('common');

  const {
    activeCategory,
    setActiveCategory,
    storeStatus,
    catalogProducts,
    rates,
    payments,
    events,
    searchQuery,
    setSearchQuery,
    currentUser,
    userProfile,
  } = useTiendaData();

  const { allCategories, currentCategoryProducts, filteredEvents } =
    useTiendaFilters(catalogProducts, events, activeCategory, searchQuery);

  const {
    selectedProduct,
    setSelectedProduct,
    selectedVariant,
    setSelectedVariant,
    step,
    setStep,
    selectedPayment,
    setSelectedPayment,
    isCopied,
    setIsCopied,
    walletAmount,
    setWalletAmount,
    paymentDetails,
    setPaymentDetails,
    customerPhone,
    setCustomerPhone,
    walletReceiverEmail,
    setWalletReceiverEmail,
    isWalletProduct,
    paymentDetailLabel,
    paymentDetailPlaceholder,
    resetModals,
    handleFinalOrder,
  } = useTiendaOrder({
    currentUser,
    userProfile,
    rates,
  });

  const {
    selectedEvent,
    eventRegisterLoading,
    eventRegisterSuccess,
    eventParticipants,
    eventForm,
    setEventForm,
    handleOpenEvent,
    handleCloseEvent,
    handleRegisterEvent,
  } = useTiendaEvents();

  return (
    <div className="min-h-screen bg-[#0B0F19] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0B0F19] via-[#0B0F19] to-black pt-24 pb-10">
      <StoreHero storeStatus={storeStatus} />

      <div className="w-full max-w-6xl mx-auto px-6 mb-8 space-y-6">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 bg-[#121826]/50 p-2 rounded-2xl border border-gray-800/50 backdrop-blur-md">
          <CategoryTabs
            allCategories={allCategories}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            setSearchQuery={setSearchQuery}
          />

          <Link
            href="/"
            className="text-gray-600 hover:text-white text-sm font-bold ml-auto pr-4 uppercase tracking-widest transition-colors"
          >
            ← {tCommon('back')}
          </Link>
        </div>

        <SearchBar
          activeCategory={activeCategory}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>

      <div className="w-full max-w-6xl mx-auto px-6 relative z-10 animate-fade-in">
        {activeCategory === 'mmo' ? (
          <TradingBoard />
        ) : activeCategory === 'eventos' ? (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-[0.04em]">
                {t('events_zone').split(' ')[0]}{' '}
                <span className="text-[#00A8FF] drop-shadow-[0_0_14px_rgba(0,168,255,0.25)]">
                  {t('events_zone').split(' ')[1]}
                </span>
              </h2>
              <p className="text-gray-400 mt-3 text-sm md:text-base tracking-[0.04em]">
                {t('events_sub')}
              </p>
            </div>

            {filteredEvents.length === 0 ? (
              <div className="text-center py-16 text-gray-500 font-bold uppercase tracking-widest border border-gray-800 rounded-3xl bg-[#121826]/50">
                {t('no_events')}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredEvents.map((ev) => (
                  <EventCard key={ev.id} ev={ev} onOpen={handleOpenEvent} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {currentCategoryProducts.map((item) => (
              <ProductCard
                key={item.id}
                item={item}
                storeStatus={storeStatus}
                onSelect={(product) => {
                  setSelectedProduct(product);
                  setStep(1);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* MODALES CON PROPS COMPLETAS */}
      <ProductModal
        selectedProduct={selectedProduct}
        selectedVariant={selectedVariant}
        setSelectedVariant={setSelectedVariant}
        step={step}
        setStep={setStep}
        selectedPayment={selectedPayment}
        setSelectedPayment={setSelectedPayment}
        payments={payments}
        userProfile={userProfile}
        isWalletProduct={isWalletProduct}
        walletAmount={walletAmount}
        setWalletAmount={setWalletAmount}
        rates={rates}
        resetModals={resetModals}
        isCopied={isCopied}
        setIsCopied={setIsCopied}
        paymentDetails={paymentDetails}
        setPaymentDetails={setPaymentDetails}
        customerPhone={customerPhone}
        setCustomerPhone={setCustomerPhone}
        walletReceiverEmail={walletReceiverEmail}
        setWalletReceiverEmail={setWalletReceiverEmail}
        paymentDetailLabel={paymentDetailLabel}
        paymentDetailPlaceholder={paymentDetailPlaceholder}
        handleFinalOrder={handleFinalOrder}
      />

      <EventModal
        selectedEvent={selectedEvent}
        eventRegisterLoading={eventRegisterLoading}
        eventRegisterSuccess={eventRegisterSuccess}
        eventParticipants={eventParticipants}
        eventForm={eventForm}
        setEventForm={setEventForm}
        handleCloseEvent={handleCloseEvent}
        handleRegisterEvent={handleRegisterEvent}
      />

      <Footer />
    </div>
  );
}