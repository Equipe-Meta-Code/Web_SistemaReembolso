import { View, Text, TouchableOpacity,  } from "react-native";
import { style } from "../style";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from "../../routes/navigation.d";
type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

const Menu = () => {

    const navigation = useNavigation<NavigationProps>();

    return(
        <View style={style.menu}>
            <View style={style.logo}>
                {/* <img src="/logo.png" alt="Logo" style={{ width: 100, height: 100 }} /> */}
                <Text style={style.textoLogo}>Recibify</Text>
            </View>
            <View style={style.botoes}>

                <TouchableOpacity style={style.botaoMenu} onPress={() => navigation.navigate("Despesas")}>
                    <Ionicons name={'list-outline'} size={24} color={'#ffffff'}/>
                    <Text style={style.textoBotaoMenu}>Lista de Despesas</Text>
                </TouchableOpacity>

                <TouchableOpacity style={style.botaoMenu} onPress={() => navigation.navigate("Categorias")}>
                    <Ionicons name={'person-outline'} size={24} color={'#ffffff'}/>
                    <Text style={style.textoBotaoMenu}>Funcionários</Text>
                </TouchableOpacity>

                <TouchableOpacity style={style.botaoMenu} onPress={() => navigation.navigate("Categorias")}>
                    <Ionicons name={'bag-handle-outline'} size={24} color={'#ffffff'}/>
                    <Text style={style.textoBotaoMenu}>Categorias</Text>
                </TouchableOpacity>

                <TouchableOpacity style={style.botaoMenu} onPress={() => navigation.navigate("Categorias")}>
                    <Ionicons name={'analytics-outline'} size={24} color={'#ffffff'}/>
                    <Text style={style.textoBotaoMenu}>Projetos</Text>
                </TouchableOpacity>

                <TouchableOpacity style={style.botaoMenu} onPress={() => navigation.navigate("Categorias")}>
                    <Ionicons name={'exit-outline'} size={24} color={'#ffffff'}/>
                    <Text style={style.textoBotaoMenu}>Departamento</Text>
                </TouchableOpacity>
                
            </View>
        </View>
    )
}

export default Menu;
