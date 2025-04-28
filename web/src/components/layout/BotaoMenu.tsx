import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from "../../routes/navigation.d";
import { style } from "./style";

type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

interface BotaoMenuProps {
  nomeBotao: string;
  onPress: () => void;
  iconName?: string;
  iconSize?: number;
  iconColor?: string;
  style?: object;
}

const BotaoMenu: React.FC<BotaoMenuProps> = ({
  nomeBotao,
  iconName,
  iconSize = 24,
  iconColor = 'rgb(0, 0, 0)',
  style: customStyle,
}) => {

  const navigation = useNavigation<NavigationProps>();

  return (
    <TouchableOpacity
      style={[style.botaoMenu, customStyle]}
      onPress={() => navigation.navigate(nomeBotao as keyof RootStackParamList)}
    >
      {iconName && <Ionicons name={iconName} size={iconSize} color={iconColor} />}
      <Text style={style.textoBotaoMenu}>{nomeBotao}</Text>
    </TouchableOpacity>
  );

};

export default BotaoMenu;