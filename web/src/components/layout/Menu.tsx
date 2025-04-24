import { View, Text, TouchableOpacity,  } from "react-native";
import { style } from "./style";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from "../../routes/navigation.d";
import BotaoMenu from "./BotaoMenu";

type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

const Menu = () => {

    const navigation = useNavigation<NavigationProps>();

    return(
        <View style={style.menu}>

            <View style={style.logo}>
                <Text style={style.textoLogo}>Recibify</Text>
            </View>
            <View style={style.botoes}>
                <BotaoMenu nomeBotao="Despesas" iconName="list-outline" onPress={() => navigation.navigate("Categorias")} />
                <BotaoMenu nomeBotao="Funcionários" iconName="person-outline" onPress={() => navigation.navigate("Funcionarios")} />
                <BotaoMenu nomeBotao="Categorias" iconName="bag-handle-outline" onPress={() => navigation.navigate("Categorias")} />
                <BotaoMenu nomeBotao="Projetos" iconName="analytics-outline" onPress={() => navigation.navigate("Projetos")} />
                <BotaoMenu nomeBotao="Departamentos" iconName="exit-outline" onPress={() => navigation.navigate("Departamentos")} />
            </View>
                
        </View>
    )
}

export default Menu;
