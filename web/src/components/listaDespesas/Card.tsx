import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import api from '../../services/api';
import styles from './style';

const colors = {
  aprovado:               { bg: '#d4f5e9',                     text: '#2e7d32' },
  recusado:               { bg: '#ffe5e5',                     text: '#c62828' },
  'aguardando aprovação': { bg: 'rgba(255, 188, 20, 0.21)',     text: 'rgba(214, 154, 1, 0.96)' },
} as const;

type ColorKey = keyof typeof colors;

interface Pacote {
  _id: string;
  pacoteId: number;
  nome: string;
  status: string;
}

interface Despesa {
  _id: string;
  data: string;
  valor_gasto: number;
  descricao: string;
  aprovacao: string;
  categoria: string;
}

interface Projeto { nome: string; }
interface Categoria { nome: string; }
interface Usuario { name: string; }

interface CardProps {
  pacote: Pacote;
  despesas: Despesa[];
  projeto?: Projeto;
  categoria?: Categoria;
  usuario?: Usuario;
  visivel: boolean;
  alternarVisibilidade: () => void;
  onAprovacaoChange: () => void;
}

const Label: React.FC<{ text: string; color: { bg: string; text: string } }> = ({ text, color }) => (
  <View style={[styles.labelContainer, { backgroundColor: color.bg }]}>
    <Text style={[styles.labelText, { color: color.text }]}>{text}</Text>
  </View>
);

export default function Card({
  pacote,
  despesas,
  projeto,
  usuario,
  visivel,
  alternarVisibilidade,
  onAprovacaoChange,
}: CardProps) {
  const { width } = useWindowDimensions();
  const isWide = width >= 1220;
  const [openDespesaId, setOpenDespesaId] = useState<string | null>(null);

  const toggleDropdown = (id: string) =>
    setOpenDespesaId(prev => (prev === id ? null : id));

  const updateAprovacao = async (id: string, aprov: string) => {
    try {
      await api.put(`/despesa/${id}`, { aprovacao: aprov });
      setOpenDespesaId(null);
      onAprovacaoChange();
    } catch (err) {
      console.error('Erro ao atualizar aprovação:', err);
    }
  };

  const updateStatusPacote = async (status: 'Aprovado' | 'Recusado') => {
    try {
      await api.put(`/pacote/${pacote.pacoteId}/status`, { status });
      await Promise.all(
        despesas.map(d => api.put(`/despesa/${d._id}`, { aprovacao: status }))
      );
      onAprovacaoChange();
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Não foi possível atualizar o pacote ou suas despesas.');
    }
  };

  const rawStatus = pacote.status.trim().toLowerCase();
  const statusKey: ColorKey =
    rawStatus === 'aprovado'
      ? 'aprovado'
      : rawStatus === 'recusado'
      ? 'recusado'
      : 'aguardando aprovação';
  const statusColor = colors[statusKey];

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={styles.header}
        onPress={alternarVisibilidade}
        activeOpacity={0.7}
      >
        <View style={{ flexDirection: 'column', flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.title}>{pacote.nome}</Text>
            <Label text={pacote.status} color={statusColor} />
          </View>
          {usuario?.name && (
            <Text style={styles.subtitle}>Funcionário: {usuario.name}</Text>
          )}
          {projeto?.nome && (
            <Text style={styles.subtitle}>Projeto: {projeto.nome}</Text>
          )}
        </View>

        <View style={styles.statusButtonsContainer}>
          <TouchableOpacity
            style={[styles.statusButton, { backgroundColor: colors.aprovado.bg }]}
            onPress={() => updateStatusPacote('Aprovado')}
          >
            <Text style={[styles.statusButtonText, { color: colors.aprovado.text }]}>
              Aprovar
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.statusButton, { backgroundColor: colors.recusado.bg }]}
            onPress={() => updateStatusPacote('Recusado')}
          >
            <Text style={[styles.statusButtonText, { color: colors.recusado.text }]}>
              Rejeitar
            </Text>
          </TouchableOpacity>
          <Ionicons
            name={visivel ? 'chevron-up-outline' : 'chevron-down-outline'}
            size={24}
            color="#444"
          />
        </View>
      </TouchableOpacity>

      {visivel && (
        <View style={isWide ? styles.tableContainer : styles.cardContainer}>

          {isWide && (
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.cell, styles.categoria]}>CATEGORIA</Text>
              <Text style={[styles.cell, styles.data]}>DATA</Text>
              <Text style={[styles.cell, styles.valor]}>VALOR</Text>
              <Text style={[styles.cell, styles.descricao]}>DESCRIÇÃO</Text>
              <Text style={[styles.cell, styles.aprovacao]}>APROVAÇÃO</Text>
            </View>
          )}

          {despesas.map(d => {
            const label =
              d.aprovacao === 'Aprovado'
                ? 'Aprovado'
                : d.aprovacao === 'Recusado'
                ? 'Recusado'
                : 'Pendente';
            const key: ColorKey =
              label === 'Aprovado'
                ? 'aprovado'
                : label === 'Recusado'
                ? 'recusado'
                : 'aguardando aprovação';

            const color = colors[key];

            return (
              <View key={d._id} style={isWide ? styles.tableRow : styles.cardItem}>
                <View style={[styles.cell, styles.categoria]}>
                  <Label text={d.categoria} color={{ bg: '#e5e7ff', text: '#4c4ddc' }} />
                </View>
                <Text style={[styles.cell, styles.data]}>
                  {new Date(d.data).toLocaleDateString('pt-BR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </Text>
                <Text style={[styles.cell, styles.valor]}>R$ {d.valor_gasto.toFixed(2)}</Text>
                <Text style={[styles.cell, styles.descricao]}>{d.descricao}</Text>

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
                        {['Aprovado', 'Pendente', 'Recusado'].map(opt => (
                          <TouchableOpacity
                            key={opt}
                            style={styles.selectItem}
                            onPress={() => updateAprovacao(d._id, opt)}
                          >
                            <Text
                              style={[
                                styles.selectItemText,
                                {
                                  color: colors[
                                    opt === 'Pendente'
                                      ? 'aguardando aprovação'
                                      : (opt.toLowerCase() as ColorKey)
                                  ].text,
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
