import { useRef, useEffect } from 'react';
import { BackHandler, Platform, SafeAreaView, StatusBar as RNStatusBar, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { WebView } from 'react-native-webview';
import * as Speech from 'expo-speech';
import html from './mori-html';

// a fixed base URL gives the page a normal origin, so localStorage (bookmarks, language, theme) is kept
const BASE_URL = 'https://mori.local';

export default function App() {
  const webRef = useRef(null);

  // Android back button: go back inside the app first, then leave it
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (webRef.current) {
        webRef.current.goBack();
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, []);

  // the web page sends text here when a play button is tapped
  const onMessage = async event => {
    try {
      const { text, lang } = JSON.parse(event.nativeEvent.data);
      const voices = await Speech.getAvailableVoicesAsync();
      const hasVoice = voices.some(v => v.language && v.language.startsWith(lang.slice(0, 2)));
      if (!hasVoice) {
        const name = lang === 'ko-KR' ? 'Korean' : 'Japanese';
        webRef.current?.injectJavaScript(
          `document.getElementById('note').textContent = 'no ${name} voice on this phone. install it in Settings > Languages > Text-to-speech.'; true;`
        );
        return;
      }
      Speech.stop();
      Speech.speak(text, { language: lang, rate: 0.85 });
    } catch {}
  };

  return (
    // Android draws the app under the status bar, so reserve that space at the top
    <SafeAreaView style={[styles.container, Platform.OS === 'android' && { paddingTop: (RNStatusBar.currentHeight || 24) + 15 }]}>
      <StatusBar style="dark" />
      <WebView
        ref={webRef}
        source={{ html, baseUrl: BASE_URL }}
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
