import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    color: '#333',
  },
  memoryList: {
    paddingBottom: 80,
  },
  memoryCard: {
    backgroundColor: '#f9f9f9',
    padding: 14,
    borderRadius: 12,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  memoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
    color: '#222',
  },
  memoryDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  memoryMeta: {
    fontSize: 12,
    color: '#777',
    marginBottom: 10,
  },
  mediaContainer: {
    flexDirection: 'row',
  },
  mediaWrapper: {
    marginRight: 10,
  },
  mediaImage: {
    width: 160,
    height: 120,
    borderRadius: 8,
    backgroundColor: '#ddd',
  },
  mediaPlaceholder: {
    width: 160,
    height: 120,
    borderRadius: 8,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    marginTop: 50,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#888',
  },
  backLink: {
    marginTop: 20,
    alignSelf: 'center',
  },
  backText: {
    fontSize: 16,
    color: '#007bff',
  },
});
