import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Categoria from '../pages/cadastro/Categoria';
import { RootStackParamList } from './navigation.d';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function Routes() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Categorias" component={Categoria} />
    </Stack.Navigator>
  );
}
