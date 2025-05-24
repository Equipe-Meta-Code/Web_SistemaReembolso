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

// Cores de status, incluindo 'Aprovado Parcialmente'
const statusColors = {
  customizado:              { bg: '#d8d8d8',                 text: '#2c2c2c' },
  aprovado:                 { bg: '#d4f5e9',                 text: '#2e7d32' },
  recusado:                 { bg: '#ffe5e5',                 text: '#c62828' },
  'aguardando aprovação':  { bg: 'rgba(255, 188, 20, 0.21)', text: 'rgba(214, 154, 1, 0.96)' },
  'aprovado parcialmente': { bg: '#fff3cd',                 text: '#856404' },
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
interface Usuario { name: string; }

interface CardProps {
  pacote: Pacote;
  despesas: Despesa[];
  projeto?: Projeto;
  usuario?: Usuario;
  visivel: boolean;
  alternarVisibilidade: () => void;
  onAprovacaoChange: () => void;
}

// Label que indica status e customização
const Label: React.FC<{ text: string; color: { bg: string; text: string }; customized?: boolean }> = ({ text, color, customized = false }) => (
  <View style={[styles.labelContainer, { backgroundColor: color.bg, flexDirection: 'row', alignItems: 'center' }]}>  
    <Text style={[styles.labelText, { color: color.text }]}>{text}</Text>
    {customized && <View style={styles.customBadge} />}
  </View>
);

export default function Card({ pacote, despesas, projeto, usuario, visivel, alternarVisibilidade, onAprovacaoChange, }: CardProps) {
  const { width } = useWindowDimensions();
  const isWide = width >= 1220;

  const [customMode, setCustomMode] = useState(false);
  const [localApprovals, setLocalApprovals] = useState<Record<string, 'Aprovado' | 'Recusado'>>({});

  const valorTotal = despesas.reduce((acc, d) => acc + d.valor_gasto, 0);
  const allSelected = despesas.length > 0 && despesas.every(d => localApprovals[d._id] !== undefined);

  // Deriva o status do pacote considerando seleções locais
  const deriveStatus = (): string => {
    if (customMode && Object.keys(localApprovals).length === despesas.length) {
      const vals = Object.values(localApprovals);
      if (vals.every(v => v === 'Aprovado')) return 'Aprovado';
      if (vals.every(v => v === 'Recusado')) return 'Recusado';
      return 'Aprovado Parcialmente';
    }
    return pacote.status;
  };
  const displayStatus = deriveStatus();
  const statusKey = displayStatus.trim().toLowerCase() as StatusKey;

  const toggleApproval = (id: string, aprov: 'Aprovado' | 'Recusado') => {
    setLocalApprovals(prev => ({ ...prev, [id]: aprov }));
  };

  const handleSaveAll = async () => {
    try {
      await Promise.all(
        Object.entries(localApprovals).map(([id, aprov]) => api.put(`/despesa/${id}`, { aprovacao: aprov }))
      );
      await api.put(`/pacote/${pacote.pacoteId}/status`, { status: displayStatus });
      setCustomMode(false);
      setLocalApprovals({});
      onAprovacaoChange();
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Não foi possível salvar aprovações.');
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

  return (
    <View style={[styles.wrapper, { overflow: 'visible' }]}>      
      <TouchableOpacity style={styles.header} onPress={alternarVisibilidade} activeOpacity={0.7}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={styles.title}>{pacote.nome}</Text>
            <View style={styles.statusButtonsContainer}>
              {!customMode ? (
                <TouchableOpacity style={[styles.statusButton, { backgroundColor: statusColors.customizado.bg }]} onPress={() => setCustomMode(true)}>
                  <Text style={[styles.statusButtonText, { color: statusColors.customizado.text }]}>Customizar</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={[styles.statusButton, { backgroundColor: statusColors.customizado.bg }]} onPress={handleSaveAll} disabled={!allSelected}>
                  <Text style={[styles.statusButtonText, { color: statusColors.customizado.text }]}>Salvar</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={[styles.statusButton, { backgroundColor: statusColors.aprovado.bg }]} onPress={() => updateStatusPacote('Aprovado')}>
                <Text style={[styles.statusButtonText, { color: statusColors.aprovado.text }]}>Aprovar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.statusButton, { backgroundColor: statusColors.recusado.bg }]} onPress={() => updateStatusPacote('Recusado')}>
                <Text style={[styles.statusButtonText, { color: statusColors.recusado.text }]}>Rejeitar</Text>
              </TouchableOpacity>
              <Ionicons name={visivel ? 'chevron-up-outline' : 'chevron-down-outline'} size={24} color="#444" />
            </View>
          </View>
          {usuario?.name && <Text style={styles.subtitle}><Text style={{ fontWeight: 'bold' }}>Funcionário: </Text>{usuario.name}</Text>}
          {projeto?.nome && <Text style={styles.subtitle}><Text style={{ fontWeight: 'bold' }}>Projeto: </Text>{projeto.nome}</Text>}
          <Text style={styles.subtitle}><Text style={{ fontWeight: 'bold' }}>Valor Total: </Text>R$ {valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
          <Text style={styles.subtitle}><Text style={{ fontWeight: 'bold' }}>Status: </Text><Text style={{ color: statusColors[statusKey].text }}>{displayStatus}</Text></Text>
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
            const local = localApprovals[d._id];
            const labelText = local || d.aprovacao;
            const labelKey = labelText.toLowerCase() as StatusKey;
            const aprovColor = statusColors[labelKey];
            const bgCategoria = categoriaCoresFundo[d.categoria] || 'rgba(229, 231, 255, 1)';
            const textCategoria = categoriaCoresTexto[d.categoria] || 'rgba(76, 77, 220, 1)';

            return (
              <View key={d._id} style={isWide ? styles.tableRow : styles.cardItem}>
                <View style={[styles.cell, styles.categoria]}><Label text={d.categoria} color={{ bg: bgCategoria, text: textCategoria }} /></View>
                <Text style={[styles.cell, styles.data]}>{new Date(d.data).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}</Text>
                <Text style={[styles.cell, styles.valor]}>R$ {d.valor_gasto.toFixed(2)}</Text>
                <Text style={[styles.cell, styles.descricao]}>{d.descricao}</Text>
                <View style={[styles.cell, styles.comprovante]}>
                  <TouchableOpacity style={styles.comprovanteButton} onPress={() => d.comprovante && Linking.openURL(d.comprovante)}>
                    <Text style={styles.comprovanteButtonText}>Exibir Comprovante</Text>
                  </TouchableOpacity>
                </View>
                <View style={[styles.cell, styles.aprovacao]}>
                  {customMode ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      {/* Mostra label customizado antes dos ícones */}
                      <Label text={labelText} color={aprovColor} customized={!!local} />
                      <TouchableOpacity style={styles.aprovacaoToggle} onPress={() => toggleApproval(d._id, 'Aprovado')}>
                        <AntDesign name="checkcircleo" size={18} />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.aprovacaoToggle} onPress={() => toggleApproval(d._id, 'Recusado')}>
                        <AntDesign name="closecircleo" size={18} />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <Label text={labelText} color={aprovColor} />
                  )}
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}
