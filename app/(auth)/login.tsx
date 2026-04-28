import { useAuth } from '@/contexts/AuthContext';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      Alert.alert('Erro ao entrar', error.message);
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white justify-center items-center p-4">
      <Text className="text-2xl font-bold mb-8">Social App</Text>
      
      <TextInput 
        placeholder="Email" 
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        className="w-full bg-gray-100 p-4 rounded-lg mb-4"
      />
      
      <TextInput 
        placeholder="Senha" 
        value={password}
        onChangeText={setPassword}
        secureTextEntry 
        autoCapitalize="none"
        className="w-full bg-gray-100 p-4 rounded-lg mb-6"
      />
      
      <TouchableOpacity 
        onPress={handleLogin}
        disabled={loading}
        className="w-full bg-blue-500 p-4 rounded-lg items-center mb-4"
        style={loading ? { opacity: 0.7 } : undefined}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-bold">Entrar</Text>
        )}
      </TouchableOpacity>

      <Link href="/register" asChild>
        <TouchableOpacity>
          <Text className="text-blue-500">Não tem conta? Cadastre-se</Text>
        </TouchableOpacity>
      </Link>
    </SafeAreaView>
  );
}