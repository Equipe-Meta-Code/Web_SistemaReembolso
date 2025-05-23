import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";              // ← import Image
import { style } from "./style";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../routes/navigation.d";
import BotaoMenu from "./BotaoMenu";

type NavProp = NativeStackNavigationProp<RootStackParamList>;

const MENU_ITEMS: { name: keyof RootStackParamList; icon: string; label: string }[] = [
  { name: "Despesas",    icon: "list-outline",       label: "Despesas" },
  { name: "Funcionarios", icon: "person-outline",     label: "Funcionarios" },
  { name: "Categorias",  icon: "bag-handle-outline", label: "Categorias" },
  { name: "Projetos",    icon: "analytics-outline",  label: "Projetos" },
  { name: "Departamentos", icon: "git-network-outline",     label: "Departamentos" },
];

interface MenuProps {
  onLogout: () => void;
}

export default function Menu({ onLogout }: MenuProps) {
  const navigation = useNavigation<NavProp>();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <View style={[style.menu, collapsed ? { width: 60 } : { width: 240 }]}>
      <TouchableOpacity
        onPress={() => setCollapsed(!collapsed)}
        style={style.botaoOcultar}
      >
        <Ionicons
          name={collapsed ? "chevron-forward" : "chevron-back"}
          size={24}
          color="#151D48"
        />
      </TouchableOpacity>

      {!collapsed && (
        <>

         <View style={style.logoContainer}>                                      
           <Image
             source={require("../../assets/icone-logo.png")}
             style={style.logoImage}
             resizeMode="contain"
           />
           <Text style={style.textoLogo}>Recibify</Text>
         </View>
          <View style={style.botoes}>
            {MENU_ITEMS.map((item) => (
              <BotaoMenu
                key={item.name}
                nomeBotao={item.label}
                iconName={item.icon}
                onPress={() => navigation.navigate(item.name)}
              />
            ))}
              <BotaoMenu
                nomeBotao="Logout"
                iconName= "exit-outline"
                onPress={onLogout} 
              />
          </View>
        </>
      )}

      {collapsed && (
        <View style={style.botoesOcultos}>
            <View style={style.logoContainer}>                                      
                <Image
                    source={require("../../assets/icone-logo.png")}
                    style={style.logoImage}
                    resizeMode="contain"
                />
            </View>

          {MENU_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.name}
              style={style.botaoIcone}
              onPress={() => navigation.navigate(item.name)}
            >
              <Ionicons
                name={item.icon}
                size={24}
                color="#151D48"
              />
            </TouchableOpacity>
          ))}

            <TouchableOpacity 
              style={style.botaoIcone}
              onPress={onLogout} 
            >
              <Ionicons 
                name="log-out-outline" 
                size={24} 
                color="#151D48" 
              />
            </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
