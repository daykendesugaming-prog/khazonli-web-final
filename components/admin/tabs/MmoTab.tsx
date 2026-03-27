type Server = {
  game: string;
  server_name: string;
  buy_rate: number | string;
  sell_rate?: number | string;
  is_active: boolean;
};

type Stock = {
  id: number;
  game: string;
  server_name: string;
  price_usd: number | string;
  stock_mk: number | string;
  is_active: boolean;
};

type Route = {
  id: number;
  server_from: string;
  server_to: string;
  mode: string;
  rate: number | string;
  is_active: boolean;
};

type NewServer = {
  game: string;
  name: string;
  buy: string;
  sell: string;
};

type NewStock = {
  game: string;
  server_name: string;
  price_usd: string;
  stock_mk: string;
};

type NewRoute = {
  server_from: string;
  server_to: string;
  mode: string;
  rate: string;
};

type Props = {
  servers: Server[];
  newServer: NewServer;
  setNewServer: React.Dispatch<React.SetStateAction<NewServer>>;
  onServerInputChange: (index: number, field: string, value: any) => void;
  onSaveServer: (server: Server) => void;
  onCreateServer: () => void;
  onDeleteServer: (serverName: string) => void;

  stocks: Stock[];
  newStock: NewStock;
  setNewStock: React.Dispatch<React.SetStateAction<NewStock>>;
  onStockInputChange: (index: number, field: string, value: any) => void;
  onSaveStock: (stock: Stock) => void;
  onCreateStock: () => void;
  onDeleteStock: (id: number) => void;

  routes: Route[];
  newRoute: NewRoute;
  setNewRoute: React.Dispatch<React.SetStateAction<NewRoute>>;
  onRouteInputChange: (index: number, field: string, value: any) => void;
  onSaveRoute: (route: Route) => void;
  onCreateRoute: () => void;
  onDeleteRoute: (id: number) => void;
};

