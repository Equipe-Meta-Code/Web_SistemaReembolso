import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  wrapper: {
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  tableContainer: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  tableHeader: {
    backgroundColor: '#f2f2f2',
  },
  cardContainer: {
    paddingTop: 10,
  },
  cardItem: {
    marginBottom: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 10,
    backgroundColor: '#fdfdfd',
  },
  cell: {
    flex: 1,
    paddingHorizontal: 6,
  },
  labelContainer: {
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  labelText: {
    fontSize: 14,
    fontWeight: '500',
  },
  projeto: { flex: 2 },
  categoria: { flex: 2 },
  data: { flex: 2 },
  valor: { flex: 1.5 },
  usuario: { flex: 2 },
  descricao: { flex: 2 },
  comprovante: { flex: 2 },
  aprovacao: { flex: 1.5 },
  aprovacaoToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  selectContainer: {
    position: 'absolute',
    top: 40,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    elevation: 4,
    zIndex: 10,
  },
  selectItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  selectItemText: {
    fontSize: 14,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },  
  statusButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginBottom: 10,
  },
  statusButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  statusButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  comprovanteButton: {
    backgroundColor: '#e0e7ff',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  comprovanteButtonText: {
    color: '#3730a3',
    fontWeight: '500',
    fontSize: 13,
  },
  aprovar: {
    display: 'flex',
    flexDirection: 'row',
    
  }
});
