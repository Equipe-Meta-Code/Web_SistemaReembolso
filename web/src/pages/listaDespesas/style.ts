// src/pages/listaDespesas/style.ts
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  pagina: {
    padding: 10,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 24,
  },
  tituloSecao: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  filtros: {
    marginBottom: 16,
  },
  conjuntoFiltros: {
    marginVertical: 8,
  },
  filtroTexto: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  opcoesFiltro: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  containerOpcao: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  filtroSelecionado: {
    backgroundColor: '#007AFF33',
    borderColor: '#007AFF',
  },
  textoOpcao: {
    fontSize: 12,
    color: '#333',
  },
  textoFiltroSelecionado: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
  },
  selecaoFiltro: {
    width: 180,
    padding: 10,
    borderRadius: 20,
    marginTop: 10,
    alignItems: 'center',
  },
  botaoAdicionarFiltro: {
    color: '#1F48AA',
  },
});
