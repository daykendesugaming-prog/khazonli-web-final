"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../../lib/supabase';

export default function ResetPasswordPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const prepareRecoverySession = async () => {
      try {
        const hash = window.location.hash;
        const params = new URLSearchParams(hash.replace('#', ''));
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        const type = params.get('type');

        if (type !== 'recovery' || !accessToken || !refreshToken) {
          setError('El enlace de recuperación no es válido o ha expirado.');
          setLoading(false);
          return;
        }

        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          setError('No se pudo validar la sesión de recuperación.');
          setLoading(false);
          return;
        }

        setReady(true);
      } catch {
        setError('No se pudo preparar la recuperación de contraseña.');
      } finally {
        setLoading(false);
      }
    };

    prepareRecoverySession();
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setSaving(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) throw new Error(error.message);

      setSuccess(true);

      setTimeout(() => {
        router.push('/login');
      }, 2500);
    } catch (err: any) {
      setError(err.message || 'No se pudo actualizar la contraseña.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00A8FF]"></div>
      </div>
    );
  }

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
            Nueva contraseña
          </p>
        </div>

        {success ? (
          <div className="text-center py-6 animate-fade-in">
            <div className="w-20 h-20 bg-[#00A8FF]/10 border border-[#00A8FF]/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(0,168,255,0.2)]">
              <span className="text-4xl">🔐</span>
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-2">
              Contraseña actualizada
            </h2>
            <p className="text-[#00A8FF] font-bold text-sm mb-6">
              Ya puedes iniciar sesión
            </p>
            <p className="text-gray-500 text-xs uppercase tracking-widest animate-pulse">
              Redirigiendo al acceso...
            </p>
          </div>
        ) : !ready ? (
          <div className="text-center py-8">
            <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl">
              <p className="text-red-400 text-xs font-bold uppercase tracking-wider">
                {error || 'No se pudo validar el enlace de recuperación.'}
              </p>
            </div>

            <Link
              href="/forgot-password"
              className="inline-block mt-6 px-6 py-3 bg-[#00A8FF] text-[#0B0F19] font-black uppercase text-xs tracking-widest rounded-xl hover:bg-blue-400 transition-all shadow-lg shadow-[#00A8FF]/20"
            >
              Solicitar un nuevo enlace
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6 rounded-2xl border border-[#00A8FF]/15 bg-[#0B0F19]/80 px-4 py-4">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#00A8FF]">
                Restablecer acceso
              </p>
              <p className="mt-2 text-[12px] leading-relaxed text-gray-400">
                Define una nueva contraseña segura para volver a entrar en tu cuenta.
              </p>
            </div>

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase mb-2 ml-1">
                  Nueva Contraseña
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0B0F19] border border-gray-800 rounded-xl p-4 text-white text-sm outline-none focus:border-[#00A8FF]/50 transition-colors"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase mb-2 ml-1">
                  Confirmar Contraseña
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#0B0F19] border border-gray-800 rounded-xl p-4 text-white text-sm outline-none focus:border-[#00A8FF]/50 transition-colors"
                  placeholder="••••••••"
                  required
                  minLength={6}
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
                disabled={saving}
                className="w-full mt-6 py-4 bg-[#00A8FF] text-[#0B0F19] font-black uppercase text-xs tracking-widest rounded-xl hover:bg-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#00A8FF]/20"
              >
                {saving ? 'Actualizando acceso...' : 'Guardar nueva contraseña'}
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