import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Menu from './src/components/layout/Menu';
import Navbar from './src/components/layout/Navbar';
import { Routes } from './src/routes/routes';
import { View } from 'react-native';

export default function App() {
  const [filtro, setFiltro] = useState('');
  const [titulo, setTitulo] = useState('Lista de Despesas');
  const [showSearch, setShowSearch] = useState(true);

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

