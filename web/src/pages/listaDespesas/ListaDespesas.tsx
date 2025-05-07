// src/pages/listaDespesas/ListaDespesas.tsx
import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, RefreshControl } from 'react-native';
import Card from '../../components/listaDespesas/Card';
import api from '../../services/api';
import styles from './style';

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
interface Projeto { _id: string; nome: string; projetoId?: number; }

interface ListaDespesasProps {
  filtro: string;
  setTitulo: (titulo: string) => void;
  setShowSearch: (show: boolean) => void;
}

const SECOES = ['Aguardando Aprovação', 'Recusado', 'Aprovado'] as const;

type Secao = typeof SECOES[number];

const ListaDespesas: React.FC<ListaDespesasProps> = ({ filtro, setTitulo, setShowSearch }) => {
  const [pacotes, setPacotes] = useState<Pacote[]>([]);
  const [despesas, setDespesas] = useState<Despesa[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [mostrarPacote, setMostrarPacote] = useState<Record<string, boolean>>({});
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setTitulo('Lista de Despesas');
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

      // filtra fora pacotes em rascunho e aplica filtro de nome
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
  const getCategoria = (catId: string) => categorias.find(c => c._id === catId || c.categoriaId === Number(catId));
  const getUsuario = (id: number) => usuarios.find(u => u.userId === id);

  const alternarVisibilidade = (pacoteId: string) => {
    setMostrarPacote(prev => ({ ...prev, [pacoteId]: !prev[pacoteId] }));
  };

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
      {SECOES.map((secao: Secao) => {
        const itens = pacotes.filter(p => p.status === secao);
        if (itens.length === 0) return null;
        return (
          <View key={secao} style={styles.section}>
            <Text style={styles.sectionTitle}>{secao}</Text>
            {itens.map(pacote => {
              const despesasRelacionadas = despesas.filter(d => pacote.despesas.includes(d.despesaId));
              const projetoRelacionado = getProjeto(pacote.projetoId);
              const usuarioRelacionado = getUsuario(pacote.userId);

              // injetar nome da categoria em cada despesa
              const despesasComNome = despesasRelacionadas.map(d => ({
                ...d,
                categoria: getCategoria(d.categoria)?.nome ?? 'Sem categoria',
                comprovante: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', // link de teste
                //comprovante: d.comprovante, 
              }));
              

              return (
                <Card
                  key={pacote._id}
                  pacote={pacote}
                  despesas={despesasComNome}
                  projeto={projetoRelacionado}
                  usuario={usuarioRelacionado}
                  visivel={!!mostrarPacote[pacote._id]}
                  alternarVisibilidade={() => alternarVisibilidade(pacote._id)}
                  onAprovacaoChange={fetchData} 
                  comprovante={''}                />
              );
            })}
          </View>
        );
      })}
    </ScrollView>
  );
};

export default ListaDespesas;
