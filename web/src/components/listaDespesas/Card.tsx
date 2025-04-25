import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './style';

interface Pacote { _id: string; nome: string; }
interface Despesa {
  _id: string;
  descricao: string;
  data: string;
  valor_gasto: number;
}

interface CardProps {
  pacote: Pacote;
  despesas: Despesa[];
  visivel: boolean;
  alternarVisibilidade: () => void;
}

export default function Card({
  pacote,
  despesas,
  visivel,
  alternarVisibilidade,
}: CardProps) {
  const { width } = useWindowDimensions();
  const isWide = width >= 1130;

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
            </View>
          )}
          {despesas.map((d) => (
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
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
