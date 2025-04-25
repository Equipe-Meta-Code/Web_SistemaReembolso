import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './style';

const colors = {
  aprovado: { bg: '#d4f5e9', text: '#2e7d32' },
  pendente: { bg: '#fff8e1', text: '#ff9800' },
  recusado: { bg: '#ffe5e5', text: '#c62828' },
};

interface Pacote { _id: string; nome: string; }
interface Despesa {
  _id: string;
  descricao: string;
  data: string;
  valor_gasto: number;
  aprovacao: string;
}

interface CardProps {
  pacote: Pacote;
  despesas: Despesa[];
  visivel: boolean;
  alternarVisibilidade: () => void;
}

const Label: React.FC<{
  text: string;
  color: { bg: string; text: string };
}> = ({ text, color }) => (
  <View style={[styles.labelContainer, { backgroundColor: color.bg }]}>
    <Text style={[styles.labelText, { color: color.text }]}>{text}</Text>
  </View>
);

export default function Card({
  pacote,
  despesas,
  visivel,
  alternarVisibilidade,
}: CardProps) {
  const { width } = useWindowDimensions();
  const isWide = width >= 1130;
  const [openDespesaId, setOpenDespesaId] = useState<string | null>(null);

  const toggleDropdown = (id: string) =>
    setOpenDespesaId((prev) => (prev === id ? null : id));

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
              <Text style={[styles.cell, styles.data]}>DATA</Text>
              <Text style={[styles.cell, styles.valor]}>VALOR</Text>
              <Text style={[styles.cell, styles.descricao]}>DESCRIÇÃO</Text>
              <Text style={[styles.cell, styles.aprovacao]}>APROVAÇÃO</Text>
            </View>
          )}

          {despesas.map((d) => {
            const label = d.aprovacao.toLowerCase() as keyof typeof colors;
            const color = colors[label];

            return (
              <View
                key={d._id}
                style={isWide ? styles.tableRow : styles.cardItem}
              >
                {isWide ? (
                  <>
                    <Text style={[styles.cell, styles.data]}>
                      {new Date(d.data).toLocaleDateString()}
                    </Text>
                    <Text style={[styles.cell, styles.valor]}>
                      {d.valor_gasto.toFixed(2)}
                    </Text>
                    <Text style={[styles.cell, styles.descricao]}>
                      {d.descricao}
                    </Text>
                  </>
                ) : (
                  <Text>{d.descricao}</Text>
                )}
                <View style={[styles.cell, styles.aprovacao]}>
                  <TouchableOpacity
                    style={styles.aprovacaoToggle}
                    onPress={() => toggleDropdown(d._id)}
                    activeOpacity={0.7}
                  >
                    <Label text={d.aprovacao} color={color} />
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
                          onPress={() => {/* placeholder */}}
                        >
                          <Text
                            style={[
                              styles.selectItemText,
                              { color: colors[opt.toLowerCase() as keyof typeof colors].text },
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
            );
          })}
        </View>
      )}
    </View>
  );
}
