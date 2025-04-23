import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Categoria from '../pages/cadastro/Categoria';
import { RootStackParamList } from './navigation.d';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function Routes() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* <Stack.Screen name="Despesas" component={ListaDespesa} /> */}
      {/* <Stack.Screen name="Funcionarios" component={Funcionarios} /> */}
      <Stack.Screen name="Categorias" component={Categoria} />
      {/* <Stack.Screen name="Projetos" component={Projetos} /> */}
      {/* <Stack.Screen name="Departamentos" component={Departamento} /> */}
    </Stack.Navigator>
  );
}
