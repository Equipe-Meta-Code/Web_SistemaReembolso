import { View, Text, TouchableOpacity,  } from "react-native";
import { style } from "../style";
import Ionicons from 'react-native-vector-icons/Ionicons';

const Menu = () => {
    return(
        <View style={style.menu}>
            <View style={style.logo}>
                {/* <img src="/logo.png" alt="Logo" style={{ width: 100, height: 100 }} /> */}
                <Text style={style.textoLogo}>Recibify</Text>
            </View>
            <View style={style.botoes}>
                <TouchableOpacity style={style.botaoMenu}>
                    <Ionicons name={'bag-handle-outline'} size={24} color={'#ffffff'}/>
                    <Text style={style.textoBotaoMenu}>Lista de Despesas</Text>
                </TouchableOpacity>
                <TouchableOpacity style={style.botaoMenu}>
                    <Text style={style.textoBotaoMenu}>Funcionários</Text>
                </TouchableOpacity>
                <TouchableOpacity style={style.botaoMenu}>
                    <Text style={style.textoBotaoMenu}>Categorias</Text>
                </TouchableOpacity>
                <TouchableOpacity style={style.botaoMenu}>
                    <Text style={style.textoBotaoMenu}>Projetos</Text>
                </TouchableOpacity>
                <TouchableOpacity style={style.botaoMenu}>
                    <Text style={style.textoBotaoMenu}>Departamento</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Menu;
