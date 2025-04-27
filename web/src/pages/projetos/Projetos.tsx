import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Animated, Pressable, Alert } from 'react-native';
import {
    Card,
    TextInput,
    Title,
    List,
    IconButton,
    Button,
} from 'react-native-paper';
import api from '../../services/api';

interface Categoria {
  _id: string;
  categoriaId: string;
  nome: string;
}

interface Departamento {
  _id: string;
  departamentoId: string;
  nome: string;
}

interface Funcionario {
  _id: string;
  userId: number;
  name: string;
}

export default function CadastroProjetos() {
    const [nomeProjeto, setNomeProjeto] = useState('');
    const [descricao, setDescricao] = useState('');
    const [departamentoId, setDepartamentoId] = useState('');
    const [categoriasInput, setCategoriasInput] = useState<{ categoriaId: string; valorMaximo: string }[]>([{ categoriaId: '', valorMaximo: '' }]);
    const [funcionariosInput, setFuncionariosInput] = useState<string[]>(['']);
    const [expandedDepartamento, setExpandedDepartamento] = useState(false);
    const [expandedCategorias, setExpandedCategorias] = useState<number | null>(null);
    const [expandedFuncionarios, setExpandedFuncionarios] = useState<number | null>(null);

    const [listaDepartamentos, setListaDepartamentos] = useState<Departamento[]>([]);
    const [listaCategorias, setListaCategorias] = useState<Categoria[]>([]);
    const [listaFuncionarios, setListaFuncionarios] = useState<Funcionario[]>([]);

    const scale = useState(new Animated.Value(1))[0];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catRes, depRes, funcRes] = await Promise.all([
                    api.get<Categoria[]>('/categorias'),
                    api.get<Departamento[]>('/departamentos'),
                    api.get<{ users: Funcionario[] }>('/userList'),
                ]);
                setListaCategorias(catRes.data);
                setListaDepartamentos(depRes.data);
                setListaFuncionarios(funcRes.data.users);
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
                Alert.alert('Erro', 'Não foi possível carregar dados iniciais.');
            }
        };
        fetchData();
    }, []);

    const valorTotal = categoriasInput.reduce(
        (total, item) => total + (parseFloat(item.valorMaximo) || 0),
        0
    );

    const adicionarCategoria = () =>
        setCategoriasInput([...categoriasInput, { categoriaId: '', valorMaximo: '' }]);

    const atualizarCategoria = (
        index: number,
        campo: 'categoriaId' | 'valorMaximo',
        valor: string
    ) => {
        const arr = [...categoriasInput];
        (arr[index] as any)[campo] = valor;
        setCategoriasInput(arr);
    };

    const adicionarFuncionario = () =>
        setFuncionariosInput([...funcionariosInput, '']);

    const atualizarFuncionario = (index: number, valor: string) => {
        const arr = [...funcionariosInput];
        arr[index] = valor;
        setFuncionariosInput(arr);
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
                                label="Digite o nome do Projeto"
                                value={nomeProjeto}
                                onChangeText={setNomeProjeto}
                                style={styles.input}
                                mode="flat"
                            />
                            <Title style={styles.selectTitle}>Descrição</Title>
                            <TextInput
                                label="Digite a descrição do Projeto"
                                value={descricao}
                                onChangeText={setDescricao}
                                style={styles.input}
                                mode="flat"
                            />

                            <Title style={styles.selectTitle}>Departamento</Title>
                            <List.Accordion
                                title={
                                    listaDepartamentos.find((d) => d.departamentoId === departamentoId)
                                        ?.nome || 'Escolha o Departamento'
                                }
                                style={styles.field}
                                expanded={expandedDepartamento}
                                onPress={() => setExpandedDepartamento(!expandedDepartamento)}
                            >
                                {listaDepartamentos.map((d) => (
                                    <List.Item
                                        key={d._id}
                                        title={d.nome}
                                        onPress={() => {
                                            setDepartamentoId(d.departamentoId);
                                            setExpandedDepartamento(false);
                                        }}
                                    />
                                ))}
                            </List.Accordion>

                            <Title style={styles.selectTitle}>Categorias e Valor Máximo (R$)</Title>
                            {categoriasInput.map((item, idx) => (
                                <View key={idx} style={styles.categoriaContainer}>
                                    <View style={{ flex: 1 }}>
                                        <List.Accordion
                                            title={
                                                listaCategorias.find((c) => c.categoriaId === item.categoriaId)
                                                    ?.nome || 'Escolha a Categoria'
                                            }
                                            style={styles.field}
                                            expanded={expandedCategorias === idx}
                                            onPress={() =>
                                                setExpandedCategorias(
                                                    expandedCategorias === idx ? null : idx
                                                )
                                            }
                                        >
                                            {listaCategorias.map((c) => (
                                                <List.Item
                                                    key={c._id}
                                                    title={c.nome}
                                                    onPress={() => {
                                                        atualizarCategoria(
                                                            idx,
                                                            'categoriaId',
                                                            c.categoriaId
                                                        );
                                                        setExpandedCategorias(null);
                                                    }}
                                                />
                                            ))}
                                        </List.Accordion>
                                    </View>
                                    <TextInput
                                        label="Valor"
                                        value={item.valorMaximo}
                                        onChangeText={(t) =>
                                            atualizarCategoria(idx, 'valorMaximo', t)
                                        }
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
                            {funcionariosInput.map((item, idx) => (
                                <List.Accordion
                                    key={idx}
                                    title={
                                        listaFuncionarios.find((f) => String(f.userId) === item)
                                            ?.name || 'Escolha o Funcionário'
                                    }
                                    style={styles.field}
                                    expanded={expandedFuncionarios === idx}
                                    onPress={() =>
                                        setExpandedFuncionarios(
                                            expandedFuncionarios === idx ? null : idx
                                        )
                                    }
                                >
                                    {listaFuncionarios.map((f) => (
                                        <List.Item
                                            key={f._id}
                                            title={f.name}
                                            onPress={() => {
                                                atualizarFuncionario(
                                                    idx,
                                                    String(f.userId)
                                                );
                                                setExpandedFuncionarios(null);
                                            }}
                                        />
                                    ))}
                                </List.Accordion>
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

