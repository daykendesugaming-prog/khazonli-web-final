"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const t = useTranslations('Auth');
  
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');

  const switchMode = (loginMode: boolean) => {
    setIsLogin(loginMode);
    setError(null);
    setSuccess(false);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          throw new Error('Credenciales incorrectas. Verifica tu correo y contraseña.');
        }

        // 🟢 REDIRECCIÓN INTELIGENTE MEJORADA
        if (email.toLowerCase() === "leafarevalen@gmail.com") {
          // Usamos window.location.href para forzar al Middleware a leer la nueva sesión
          window.location.href = '/admin'; 
        } else {
          window.location.href = '/perfil';
        }
      } else {
        if (!fullName.trim() || !whatsapp.trim()) {
          throw new Error('Por favor, completa tu Nombre y WhatsApp.');
        }

        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) throw new Error(signUpError.message);

        if (authData.user) {
          const { error: profileError } = await supabase.from('user_profiles').insert([
            {
              id: authData.user.id,
              full_name: fullName,
              whatsapp: whatsapp,
              role: email.toLowerCase() === "leafarevalen@gmail.com" ? 'admin' : 'user' // Asignamos rol en DB
            },
          ]);

          if (profileError) {
            console.warn('Aviso: Perfil creado con error en datos extra:', profileError.message);
          }
        }

        setSuccess(true);

        // 🟢 REDIRECCIÓN INTELIGENTE TRAS REGISTRO
        setTimeout(() => {
          if (email.toLowerCase() === "leafarevalen@gmail.com") {
            router.push('/admin');
          } else {
            router.push('/perfil');
          }
        }, 2500);
      }
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error inesperado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center p-4 relative overflow-hidden">
      {/* GLOWS DE FONDO - RECUPERADOS */}
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
            {isLogin ? t('login_panel') : t('join_station')}
          </p>
        </div>

        {success ? (
          <div className="text-center py-8 animate-fade-in">
            <div className="w-20 h-20 bg-[#00A8FF]/10 border border-[#00A8FF]/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(0,168,255,0.2)]">
              <span className="text-4xl">🚀</span>
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-2">
              {t('success_reg')}
            </h2>
            <p className="text-[#00A8FF] font-bold text-sm mb-6">{t('welcome')}</p>
            <p className="text-gray-500 text-xs uppercase tracking-widest animate-pulse">
              {t('opening_profile')}
            </p>
          </div>
        ) : (
          <>
            <div className="flex bg-[#0B0F19] rounded-xl p-1 mb-8 border border-gray-800">
              <button
                onClick={() => switchMode(true)}
                className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${
                  isLogin
                    ? 'bg-[#00A8FF] text-[#0B0F19] shadow-[0_0_15px_rgba(0,168,255,0.4)]'
                    : 'text-gray-500 hover:text-white'
                }`}
              >
                {t('enter')}
              </button>
              <button
                onClick={() => switchMode(false)}
                className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${
                  !isLogin
                    ? 'bg-[#00A8FF] text-[#0B0F19] shadow-[0_0_15px_rgba(0,168,255,0.4)]'
                    : 'text-gray-500 hover:text-white'
                }`}
              >
                {t('register')}
              </button>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              {!isLogin && (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <label className="block text-[10px] font-black text-gray-500 uppercase mb-2 ml-1">
                      {t('name_placeholder')}
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-[#0B0F19] border border-gray-800 rounded-xl p-4 text-white text-sm outline-none focus:border-[#00A8FF]/50 transition-colors"
                      placeholder="Ej: Yugo"
                      required={!isLogin}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-[#00A8FF] uppercase mb-2 ml-1">
                      {t('whatsapp_label')}
                    </label>
                    <input
                      type="tel"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="w-full bg-[#0B0F19] border border-[#00A8FF]/30 rounded-xl p-4 text-white text-sm outline-none focus:border-[#00A8FF] transition-colors"
                      placeholder="Ej: +58 412 1234567"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase mb-2 ml-1">
                  {t('email_label')}
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

              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase mb-2 ml-1">
                  {t('pass_label')}
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

              {isLogin && (
                <div className="flex justify-end -mt-1">
                  <Link
                    href="/forgot-password"
                    className="text-[10px] font-black uppercase tracking-widest text-[#00A8FF] hover:text-white transition-colors"
                  >
                    {t('forgot_pass')}
                  </Link>
                </div>
              )}

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
                {loading ? t('process') : isLogin ? t('btn_access') : t('btn_create')}
              </button>
            </form>
          </>
        )}

        <div className="mt-8 text-center border-t border-gray-800 pt-6">
          <Link
            href="/"
            className="text-gray-500 hover:text-white text-[10px] font-bold uppercase transition-colors tracking-widest"
          >
            ← {t('back_login')}
          </Link>
        </div>
      </div>
    </div>
  );
}