export default function MmoTab({
  servers,
  newServer,
  setNewServer,
  onServerInputChange,
  onSaveServer,
  onCreateServer,
  onDeleteServer,
  stocks,
  newStock,
  setNewStock,
  onStockInputChange,
  onSaveStock,
  onCreateStock,
  onDeleteStock,
  routes,
  newRoute,
  setNewRoute,
  onRouteInputChange,
  onSaveRoute,
  onCreateRoute,
  onDeleteRoute,
}: Props) {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-[#121826] border border-[#00A8FF]/30 rounded-3xl p-6">
        <h2 className="text-xs font-black text-[#00A8FF] uppercase mb-6 tracking-widest">
          📉 COMPRA DE MK (CLIENTE VENDE)
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8 bg-[#0B0F19] p-4 rounded-2xl border border-gray-800">
          <input
            type="text"
            placeholder="Juego"
            value={newServer.game}
            onChange={(e) => setNewServer({ ...newServer, game: e.target.value })}
            className="bg-[#121826] border border-gray-800 rounded-lg p-2 text-[10px] outline-none focus:border-[#00A8FF]/50"
          />
          <input
            type="text"
            placeholder="Servidor"
            value={newServer.name}
            onChange={(e) => setNewServer({ ...newServer, name: e.target.value })}
            className="bg-[#121826] border border-gray-800 rounded-lg p-2 text-[10px] outline-none focus:border-[#00A8FF]/50"
          />
          <input
            type="number"
            placeholder="Compra $"
            value={newServer.buy}
            onChange={(e) => setNewServer({ ...newServer, buy: e.target.value })}
            className="bg-[#121826] border border-gray-800 rounded-lg p-2 text-[10px] outline-none focus:border-[#00A8FF]/50"
          />
          <input
            type="number"
            placeholder="Venta referencial $"
            value={newServer.sell}
            onChange={(e) => setNewServer({ ...newServer, sell: e.target.value })}
            className="bg-[#121826] border border-gray-800 rounded-lg p-2 text-[10px] outline-none focus:border-[#00A8FF]/50"
          />
          <button
            onClick={onCreateServer}
            className="bg-white text-black font-black uppercase text-[9px] rounded-lg hover:bg-gray-200 active:scale-95 transition-all"
          >
            Añadir
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[10px] font-bold text-white">
            <thead>
              <tr className="border-b border-gray-800 text-gray-500 uppercase tracking-widest">
                <th className="pb-4 pl-4 text-left">Server</th>
                <th className="pb-4 text-center">Paga a (USDT)</th>
                <th className="pb-4 text-center">Visible</th>
                <th className="pb-4 text-right pr-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {servers.map((s, i) => (
                <tr key={`${s.server_name}-${i}`} className="border-b border-gray-800/50 hover:bg-white/5 transition-all">
                  <td className="py-4 pl-4">
                    <span className="text-[#00A8FF] uppercase">{s.game}</span>
                    <br />
                    {s.server_name}
                  </td>

                  <td className="text-center">
                    <input
                      type="number"
                      step="0.01"
                      value={s.buy_rate}
                      onChange={(e) => onServerInputChange(i, 'buy_rate', e.target.value)}
                      className="w-16 bg-[#0B0F19] text-center rounded border border-gray-800 outline-none focus:border-[#00A8FF]/50"
                    />
                  </td>

                  <td className="text-center">
                    <input
                      type="checkbox"
                      checked={s.is_active}
                      onChange={(e) => onServerInputChange(i, 'is_active', e.target.checked)}
                      className="accent-[#00A8FF]"
                    />
                  </td>

                  <td className="py-4 pr-4 flex gap-2 justify-end">
                    <button
                      onClick={() => onSaveServer(s)}
                      className="p-2 bg-gray-800 rounded-lg hover:bg-white hover:text-black transition-colors"
                    >
                      💾
                    </button>
                    <button
                      onClick={() => onDeleteServer(s.server_name)}
                      className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-[#121826] border border-[#FBB03B]/30 rounded-3xl p-6">
        <h2 className="text-xs font-black text-[#FBB03B] uppercase mb-6 tracking-widest">
          📦 INVENTARIO MK (CLIENTE COMPRA)
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8 bg-[#0B0F19] p-4 rounded-2xl border border-gray-800">
          <input
            type="text"
            placeholder="Juego"
            value={newStock.game}
            onChange={(e) => setNewStock({ ...newStock, game: e.target.value })}
            className="bg-[#121826] border border-gray-800 rounded-lg p-2 text-[10px] outline-none focus:border-[#FBB03B]/50"
          />
          <input
            type="text"
            placeholder="Servidor"
            value={newStock.server_name}
            onChange={(e) => setNewStock({ ...newStock, server_name: e.target.value })}
            className="bg-[#121826] border border-gray-800 rounded-lg p-2 text-[10px] outline-none focus:border-[#FBB03B]/50"
          />
          <input
            type="number"
            placeholder="Precio USDT"
            value={newStock.price_usd}
            onChange={(e) => setNewStock({ ...newStock, price_usd: e.target.value })}
            className="bg-[#121826] border border-gray-800 rounded-lg p-2 text-[10px] outline-none focus:border-[#FBB03B]/50"
          />
          <input
            type="number"
            placeholder="Stock (M)"
            value={newStock.stock_mk}
            onChange={(e) => setNewStock({ ...newStock, stock_mk: e.target.value })}
            className="bg-[#121826] border border-gray-800 rounded-lg p-2 text-[10px] outline-none focus:border-[#FBB03B]/50"
          />
          <button
            onClick={onCreateStock}
            className="bg-[#FBB03B] text-black font-black uppercase text-[9px] rounded-lg hover:bg-yellow-400 active:scale-95 transition-all"
          >
            Añadir
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[10px] font-bold text-white">
            <thead>
              <tr className="border-b border-gray-800 text-gray-500 uppercase tracking-widest">
                <th className="pb-4 pl-4 text-left">Server</th>
                <th className="pb-4 text-center">Precio USDT</th>
                <th className="pb-4 text-center">Stock (M)</th>
                <th className="pb-4 text-center">Visible</th>
                <th className="pb-4 text-right pr-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((s, i) => (
                <tr key={s.id} className="border-b border-gray-800/50 hover:bg-white/5 transition-all">
                  <td className="py-4 pl-4">
                    <span className="text-[#FBB03B] uppercase">{s.game}</span>
                    <br />
                    {s.server_name}
                  </td>

                  <td className="text-center">
                    <input
                      type="number"
                      step="0.01"
                      value={s.price_usd}
                      onChange={(e) => onStockInputChange(i, 'price_usd', e.target.value)}
                      className="w-16 bg-[#0B0F19] text-center rounded border border-gray-800 outline-none focus:border-[#FBB03B]/50"
                    />
                  </td>

                  <td className="text-center">
                    <input
                      type="number"
                      step="0.01"
                      value={s.stock_mk}
                      onChange={(e) => onStockInputChange(i, 'stock_mk', e.target.value)}
                      className="w-16 bg-[#0B0F19] text-center rounded border border-gray-800 outline-none focus:border-[#FBB03B]/50"
                    />
                  </td>

                  <td className="text-center">
                    <input
                      type="checkbox"
                      checked={s.is_active}
                      onChange={(e) => onStockInputChange(i, 'is_active', e.target.checked)}
                      className="accent-[#FBB03B]"
                    />
                  </td>

                  <td className="py-4 pr-4 flex gap-2 justify-end">
                    <button
                      onClick={() => onSaveStock(s)}
                      className="p-2 bg-gray-800 rounded-lg hover:bg-white hover:text-black transition-colors"
                    >
                      💾
                    </button>
                    <button
                      onClick={() => onDeleteStock(s.id)}
                      className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-[#121826] border border-[#25D366]/30 rounded-3xl p-6">
        <h2 className="text-xs font-black text-[#25D366] uppercase mb-6 tracking-widest">
          🔄 RUTAS DE INTERCAMBIO
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-8 bg-[#0B0F19] p-4 rounded-2xl border border-gray-800">
          <input
            type="text"
            placeholder="De:"
            value={newRoute.server_from}
            onChange={(e) => setNewRoute({ ...newRoute, server_from: e.target.value })}
            className="bg-[#121826] border border-gray-800 rounded-lg p-2 text-[10px] outline-none focus:border-[#25D366]/50"
          />
          <input
            type="text"
            placeholder="A:"
            value={newRoute.server_to}
            onChange={(e) => setNewRoute({ ...newRoute, server_to: e.target.value })}
            className="bg-[#121826] border border-gray-800 rounded-lg p-2 text-[10px] outline-none focus:border-[#25D366]/50"
          />
          <select
            value={newRoute.mode}
            onChange={(e) => setNewRoute({ ...newRoute, mode: e.target.value })}
            className="bg-[#121826] border border-gray-800 rounded-lg p-2 text-[10px] text-white outline-none focus:border-[#25D366]/50"
          >
            <option value="fijo">Tasa Fija</option>
            <option value="consulta">Por Consulta</option>
          </select>
          <input
            type="number"
            placeholder="Tasa"
            value={newRoute.rate}
            onChange={(e) => setNewRoute({ ...newRoute, rate: e.target.value })}
            disabled={newRoute.mode === 'consulta'}
            className="bg-[#121826] border border-gray-800 rounded-lg p-2 text-[10px] outline-none focus:border-[#25D366]/50 disabled:opacity-50"
          />
          <button
            onClick={onCreateRoute}
            className="bg-[#25D366] text-black font-black uppercase text-[9px] rounded-lg hover:bg-green-400 active:scale-95 transition-all"
          >
            Crear Ruta
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[10px] font-bold text-white">
            <thead>
              <tr className="border-b border-gray-800 text-gray-500 uppercase tracking-widest">
                <th className="pb-4 pl-4 text-left">Desde</th>
                <th className="pb-4 text-left">Hacia</th>
                <th className="pb-4 text-center">Modo</th>
                <th className="pb-4 text-center">Multiplicador</th>
                <th className="pb-4 text-center">Activa</th>
                <th className="pb-4 text-right pr-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {routes.map((r, i) => (
                <tr key={r.id} className="border-b border-gray-800/50 hover:bg-white/5 transition-all">
                  <td className="py-4 pl-4 uppercase text-[#25D366]">{r.server_from}</td>
                  <td className="uppercase">{r.server_to}</td>

                  <td className="text-center">
                    <select
                      value={r.mode}
                      onChange={(e) => onRouteInputChange(i, 'mode', e.target.value)}
                      className="bg-[#0B0F19] border border-gray-800 rounded p-1 text-[9px]"
                    >
                      <option value="fijo">Fija</option>
                      <option value="consulta">Consulta</option>
                    </select>
                  </td>

                  <td className="text-center">
                    <input
                      type="number"
                      step="0.01"
                      value={r.rate}
                      disabled={r.mode === 'consulta'}
                      onChange={(e) => onRouteInputChange(i, 'rate', e.target.value)}
                      className="w-16 bg-[#0B0F19] text-center rounded border border-gray-800 outline-none focus:border-[#25D366]/50 disabled:opacity-50"
                    />
                  </td>

                  <td className="text-center">
                    <input
                      type="checkbox"
                      checked={r.is_active}
                      onChange={(e) => onRouteInputChange(i, 'is_active', e.target.checked)}
                      className="accent-[#25D366]"
                    />
                  </td>

                  <td className="py-4 pr-4 flex gap-2 justify-end">
                    <button
                      onClick={() => onSaveRoute(r)}
                      className="p-2 bg-gray-800 rounded-lg hover:bg-white hover:text-black transition-colors"
                    >
                      💾
                    </button>
                    <button
                      onClick={() => onDeleteRoute(r.id)}
                      className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}