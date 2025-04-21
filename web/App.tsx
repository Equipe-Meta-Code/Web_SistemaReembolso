import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Menu from './src/components/layout/Menu';
import Navbar from './src/components/layout/Navbar';

export default function App() {
  return (
    <View style={styles.container}>
              <Menu />

      <View style={styles.mainContent}>
      <Navbar />
        <View style={styles.pageContent}>
        </View>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row', // vertical layout
    backgroundColor: '#fff',
  },
  mainContent: {
    flex: 1,
    flexDirection: 'column', // horizontal layout: menu + page content
  },
  pageContent: {
    flex: 1, // ocupa o espaço restante
    backgroundColor: '#f0f0f0',
    padding: 10,
  },
});
