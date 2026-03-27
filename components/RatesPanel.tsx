export default function RatesPanel() {
  // Datos de prueba (Luego los conectaremos a tu base de datos)
  const servers = [
    { id: 1, name: 'Draconiros', version: 'Dofus 2', buy: '0.90', sell: '1.15' },
    { id: 2, name: 'Tal Kasha', version: 'Dofus 2', buy: '0.85', sell: '1.05' },
    { id: 3, name: 'Boune', version: 'Dofus Retro', buy: '2.50', sell: '3.10' },
    { id: 4, name: 'Krajlove', version: 'Dofus Touch', buy: '0.40', sell: '0.55' },
  ];

  return (
    <section className="w-full max-w-5xl mx-auto py-16 px-6">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-gray-800 pb-4">
        <div>
          <h2 className="text-3xl font-bold text-khaz-light tracking-wide">Mercado Actual</h2>
          <p className="text-gray-400 mt-1">Tasas actualizadas en tiempo real</p>
        </div>
        <div className="text-sm text-khaz-blue font-semibold bg-khaz-blue/10 px-3 py-1 rounded-md mt-4 md:mt-0">
          ● Estado: Comprando
        </div>
      </div>

      {/* Grid de Servidores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {servers.map((server) => (
          <div 
            key={server.id} 
            className="bg-[#121826] border border-gray-800 rounded-xl p-5 hover:border-khaz-blue/50 hover:shadow-[0_0_15px_rgba(0,168,255,0.15)] transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-white">{server.name}</h3>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{server.version}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center bg-[#0B0F19] p-2 rounded border border-gray-800/50">
                <span className="text-sm text-gray-400">Tú recibes:</span>
                <span className="font-bold text-green-400">${server.buy}</span>
              </div>
              <div className="flex justify-between items-center bg-[#0B0F19] p-2 rounded border border-gray-800/50">
                <span className="text-sm text-gray-400">Tú pagas:</span>
                <span className="font-bold text-khaz-light">${server.sell}</span>
              </div>
            </div>

            <button className="w-full mt-5 py-2 bg-transparent border border-gray-700 hover:border-khaz-blue hover:text-khaz-blue text-sm font-bold text-gray-300 rounded transition-colors">
              Negociar Ahora
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}