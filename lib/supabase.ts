import { createClient } from "@supabase/supabase-js";
import * as SecureStore from 'expo-secure-store';

const ExpoSecureStoreAdapter = {
    // Pega a autenticação do usuário e descriptografa.
    getItem: (key: string) => {
        return SecureStore.getItemAsync(key);
    },
    setItem: (key: string, value: string) => {
        SecureStore.setItemAsync(key, value);
    },
    removeItem: (key: string) => {
        SecureStore.deleteItemAsync(key);
    }
}

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_KEY!;

export const supabase = createClient(
    supabaseUrl,
    supabaseAnonKey, 
    {
        auth: {
            storage: ExpoSecureStoreAdapter,
            autoRefreshToken: true, // Token renegerado em um intervalo específico (1h - 3600s)
            persistSession: true, // Permite que o usuário continue logado através da sessão
            detectSessionInUrl: false // Detecta a sessão através da URL (falso para mobile)
        }
    }
)