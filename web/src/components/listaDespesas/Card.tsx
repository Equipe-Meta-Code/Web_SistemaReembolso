import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './style';

interface CardProps {
  pacote: { _id: string; nome: string };
  visivel: boolean;
  alternarVisibilidade: () => void;
}

export default function Card({
  pacote,
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
          <Text>No expenses yet.</Text>
        </View>
      )}
    </View>
  );
}
