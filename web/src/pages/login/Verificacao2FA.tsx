import React, { useState } from "react";
import { View, Text, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, TouchableOpacity, TextInput } from "react-native";
import { useNavigation, NavigationProp, RouteProp, useRoute } from "@react-navigation/native";
import { MaterialIcons } from '@expo/vector-icons';
import { style } from "./style";
import api from "../../services/api";

interface LoginProps {
  onLogin: () => void;
}

// espera receber um email
type Verificacao2FARouteProp = RouteProp<{ params: { email: string } }, "params">;

export default function Verificacao2FA({ onLogin }: LoginProps) {
  const route = useRoute<Verificacao2FARouteProp>();

  const email = route.params?.email || ""; //email passado no login
  const [code, setCode] = useState(""); // codigo digitado pelo usuário
  const [loading, setLoading] = useState(false);
  const [formInvalido, setFormInvalido] = useState(false);

  async function handleVerifyCode() {

    // verifica se campo está vazio ou incompleto
    if (!code || code.length !== 6) {
      setFormInvalido(true);
      return Alert.alert("Atenção", "Digite o código de 6 dígitos enviado por e-mail.");
    }

    setFormInvalido(false);
    setLoading(true);

    try {
      const response = await api.post("/verifyWeb", { email, code });
      const data = response.data;

      // usuário só recebe o token depois de ser autenticado
      // então, verifica se recebeu o token
      if (data.token) {
        Alert.alert("Sucesso", "Autenticação concluída!");
        
        setTimeout(() => {
          if (data.token) {
            onLogin();
          } else {
            Alert.alert('Erro', 'Usuário não foi encontrado');
          }
            setLoading(false);
        }, 1500);

      } else {
        Alert.alert("Erro", "Token não recebido, tente novamente.");
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || "Código inválido ou expirado.";
      console.log("Erro na verificação 2FA", error.response?.data);

      Alert.alert("Erro", msg);
    } finally {
      setLoading(false);
    }
  }

  // reenviar código se o usuário pedir
  async function handleResendCode() {
    try {
      setLoading(true);
      await api.post("/resend-code", { email }); 
      Alert.alert("Código reenviado", "Verifique sua caixa de entrada.");
    } catch (error: any) {
      const msg = error.response?.data?.message || "Erro ao reenviar o código.";
      console.log("Erro ao reenviar código", error.response?.data);
      Alert.alert("Erro", msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={style.container}>
  <View style={style.card}>
    <Text style={style.title}>Verificação 2FA</Text>

    <Text style={[style.description, { marginBottom: 16 }]}>
      Digite o código de 6 dígitos que enviamos para:{"\n"}
      <Text style={{ fontWeight: 'bold' }}>{email}</Text>
    </Text>

    <View style={style.inputGroup}>
      <Text style={{ marginBottom: 6, fontWeight: '600' }}>Código</Text>
      <View style={{
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: formInvalido ? "red" : "#ccc",
        borderRadius: 8,
        paddingHorizontal: 12,
        marginBottom: 10
      }}>
        <TextInput
          value={code}
          onChangeText={text => {
            if (formInvalido) setFormInvalido(false);
            setCode(text);
          }}
          placeholder="Digite o código de verificação"
          keyboardType="numeric"
          maxLength={6}
          style={{ flex: 1, paddingVertical: 10 }}
        />
        <MaterialIcons name="vpn-key" size={24} color="#999" />
      </View>

      <TouchableOpacity
        style={style.botao}
        onPress={handleVerifyCode}
        disabled={loading}
      >
        <Text style={style.textoBotao}>
          {loading ? "Aguarde..." : "Verificar"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleResendCode}>
        <Text style={style.resendText}>Reenviar código</Text>
      </TouchableOpacity>
    </View>
  </View>
</View>

  );
}