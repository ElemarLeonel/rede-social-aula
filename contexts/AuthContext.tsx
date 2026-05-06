import { supabase } from '@/lib/supabase';
import type { Session, User } from '@supabase/supabase-js';
import React, { createContext, useContext, useEffect, useState } from 'react';

type AuthContextType = {
    session: Session | null;
    user: User | null;
    loading: boolean;
    // SignIn: Login
    signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
    // SignUp: Cadastrar
    signUp: (
        email: string,
        password: string,
        profile?: { name: string, username: string }
    ) => Promise<{ error: Error | null }>;
    confirmEmail: boolean;
    signOut: () => Promise<void>;
}

// Definir a variável que irá armazenar o contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Inicializa o componente recebendo a propriedade children, que tem a tipagem do ReactNode
export default function AuthProvider({ children }: { children: React.ReactNode }){
    // Variável de estado session que armazena a sessão do usuário
    const [session, setSession] = useState<Session | null>(null);
    // Variável de estado loading que armazena o carregamento da tela
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // Pegar a sessão inicial
        supabase.auth.getSession().then(({ data: { session }}) => {
            setSession(session);
            setLoading(false);
        })

        // Pegar todas as alterações de estado (API) da autenticação

        // onAuthStateChange acompanha as notificações em tempo real, da autenticação.
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);

            // unsubscribe() remove e sai de todos os canais Realtime
            return () => subscription.unsubscribe();
        })
    }, [])

    const signIn = async(email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        return { error: error as Error | null }
    }

    // SignUp
    const signUp = async(
        email: string,
        password: string,
        profile?: { name: string, username: string }
    ) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password
        });

        const confirmEmail = !error && !!data.user && data.user.identities?.length === 0;

        if(!error && data.user && profile) {
            await supabase.from('profiles').upsert({
                id: data.user.id,
                name: profile.name,
                username: profile.username,
                avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=random`,
                bio: ''
            })
        }

        return { error: error as Error | null, confirmEmail }
    }

    // SignOut
    const signOut = async() => {
        await supabase.auth.signOut();
    }

    return (
        <AuthContext.Provider value={{
            session,
            // ?? null coalesce
            user: session?.user ?? null,
            loading,
            signIn,
            signUp,
            signOut
        }}>
         { children }
        </AuthContext.Provider>
    )
}

export function useAuth(){
    const context = useContext(AuthContext);
    if(context === undefined) throw new Error("useAuth must be used within an AuthProvider");
    return context
}