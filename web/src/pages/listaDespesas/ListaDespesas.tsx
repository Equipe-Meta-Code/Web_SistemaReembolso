// src/pages/listaDespesas/ListaDespesas.tsx
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  RefreshControl,
  Pressable,
} from 'react-native';
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

  const [statusSelecionados, setStatusSelecionados] = useState<string[]>([]);
  const [funcionariosSelecionados, setFuncionariosSelecionados] = useState<number[]>([]);
  const [projetosSelecionados, setProjetosSelecionados] = useState<number[]>([]);

  useEffect(() => {
    setTitulo('Lista de Despesas');
    setShowSearch(false);
  }, []);

  const fetchData = async () => {
    try {
      const [
        resPacotes,
        resDespesas,
        resCats,
        resUsers,
        resProjs
      ] = await Promise.all([
        api.get<Pacote[]>('/pacote'),
        api.get<Despesa[]>('/despesa'),
        api.get<{ categorias: Categoria[] }>('/categorias'),
        api.get<{ users: Usuario[] }>('/userList'),
        api.get<Projeto[]>('/projeto'),
      ]);

      setPacotes(
        (resPacotes.data ?? [])
          .filter(p =>
            p.status !== 'Rascunho' &&
            p.nome.toLowerCase().includes(filtro.toLowerCase())
          )
      );
      setDespesas(resDespesas.data ?? []);
      setCategorias(resCats.data.categorias ?? []);
      setUsuarios(resUsers.data.users ?? []);
      setProjetos(resProjs.data ?? []);
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
  const getCategoria = (catId: string) =>
    categorias.find(c => c._id === catId || c.categoriaId === Number(catId));
  const getUsuario = (id: number) => usuarios.find(u => u.userId === id);

  const toggleStatus = (status: string) =>
    setStatusSelecionados(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  const toggleUser = (id: number) =>
    setFuncionariosSelecionados(prev =>
      prev.includes(id)
        ? prev.filter(u => u !== id)
        : [...prev, id]
    );
  const toggleProject = (id: number) =>
    setProjetosSelecionados(prev =>
      prev.includes(id)
        ? prev.filter(p => p !== id)
        : [...prev, id]
    );

  const pacotesFiltrados = pacotes.filter(p => {
    const okStatus = !statusSelecionados.length || statusSelecionados.includes(p.status);
    const okUser = !funcionariosSelecionados.length || funcionariosSelecionados.includes(p.userId);
    const okProjeto = !projetosSelecionados.length || projetosSelecionados.includes(p.projetoId);
    return okStatus && okUser && okProjeto;
  });

  return (
    <ScrollView
      style={styles.pagina}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={async () => {
            setRefreshing(true);
            await fetchData();
            setRefreshing(false);
          }}
        />
      }
    >

      <View style={styles.filtros}>

        <View style={styles.conjuntoFiltros}>
          <Text style={styles.filtroTexto}>Status:</Text>
          <View style={styles.opcoesFiltro}>
            {SECOES.map(s => (
              <Pressable
                key={s}
                onPress={() => toggleStatus(s)}
                style={[
                  styles.containerOpcao,
                  statusSelecionados.includes(s) && styles.filtroSelecionado,
                ]}
              >
                <Text
                  style={
                    statusSelecionados.includes(s)
                      ? styles.textoFiltroSelecionado
                      : styles.textoOpcao
                  }
                >
                  {s}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.conjuntoFiltros}>
          <Text style={styles.filtroTexto}>Funcionários:</Text>
          <View style={styles.opcoesFiltro}>
            {usuarios.map(u => (
              <Pressable
                key={u.userId}
                onPress={() => toggleUser(u.userId!)}
                style={[
                  styles.containerOpcao,
                  funcionariosSelecionados.includes(u.userId!) && styles.filtroSelecionado,
                ]}
              >
                <Text
                  style={
                    funcionariosSelecionados.includes(u.userId!)
                      ? styles.textoFiltroSelecionado
                      : styles.textoOpcao
                  }
                >
                  {u.name}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.conjuntoFiltros}>
          <Text style={styles.filtroTexto}>Projetos:</Text>
          <View style={styles.opcoesFiltro}>
            {projetos.map(p => (
              <Pressable
                key={p.projetoId}
                onPress={() => toggleProject(p.projetoId!)}
                style={[
                  styles.containerOpcao,
                  projetosSelecionados.includes(p.projetoId!) && styles.filtroSelecionado,
                ]}
              >
                <Text
                  style={
                    projetosSelecionados.includes(p.projetoId!)
                      ? styles.textoFiltroSelecionado
                      : styles.textoOpcao
                  }
                >
                  {p.nome}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>

      {SECOES.map(secao => {
        const itens = pacotesFiltrados.filter(p => p.status === secao);
        if (!itens.length) return null;
        return (
          <View key={secao} style={styles.section}>
            <Text style={styles.tituloSecao}>{secao}</Text>
            {itens.map(p => {
              const despesasRel = despesas.filter(d =>
                p.despesas.includes(d.despesaId)
              );
              const proj = getProjeto(p.projetoId);
              const usr = getUsuario(p.userId);
              const despesasComNome = despesasRel.map(d => ({
                ...d,
                categoria: getCategoria(d.categoria)?.nome ?? 'Sem categoria',
                comprovante:
                  'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
              }));
              return (
                <Card
                  key={p._id}
                  pacote={p}
                  despesas={despesasComNome}
                  projeto={proj}
                  usuario={usr}
                  visivel={!!mostrarPacote[p._id]}
                  alternarVisibilidade={() =>
                    setMostrarPacote(prev => ({
                      ...prev,
                      [p._id]: !prev[p._id],
                    }))
                  }
                  onAprovacaoChange={fetchData}
                  comprovante={''}
                />
              );
            })}
          </View>
        );
      })}
    </ScrollView>
  );
};

export default ListaDespesas;
