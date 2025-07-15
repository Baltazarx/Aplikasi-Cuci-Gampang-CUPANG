import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const AdminDashboardScreen = ({ navigation }) => {
  const DashboardButton = ({ title, emoji, onPress }) => (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{emoji} {title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📊 Dasbor Admin</Text>
      
      <View style={styles.buttonGroup}>
        <DashboardButton
          title="Kelola Pesanan"
          emoji="🧾"
          onPress={() => navigation.navigate('AdminOrders')}
        />
        <DashboardButton
          title="Lihat Ratings"
          emoji="⭐"
          onPress={() => navigation.navigate('AdminRatings')}
        />
        <DashboardButton
          title="Kelola Pengguna"
          emoji="👥"
          onPress={() => navigation.navigate('AdminUsers')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f8fb',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1a73e8',
    marginBottom: 30,
    textAlign: 'center',
  },
  buttonGroup: {
    width: '100%',
    gap: 16,
  },
  button: {
    backgroundColor: '#1a73e8',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default AdminDashboardScreen;
