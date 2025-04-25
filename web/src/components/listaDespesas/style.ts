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
    marginBottom: 8,
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
  data: {
    flex: 2,
  },
  valor: {
    flex: 1.5,
  },
  descricao: {
    flex: 3,
  },
});
