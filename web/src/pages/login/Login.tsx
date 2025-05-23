import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
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
  const [showPassword, setShowPassword] = useState(false);
  const [emailValido, setEmailValido] = useState(true);
  const [formInvalido, setFormInvalido] = useState(false);

  async function getLogin() {
        if (!email || !password || !emailValido) {
            setFormInvalido(true);
            return Alert.alert('Atenção', 'Preencha todos os campos corretamente!');
        }

        setFormInvalido(false);
        setLoading(true);

        try {
          const response = await api.post('/login', { email, password });
          console.log("Resposta do login:", response.data);

          // Aqui você pode salvar o token se houver
          await AsyncStorage.setItem('token', response.data.token);

          // Chama a função que avisa o App que o login foi bem-sucedido
          onLogin(); 
        } catch (error: any) {
          console.log('Erro ao logar o usuário.', error);
          const msg = error.response?.data?.mensagem || 'Não foi possível realizar o login. Tente novamente.';
          Alert.alert('Erro', msg);
        } finally {
          setLoading(false);
        }

    }


  return (
    <View style={style.container}>
      <Text style={style.title}>Login</Text>

      <TextInput
        style={style.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={style.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button title="Entrar" onPress={getLogin} />
    </View>
  );
}