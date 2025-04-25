import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './style';

interface Pacote { _id: string; nome: string; }
interface Despesa { _id: string; descricao: string; }

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
        <View style={styles.cardContainer}>
          {despesas.map((d) => (
            <View key={d._id} style={styles.cardItem}>
              <Text>{d.descricao}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
