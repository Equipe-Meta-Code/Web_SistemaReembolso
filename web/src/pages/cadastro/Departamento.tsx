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

interface Departamento {
  id: string;
  name: string;
}
interface DepartamentosProps {
  setTitulo: (titulo: string) => void;
  setShowSearch: (show: boolean) => void;
}

export default function Departamentos({ setTitulo, setShowSearch }: DepartamentosProps) {
  const [name, setName] = useState('');
  const [search, setSearch] = useState('');
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);

  const fetchDepartamentos = () => {
    api.get('/departamentos')
      .then(({ data }) => {
        const mapped: Departamento[] = data.map((d: any) => ({
          id: d._id,
          name: typeof d.nome === 'string' ? d.nome : '',
        }));
        const seen = new Set<string>();
        const unique = mapped.filter(dep => {
          if (!dep.name) return false;
          if (seen.has(dep.name)) return false;
          seen.add(dep.name);
          return true;
        });
        setDepartamentos(unique);
      })
      .catch(err => console.error('Erro ao carregar departamentos', err));
  };

  useEffect(() => {
    setTitulo('Departamentos');
    setShowSearch(false);          
    fetchDepartamentos();

    const interval = setInterval(() => {
      fetchDepartamentos();
    }, 3000);
    return () => clearInterval(interval)

  }, []);

  

  // filtra pela busca
  const filtered = useMemo(
    () =>
      departamentos.filter(dep =>
        dep.name.toLowerCase().includes(search.toLowerCase())
      ),
    [search, departamentos]
  );

  const addDepartamento = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    api.post('/departamentos', { nome: trimmed })
      .then(() => {
        setName('');
        fetchDepartamentos();
      })
      .catch(err => console.error('Erro ao adicionar departamento', err));
  };

  const removeDepartamento = (id: string) => {
    api.delete(`/departamentos/${id}`)
      .then(() => fetchDepartamentos())
      .catch(err => console.error('Erro ao remover departamento', err));
  };

  const editDepartamento = (id: string) => {
    const novoNome = prompt('Novo nome do departamento?', '');
    if (!novoNome?.trim()) return;
    api.put(`/departamentos/${id}`, { nome: novoNome.trim() })
      .then(() => fetchDepartamentos())
      .catch(err => console.error('Erro ao editar departamento', err));
  };

  return (
    <View style={styles.container}>
      <Card style={styles.formCard}>
        <Card.Content>
          {/* Formulário de cadastro */}
          <View style={styles.row_top}>
            <View style={{ width: 600, backgroundColor: '#FFFFFF', borderRadius: 8 }}>
              <TextInput
                label="Nome do Departamento"
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
              onPress={addDepartamento}
              contentStyle={{ height: 48 }}
              style={styles.button}
            >
              Registrar Departamento
            </Button>
          </View>

          {/* Título e busca */}
          <View style={styles.row_bottom}>
            <Title style={styles.label}>Lista de Departamentos</Title>
            <Searchbar
              placeholder="Buscar ..."
              value={search}
              onChangeText={setSearch}
              style={[styles.search, { backgroundColor: '#FAFAFA' }]}
            />
          </View>

          {/* Tabela de departamentos */}
          <View style={styles.tableContainer}>
            <DataTable.Header style={styles.header}>
              <DataTable.Title style={{ flex: 3 }} textStyle={styles.headerText}>DEPARTAMENTO</DataTable.Title>
              <DataTable.Title style={{ flex: 2 }} textStyle={styles.headerText}>AÇÕES</DataTable.Title>
            </DataTable.Header>

            {filtered.map((dep, idx) => (
              <DataTable.Row
                key={dep.id}
                style={[styles.row, idx % 2 === 0 ? styles.rowEven : styles.rowOdd]}
              >
                <DataTable.Cell style={{ flex: 3 }} textStyle={styles.name}>
                  <Text numberOfLines={1} ellipsizeMode="tail">
                    {dep.name}
                  </Text>
                </DataTable.Cell>
                <DataTable.Cell style={{ flex: 2 }}>
                  <View style={styles.actions}>
                    <IconButton icon="delete-outline" size={20} onPress={() => removeDepartamento(dep.id)} />
                    <IconButton icon="pencil-outline" size={20} onPress={() => editDepartamento(dep.id)} />
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

// estilos mantidos exatamente iguais
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