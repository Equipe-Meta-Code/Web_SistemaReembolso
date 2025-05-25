import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { style } from "./style";
import api from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { AuthStackParamList } from '../../routes/AuthStack';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [loading, setLoading] = useState(false);
  const [emailValido, setEmailValido] = useState(true);
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();
  const [mensagemErro, setMensagemErro] = useState("");

  async function getLogin() {
    if (!email || !password || !emailValido) {
      setMensagemErro("Preencha todos os campos corretamente!");
      return;
    }

    setLoading(true);
    setMensagemErro(""); // limpa erro anterior

    try {
      const response = await api.post('/loginWeb', { email, password });

      await AsyncStorage.setItem('tokenTemp', response.data.token);
      navigation.navigate("Verificacao2FA", { email });
    } catch (error: any) {
      const status = error?.response?.status;
      const mensagem = error?.response?.data?.message;

      if (status === 403) {
        setMensagemErro(mensagem || "Esta área é exclusiva para gerentes.");
      } else if (status === 401) {
        setMensagemErro(mensagem || "Credenciais inválidas.");
      } else {
        setMensagemErro("Ocorreu um erro inesperado. Tente novamente.");
      }
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

        {mensagemErro !== "" && (
          <Text style={style.erroTexto}>{mensagemErro}</Text>
        )}

        <TouchableOpacity style={style.botao} onPress={getLogin}>
          <Text style={style.textoBotao}>Entrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}