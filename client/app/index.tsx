import { Text, View } from "react-native";
import { SafeAreaView } from 'react-native';
import TextPromptScreen from '../components/TextPromptScreen/TextPromptScreen';

export default function Index() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TextPromptScreen />
    </SafeAreaView>
  );
}