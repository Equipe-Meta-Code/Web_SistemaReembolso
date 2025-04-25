// src/components/listaDespesas/Card.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import api from '../../services/api';
import styles from './style';

const colors = {
  aprovado: { bg: '#d4f5e9', text: '#2e7d32' },
  pendente: { bg: '#fff8e1', text: '#ff9800' },
  recusado: { bg: '#ffe5e5', text: '#c62828' },
};

interface Pacote   { _id: string; nome: string; }
interface Despesa  {
  _id: string;
  data: string;
  valor_gasto: number;
  descricao: string;
  aprovacao: string;
}
interface Projeto  { nome: string; }
interface Categoria{ nome: string; }
interface Usuario  { name: string; }

interface CardProps {
  pacote: Pacote;
  despesas: Despesa[];
  projeto?: Projeto;
  categoria?: Categoria;
  usuario?: Usuario;
  visivel: boolean;
  alternarVisibilidade: () => void;
  onAprovacaoChange: () => void;  // Nova prop
}

const Label: React.FC<{ text: string; color: { bg: string; text: string } }> = ({
  text,
  color,
}) => (
  <View style={[styles.labelContainer, { backgroundColor: color.bg }]}>
    <Text style={[styles.labelText, { color: color.text }]}>{text}</Text>
  </View>
);

export default function Card({
  pacote,
  despesas,
  projeto,
  categoria,
  usuario,
  visivel,
  alternarVisibilidade,
  onAprovacaoChange,
}: CardProps) {
  const { width } = useWindowDimensions();
  const isWide = width >= 1130;
  const [openDespesaId, setOpenDespesaId] = useState<string | null>(null);

  const toggleDropdown = (id: string) =>
    setOpenDespesaId((prev) => (prev === id ? null : id));

  const updateAprovacao = async (id: string, aprov: string) => {
    try {
      await api.put(`/despesa/${id}`, { aprovacao: aprov });
      setOpenDespesaId(null);
      onAprovacaoChange();   // 4) Recarrega a lista
    } catch (err) {
      console.error('Erro ao atualizar aprovação:', err);
    }
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={styles.header}
        onPress={alternarVisibilidade}
        activeOpacity={0.7}
      >
        <Text style={styles.title}>{pacote.nome}</Text>
        <Ionicons
          name={visivel ? 'chevron-up-outline' : 'chevron-down-outline'}
          size={24}
          color="#444"
        />
      </TouchableOpacity>

      {visivel && (
        <View style={isWide ? styles.tableContainer : styles.cardContainer}>
          {isWide && (
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.cell, styles.projeto]}>PROJETO</Text>
              <Text style={[styles.cell, styles.categoria]}>CATEGORIA</Text>
              <Text style={[styles.cell, styles.data]}>DATA</Text>
              <Text style={[styles.cell, styles.valor]}>VALOR</Text>
              <Text style={[styles.cell, styles.usuario]}>FUNCIONÁRIO</Text>
              <Text style={[styles.cell, styles.descricao]}>DESCRIÇÃO</Text>
              <Text style={[styles.cell, styles.aprovacao]}>APROVAÇÃO</Text>
            </View>
          )}

          {/* Linhas de despesas */}
          {despesas.map((d) => {
            const label =
              d.aprovacao === 'Aprovado'
                ? 'Aprovado'
                : d.aprovacao === 'Pendente'
                ? 'Pendente'
                : 'Recusado';
            const color = colors[label.toLowerCase() as keyof typeof colors];

            return (
              <View
                key={d._id}
                style={isWide ? styles.tableRow : styles.cardItem}
              >
                <Text style={[styles.cell, styles.projeto]}>
                  {projeto?.nome ?? '-'}
                </Text>
                <View style={[styles.cell, styles.categoria]}>
                  <Label
                    text={categoria?.nome ?? '-'}
                    color={{ bg: '#e5e7ff', text: '#4c4ddc' }}
                  />
                </View>
                <Text style={[styles.cell, styles.data]}>
                  {new Date(d.data).toLocaleDateString('pt-BR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </Text>
                <Text style={[styles.cell, styles.valor]}>
                  R$ {d.valor_gasto.toFixed(2)}
                </Text>
                <Text style={[styles.cell, styles.usuario]}>
                  {usuario?.name ?? '-'}
                </Text>
                <Text style={[styles.cell, styles.descricao]}>
                  {d.descricao}
                </Text>

                {/* Coluna de aprovação */}
                <View style={[styles.cell, styles.aprovacao]}>
                  <View style={{ position: 'relative' }}>
                    <TouchableOpacity
                      style={styles.aprovacaoToggle}
                      onPress={() => toggleDropdown(d._id)}
                      activeOpacity={0.7}
                    >
                      <Label text={label} color={color} />
                      <Ionicons
                        name="chevron-down-outline"
                        size={16}
                        style={{ marginLeft: 4 }}
                      />
                    </TouchableOpacity>

                    {openDespesaId === d._id && (
                      <View style={styles.selectContainer}>
                        {['Aprovado', 'Pendente', 'Recusado'].map((opt) => (
                          <TouchableOpacity
                            key={opt}
                            style={styles.selectItem}
                            onPress={() => updateAprovacao(d._id, opt)}
                          >
                            <Text
                              style={[
                                styles.selectItemText,
                                {
                                  color:
                                    colors[opt.toLowerCase() as keyof typeof colors]
                                      .text,
                                },
                              ]}
                            >
                              {opt}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}
