// src/pages/listaDespesas/ListaProjetos.tsx
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
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

const ListaProjetos: React.FC<ListaProjetosProps> = ({
  filtro,
  setTitulo,
  setShowSearch,
}) => {
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [quantidadeProjetos, setQuantidadeProjetos] = useState(5);
  const [visivelProjeto, setVisivelProjeto] = useState<Record<number, boolean>>({});

  const navigation = useNavigation();

  useEffect(() => {
    setTitulo('Lista de Projetos');
    setShowSearch(true);
  }, []);

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

  const projetosFiltrados = projetos.filter(p =>
    p.nome.toLowerCase().includes(filtro.toLowerCase())
  );

  const projetosVisiveis = projetosFiltrados.slice(0, quantidadeProjetos);

  const ativos = projetosFiltrados.filter(p => p.status === 'ativo');
  const encerrados = projetosFiltrados.filter(p => p.status === 'encerrado');

  const atualizarProjetos = () => {
    fetchProjetos();
  };

  return (
    <ScrollView
      style={styles.pagina}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={async () => {
            setRefreshing(true);
            await fetchProjetos();
            setRefreshing(false);
          }}
        />
      }
    >
      <View style={{ padding: 16 }}>

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
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>
              + Novo Projeto
            </Text>
          </TouchableOpacity>
        </View>

        {/* Lista de Projetos Ativos */}
        {ativos.slice(0, quantidadeProjetos).map(p => (
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
            onProjetoAtualizado={atualizarProjetos}
          />
        ))}

        {quantidadeProjetos < ativos.length && (
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

        {/* Lista de Projetos Encerrados */}
        {encerrados.length > 0 && (
          <View style={{ marginTop: 32 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#888', marginBottom: 8 }}>
              Projetos Encerrados
            </Text>
            {encerrados.map(p => (
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
                encerrado 
                onProjetoAtualizado={atualizarProjetos}
              />
            ))}
          </View>
        )}


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
