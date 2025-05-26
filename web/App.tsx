// App.tsx
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View } from 'react-native';

import AuthStack from './src/routes/AuthStack';
import Menu from './src/components/layout/Menu';
import Navbar from './src/components/layout/Navbar';
import { Routes } from './src/routes/routes';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [filtro, setFiltro] = useState('');
  const [titulo, setTitulo] = useState('Lista de Despesas');
  const [showSearch, setShowSearch] = useState(true);

  useEffect(() => {
    async function checkToken() {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        setIsAuthenticated(true);
      }
      setLoadingAuth(false);
    }
    checkToken();
  }, []);

  if (loadingAuth) return null;

  async function logout() {
    await AsyncStorage.removeItem('token');
    setIsAuthenticated(false);
  }

  return (
    <NavigationContainer>
      {!isAuthenticated ? (
        <AuthStack onLogin={() => setIsAuthenticated(true)} />
      ) : (
        <View style={{ flexDirection: 'row', flex: 1 }}>
          <Menu onLogout={logout} />
          <View style={{ flex: 1 }}>
            <Navbar 
              onTextChange={setFiltro} 
              titulo={titulo} 
              showSearch={showSearch} 
            />
            <Routes 
              filtro={filtro} 
              setTitulo={setTitulo} 
              setShowSearch={setShowSearch} 
            />
          </View>
        </View>
      )}
    </NavigationContainer>
  );
}