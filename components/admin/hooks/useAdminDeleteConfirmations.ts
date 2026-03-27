"use client";

export function useAdminDeleteConfirmations(
  askForConfirmation: Function,
  handleDeleteServer: Function,
  handleDeleteStock: Function,
  handleDeleteRoute: Function,
  handleDeletePayment: Function,
  handleDeleteVariant: Function,
  handleDeleteProduct: Function,
  handleDeleteEvent: Function
) {
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

  return {
    wrappedDeleteServer,
    wrappedDeleteStock,
    wrappedDeleteRoute,
    wrappedDeletePayment,
    wrappedDeleteVariant,
    wrappedDeleteProduct,
    wrappedDeleteEvent,
  };
}