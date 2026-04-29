import { supabase } from '@/lib/supabase';
import type { Session, User } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useState } from 'react';

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