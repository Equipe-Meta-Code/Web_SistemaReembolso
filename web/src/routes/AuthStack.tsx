// src/routes/AuthStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../pages/login/Login';
import Verificacao2FA from '../pages/login/Verificacao2FA';

export type AuthStackParamList = {
  Login: undefined;
  Verificacao2FA: { email: string };
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthStack({ onLogin }: { onLogin: () => void }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Verificacao2FA">
        {props => <Verificacao2FA {...props} onLogin={onLogin} />}
    </Stack.Screen>

    </Stack.Navigator>
  );
}