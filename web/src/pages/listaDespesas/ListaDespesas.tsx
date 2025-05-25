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
import { Picker } from '@react-native-picker/picker';

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

const SECOES = ['Aguardando Aprovação', 'Recusado', 'Aprovado', 'Aprovado Parcialmente'] as const;
type Secao = typeof SECOES[number];

// Cores definidas inline para cada status
const statusStyles: Record<Secao, { backgroundColor: string; color: string }> = {
  'Aguardando Aprovação': {
    backgroundColor: 'rgba(255, 188, 20, 0.21)',
    color: 'rgba(214, 154, 1, 0.96)',
  },
  Recusado: {
    backgroundColor: 'rgba(209, 53, 53, 0.15)',
    color: 'rgba(185, 14, 14, 0.70)',
  },
  Aprovado: {
    backgroundColor: 'rgba(27, 143, 37, 0.15)',
    color: 'rgba(4, 155, 12, 0.83)',
  },
  'Aprovado Parcialmente': {
    backgroundColor: 'rgba(255, 139, 62, 0.21)',
    color: 'rgba(248, 103, 7, 0.69)',
  },
};

// Cores de seleção
const selectedBg = 'rgba(173, 216, 230, 0.4)';
const selectedColor = 'rgba(0, 0, 139, 1)';

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
  const [funcionariosDropdowns, setFuncionariosDropdowns] = useState<number[]>([0]);
  const [projetosDropdowns, setProjetosDropdowns] = useState<number[]>([0]);

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
    const funcionariosValidos = funcionariosSelecionados.filter(f => typeof f === 'number' && !isNaN(f));
    const projetosValidos = projetosSelecionados.filter(pj => typeof pj === 'number' && !isNaN(pj));

    const okUser =
      funcionariosValidos.length === 0 ? true : funcionariosValidos.includes(p.userId);
    const okProjeto =
      projetosValidos.length === 0 ? true : projetosValidos.includes(p.projetoId);

    const okStatus = !statusSelecionados.length || statusSelecionados.includes(p.status);

    return okStatus && okUser && okProjeto;
  });

  const addFuncionarioDropdown = () => setFuncionariosDropdowns(prev => [...prev, prev.length]);
  const addProjetoDropdown = () => setProjetosDropdowns(prev => [...prev, prev.length]);

  const setFuncionarioSelecionado = (idx: number, userId: number | string) => {
    setFuncionariosSelecionados(prev => {
      const novo = [...prev];
      novo[idx] = userId === "" ? NaN : Number(userId);
      return novo as number[];
    });
  };
  const setProjetoSelecionado = (idx: number, projetoId: number | string) => {
    setProjetosSelecionados(prev => {
      const novo = [...prev];
      novo[idx] = projetoId === "" ? NaN : Number(projetoId);
      return novo as number[];
    });
  };

  const removeFuncionarioDropdown = (idx: number) => {
    setFuncionariosDropdowns(prev => prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev);
    setFuncionariosSelecionados(prev => prev.filter((_, i) => i !== idx));
  };
  const removeProjetoDropdown = (idx: number) => {
    setProjetosDropdowns(prev => prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev);
    setProjetosSelecionados(prev => prev.filter((_, i) => i !== idx));
  };

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
            {SECOES.map(s => {
              const selected = statusSelecionados.includes(s);
              return (
                <Pressable
                  key={s}
                  onPress={() => toggleStatus(s)}
                  style={[
                    styles.containerOpcao,
                    { backgroundColor: selected ? selectedBg : statusStyles[s].backgroundColor },
                  ]}
                >
                  <Text
                    style={
                      selected
                        ? { ...styles.textoFiltroSelecionado, color: selectedColor } 
                        : { ...styles.textoOpcao, color: statusStyles[s].color }
                    }
                  >
                    {s}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.conjuntoFiltros}>
          <Text style={styles.filtroTexto}>Funcionários:</Text>
          <View>
            {funcionariosDropdowns.map((_, idx) => (
              <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <Picker
                  selectedValue={funcionariosSelecionados[idx] ?? ''}
                  style={{ width: 180, height: 40 }}
                  onValueChange={value => setFuncionarioSelecionado(idx, value)}
                >
                  <Picker.Item label="Selecione" value="" />
                  {usuarios.map(u => (
                    <Picker.Item key={u.userId} label={u.name} value={u.userId} />
                  ))}
                </Picker>
                <Pressable onPress={() => removeFuncionarioDropdown(idx)} style={{ marginLeft: 8 }}>
                  <Text style={{ color: 'red', fontWeight: 'bold' }}>-</Text>
                </Pressable>
              </View>
            ))}
            <Pressable onPress={addFuncionarioDropdown} style={{ marginTop: 4 }}>
              <Text style={{ color: 'blue' }}>+ Adicionar Funcionário</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.conjuntoFiltros}>
          <Text style={styles.filtroTexto}>Projetos:</Text>
          <View>
            {projetosDropdowns.map((_, idx) => (
              <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <Picker
                  selectedValue={projetosSelecionados[idx] ?? ''}
                  style={{ width: 180, height: 40 }}
                  onValueChange={value => setProjetoSelecionado(idx, value)}
                >
                  <Picker.Item label="Selecione" value="" />
                  {projetos.map(p => (
                    <Picker.Item key={p.projetoId} label={p.nome} value={p.projetoId} />
                  ))}
                </Picker>
                <Pressable onPress={() => removeProjetoDropdown(idx)} style={{ marginLeft: 8 }}>
                  <Text style={{ color: 'red', fontWeight: 'bold' }}>-</Text>
                </Pressable>
              </View>
            ))}
            <Pressable onPress={addProjetoDropdown} style={{ marginTop: 4 }}>
              <Text style={{ color: 'blue' }}>+ Adicionar Projeto</Text>
            </Pressable>
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
                    }))}
                  onAprovacaoChange={fetchData}
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
