import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Platform, ScrollView } from 'react-native';
import {
    Card,
    TextInput,
    Button,
    Title,
    Searchbar,
    IconButton,
    DataTable,
} from 'react-native-paper';
import api from '../../services/api';
import Foto from '../../components/foto/Foto';

interface Funcionario {
    id: string;
    name: string;
    email: string;
    createdAt: string;
}

interface ListaFuncionariosProps {
    filtro: string;
    setTitulo: (titulo: string) => void;
    setShowSearch: (show: boolean) => void;
}

export default function Funcionarios({ setTitulo, filtro, setShowSearch }: ListaFuncionariosProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);



    useEffect(() => {
        setTitulo('Lista de Funcionários');
        setShowSearch(true);

        api.get('/userList')
            .then(({ data }) => {
                // Ajuste: acessar array de usuários dentro de data.users
                const usersArray = data.users || [];
                const mapped: Funcionario[] = usersArray.map((d: any) => ({
                    id: d.userId,
                    name: d.name,
                    email: d.email,
                    createdAt: d.createdAt,
                }));
                const seen = new Set<string>();
                const unique = mapped.filter(item => {
                    if (seen.has(item.id)) return false;
                    seen.add(item.id);
                    return true;
                });
                setFuncionarios(unique);
            })
            .catch(err => console.error('Erro ao carregar funcionários', err));
    }, []);

    const filtered = useMemo(() => {
        return funcionarios.filter(fun =>
            fun.name.toLowerCase().includes(filtro.toLowerCase())
        );
    }, [filtro, funcionarios]);

    const removeFuncionario = (id: string) => {
        api.delete(`/users/${id}`)
            .then(() => setFuncionarios(prev => prev.filter(fun => fun.id !== id)))
            .catch(err => console.error('Erro ao remover funcionário', err));
    };

    const editFuncionario = (id: string) => {
        const onSubmit = (newName: string, newEmail: string) => {
            if (!newName.trim() || !newEmail.trim()) return;
            api.put(`/users/${id}`, { name: newName.trim(), email: newEmail.trim() })
                .then(({ data }) => {
                    setFuncionarios(prev =>
                        prev.map(fun =>
                            fun.id === id ? { ...fun, name: data.name, email: data.email } : fun
                        )
                    );
                })
                .catch(err => console.error('Erro ao editar funcionário', err));
        };

        if (Platform.OS === 'ios') {
            Alert.prompt(
                'Editar Funcionário',
                'Informe novo nome e email separados por vírgula',
                text => {
                    const [newName, newEmail] = text.split(',');
                    onSubmit(newName || '', newEmail || '');
                }
            );
        } else {
            const newName = prompt('Novo nome do funcionário?');
            const newEmail = prompt('Novo email do funcionário?');
            if (newName && newEmail) onSubmit(newName, newEmail);
        }
    };

    return (
        <View style={styles.container}>
            <Card style={styles.formCard}>
                <Card.Content style={{ flex: 1, paddingBottom: 16 }}>
                    <DataTable style={styles.tableContainer}>
                        <DataTable.Header style={styles.header}>
                            <DataTable.Title style={{ flex: 3 }} textStyle={styles.headerText}>NOME</DataTable.Title>
                            <DataTable.Title style={{ flex: 2 }} textStyle={styles.headerText}>ID</DataTable.Title>
                            <DataTable.Title style={{ flex: 3 }} textStyle={styles.headerText}>EMAIL</DataTable.Title>
                            <DataTable.Title style={{ flex: 2 }} textStyle={styles.headerText}>CRIAÇÃO</DataTable.Title>
                        </DataTable.Header>
                        <View style={{ flex: 1, maxHeight: 650 }}>
                            <ScrollView>
                                {filtered.map((item, idx) => (
                                    <DataTable.Row
                                        key={item.id}
                                        style={[styles.row, idx % 2 === 0 ? styles.rowEven : styles.rowOdd]}
                                    >
                                         <Foto
                                                tipo="user"
                                                tipoId={+item.id}
                                                width={40}
                                                height={40}
                                                borderRadius={20}
                                                borderWidth={1}
                                                borderColor="#E9ECEF"
                                                refreshKey={item.id}
                                                fallbackSource={require('../../assets/perfil.png')}
                                            />
                                        <DataTable.Cell style={styles.cellPhotoName}>
                                            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.name}>
                                                {item.name}
                                            </Text>
                                        </DataTable.Cell>
                                        <DataTable.Cell style={{ flex: 2 }}>
                                            <Text style={styles.id}>{item.id}</Text>
                                        </DataTable.Cell>
                                        <DataTable.Cell style={{ flex: 3 }}>
                                            <Text style={styles.name}>{item.email}</Text>
                                        </DataTable.Cell>
                                        <DataTable.Cell style={{ flex: 2 }}>
                                            <Text style={styles.name}>{new Date(item.createdAt).toLocaleDateString()}</Text>
                                        </DataTable.Cell>
                                    </DataTable.Row>
                                ))}
                            </ScrollView>
                        </View>
                    </DataTable>
                </Card.Content>
            </Card>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 50,
        backgroundColor: '#FFFFFF',
    },
    formCard: {
        borderRadius: 12,
        padding: 8,
        backgroundColor: '#FFFFFF',
    },
    listItem: {
        backgroundColor: '#FAFAFA',
        marginBottom: 4,
        borderRadius: 8,
    },
    tableContainer: {
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E9ECEF',
        width: '100%',
    },
    header: {
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E9ECEF',
    },
    headerText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#A4A1A2',
        textTransform: 'uppercase',
    },
    row: {
        minHeight: 56,
        alignItems: 'center',
        paddingHorizontal: 16,
        flexDirection: 'row',
    },
    rowEven: { backgroundColor: '#FFFFFF' },
    rowOdd: { backgroundColor: '#F8F9FC' },
    cellPhotoName: {
        flex: 3,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    name: {
        fontSize: 16,
        color: '#2C2C2C',
        marginLeft: 8,
    },

    id: {
        fontSize: 16,
        color: '#6E6E6E',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    iconButton: {
        margin: 0,
        padding: 4,
    },
});