// src/pages/listaDespesas/ListaDespesas.tsx
import React, { useEffect, useState } from 'react';
import { ScrollView, Text } from 'react-native';
import Card from '../../components/listaDespesas/Card';
import api from '../../services/api';

interface Pacote {
  _id: string;
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
}

interface Categoria {
  _id: string;
  nome: string;
  categoriaId?: number;
}

interface Usuario {
  _id: string;
  name: string;
  userId?: number;
}

interface Projeto {
  _id: string;
  nome: string;
  projetoId?: number;
}

const ListaDespesas: React.FC = () => {
  const [pacotes, setPacotes] = useState<Pacote[]>([]);
  const [despesas, setDespesas] = useState<Despesa[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [mostrarPacote, setMostrarPacote] = useState<Record<string, boolean>>({});

  // 1) Função de fetch em escopo para poder reaplicar após mudanças
  const fetchData = async () => {
    try {
      const [
        resPacotes,
        resDespesas,
        resCategorias,
        resUsuarios,
        resProjetos,
      ] = await Promise.all([
        api.get<Pacote[]>('/pacote'),
        api.get<Despesa[]>('/despesa'),
        api.get<Categoria[]>('/categorias'),
        api.get<{ users: Usuario[] }>('/userList'),
        api.get<Projeto[]>('/projeto'),
      ]);

      setPacotes(resPacotes.data ?? []);
      setDespesas(resDespesas.data ?? []); 
      setCategorias(resCategorias.data ?? []);
      setUsuarios(resUsuarios.data.users ?? []);
      setProjetos(resProjetos.data ?? []);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  };

  // 2) Carrega ao montar
  useEffect(() => {
    fetchData();
  }, []);

  // Utils
  const getProjeto = (id: number) =>
    projetos.find((p) => p.projetoId === id);

  const getCategoria = (catId: string) =>
    categorias.find((c) => c._id === catId || c.categoriaId === Number(catId));

  const getUsuario = (id: number) =>
    usuarios.find((u) => u.userId === id);

  const alternarVisibilidade = (pacoteId: string) => {
    setMostrarPacote((prev) => ({
      ...prev,
      [pacoteId]: !prev[pacoteId],
    }));
  };

  if (!Array.isArray(pacotes)) {
    return <Text>Carregando pacotes...</Text>;
  }

  return (
    <ScrollView>
      {pacotes.map((pacote) => {
        const despesasRelacionadas = despesas.filter((d) =>
          pacote.despesas.includes(d.despesaId)
        );

        return (
          <Card
            key={pacote._id}
            pacote={pacote}
            despesas={despesasRelacionadas}
            projeto={getProjeto(pacote.projetoId)}
            categoria={getCategoria(despesasRelacionadas[0]?.categoria ?? '')}
            usuario={getUsuario(pacote.userId)}
            visivel={!!mostrarPacote[pacote._id]}
            alternarVisibilidade={() => alternarVisibilidade(pacote._id)}
            onAprovacaoChange={fetchData}         // 3) Passa a função
          />
        );
      })}
    </ScrollView>
  );
};

export default ListaDespesas;
