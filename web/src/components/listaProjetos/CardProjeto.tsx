import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './style';
import { Projeto } from '../../types/Projeto';
import api from '../../services/api';

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

interface Funcionario {
  _id: string;
  name: string;
  userId: number;
}

interface CardProps {
  projeto: Projeto;
  visivel: boolean;
  alternarVisibilidade: () => void;
  encerrado?: boolean;
  onProjetoAtualizado: () => void;
}

const Label: React.FC<{ text: string; color: { bg: string; text: string } }> = ({
  text,
  color,
}) => (
  <View style={[styles.labelContainer, { backgroundColor: color.bg }]}>  
    <Text style={[styles.labelText, { color: color.text }]}>{text}</Text>
  </View>
);

export default function CardProjeto({
  projeto,
  visivel,
  alternarVisibilidade,
  encerrado,
  onProjetoAtualizado,
}: CardProps) {
  const { width } = useWindowDimensions();
  const isWide = width >= 1220;

  const [verDepartamentos, setVerDepartamentos] = useState(false);
  const [verFuncionarios, setVerFuncionarios] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [todosFuncionarios, setTodosFuncionarios] = useState<Funcionario[]>([]);
  const [selectedFunc, setSelectedFunc] = useState<string>('');
  const [saving, setSaving] = useState(false);

  // Busca todos os usuários
  useEffect(() => {
    api
      .get('/userList')
      .then(res => setTodosFuncionarios(res.data.users))
      .catch(err => console.error('Erro ao buscar funcionários:', err));
  }, []);

  // Filtra usuários que ainda não estão no projeto
  const funcionariosDisponiveis = todosFuncionarios.filter(
    u => !projeto.funcionarios.some(pf => pf.userId === u.userId)
  );

  const adicionarFuncionario = async () => {
    if (!selectedFunc) {
      Alert.alert('Erro', 'Selecione um funcionário.');
      return;
    }
    try {
      setSaving(true);
      const response = await api.put(
        `/projeto/${projeto.projetoId}/funcionarios/adicionar`,
        { funcionarioId: selectedFunc }
      );
      setSaving(false);
      if (response.status >= 200 && response.status < 300) {
        Alert.alert('Sucesso', 'Funcionário adicionado!');
        setShowAdd(false);
        setSelectedFunc('');
        onProjetoAtualizado();
      } else {
        Alert.alert('Erro', 'Falha ao adicionar funcionário.');
      }
    } catch (error) {
      setSaving(false);
      Alert.alert('Erro', 'Falha ao adicionar funcionário.');
      console.error('Erro ao adicionar funcionário:', error);
    }
  };

  const encerrarProjeto = async () => {
    const confirmar = window.confirm(
      `Deseja realmente encerrar o projeto "${projeto.nome}"?`
    );
    if (!confirmar) return;

    try {
      setLoading(true);
      const response = await api.put(
        `/projeto/${projeto.projetoId}/encerrar`
      );
      setLoading(false);
      if (response.status >= 200 && response.status < 300) {
        window.alert('Projeto encerrado com sucesso!');
        onProjetoAtualizado();
      } else {
        window.alert('Falha ao encerrar o projeto.');
      }
    } catch (error) {
      setLoading(false);
      window.alert('Falha ao encerrar o projeto.');
      console.error('Erro ao encerrar projeto:', error);
    }
  };

  return (
    <View style={[styles.wrapper, encerrado && { opacity: 0.5 }]}>      
      <TouchableOpacity
        style={styles.header}
        onPress={alternarVisibilidade}
        activeOpacity={0.7}
      >
        <View style={{ flex: 1 }}>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
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
              <View
                key={cat._id}
                style={[styles.cardItem, { marginBottom: 8 }]}
              >
                <Label text={cat.nome} color={{ bg, text }} />
                <Text style={styles.subtitle}>
                  Valor máximo: R${' '}
                  {cat.valor_maximo.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
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
              name={
                verDepartamentos
                  ? 'chevron-up-outline'
                  : 'chevron-down-outline'
              }
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
              name={
                verFuncionarios
                  ? 'chevron-up-outline'
                  : 'chevron-down-outline'
              }
              size={20}
              color="gray"
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

          {/* Botão encerrar projeto */}
          {!encerrado && (
            <View
              style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}
            >
              <TouchableOpacity
                onPress={() => setShowAdd(!showAdd)}
                style={{ padding: 10, backgroundColor: '#2a8bf2', borderRadius: 6 }}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                  Adicionar Funcionário
                </Text>
              </TouchableOpacity>
              {showAdd && (
                <View
                  style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 12 }}
                >
                  <Picker
                    selectedValue={selectedFunc}
                    style={{ height: 40, width: 180 }}
                    onValueChange={value => setSelectedFunc(value)}
                  >
                    <Picker.Item label="Selecione" value="" />
                    {funcionariosDisponiveis.length > 0
                      ? funcionariosDisponiveis.map(f => (
                          <Picker.Item
                            key={f._id}
                            label={f.name}
                            value={f._id}
                          />
                        ))
                      : (
                          <Picker.Item
                            label="Nenhum funcionário disponível"
                            value=""
                          />
                        )}
                  </Picker>
                  <TouchableOpacity
                    onPress={adicionarFuncionario}
                    style={{
                      marginLeft: 8,
                      padding: 10,
                      backgroundColor: '#28a745',
                      borderRadius: 6,
                    }}
                    disabled={saving}
                  >
                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                      {saving ? 'Salvando...' : 'Salvar'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}

          {!encerrado && (
            <TouchableOpacity
              onPress={encerrarProjeto}
              style={{
                marginTop: 30,
                paddingVertical: 10,
                backgroundColor: '#555',
                borderRadius: 6,
                alignItems: 'center',
              }}
              disabled={loading}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                {loading ? 'Encerrando...' : 'Encerrar Projeto'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}
