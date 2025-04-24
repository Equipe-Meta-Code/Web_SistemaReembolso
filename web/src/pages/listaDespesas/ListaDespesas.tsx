import React, { useState, useEffect } from 'react';
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

    interface Pacote {
        _id: string;
        nome: string;
        projetoId: string;
        status: string;
        userId: string;
        despesas: string[];
    }

    const [despesas, setDespesas] = useState<Despesa[]>([]);
    const [pacotes, setPacotes] = useState<Pacote[]>([]);

    useEffect(() => {

        const fetchPacotes = async () => {
            try {
                const response = await api.get("/pacote");
                const listaPacotes: Pacote[] = response.data;

                setPacotes(listaPacotes);
                console.log('Pacotes:', listaPacotes);
            } catch (error) {
                console.error("Erro ao carregar pacotes", error);
            }
        };

        const fetchDespesas = async () => {
          try {
            const response = await api.get("/despesa");
            const todasDespesas: Despesa[] = response.data;

            setDespesas(todasDespesas);

            console.log('Despesas filtradas:', despesas)
          } catch (err) {
            console.error("Erro ao carregar despesas", err);
          } finally {
            console.log("Carregou as despesas");
          }
        };

        fetchPacotes();
        fetchDespesas();
    }, []);

    return (
        <View>
            {/* Renderizar pacotes ou despesas aqui */}
        </View>
    );
}
