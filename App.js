import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Speech from 'expo-speech';
import html from './mori-html';

// the web page sends text here when a ▶ button is tapped; the phone's speech engine reads it aloud
const onMessage = event => {
  try {
    const { text, lang } = JSON.parse(event.nativeEvent.data);
    Speech.stop();
    Speech.speak(text, { language: lang, rate: 0.85 });
  } catch {}
};

// Mori runs entirely inside this WebView, so it works offline with no server.
export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <WebView
        source={{ html }}
        originWhitelist={['*']}
        javaScriptEnabled
        domStorageEnabled
        onMessage={onMessage}
        style={styles.web}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3EFE8' },
  web: { flex: 1, backgroundColor: '#F3EFE8' },
});
