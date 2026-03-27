"use client";

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const redirectTo =
        typeof window !== 'undefined'
          ? `${window.location.origin}/reset-password`
          : undefined;

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });

      if (error) throw new Error(error.message);

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'No se pudo procesar la solicitud.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00A8FF]/10 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FBB03B]/5 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="bg-[#121826] border border-gray-800 p-8 md:p-10 rounded-[30px] w-full max-w-md shadow-2xl relative z-10 animate-fade-in">
        <div className="text-center mb-8">
          <Link href="/">
            <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter hover:scale-105 transition-transform inline-block cursor-pointer mb-2">
              KHAZONLI<span className="text-[#00A8FF]">.ES</span>
            </h1>
          </Link>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
            Recuperación de acceso
          </p>
        </div>

        {success ? (
          <div className="text-center py-6 animate-fade-in">
            <div className="w-20 h-20 bg-[#00A8FF]/10 border border-[#00A8FF]/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(0,168,255,0.2)]">
              <span className="text-4xl">📩</span>
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-2">
              Correo enviado
            </h2>
            <p className="text-[#00A8FF] font-bold text-sm mb-4">
              Revisa tu bandeja de entrada
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              Si el correo existe en el sistema, recibirás un enlace para restablecer tu contraseña.
            </p>

            <Link
              href="/login"
              className="inline-block mt-8 px-6 py-3 bg-[#00A8FF] text-[#0B0F19] font-black uppercase text-xs tracking-widest rounded-xl hover:bg-blue-400 transition-all shadow-lg shadow-[#00A8FF]/20"
            >
              Volver al acceso
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6 rounded-2xl border border-[#00A8FF]/15 bg-[#0B0F19]/80 px-4 py-4">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#00A8FF]">
                Recupera tu cuenta
              </p>
              <p className="mt-2 text-[12px] leading-relaxed text-gray-400">
                Introduce el correo de tu cuenta y te enviaremos un enlace para crear una nueva contraseña.
              </p>
            </div>

            <form onSubmit={handleResetRequest} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase mb-2 ml-1">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0B0F19] border border-gray-800 rounded-xl p-4 text-white text-sm outline-none focus:border-[#00A8FF]/50 transition-colors"
                  placeholder="tu@correo.com"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-xl mt-4">
                  <p className="text-red-500 text-[10px] font-bold text-center uppercase tracking-wider">
                    {error}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 py-4 bg-[#00A8FF] text-[#0B0F19] font-black uppercase text-xs tracking-widest rounded-xl hover:bg-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#00A8FF]/20"
              >
                {loading ? 'Enviando enlace...' : 'Enviar enlace de recuperación'}
              </button>
            </form>
          </>
        )}

        <div className="mt-8 text-center border-t border-gray-800 pt-6">
          <Link
            href="/login"
            className="text-gray-500 hover:text-white text-[10px] font-bold uppercase transition-colors tracking-widest"
          >
            ← Volver al login
          </Link>
        </div>
      </div>
    </div>
  );
}