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
  onPress,
  iconName,
  iconSize = 24,
  iconColor = 'rgb(0, 0, 0)',
  style: customStyle,
}) => {

  const navigation = useNavigation<NavigationProps>();

  const handlePress = () => {
    if (onPress) {
      onPress(); // usa o onPress personalizado se existir
    } else {
      navigation.navigate(nomeBotao as keyof RootStackParamList); // senão, navega normalmente
    }
  };

  return (
    <TouchableOpacity
      style={[style.botaoMenu, customStyle]}
      onPress={handlePress}
    >
      {iconName && <Ionicons name={iconName} size={iconSize} color={iconColor} />}
      <Text style={style.textoBotaoMenu}>{nomeBotao}</Text>
    </TouchableOpacity>
  );

};

export default BotaoMenu;