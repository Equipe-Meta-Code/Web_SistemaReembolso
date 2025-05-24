import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  Alert,
  Linking,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import api from '../../services/api';
import styles from './style';

// Mapeamento de cores por categoria
const categoriaCoresFundo: Record<string, string> = { 
  'Alimentação': 'rgba(234, 234, 255, 0.8)',
  'Hospedagem': 'rgba(3, 46, 31, 0.07)',
  'Transporte': 'rgba(52, 163, 238, 0.1)',
  'Serviços Terceirizados': 'rgba(90, 128, 19, 0.1)',
  'Materiais': 'rgba(255, 109, 211, 0.06)',
  'Outros': 'rgba(97, 97, 97, 0.1)',
};    

const categoriaCoresTexto: Record<string, string> = { 
  'Alimentação': 'rgba(58, 8, 196, 0.63)',
  'Hospedagem': 'rgba(6, 58, 40, 0.65)',
  'Transporte': 'rgba(19, 75, 165, 0.67)',
  'Serviços Terceirizados': 'rgba(50, 70, 13, 0.5)',
  'Materiais': 'rgba(160, 3, 95, 0.69)',
  'Outros': 'rgba(54, 52, 52, 0.5)',
};

const statusColors = {
  customizado:               { bg: '#d8d8d8',                     text: '#2c2c2c' },
  aprovado:               { bg: '#d4f5e9',                     text: '#2e7d32' },
  recusado:               { bg: '#ffe5e5',                     text: '#c62828' },
  'aguardando aprovação': { bg: 'rgba(255, 188, 20, 0.21)',     text: 'rgba(214, 154, 1, 0.96)' },
} as const;

type StatusKey = keyof typeof statusColors;

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
  comprovante?: string;
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
  comprovante: string;
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

  // calcula o total de todas as despesas deste pacote
  const valorTotal = despesas.reduce((acc, d) => acc + d.valor_gasto, 0);


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
  const statusKey: StatusKey =
    rawStatus === 'aprovado'
      ? 'aprovado'
      : rawStatus === 'recusado'
      ? 'recusado'
      : 'aguardando aprovação';
  const pacoteColor = statusColors[statusKey];

  const statusTextColor =
    rawStatus === 'aprovado'
      ? statusColors.aprovado.text
      : rawStatus === 'recusado'
      ? statusColors.recusado.text
      : statusColors['aguardando aprovação'].text;

  return (
    <View
      style={[
        styles.wrapper,
        { overflow: 'visible', zIndex: openDespesaId ? 1000 : 0, elevation: openDespesaId ? 20 : 0 },
      ]}
    >
      <TouchableOpacity
        style={styles.header}
        onPress={alternarVisibilidade}
        activeOpacity={0.7}
      >
        <View style={{ flexDirection: 'column', flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <Text style={styles.title}>{pacote.nome}</Text>
            <View style={styles.statusButtonsContainer}>
              <TouchableOpacity
                style={[styles.statusButton, { backgroundColor: statusColors.customizado.bg }]}
                onPress={() => updateStatusPacote('Aprovado')}
              >
                <Text style={[styles.statusButtonText, { color: statusColors.customizado.text }]}>Customizado</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.statusButton, { backgroundColor: statusColors.aprovado.bg }]}
                onPress={() => updateStatusPacote('Aprovado')}
              >
                <Text style={[styles.statusButtonText, { color: statusColors.aprovado.text }]}>Aprovar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.statusButton, { backgroundColor: statusColors.recusado.bg }]}
                onPress={() => updateStatusPacote('Recusado')}
              >
                <Text style={[styles.statusButtonText, { color: statusColors.recusado.text }]}>Rejeitar</Text>
              </TouchableOpacity>

              <Ionicons
                name={visivel ? 'chevron-up-outline' : 'chevron-down-outline'}
                size={24}
                color="#444"
              />
            </View>
          </View>
          {usuario?.name && (
            <Text style={styles.subtitle}>
              <Text style={{ fontWeight: 'bold' }}>Funcionário: </Text>
              {usuario.name}
            </Text>
          )}
          {projeto?.nome && (
            <Text style={styles.subtitle}>
              <Text style={{ fontWeight: 'bold' }}>Projeto: </Text>
              {projeto.nome}
            </Text>
          )}
          <Text style={styles.subtitle}>
            <Text style={{ fontWeight: 'bold' }}>Valor Total: </Text>
            <Text>R$ {valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
          </Text>
          <Text style={styles.subtitle}>
            <Text style={{ fontWeight: 'bold' }}>Status: </Text>
            <Text style={{ color: statusTextColor }}>{pacote.status}</Text>
          </Text>
        </View>
      </TouchableOpacity>

      {visivel && (
        <View style={[isWide ? styles.tableContainer : styles.cardContainer, { overflow: 'visible' }]}>  
          {isWide && (
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.cell, styles.categoria]}>CATEGORIA</Text>
              <Text style={[styles.cell, styles.data]}>DATA</Text>
              <Text style={[styles.cell, styles.valor]}>VALOR</Text>
              <Text style={[styles.cell, styles.descricao]}>DESCRIÇÃO</Text>
              <Text style={[styles.cell, styles.comprovante]}>COMPROVANTE</Text>
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
            const key: StatusKey =
              label === 'Aprovado'
                ? 'aprovado'
                : label === 'Recusado'
                ? 'recusado'
                : 'aguardando aprovação';
            const aprovColor = statusColors[key];

            // Cores dinâmicas por categoria
            const bgCategoria = categoriaCoresFundo[d.categoria] || 'rgba(229, 231, 255, 1)';
            const textCategoria = categoriaCoresTexto[d.categoria] || 'rgba(76, 77, 220, 1)';

            return (
              <View key={d._id} style={isWide ? styles.tableRow : styles.cardItem}>

                <View style={[styles.cell, styles.categoria]}>
                  <Label text={d.categoria} color={{ bg: bgCategoria, text: textCategoria }} />
                </View>

                <Text style={[styles.cell, styles.data]}>
                  {new Date(d.data).toLocaleDateString('pt-BR', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </Text>

                <Text style={[styles.cell, styles.valor]}>R$ {d.valor_gasto.toFixed(2)}</Text>

                <Text style={[styles.cell, styles.descricao]}>{d.descricao}</Text>

                <View style={[styles.cell, styles.descricao]}>

                  <TouchableOpacity
                    style={styles.comprovanteButton}
                    onPress={() => { if (d.comprovante) Linking.openURL(d.comprovante); }}
                  >
                    <Text style={styles.comprovanteButtonText}>Exibir Comprovante</Text>
                  </TouchableOpacity>

                </View>

                <View style={[styles.cell, styles.aprovacao]}>
                  <View style={{ display: 'flex', flexDirection: 'row', position: 'relative' }}>
                    <Label text={label} color={aprovColor} />
                    <TouchableOpacity
                      style={styles.aprovacaoToggle}
                      activeOpacity={0.7}
                    >
                      <AntDesign
                        name="checkcircleo"
                        size={18}
                        style={{ marginLeft: 4 }}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.aprovacaoToggle}
                      activeOpacity={0.7}
                    >
                      <AntDesign
                        name="closecircleo"
                        size={18}
                        style={{ marginLeft: 4 }}
                      />
                    </TouchableOpacity>

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
