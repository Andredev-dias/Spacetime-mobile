import { Text, TouchableOpacity, View } from "react-native";
import { useAuthRequest, makeRedirectUri } from "expo-auth-session";
import * as SecureStore from "expo-secure-store";
import { useEffect } from "react";
import { styled } from "nativewind";
import { useRouter } from "expo-router";

import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";

import { BaiJamjuree_700Bold } from "@expo-google-fonts/bai-jamjuree";

import Logo from "../src/assets/logo.svg";
import { api } from "../src/lib/api";

const StyledLogo = styled(Logo);

// Endpoint
const discovery = {
  authorizationEndpoint: "https://github.com/login/oauth/authorize",
  tokenEndpoint: "https://github.com/login/oauth/access_token",
  revocationEndpoint:
    "https://github.com/settings/connections/applications/09e5fe3dbe155e82d168",
};

export default function App() {
  const router = useRouter();

  const [hasLoadedFonts] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
    BaiJamjuree_700Bold,
  });

  const [request, response, signInWithGithub] = useAuthRequest(
    {
      clientId: "09e5fe3dbe155e82d168",
      scopes: ["identity"],
      redirectUri: makeRedirectUri({
        scheme: "spacetime",
      }),
    },
    discovery
  );

  async function handleGithubOauthCode(code: string) {
    const response = await api.post("/register", {
      code,
    });
    const { token } = response.data;
    await SecureStore.setItemAsync("token", token);
    router.push("/memories");
  }

  useEffect(() => {
    // console.log( makeRedirectUri({
    //   scheme: "spacetime",
    // }))

    if (response?.type === "success") {
      const { code } = response.params;
      handleGithubOauthCode(code);
    }
  }, [response]);

  if (!hasLoadedFonts) {
    return null;
  }

  return (
    <View className=" flex-1 items-center  px-8 py-10">
      <View className="flex-1 items-center justify-center gap-6 ">
        <StyledLogo />

        <View className="space-y-2">
          <Text className="text-center font-title text-2xl leading-tight text-gray-50">
            Sua cápsula do tempo
          </Text>
          <Text className="text-center font-body text-base leading-relaxed text-gray-100">
            Colecione momentos marcantes da sua jornada e compartilhe (se
            quiser) com o mundo!
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          className="rounded-full bg-green-500 px-5 py-2"
          onPress={() => signInWithGithub()}
        >
          <Text className="font-alt text-sm uppercase text-black">
            CADASTRAR LEMBRANÇA
          </Text>
        </TouchableOpacity>
      </View>

      <Text className="text-center font-body text-sm leading-relaxed text-gray-300 ">
        Feito com 💜 no NLW da Rocketseat por André Dias.
      </Text>
    </View>
  );
}
