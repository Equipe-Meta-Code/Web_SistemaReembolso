import React, { useState, useMemo, useEffect} from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import api from '../../services/api'; 
import {
    Card,
    TextInput,
    Button,
    Title,
    Searchbar,
    List,
    IconButton,
    DataTable,
} from 'react-native-paper';



export default function ListaDespesas() {

    interface Despesa {
        _id: string;
        projetoId: string;
        userId: string;
        categoria: string;
        data: string;
        valor_gasto: number;
        descricao: string;
        aprovacao: string;
    }

    const [despesas, setDespesas] = useState<Despesa[]>([]);

    useEffect(() => {
        const fetchDespesas = async () => {
          try {
            const response = await api.get("/despesa");
            const todasDespesas: Despesa[] = response.data;


            setDespesas(todasDespesas);

            console.log('Despesas sem filtro:', response.data)
            console.log('Despesas filtradas:', despesas)
          } catch (err) {
            console.error("Erro ao carregar despesas", err);
          } finally {
            console.log("Carregou as despesas");
          }
        };
        fetchDespesas();
    }, []);
    

    return (
        <View >
            
        </View>
    );
}
