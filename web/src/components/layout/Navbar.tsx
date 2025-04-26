import React, { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import { style } from './style';

interface NavbarProps {
  onTextChange: (text: string) => void;
  titulo: string;
}

const Navbar: React.FC<NavbarProps> = ({ onTextChange, titulo }) => {
  const [texto, setTexto] = useState('');

  const handleTextChange = (newText: string) => {
    setTexto(newText);
    onTextChange(newText);
  };

  return (
    <View style={style.navBar}>
      <Text style={style.tituloNavBar}>{titulo}</Text>
      <TextInput
        style={style.inputNavbar}
        placeholder="Buscar..."
        value={texto}
        onChangeText={handleTextChange}
      />
    </View>
  );
};

export default Navbar;
