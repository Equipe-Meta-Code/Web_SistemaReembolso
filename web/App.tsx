import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Menu from './src/components/layout/Menu';
import Navbar from './src/components/layout/Navbar';
import { Routes } from './src/routes/routes';
import { View } from 'react-native';
import Login from './src/pages/login/Login';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [filtro, setFiltro] = useState('');
  const [titulo, setTitulo] = useState('Lista de Despesas');
  const [showSearch, setShowSearch] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);

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

  if (loadingAuth) {
    return null; 
  }

  if (!isAuthenticated) {
    return (
      <NavigationContainer>
        <Login onLogin={() => setIsAuthenticated(true)} />
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <View style={{ flexDirection: 'row', flex: 1 }}>
        <Menu />
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
    </NavigationContainer>
  );
}

