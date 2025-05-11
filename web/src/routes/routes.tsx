// src/routes/routes.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Categorias from '../pages/cadastro/Categoria';
import ListaDespesas from '../pages/listaDespesas/ListaDespesas';
import ListaFuncionarios from '../pages/listaFuncionarios/Funcionarios';
import Departamentos from '../pages/cadastro/Departamento';
import { RootStackParamList } from './navigation.d';
import Projetos from '../pages/projetos/Projetos';
import ListaProjetos from '../pages/projetos/ListaProjetos';


interface RoutesProps {
  filtro: string;
  setTitulo: (titulo: string) => void;
  setShowSearch: (show: boolean) => void;
}

const Stack = createNativeStackNavigator<RootStackParamList>();

export function Routes({ filtro, setTitulo, setShowSearch }: RoutesProps) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Despesas">
        {() => (
          <ListaDespesas 
            filtro={filtro} 
            setTitulo={setTitulo} 
            setShowSearch={setShowSearch} 
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="Funcionarios">
        {() => (
          <ListaFuncionarios 
            filtro={filtro} 
            setTitulo={setTitulo} 
            setShowSearch={setShowSearch} 
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="Categorias">
        {() => <Categorias setTitulo={setTitulo} setShowSearch={setShowSearch} />}
      </Stack.Screen>

      <Stack.Screen name="Projetos">
        {() => <ListaProjetos setTitulo={setTitulo} setShowSearch={setShowSearch} filtro={''} />}
      </Stack.Screen>

      <Stack.Screen name="Departamentos">
        {() => <Departamentos setTitulo={setTitulo} setShowSearch={setShowSearch} />}
      </Stack.Screen>

      <Stack.Screen name="CadastroProjetos">
        {() => <Projetos setTitulo={setTitulo} setShowSearch={setShowSearch} />}
      </Stack.Screen>


    </Stack.Navigator>
  );
};