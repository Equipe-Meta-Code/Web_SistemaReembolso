import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { style } from "./style";
import api from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailValido, setEmailValido] = useState(true);

  async function getLogin() {
    if (!email || !password || !emailValido) {
      return Alert.alert('Atenção', 'Preencha todos os campos corretamente!');
    }

    setLoading(true);

    try {
      const response = await api.post('/login', { email, password });
      await AsyncStorage.setItem('token', response.data.token);
      onLogin(); 
    } catch (error: any) {
      const msg = error.response?.data?.mensagem || 'Não foi possível realizar o login. Tente novamente.';
      Alert.alert('Erro', msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={style.container}>
      <View style={style.card}>

        <View style={style.logoContainer}>                                      
          <Image
            source={require("../../assets/icone-logo.png")}
            style={style.logoImage}
            resizeMode="contain"
          />
          <Text style={style.textoLogo}>Recibify</Text>
        </View>
        
        <Text style={style.title}>Login</Text>

        <TextInput
          style={style.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <View style={style.inputContainer}>
          <TextInput
            style={style.input}
            placeholder="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={secureText}
          />
          <TouchableOpacity
            onPress={() => setSecureText(!secureText)}
            style={style.iconButton}
          >
            <Feather
              name={secureText ? 'eye' : 'eye-off'}
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={style.botao} onPress={getLogin}>
          <Text style={style.textoBotao}>Entrar</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}