import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, RefreshControl, TouchableOpacity } from 'react-native';
import api from '../../services/api';
import styles from './style';
import CardProjeto from '../../components/listaProjetos/CardProjeto';
import { Projeto } from '../../types/Projeto';
import { useNavigation } from '@react-navigation/native';

interface Pacote {
  _id: string;
  pacoteId: number;
  nome: string;
  projetoId: number;
  userId: number;
  status: string;
  despesas: number[];
}

interface Despesa {
  _id: string;
  despesaId: number;
  projetoId: number;
  userId: number;
  categoria: string;
  data: string;
  valor_gasto: number;
  descricao: string;
  aprovacao: string;
  comprovante: string;
}

interface Categoria { _id: string; nome: string; categoriaId?: number; }
interface Usuario { _id: string; name: string; userId?: number; }

interface ListaDespesasProps {
  filtro: string;
  setTitulo: (titulo: string) => void;
  setShowSearch: (show: boolean) => void;
}

const ListaProjetos: React.FC<ListaDespesasProps> = ({ filtro, setTitulo, setShowSearch }) => {
  const [pacotes, setPacotes] = useState<Pacote[]>([]);
  const [despesas, setDespesas] = useState<Despesa[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [mostrarPacote, setMostrarPacote] = useState<Record<string, boolean>>({});
  const [refreshing, setRefreshing] = useState(false);
  const [quantidadeProjetos, setQuantidadeProjetos] = useState(5);

  const navigation = useNavigation();

  useEffect(() => {
    setTitulo('Lista de Projetos');
    setShowSearch(false);
  }, []);

  const fetchData = async () => {
    try {
      const [resPacotes, resDespesas, resCategorias, resUsuarios, resProjetos] = await Promise.all([
        api.get<Pacote[]>('/pacote'),
        api.get<Despesa[]>('/despesa'),
        api.get<Categoria[]>('/categorias'),
        api.get<{ users: Usuario[] }>('/userList'),
        api.get<Projeto[]>('/projeto'),
      ]);

      const allPacotes = resPacotes.data ?? [];
      const validos = allPacotes.filter(p => p.status !== 'Rascunho' && p.nome.toLowerCase().includes(filtro.toLowerCase()));
      setPacotes(validos);
      setDespesas(resDespesas.data ?? []);
      setCategorias(resCategorias.data ?? []);
      setUsuarios(resUsuarios.data.users ?? []);
      setProjetos(resProjetos.data ?? []);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, [filtro]);

  const getProjeto = (id: number) => projetos.find(p => p.projetoId === id);
  const getUsuario = (id: number) => usuarios.find(u => u.userId === id);

  const alternarVisibilidade = (pacoteId: string) => {
    setMostrarPacote(prev => ({ ...prev, [pacoteId]: !prev[pacoteId] }));
  };

  const projetosVisiveis = pacotes.slice(0, quantidadeProjetos);

  return (
    <ScrollView
      style={styles.pagina}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={async () => { setRefreshing(true); await fetchData(); setRefreshing(false); }}
        />
      }
    >
      <View style={{ padding: 16 }}>
        {/* Botão de novo projeto */}
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 16 }}>
            <TouchableOpacity
                style={{
                backgroundColor: '#007bff',
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 6,
                }}
                onPress={() => navigation.navigate('CadastroProjetos' as never)}
            >
                <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>+ Novo Projeto</Text>
            </TouchableOpacity>
        </View>


        {projetosVisiveis.map(pacote => {
          const projetoRelacionado = getProjeto(pacote.projetoId);
          if (!projetoRelacionado) return null;

          return (
            <CardProjeto
              key={pacote._id}
              projeto={projetoRelacionado}
              visivel={!!mostrarPacote[pacote._id]}
              alternarVisibilidade={() => alternarVisibilidade(pacote._id)}
            />
          );
        })}

        {quantidadeProjetos < pacotes.length && (
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
