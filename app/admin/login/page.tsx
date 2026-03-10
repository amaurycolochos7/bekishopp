'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(false);
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const [logoUrl, setLogoUrl] = useState<string | null>(null);
    const [nombreNegocio, setNombreNegocio] = useState('');
    const [slogan, setSlogan] = useState('');
    const router = useRouter();

    useEffect(() => {
        async function cargarConfig() {
            try {
                const supabase = createClient();
                const { data } = await supabase.from('configuracion').select('logo_url, nombre_negocio, slogan').limit(1).single();
                if (data) {
                    setLogoUrl(data.logo_url);
                    setNombreNegocio(data.nombre_negocio || 'Panel de Administración');
                    setSlogan(data.slogan || 'Gestione sus productos y servicios');
                }
            } catch {
                // sin configuración aún
            }
        }
        cargarConfig();
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setCargando(true);
        setError('');

        const supabase = createClient();
        const { error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (authError) {
            setError('Credenciales incorrectas. Verifica tu correo y contraseña.');
            setCargando(false);
            return;
        }

        router.push('/admin');
        router.refresh();
    };

    return (
        <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4">
            {/* Fondo elegante */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#f5f0e8] via-[#ede6da] to-[#e8dfd0]" />

            {/* Decoraciones sutiles */}
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#c4a97d]/10 blur-3xl" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#8b7355]/10 blur-3xl" />

            {/* Card de login */}
            <div className="relative z-10 w-full max-w-sm">
                {/* Logo dinámico del negocio */}
                <div className="text-center mb-8">
                    {logoUrl ? (
                        <img src={logoUrl} alt={nombreNegocio} className="w-20 h-20 mx-auto rounded-2xl object-cover shadow-lg mb-4" />
                    ) : (
                        <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-[#b8976a] to-[#8b7355] flex items-center justify-center shadow-lg mb-4">
                            <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>
                        </div>
                    )}
                    <h1 className="text-xl font-bold text-[#3d3225]">
                        Panel de Administración
                    </h1>
                    <p className="mt-1 text-[#8b7c6b] text-sm">
                        {slogan || 'Gestione sus productos y servicios'}
                    </p>
                </div>

                {/* Formulario */}
                <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-7 shadow-xl shadow-black/5 border border-white/80">
                    {error && (
                        <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="block text-xs font-bold text-[#5a4e3f] uppercase tracking-wider mb-2">
                                Correo electrónico
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <svg className="w-4.5 h-4.5 text-[#b8a68d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="correo@ejemplo.com"
                                    className="w-full pl-11 pr-4 py-3 bg-[#faf7f2] border border-[#e0d5c4] rounded-xl text-[#3d3225] placeholder-[#c4b8a5] text-sm focus:outline-none focus:border-[#b8976a] focus:ring-2 focus:ring-[#b8976a]/20 transition-all"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xs font-bold text-[#5a4e3f] uppercase tracking-wider mb-2">
                                Contraseña
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <svg className="w-4.5 h-4.5 text-[#b8a68d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <input
                                    type={mostrarPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="Tu contraseña"
                                    className="w-full pl-11 pr-11 py-3 bg-[#faf7f2] border border-[#e0d5c4] rounded-xl text-[#3d3225] placeholder-[#c4b8a5] text-sm focus:outline-none focus:border-[#b8976a] focus:ring-2 focus:ring-[#b8976a]/20 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setMostrarPassword(!mostrarPassword)}
                                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#b8a68d] hover:text-[#8b7355] transition-colors"
                                >
                                    {mostrarPassword ? (
                                        <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Botón */}
                        <button
                            type="submit"
                            disabled={cargando}
                            className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-[#b8976a] to-[#a07d52] hover:from-[#a07d52] hover:to-[#8b6b3e] shadow-lg shadow-[#b8976a]/25 hover:shadow-xl hover:shadow-[#b8976a]/30 hover:-translate-y-0.5 flex items-center justify-center gap-2"
                        >
                            {cargando ? (
                                <>
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Verificando...
                                </>
                            ) : (
                                <>
                                    Iniciar Sesión
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Volver */}
                <a
                    href="/"
                    className="mt-6 flex items-center justify-center gap-2 text-[#8b7c6b] hover:text-[#5a4e3f] text-sm transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Volver al catálogo público
                </a>
            </div>
        </div>
    );
}
