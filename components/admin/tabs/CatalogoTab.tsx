"use client";

type ProductVariant = {
  id: number;
  variant_name: string;
  price_text: string;
  price_usd: number;
};

type Product = {
  id: number;
  name: string;
  category: string;
  icon: string;
  description?: string;
  product_variants?: ProductVariant[];
};

type NewProduct = {
  name: string;
  category: string;
  description: string;
  icon: string;
  tag: string;
};

type Props = {
  products: Product[];
  newProduct: NewProduct;
  setNewProduct: React.Dispatch<React.SetStateAction<NewProduct>>;
  uploading: boolean;
  rates: { buy: number };
  onUploadImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCreateProduct: () => void;
  onOpenVariantModal: (productId: number) => void;
  onDeleteProduct: (id: number) => void;
  onDeleteVariant: (id: number) => void;
};

export default function CatalogoTab({
  products,
  newProduct,
  setNewProduct,
  uploading,
  rates,
  onUploadImage,
  onCreateProduct,
  onOpenVariantModal,
  onDeleteProduct,
  onDeleteVariant,
}: Props) {
  return (
    <div className="bg-[#121826] border border-purple-500/20 rounded-3xl p-6 animate-fade-in">
      <h2 className="text-xs font-black text-purple-400 uppercase mb-6 tracking-widest">
        📦 SERVICIOS DIGITALES Y STREAMING
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 bg-[#0B0F19] p-6 rounded-2xl border border-gray-800">
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Nombre (Ej: Netflix)"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            className="w-full bg-[#121826] border border-gray-800 rounded-xl p-3 text-sm outline-none focus:border-purple-500/50"
          />

          <div>
            <input
              type="text"
              placeholder="Categoría (Ej: software, streaming)"
              value={newProduct.category}
              onChange={(e) =>
                setNewProduct({ ...newProduct, category: e.target.value.toLowerCase() })
              }
              className="w-full bg-[#121826] border border-gray-800 rounded-xl p-3 text-sm outline-none focus:border-purple-500/50"
            />

            <div className="flex flex-wrap gap-2 text-[9px] uppercase font-bold mt-2 px-1 items-center">
              <span className="text-gray-600">Rápidas:</span>
              <button
                type="button"
                onClick={() => setNewProduct({ ...newProduct, category: 'streaming' })}
                className={`px-2 py-1 rounded transition-all ${
                  newProduct.category === 'streaming'
                    ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/40'
                    : 'bg-purple-500/10 text-purple-400 hover:bg-purple-500/30'
                }`}
              >
                Streaming
              </button>
              <button
                type="button"
                onClick={() => setNewProduct({ ...newProduct, category: 'gaming' })}
                className={`px-2 py-1 rounded transition-all ${
                  newProduct.category === 'gaming'
                    ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/40'
                    : 'bg-purple-500/10 text-purple-400 hover:bg-purple-500/30'
                }`}
              >
                Gaming
              </button>
              <button
                type="button"
                onClick={() => setNewProduct({ ...newProduct, category: 'wallets' })}
                className={`px-2 py-1 rounded transition-all ${
                  newProduct.category === 'wallets'
                    ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/40'
                    : 'bg-purple-500/10 text-purple-400 hover:bg-purple-500/30'
                }`}
              >
                Wallets
              </button>
            </div>
          </div>
        </div>

        <textarea
          placeholder="Descripción corta..."
          value={newProduct.description}
          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
          className="w-full bg-[#121826] border border-gray-800 rounded-xl p-3 text-sm outline-none focus:border-purple-500/50 h-24"
        />

        <div className="flex flex-col gap-4">
          <div className="border-2 border-dashed border-gray-800 rounded-2xl flex flex-col items-center justify-center p-4 relative group transition-all overflow-hidden h-24">
            {uploading ? (
              <span className="text-[10px] font-black text-purple-400 uppercase animate-pulse">
                ⏳ Subiendo...
              </span>
            ) : newProduct.icon ? (
              <img src={newProduct.icon} className="w-full h-full object-contain" />
            ) : (
              <span className="text-[9px] text-gray-600 font-bold uppercase text-center">
                📸 Seleccionar Logo
              </span>
            )}

            {!uploading && (
              <label className="absolute inset-0 cursor-pointer flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/80 transition-opacity rounded-2xl">
                <span className="text-[9px] font-black text-purple-400 uppercase">
                  {newProduct.icon ? 'Cambiar Logo' : 'Subir Logo'}
                </span>
                <input
                  type="file"
                  className="hidden"
                  onChange={onUploadImage}
                  disabled={uploading}
                />
              </label>
            )}
          </div>
          <button
            onClick={onCreateProduct}
            className="w-full py-3 bg-purple-500 text-white font-black uppercase rounded-xl text-[10px] hover:bg-purple-400 active:scale-95 transition-all shadow-lg shadow-purple-500/20"
          >
            Crear Servicio
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {products.map((p) => (
          <div key={p.id} className="bg-[#0B0F19] border border-gray-800 rounded-2xl p-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#121826] border border-gray-800 rounded-xl flex items-center justify-center p-2">
                  <img src={p.icon} className="w-full h-full object-contain" />
                </div>
                <div>
                  <div className="flex items-center gap-2 relative">
                    <h3 className="font-black uppercase text-sm">{p.name}</h3>
                    
                    {/* 🟢 CORRECCIÓN: Burbuja con Z-Index absoluto y anti-recortes */}
                    {p.description && (
                      <div className="relative group cursor-help ml-1 flex items-center">
                        <span className="flex items-center justify-center w-4 h-4 rounded-full bg-purple-500/20 text-purple-400 text-[10px] font-black border border-purple-500/30 hover:bg-purple-500 hover:text-white transition-colors">
                          i
                        </span>
                        
                        {/* La burbuja que flota por encima de toda la página */}
                        <div className="absolute top-full left-0 mt-2 hidden group-hover:block w-48 sm:w-64 bg-[#121826] border border-purple-500/50 p-4 rounded-xl z-[999] shadow-[0_10px_40px_rgba(0,0,0,0.8)] pointer-events-none">
                          <p className="text-[10px] text-gray-300 font-medium normal-case tracking-normal leading-relaxed relative z-10">
                            {p.description}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  <span className="text-[7px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded font-bold uppercase mt-1 inline-block">
                    {p.category}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onOpenVariantModal(p.id)}
                  className="bg-green-500/10 text-green-500 px-3 py-1 rounded-lg text-[8px] font-black uppercase hover:bg-green-500 hover:text-black active:scale-95 transition-all"
                >
                  + Variantes
                </button>
                <button
                  onClick={() => onDeleteProduct(p.id)}
                  className="text-red-500 hover:bg-red-500 hover:text-white p-2 rounded-lg transition-colors text-xs"
                >
                  🗑️
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {p.product_variants?.map((v) => (
                <div
                  key={v.id}
                  className="bg-[#121826] p-3 rounded-xl border border-gray-800 flex justify-between items-center"
                >
                  <div className="overflow-hidden">
                    <p className="text-[10px] font-bold text-gray-300 truncate">
                      {v.variant_name}
                    </p>
                    <p className="text-[10px] font-black text-[#FBB03B]">
                      {v.price_text}{' '}
                      <span className="text-gray-600 font-medium">
                        | {(v.price_usd * rates.buy).toFixed(2)} Bs
                      </span>
                    </p>
                  </div>

                  <button
                    onClick={() => onDeleteVariant(v.id)}
                    className="text-red-500 text-[10px] ml-2 hover:bg-red-500/20 p-1.5 rounded transition-colors"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}