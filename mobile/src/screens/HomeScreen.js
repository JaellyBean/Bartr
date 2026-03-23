import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const MOCK_SERVICES = [
  { id: '1', user: 'Alice M.', offer: 'Plumbing Repair', need: 'Web Design' },
  { id: '2', user: 'Bob S.', offer: 'Photography', need: 'Guitar Lessons' },
  { id: '3', user: 'Charlie D.', offer: 'Math Tutoring', need: 'Cooking Lessons' },
  { id: '4', user: 'Diana F.', offer: 'Graphic Design', need: 'Handyman Help' },
];

export default function HomeScreen({ navigation }) {
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.avatar}><Text style={styles.avatarText}>{item.user[0]}</Text></View>
        <Text style={styles.userName}>{item.user}</Text>
      </View>
      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Offers:</Text>
          <Text style={styles.infoText}>{item.offer}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Needs:</Text>
          <Text style={styles.infoText}>{item.need}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.tradeButton}>
        <Text style={styles.tradeButtonText}>Propose Trade</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Explore Services</Text>
        <Text style={styles.subtitle}>Find what you need in your community</Text>
      </View>
      <FlatList
        data={MOCK_SERVICES}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030712',
  },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#111827',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#9ca3af',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#818cf8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  userName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  cardBody: {
    marginBottom: 20,
    backgroundColor: '#030712',
    padding: 16,
    borderRadius: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  infoLabel: {
    color: '#9ca3af',
    fontSize: 14,
    width: 60,
  },
  infoText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  tradeButton: {
    backgroundColor: '#4f46e5',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  tradeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
