import { StyleSheet } from 'react-native';

export const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white', 
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    card: {
        width: '85%',
        maxWidth: 500,
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 24,
        elevation: 5, 
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    title: {
        fontSize: 20,
        marginBottom: 20,
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#1F48AA',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 15,
        padding: 13,
        borderRadius: 10,
        backgroundColor: 'rgba(233, 231, 231, 0.31)',
    },
    botao: {
        backgroundColor: '#1F48AA', 
        paddingVertical: 11,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    textoBotao: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    logoImage: {
        width: 80,
        height: 80,
        alignSelf: 'center',
        marginBottom: 20,
    },
    textoLogo: {
        fontSize: 30,
        fontWeight: "bold",
        color: "#151D48",
    },
    logoContainer: {
        alignItems: "center",
        marginTop: 10,
        marginBottom: 50,
    },

});