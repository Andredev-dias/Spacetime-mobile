import { ScrollView, View, TouchableOpacity, Text, Image } from "react-native";
import Logo from "../src/assets/logo.svg";
import { Link, useRouter } from "expo-router";
import Icon from "@expo/vector-icons/Feather";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { api } from "../src/lib/api";
import dayjs from "dayjs";
import ptBr from "dayjs/locale/pt-br";

dayjs.locale(ptBr);
interface Memory {
  createdAt: string;
  coverUrl: string;
  excerpt: string;
  id: string;
}

export default function Memories() {
  const { bottom, top } = useSafeAreaInsets();
  const router = useRouter();
  const [memories, setMemories] = useState<Memory[]>([]);

  async function signOut() {
    await SecureStore.deleteItemAsync("token");
    router.push("/");
  }

  async function loadMemories() {
    const token = await SecureStore.getItemAsync("token");

    const response = await api.get("/memories", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setMemories(response.data);
  }

  useEffect(() => {
    loadMemories();
  }, []);

  return (
    <ScrollView
      className="flex-1 "
      contentContainerStyle={{ paddingBottom: bottom, paddingTop: top }}
    >
      <View className=" flex-row mt-4 px-8 items-center justify-between">
        <Logo />
        <View className="flex-row gap-1">
          <TouchableOpacity
            onPress={signOut}
            className="h-10 w-10 items-center justify-center rounded-full bg-red-500"
          >
            <Icon name="log-out" size={16} color="#000" />
          </TouchableOpacity>
          <Link href="/new" asChild>
            <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-green-500">
              <Icon name="plus" size={16} color="#000" />
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      <View className="mt-6 space-y-10">
        {memories.map((item) => {
          return (
            <View className="space-y-4" key={item.id}>
              <View className="flex-row items-center gap-2">
                <View className="h-px w-5 bg-gray-50" />
                <Text className="text-gray-100 font-body text-xs">
                  {dayjs(item.createdAt).format("D[ de ]MMM[, ]YYYY")}
                </Text>
              </View>
              <View className="space-y-4 px-8">
                <Image
                  source={{
                    uri: item.coverUrl,
                  }}
                  className="aspect-video w-full rounded-lg"
                  alt="Memory Image"
                />
                <Text className="font-body text-base leading-relaxed text-gray-100">
                  {item.excerpt}
                </Text>
                <Link href="/memories/id" asChild>
                  <TouchableOpacity className="flex-row items-center gap-2">
                    <Text className="font-body text-sm text-gray-200">
                      Ler mais
                    </Text>
                    <Icon name="arrow-right" size={16} color="#9e9ea0" />
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}
