import { NavigationContainer } from '@react-navigation/native';
import Menu from './src/components/layout/Menu';
import Navbar from './src/components/layout/Navbar';
import { Routes } from './src/routes/routes';
import { View } from 'react-native';

export default function App() {
  return (
    <NavigationContainer>
      <View style={{ flexDirection: 'row', flex: 1 }}>
        <Menu />
        <View style={{ flex: 1 }}>
          <Navbar />
          <Routes />
        </View>
      </View>
    </NavigationContainer>
  );
}
