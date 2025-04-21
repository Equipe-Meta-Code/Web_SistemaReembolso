import { View, Text  } from "react-native";
import {style} from "../style";


const Navbar = () => {
    return(
        <View style={style.navBar}>
            <Text style={style.tituloNavBar}>Lista de Despesas</Text>
        </View>
    )
}

export default Navbar;