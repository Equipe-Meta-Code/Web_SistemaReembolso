import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  RefreshControl,
  TouchableOpacity,
  Pressable,
  TextInput,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import api from '../../services/api';
import styles from './style';
import CardProjeto from '../../components/listaProjetos/CardProjeto';
import { Projeto } from '../../types/Projeto';
import { useNavigation } from '@react-navigation/native';

interface ListaProjetosProps {
  filtro: string;
  setTitulo: (titulo: string) => void;
  setShowSearch: (show: boolean) => void;
}

export interface Usuario {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  __v: number;
  twoFactorEnabled: boolean;
}

const ListaProjetos: React.FC<ListaProjetosProps> = ({
  filtro,
  setTitulo,
  setShowSearch,
}) => {
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [quantidadeProjetos, setQuantidadeProjetos] = useState(5);
  const [visivelProjeto, setVisivelProjeto] = useState<Record<number, boolean>>({});

  const [nomeFiltro, setNomeFiltro] = useState<string>('');
  const [funcionariosDropdowns, setFuncionariosDropdowns] = useState<number[]>([0]);
  const [funcionariosSelecionados, setFuncionariosSelecionados] = useState<number[]>([]);

  const navigation = useNavigation();

  useEffect(() => {
    setTitulo('Lista de Projetos');
    setShowSearch(false);
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get<{ users: Usuario[] }>('/userList');
      setUsuarios(res.data.users ?? []);
    } catch (err) {
      console.error('Erro ao buscar usuários:', err);
    }
  };

  const fetchProjetos = async () => {
    try {
      const res = await api.get<Projeto[]>('/projeto');
      setProjetos(res.data ?? []);
    } catch (err) {
      console.error('Erro ao buscar projetos:', err);
    }
  };

  useEffect(() => {
    fetchProjetos();
    const interval = setInterval(fetchProjetos, 3000);
    return () => clearInterval(interval);
  }, []);

  const addFuncionarioDropdown = () =>
    setFuncionariosDropdowns(prev => [...prev, prev.length]);
  const removeFuncionarioDropdown = (idx: number) => {
    setFuncionariosDropdowns(prev =>
      prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev
    );
    setFuncionariosSelecionados(prev => prev.filter((_, i) => i !== idx));
  };
  const setFuncionarioSelecionado = (idx: number, userId: string | number) => {
    setFuncionariosSelecionados(prev => {
      const novo = [...prev];
      novo[idx] = userId === '' ? NaN : Number(userId);
      return novo as number[];
    });
  };

  // Filtra por nome (search input + prop filtro) e por funcionários
  const projetosFiltrados = projetos.filter(p => {
    const nomePropOk = p.nome.toLowerCase().includes(filtro.toLowerCase());
    const nomeLocalOk = p.nome.toLowerCase().includes(nomeFiltro.toLowerCase());
    const funcionariosValidos = funcionariosSelecionados.filter(
      f => typeof f === 'number' && !isNaN(f)
    );
    const atendeFuncionario =
      funcionariosValidos.length === 0 ||
      p.funcionarios.some(f => funcionariosValidos.includes(f.userId));
    return nomePropOk && nomeLocalOk && atendeFuncionario;
  });

  const projetosVisiveis = projetosFiltrados.slice(0, quantidadeProjetos);

  return (
    <ScrollView
      style={styles.pagina}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={async () => {
            setRefreshing(true);
            await Promise.all([fetchProjetos(), fetchUsers()]);
            setRefreshing(false);
          }}
        />
      }
    >
      <View style={{ padding: 16 }}>
        <View
          style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 16 }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: '#007bff',
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: 6,
            }}
            onPress={() => navigation.navigate('CadastroProjetos' as never)}
          >
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>
              + Novo Projeto
            </Text>
          </TouchableOpacity>
        </View>

        {/* Filtro por nome do projeto */}
        <View style={{ marginBottom: 16 }}>
          <Text style={styles.filtroTexto}>Nome do Projeto:</Text>
          <TextInput
            value={nomeFiltro}
            onChangeText={setNomeFiltro}
            placeholder="Buscar projeto..."
            placeholderTextColor="#aaa"
            style={styles.inputFiltro}
          />
        </View>

        {/* Filtro de Funcionários */}
        <View style={{ marginBottom: 16 }}>
          <Text style={styles.filtroTexto}>Funcionários:</Text>
          {funcionariosDropdowns.map((_, idx) => (
            <View
              key={idx}
              style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}
            >
              <Picker
                selectedValue={funcionariosSelecionados[idx] ?? ''}
                style={{ width: 200, height: 40 }}
                onValueChange={value => setFuncionarioSelecionado(idx, value)}
              >
                <Picker.Item label="Selecione" value="" />
                {usuarios.map(u => (
                  <Picker.Item key={u.userId} label={u.name} value={u.userId} />
                ))}
              </Picker>
              <Pressable
                onPress={() => removeFuncionarioDropdown(idx)}
                style={{ marginLeft: 8 }}
              >
                <Text style={{ color: 'red', fontWeight: 'bold' }}>-</Text>
              </Pressable>
            </View>
          ))}
          <Pressable onPress={addFuncionarioDropdown}>
            <Text style={{ color: '#007bff' }}>+ Adicionar Funcionário</Text>
          </Pressable>
        </View>

        {/* Lista de Projetos */}
        {projetosVisiveis.map(p => (
          <CardProjeto
            key={p.projetoId}
            projeto={p}
            visivel={!!visivelProjeto[p.projetoId!]}
            alternarVisibilidade={() =>
              setVisivelProjeto(prev => ({
                ...prev,
                [p.projetoId!]: !prev[p.projetoId!],
              }))
            }
          />
        ))}

        {quantidadeProjetos < projetosFiltrados.length && (
          <Text
            style={{
              marginTop: 20,
              textAlign: 'center',
              color: '#007bff',
              fontWeight: 'bold',
            }}
            onPress={() => setQuantidadeProjetos(quantidadeProjetos + 5)}
          >
            Ver mais projetos
          </Text>
        )}
      </View>
    </ScrollView>
  );
};

export default ListaProjetos;
