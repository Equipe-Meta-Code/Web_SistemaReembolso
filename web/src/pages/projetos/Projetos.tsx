import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Animated, Pressable } from 'react-native';
import {
    Card,
    TextInput,
    Title,
    List,
    IconButton,
    Button,
} from 'react-native-paper';
import { red } from 'react-native-reanimated/lib/typescript/Colors';

export default function CadastroProjetos() {
    const [nomeProjeto, setNomeProjeto] = useState('');
    const [descricao, setDescricao] = useState('');
    const [departamento, setDepartamento] = useState('');
    const [categorias, setCategorias] = useState([{ categoria: '', valorMaximo: '' }]);
    const [funcionarios, setFuncionarios] = useState(['']);
    const [expandedDepartamento, setExpandedDepartamento] = useState(false);
    const [expandedCategorias, setExpandedCategorias] = useState<number | null>(null);
    const [expandedFuncionarios, setExpandedFuncionarios] = useState<number | null>(null);

    const scale = useState(new Animated.Value(1))[0];

    const listaDepartamentos = ['Financeiro', 'Tecnologia', 'Marketing'];
    const listaCategorias = ['Alimentação', 'Hospedagem', 'Viagem'];
    const listaFuncionarios = ['Ana Silva', 'Bruno Costa', 'Carlos Souza', 'Daniela Lima', 'Eduardo Alves', 'Fernanda Rocha'];

    const valorTotal = categorias.reduce((total, item) => total + (parseFloat(item.valorMaximo) || 0), 0);

    const adicionarCategoria = () => {
        setCategorias([...categorias, { categoria: '', valorMaximo: '' }]);
    };

    const atualizarCategoria = (index: number, campo: 'categoria' | 'valorMaximo', valor: string) => {
        const novasCategorias = [...categorias];
        novasCategorias[index][campo] = valor;
        setCategorias(novasCategorias);
    };

    const adicionarFuncionario = () => {
        setFuncionarios([...funcionarios, '']);
    };

    const atualizarFuncionario = (index: number, value: string) => {
        const novosFuncionarios = [...funcionarios];
        novosFuncionarios[index] = value;
        setFuncionarios(novosFuncionarios);
    };

    const handlePressIn = () => {
        Animated.spring(scale, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scale, {
            toValue: 1,
            friction: 3,
            tension: 40,
            useNativeDriver: true,
        }).start();
    };

    return (
        <ScrollView style={{ flex: 1, backgroundColor: '#ffffff' }}>
            <View style={styles.container}>

                <Card style={styles.card}>
                    <Card.Content>
                        <View style={styles.leftSide}>
                            <Title style={styles.selectTitle}>Nome do Projeto</Title>
                            <TextInput
                                label=""
                                value={nomeProjeto}
                                onChangeText={setNomeProjeto}
                                style={styles.input}
                                mode="flat"
                            />
                            <Title style={styles.selectTitle}>Descrição</Title>
                            <TextInput
                                label=""
                                value={descricao}
                                onChangeText={setDescricao}
                                style={styles.input}
                                mode="flat"
                            />

                            <Title style={styles.selectTitle}>Departamento</Title>
                            <List.Accordion
                                title={departamento || "Escolha o Departamento"}
                                style={styles.field}
                                expanded={expandedDepartamento}
                                onPress={() => setExpandedDepartamento(!expandedDepartamento)}
                            >
                                {listaDepartamentos.map((dep, index) => (
                                    <List.Item
                                        key={index}
                                        title={dep}
                                        onPress={() => {
                                            setDepartamento(dep);
                                            setExpandedDepartamento(false);
                                        }}
                                    />
                                ))}
                            </List.Accordion>

                            <Title style={styles.selectTitle}>Categorias e Valor Máximo (R$)</Title>
                            {categorias.map((item, index) => (
                                <View key={index} style={styles.categoriaContainer}>
                                    <View style={{ flex: 1 }}>
                                        <List.Accordion
                                            title={item.categoria || "Escolha a Categoria"}
                                            style={styles.field}
                                            expanded={expandedCategorias === index}
                                            onPress={() => setExpandedCategorias(expandedCategorias === index ? null : index)}
                                        >
                                            {listaCategorias.map((cat, idx) => (
                                                <List.Item
                                                    key={idx}
                                                    title={cat}
                                                    onPress={() => {
                                                        atualizarCategoria(index, 'categoria', cat);
                                                        setExpandedCategorias(null);
                                                    }}
                                                />
                                            ))}
                                        </List.Accordion>
                                    </View>
                                    <TextInput
                                        label="Valor"
                                        value={item.valorMaximo}
                                        onChangeText={(text) => atualizarCategoria(index, 'valorMaximo', text)}
                                        style={[styles.input, { width: 100, marginLeft: 8 }]}
                                        mode="flat"
                                        keyboardType="numeric"
                                    />
                                </View>
                            ))}
                            <IconButton
                                icon="plus"
                                size={20}
                                onPress={adicionarCategoria}
                                style={[styles.addButton, { backgroundColor: '#4caf50' }]}
                                iconColor="white"
                            />
                        </View>

                        <View style={styles.rightSide}>
                            <Title style={styles.selectTitle}>Funcionários</Title>
                            {funcionarios.map((item, index) => (
                                <View key={index}>
                                    <List.Accordion
                                        title={item || "Escolha o Funcionário"}
                                        style={styles.field}
                                        expanded={expandedFuncionarios === index}
                                        onPress={() => setExpandedFuncionarios(expandedFuncionarios === index ? null : index)}
                                    >
                                        {listaFuncionarios.map((nome, idx) => (
                                            <List.Item
                                                key={idx}
                                                title={nome}
                                                onPress={() => {
                                                    atualizarFuncionario(index, nome);
                                                    setExpandedFuncionarios(null);
                                                }}
                                            />
                                        ))}
                                    </List.Accordion>
                                </View>
                            ))}
                            <IconButton
                                icon="plus"
                                size={20}
                                onPress={adicionarFuncionario}
                                style={[styles.addButton, { backgroundColor: '#2196f3' }]}
                                iconColor="white"
                            />

                            <Card style={styles.totalCard}>
                                <Card.Content>
                                    <Title>Valor Limite Total: R$ {valorTotal.toFixed(2)}</Title>

                                    {categorias.map((item, index) => (
                                        <View key={index} style={styles.valorItem}>
                                            <View style={[styles.bolinha, { backgroundColor: coresCategoria[index % coresCategoria.length] }]} />
                                            <Title style={styles.valorTexto}>
                                                {item.categoria || "Sem categoria"} - R$ {(parseFloat(item.valorMaximo) || 0).toFixed(2)}
                                            </Title>
                                        </View>
                                    ))}

                                    <View style={styles.barContainer}>
                                        {categorias.map((item, index) => {
                                            const porcentagem = valorTotal > 0 ? (parseFloat(item.valorMaximo) || 0) / valorTotal : 0;
                                            return (
                                                <View
                                                    key={index}
                                                    style={{
                                                        width: `${porcentagem * 100}%`,
                                                        height: 20,
                                                        backgroundColor: coresCategoria[index % coresCategoria.length],
                                                    }}
                                                />
                                            );
                                        })}
                                    </View>
                                </Card.Content>
                            </Card>

                            <Pressable
                                onPressIn={handlePressIn}
                                onPressOut={handlePressOut}
                                onPress={() => console.log('Projeto Cadastrado')}
                                style={{ marginTop: 24 }}
                            >
                                <Animated.View style={[styles.cadastrarButton, { transform: [{ scale }] }]}>
                                    <Title style={styles.cadastrarButtonText}>Cadastrar Projeto</Title>
                                </Animated.View>
                            </Pressable>

                        </View>
                    </Card.Content>
                </Card>
            </View>
        </ScrollView>
    );
}

