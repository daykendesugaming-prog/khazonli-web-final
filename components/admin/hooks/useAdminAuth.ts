"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';

export function useAdminAuth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;
    
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.warn('⚠️ Error obteniendo sesión:', error.message);
          
          // Si es error de token inválido, limpiar sesión corrupta
          if (error.message.includes('Refresh Token') || error.message.includes('Invalid')) {
            console.log('🧹 Limpiando token inválido...');
            await supabase.auth.signOut();
          }
          
          if (isMounted) setSession(null);
          return;
        }
        
        if (isMounted) setSession(session);
      } catch (err) {
        console.error('❌ Error inicializando auth:', err);
        if (isMounted) setSession(null);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;
        
        console.log(`🔐 Auth event: ${event}`);
        
        // Solo actualizar en eventos relevantes
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'SIGNED_OUT') {
          setSession(session);
        }
        
        // Si hay error de token, limpiar
        if (event === 'TOKEN_REFRESHED' && !session) {
          await supabase.auth.signOut();
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Limpiar cualquier sesión corrupta antes de login
    await supabase.auth.signOut();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError('Acceso denegado: ' + error.message);
    } else {
      setSession(data.session);
    }

    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    session,
    handleLogin,
    handleLogout,
  };
}