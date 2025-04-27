import { View, Text  } from "react-native";
import {style} from "./style";

interface NavbarProps {
    titulo: string;
}

const Navbar = ({ titulo }: NavbarProps) => {
    return (
        <View style={style.navBar}>
            <Text style={style.tituloNavBar}>{titulo}</Text>
        </View>
    );
};

export default Navbar;