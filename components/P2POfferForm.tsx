'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function P2POfferForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dbServers, setDbServers] = useState<string[]>([]);

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);

  const [action, setAction] = useState('Quiero Vender mis MK');
  const [server, setServer] = useState('');
  const [customServer, setCustomServer] = useState('');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [contact, setContact] = useState('');

  useEffect(() => {
    async function loadInitialData() {
      const { data } = await supabase
        .from('mmo_servers')
        .select('server_name')
        .eq('is_active', true);

      if (data && data.length > 0) {
        const serverNames = data.map((s) => s.server_name);
        setDbServers(serverNames);
        setServer(serverNames[0]);
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        setCurrentUser(session.user);

        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          setUserProfile(profile);
          if (profile.whatsapp) {
            setContact(profile.whatsapp);
          }
        }
      }
    }

    loadInitialData();
  }, []);

  const handleSubmit = async () => {
    const finalServer = server === 'Otro' ? customServer.trim() : server;

    if (!amount || !price || !contact.trim() || !finalServer.trim()) {
      alert('⚠️ Por favor completa todos los campos para enviar tu oferta.');
      return;
    }

    setIsSubmitting(true);

    const totalPropuesto = (parseFloat(amount) * parseFloat(price)).toFixed(2);
    let orderId = `OFER-${Math.floor(Date.now() / 1000)}`;

    try {
      const { data, error } = await supabase
        .from('digital_orders')
        .insert([
          {
            product_name: `Oferta P2P - ${action.includes('Vender') ? 'Venta' : 'Compra'}`,
            variant_name: `${amount} MK en ${finalServer} a $${price}/MK`,
            price_text: `$${totalPropuesto} USD (Propuesto)`,
            price_bs: null,
            payment_method: 'A convenir',
            customer_phone: contact.trim(),
            payment_details: `Oferta P2P | Acción: ${action} | Server: ${finalServer}`,
            status: 'pendiente',
            user_id: currentUser?.id || null,
          },
        ])
        .select()
        .single();

      if (error) {
        console.warn('Aviso BD P2P:', error.message);
      }

      if (data && data.id) {
        orderId = data.id;
      }
    } catch (e) {
      console.warn('Error de conexión BD P2P:', e);
    }

    const message = `¡Hola Khazonli! 👋\n\nTengo una *OFERTA P2P*.\n\n🆔 *TICKET:* ${orderId}\n🎯 *ACCIÓN:* ${action}\n🌍 *SERVER:* ${finalServer}\n💰 *CANTIDAD:* ${amount} MK\n💵 *MI PRECIO:* $${price} USD/MK\n🤝 *TOTAL PROPUESTO:* $${totalPropuesto} USD\n📞 *CONTACTO:* ${contact.trim()}\n\n¿Hacemos trato?`;

    window.open(`https://wa.me/584124989220?text=${encodeURIComponent(message)}`, '_blank');

    setIsSubmitting(false);
    setAmount('');
    setPrice('');
    setCustomServer('');

    if (userProfile?.whatsapp) {
      setContact(userProfile.whatsapp);
    } else {
      setContact('');
    }

    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full mt-6 py-4 border border-dashed border-[#00A8FF]/50 bg-[#00A8FF]/5 text-[#00A8FF] font-bold rounded-xl hover:bg-[#00A8FF]/10 transition-all flex items-center justify-center gap-2"
      >
        <span>⚡</span> ¿Tienes un lote grande? Proponer Precio Personalizado
      </button>
    );
  }

  return (
    <div className="w-full mt-6 p-6 bg-[#0B0F19] border border-gray-800 rounded-xl relative animate-fade-in shadow-2xl">
      <button
        onClick={() => setIsOpen(false)}
        className="absolute top-4 right-4 text-gray-500 hover:text-white"
      >
        ✕
      </button>

      <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight">
        Lanza tu Oferta
      </h3>
      <p className="text-xs text-gray-400 mb-6">
        Si la oferta es buena, Khaz te contactará en menos de 24h.
      </p>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
              Acción
            </label>
            <select
              value={action}
              onChange={(e) => setAction(e.target.value)}
              className="w-full bg-[#121826] border border-gray-700 rounded-lg p-2.5 text-white text-sm focus:border-[#00A8FF] outline-none"
            >
              <option>Quiero Vender mis MK</option>
              <option>Quiero Comprar MK</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
              Servidor
            </label>
            <select
              value={server}
              onChange={(e) => setServer(e.target.value)}
              className="w-full bg-[#121826] border border-gray-700 rounded-lg p-2.5 text-white text-sm focus:border-[#00A8FF] outline-none"
            >
              {dbServers.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
              <option value="Otro">Otro (Escribir)</option>
            </select>
          </div>
        </div>

        {server === 'Otro' && (
          <div className="animate-fade-in">
            <label className="block text-[10px] font-bold text-[#00A8FF] uppercase mb-1">
              Nombre del Servidor
            </label>
            <input
              type="text"
              placeholder="Ej: Omegas"
              value={customServer}
              onChange={(e) => setCustomServer(e.target.value)}
              className="w-full bg-[#121826] border border-[#00A8FF]/50 rounded-lg p-2.5 text-white text-sm focus:border-[#00A8FF] outline-none"
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
              Cantidad (MK)
            </label>
            <input
              type="number"
              placeholder="Ej: 50"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-[#121826] border border-gray-700 rounded-lg p-2.5 text-white text-sm focus:border-[#00A8FF] outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#FBB03B] uppercase mb-1">
              Tu Precio (USD/MK)
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="Ej: 0.85"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-[#121826] border border-[#FBB03B]/50 rounded-lg p-2.5 text-[#FBB03B] font-bold text-sm focus:border-[#FBB03B] outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-[#00A8FF] uppercase mb-1">
            Tu WhatsApp / Discord *
          </label>
          <input
            type="text"
            placeholder="+58... o Usuario#1234"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="w-full bg-[#121826] border border-[#00A8FF]/50 rounded-lg p-2.5 text-white text-sm focus:border-[#00A8FF] outline-none"
          />
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting || !amount || !price || !contact || (server === 'Otro' && !customServer)}
          className="w-full py-3 bg-gradient-to-r from-[#00A8FF] to-cyan-400 text-[#0B0F19] font-black uppercase tracking-wider rounded-lg shadow-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-2"
        >
          {isSubmitting ? 'Procesando...' : 'Enviar Oferta al Sistema'}
        </button>
      </div>
    </div>
  );
}