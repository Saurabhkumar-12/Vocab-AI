import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView style={{ flex: 1 }} className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center px-6">
        <Image
          source={require("../../assets/images/moscot-logo.png")}
          style={{ width: 120, height: 120 }}
          resizeMode="contain"
        />
        <Text className="h1 text-text-primary mt-4">lingua</Text>
      </View>
    </SafeAreaView>
  );
}
