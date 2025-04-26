import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
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

interface Category {
    id: string;
    name: string;
}

interface CategoriasProps {
    setTitulo: (titulo: string) => void;
    setShowSearch: (show: boolean) => void;
}

export default function Categorias({ setTitulo, setShowSearch }: CategoriasProps) {
    const [name, setName] = useState('');
    const [search, setSearch] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const from = page * rowsPerPage;
    const to = Math.min((page + 1) * rowsPerPage, categories.length);

    useEffect(() => {
        setTitulo('Categorias');
        setShowSearch(false);
    }, []);
    
    // carrega e deduplica categorias
    const fetchCategories = () => {
        api.get('/categorias')
            .then(({ data }) => {
                const mapped: Category[] = data.map((d: any) => ({
                    id: d._id,
                    name: typeof d.nome === 'string' ? d.nome : '',
                }));
                const seen = new Set<string>();
                const unique = mapped.filter(item => {
                    if (seen.has(item.name)) return false;
                    seen.add(item.name);
                    return true;
                });
                setCategories(unique);
            })
            .catch(err => console.error('Erro ao carregar categorias', err));
    };
    
    useEffect(() => {
        fetchCategories();
    }, []);

    // Filtra pela busca com segurança
    const filtered = useMemo(
        () =>
            categories.filter(cat =>
                cat.name.toLowerCase().includes(search.toLowerCase())
            ),
        [search, categories]
    );

    // Adicionar nova categoria e recarregar
    const addCategory = () => {
        const trimmed = name.trim();
        if (!trimmed) return;
        api.post('/categorias', { nome: trimmed })
            .then(() => {
                setName('');
                fetchCategories();
            })
            .catch(err => console.error('Erro ao adicionar categoria', err));
    };

    // Remover categoria e recarregar
    const removeCategory = (id: string) => {
        api.delete(`/categorias/${id}`)
            .then(() => fetchCategories())
            .catch(err => console.error('Erro ao remover categoria', err));
    };

    // Editar nome da categoria e recarregar
    const editCategory = (id: string) => {
        const novoNome = prompt('Novo nome da categoria?', '');
        if (!novoNome?.trim()) return;
        api.put(`/categorias/${id}`, { nome: novoNome.trim() })
            .then(() => fetchCategories())
            .catch(err => console.error('Erro ao editar categoria', err));
    };

    const handleChangePage = (newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (newRowsPerPage: number) => {
        setRowsPerPage(newRowsPerPage);
        setPage(0);
    };

    const displayData = filtered.slice(from, to);

    return (
        <View style={styles.container}>
            <Card style={styles.formCard}>
                <Card.Content>
                    {/* Formulário de cadastro */}
                    <View style={styles.row_top}>
                        <View style={{ width: 600, backgroundColor: '#FFFFFF', borderRadius: 8 }}>
                            <TextInput
                                label="Nome da Categoria"
                                value={name}
                                onChangeText={setName}
                                mode="outlined"
                                activeOutlineColor="#1F48AA"
                                contentStyle={{ height: 48 }}
                                style={{ backgroundColor: '#FFFFFF' }}
                            />
                        </View>
                        <Button
                            mode="contained"
                            onPress={addCategory}
                            contentStyle={{ height: 48 }}
                            style={styles.button}
                        >
                            Registrar Categoria
                        </Button>
                    </View>

                    {/* Título e busca */}
                    <View style={styles.row_bottom}>
                        <Title style={styles.label}>Lista de Categorias</Title>
                        <Searchbar
                            placeholder="Search here..."
                            value={search}
                            onChangeText={setSearch}
                            style={[styles.search, { backgroundColor: '#FAFAFA' }]}
                        />
                    </View>

                    {/* Tabela de categorias */}
                    <View style={styles.tableContainer}>
                        <DataTable.Header style={styles.header}>
                            <DataTable.Title style={{ flex: 3 }} textStyle={styles.headerText}>NOME</DataTable.Title>
                            <DataTable.Title style={{ flex: 2 }} textStyle={styles.headerText}>AÇÕES</DataTable.Title>
                        </DataTable.Header>

                        {displayData.map((item, idx) => (
                            <DataTable.Row
                                key={item.id}
                                style={[styles.row, idx % 2 === 0 ? styles.rowEven : styles.rowOdd]}
                            >
                                <DataTable.Cell style={{ flex: 3 }} textStyle={styles.name}>
                                    <Text numberOfLines={1} ellipsizeMode="tail">
                                        {item.name}
                                    </Text>
                                </DataTable.Cell>
                                <DataTable.Cell style={{ flex: 2 }}>
                                    <View style={styles.actions}>
                                        <IconButton icon="delete-outline" size={20} onPress={() => removeCategory(item.id)} />
                                        <IconButton icon="pencil-outline" size={20} onPress={() => editCategory(item.id)} />
                                    </View>
                                </DataTable.Cell>
                            </DataTable.Row>
                        ))}
                    </View>
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
    row_top: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        gap: 120,
        marginBottom: 60,
    },
    button: {
        borderRadius: 24,
        width: 350,
        backgroundColor: '#1F48AA',
    },
    label: {
        fontSize: 22,
        color: '#000000',
        marginBottom: 8,
        fontWeight: 'bold',
    },
    search: {
        marginBottom: 8,
    },
    row_bottom: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        gap: 120,
        marginBottom: 30,
    },
    tableContainer: {
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E9ECEF',
        width: 600,
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
    name: {
        fontSize: 16,
        color: '#2C2C2C',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
});
