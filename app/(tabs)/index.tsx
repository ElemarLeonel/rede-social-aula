import { Bell, Compass, Image as ImageIcon, Search } from 'lucide-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FeedScreen() {
  return (
    <SafeAreaView className="flex-1 bg-slate-950" edges={['top']}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, gap: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-3">
          <Text className="text-sm font-medium uppercase tracking-[2px] text-teal-300">
            Mock da Home
          </Text>
          <Text className="text-4xl font-bold leading-tight text-white">
            Base pronta para montar a sua timeline.
          </Text>
          <Text className="text-base leading-6 text-slate-300">
            Esta tela esta mockada para facilitar as alteracoes visuais e de
            navegacao depois.
          </Text>
        </View>

        <View className="rounded-3xl border border-white/10 bg-slate-900 p-5">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-lg font-semibold text-white">
              Acoes rapidas
            </Text>
            <Bell size={20} color="#5eead4" />
          </View>

          <View className="flex-row flex-wrap gap-3">
            <Pressable className="min-w-[48%] flex-1 rounded-2xl bg-teal-500 px-4 py-4">
              <Search size={18} color="#042f2e" />
              <Text className="mt-3 text-base font-semibold text-teal-950">
                Explorar
              </Text>
              <Text className="mt-1 text-sm text-teal-900">
                Buscar pessoas, temas e posts.
              </Text>
            </Pressable>

            <Pressable className="min-w-[48%] flex-1 rounded-2xl bg-sky-400 px-4 py-4">
              <ImageIcon size={18} color="#082f49" />
              <Text className="mt-3 text-base font-semibold text-sky-950">
                Criar post
              </Text>
              <Text className="mt-1 text-sm text-sky-900">
                Espaco reservado para CTA principal.
              </Text>
            </Pressable>
          </View>
        </View>

        <View className="gap-4">
          <Text className="text-lg font-semibold text-white">
            Secoes em destaque
          </Text>

          <View className="rounded-3xl bg-white p-5">
            <Compass size={22} color="#0f766e" />
            <Text className="mt-4 text-xl font-bold text-slate-900">
              Descobertas da comunidade
            </Text>
            <Text className="mt-2 text-sm leading-6 text-slate-600">
              Use este card como base para blocos editoriais, carrosseis,
              metricas ou listas de recomendacao.
            </Text>
          </View>

          <View className="rounded-3xl border border-dashed border-slate-700 p-5">
            <Text className="text-base font-semibold text-slate-200">
              Estado vazio
            </Text>
            <Text className="mt-2 text-sm leading-6 text-slate-400">
              Aqui pode entrar lista, feed, stories ou qualquer outra composicao.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
