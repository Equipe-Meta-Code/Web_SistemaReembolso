import { StyleSheet, Dimensions } from 'react-native';

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

    inputGroup: {
        width: '100%',
        gap: 16,
        paddingHorizontal: 10,
        marginTop: 60,
    },
    resendText: {
        marginTop: 16,
        color: '#1F48AA',
        textAlign: 'center',
        textDecorationLine: 'underline',
        fontSize: 14,
    },
    boxTop: {
        height: Dimensions.get('window').height / 5,
        width: '100%',
        backgroundColor: '#1F48AA',
        alignItems: 'flex-start',
        justifyContent: 'center',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    boxMid: {
        flex: 1,
        backgroundColor: '#1F48AA',
        width: '100%',
        paddingTop: 20,
        paddingHorizontal: 20,
    },
    description: {
        fontSize: 16,    
        color: '#1F48AA',  
        textAlign: 'left',  
        marginTop: 10,  
        paddingLeft:20
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    inputContainer: {
        position: 'relative',
        justifyContent: 'center',
        marginBottom: 16,
    },
    iconButton: {
        position: 'absolute',
        right: 12,
        marginTop: 5,
        transform: [{ translateY: -10 }],
        padding: 4,
    },
    erroTexto: {
        color: 'red',
        fontSize: 14,
        marginTop: 10,
        marginBottom: 10,
        textAlign: 'center',
    },

});