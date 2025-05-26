import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './style';
import { Projeto } from '../../types/Projeto';

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

interface CardProps {
  projeto: Projeto;
  visivel: boolean;
  alternarVisibilidade: () => void;
}

const Label: React.FC<{ text: string; color: { bg: string; text: string } }> = ({ text, color }) => (
  <View style={[styles.labelContainer, { backgroundColor: color.bg }]}>
    <Text style={[styles.labelText, { color: color.text }]}>{text}</Text>
  </View>
);

export default function CardProjeto({
  projeto,
  visivel,
  alternarVisibilidade,
}: CardProps) {
  const { width } = useWindowDimensions();
  const isWide = width >= 1220;

  const [verDepartamentos, setVerDepartamentos] = useState(false);
  const [verFuncionarios, setVerFuncionarios] = useState(false);

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={styles.header}
        onPress={alternarVisibilidade}
        activeOpacity={0.7}
      >
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.title}>{projeto.nome}</Text>
            <Ionicons
              name={visivel ? 'chevron-up-outline' : 'chevron-down-outline'}
              size={24}
              color="#444"
            />
          </View>
          <Text style={styles.subtitle}>
            <Text style={{ fontWeight: 'bold' }}>Descrição: </Text>
            {projeto.descricao}
          </Text>
          <Text style={styles.subtitle}>
            <Text style={{ fontWeight: 'bold' }}>Criado em: </Text>
            {new Date(projeto.createdAt).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}
          </Text>
        </View>
      </TouchableOpacity>

      {visivel && (
        <View style={isWide ? styles.tableContainer : styles.cardContainer}>
          {/* Categorias */}
          <Text style={[styles.tituloSecao, { marginTop: 16 }]}>Categorias</Text>
          {projeto.categorias.map(cat => {
            const bg = categoriaCoresFundo[cat.nome] || 'rgba(229, 231, 255, 1)';
            const text = categoriaCoresTexto[cat.nome] || 'rgba(76, 77, 220, 1)';
            return (
              <View key={cat._id} style={[styles.cardItem, { marginBottom: 8 }]}>
                <Label text={cat.nome} color={{ bg, text }} />
                <Text style={styles.subtitle}>
                  Valor máximo: R$ {cat.valor_maximo.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Text>
              </View>
            );
          })}

          {/* Departamentos */}
          <TouchableOpacity
            onPress={() => setVerDepartamentos(!verDepartamentos)}
            style={styles.sectionToggle}
          >
            <Text style={styles.tituloSecao}>Departamentos</Text>
            <Ionicons
              name={verDepartamentos ? 'chevron-up-outline' : 'chevron-down-outline'}
              size={20}
              color="#555"
              style={{ marginLeft: 4 }}
            />
          </TouchableOpacity>
          {verDepartamentos && (
            <View style={{ marginBottom: 12 }}>
              {projeto.departamentos.map(dep => (
                <View key={dep._id} style={styles.cardItem}>
                  <Text style={styles.subtitle}>• {dep.nome}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Funcionários */}
          <TouchableOpacity
            onPress={() => setVerFuncionarios(!verFuncionarios)}
            style={styles.sectionToggle}
          >
            <Text style={styles.tituloSecao}>Funcionários</Text>
            <Ionicons
              name={verFuncionarios ? 'chevron-up-outline' : 'chevron-down-outline'}
              size={20}
              color="#555"
              style={{ marginLeft: 4 }}
            />
          </TouchableOpacity>
          {verFuncionarios && (
            <View style={{ marginBottom: 8 }}>
              {projeto.funcionarios.map(func => (
                <View key={func._id} style={styles.cardItem}>
                  <Text style={styles.subtitle}>• {func.name}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
}
