import { useAuth } from '@/contexts/AuthContext';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RegisterScreen() {
  const router = useRouter();
  const { signUp } = useAuth();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha email e senha.');
      return;
    }

    setLoading(true);
    const { error, confirmEmail } = await signUp(email, password, { name, username });
    setLoading(false);

    if (error) {
      Alert.alert('Erro ao cadastrar', error.message);
    } else if (confirmEmail) {
      Alert.alert(
        'Verifique seu email',
        'Enviamos um link de confirmação para o seu email. Confirme para poder entrar.',
        [{ text: 'OK', onPress: () => router.replace('/(auth)/login') }]
      );
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white justify-center items-center p-4">
      <Text className="text-2xl font-bold mb-8">Criar Conta</Text>
      
      <TextInput 
        placeholder="Nome completo" 
        value={name}
        onChangeText={setName}
        className="w-full bg-gray-100 p-4 rounded-lg mb-4"
      />

      <TextInput 
        placeholder="Nome de usuário" 
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        className="w-full bg-gray-100 p-4 rounded-lg mb-4"
      />
      
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
        onPress={handleRegister}
        disabled={loading}
        className="w-full bg-blue-500 p-4 rounded-lg items-center mb-4"
        style={loading ? { opacity: 0.7 } : undefined}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-bold">Cadastrar</Text>
        )}
      </TouchableOpacity>

      <Link href="/login" asChild>
        <TouchableOpacity>
          <Text className="text-blue-500">Já tem conta? Entrar</Text>
        </TouchableOpacity>
      </Link>
    </SafeAreaView>
  );
}