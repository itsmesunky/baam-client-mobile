import { StackScreenProps } from "@react-navigation/stack";
import { View } from "react-native";
import { useEffect } from "react";
import { SignUpStackParamList } from "../../navigations/SignUpStackNavigation";
import useUserStore from "../../store/UserStore";
import useAuthStore from "../../store/UserAuthStore";
import { jwtDecode } from "jwt-decode";

type SocialLoginRedirectProps = StackScreenProps<SignUpStackParamList, "SocialLoginRedirect">;

export default function SocialLoginRedirect({ navigation, route }: SocialLoginRedirectProps) {
  const provider = route.params.provider;
  const code = route.params.code;

  const { setAccessToken } = useUserStore((state) => state);
  const { setToken, setRefreshToken } = useAuthStore();
  useEffect(() => {
    const requestBody = {
      code: code,
      provider: provider
    };

    fetch(`https://b-site.site/authentication`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    })
      .then((response) => response.json())
      .then((data) => {
        setRefreshToken(data.refreshToken);
        setAccessToken(data.accessToken);
        setToken(data.accessToken);
        navigation.navigate("SelectSchool");
      })
      .catch((error) => {
        console.error("Failed to handle kakao login:", error);
      });
  }, [code]);

  return <View></View>;
}