import { COLOR } from "@/constants/colorPalette";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    backgroundColor: COLOR.primary,
    padding: 20,
    borderRadius: 15,
    shadowColor: COLOR.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 10,
  },
  profileSection: {
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#FFFFFF',
  },
  details: {
    fontSize: 14,
    marginBottom: 4,
    color: '#F0F0F0',
    opacity: 0.9,
  },
  quoteSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)', 
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FFFFFF',
  },
  quoteText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#FFFFFF',
    lineHeight: 22,
    marginBottom: 8,
  },
  quoteAuthor: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
    textAlign: 'right',
    fontStyle: 'italic',
  },
  loadingText: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 10,
    opacity: 0.8,
  },
});