const coresCategoria = ['#4caf50', '#2196f3', '#ff9800', '#9c27b0', '#f44336'];

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#ffffff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1976d2',
        marginBottom: 16,
        textAlign: 'center',
    },
    card: {
        padding: 8,
        backgroundColor: '#ffffff',
        borderColor: '#cccccc',
        borderWidth: 1,
        borderRadius: 10,
    },
    leftSide: {
        flex: 1,
    },
    rightSide: {
        marginTop: 24,
    },
    field: { // novo estilo unificado
        backgroundColor: '#ffffff',
        borderColor: '#cccccc',
        borderWidth: 1,
        borderRadius: 8, // bordas levemente arredondadas
        height: 45, // altura padrão para inputs e selects
        justifyContent: 'center', // para alinhar o texto verticalmente no select
        paddingHorizontal: 12,
        marginBottom: 12,
    },
    input: { // novo estilo unificado
        backgroundColor: '',
        borderColor: '#cccccc',
        borderWidth: 1,
        borderRadius: 8, // bordas levemente arredondadas
        height: 45, // altura padrão para inputs e selects
        justifyContent: 'center', // para alinhar o texto verticalmente no select
        paddingHorizontal: 12,
        marginBottom: 12,
    },
    selectTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 8,
        color: '#000000',
    },
    categoriaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    addButton: {
        alignSelf: 'flex-start',
        marginTop: 8,
    },
    totalCard: {
        marginTop: 24,
        padding: 8,
        backgroundColor: '#ffffff',
        borderColor: '#cccccc',
        borderWidth: 1,
        borderRadius: 10,
    },
    valorItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    bolinha: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 8,
    },
    valorTexto: {
        fontSize: 16,
    },
    barContainer: {
        flexDirection: 'row',
        marginTop: 8,
        backgroundColor: '#e0e0e0',
        height: 20,
        borderRadius: 10,
        overflow: 'hidden',
    },
    cadastrarButton: {
        backgroundColor: '#1F48AA',
        paddingVertical: 8,
        paddingHorizontal: 85,
        borderRadius: 20,
        alignSelf: 'center',
    },
    cadastrarButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

