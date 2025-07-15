import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';

const AdminUsersScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://192.168.1.14:5000/admin/users', {
        withCredentials: true,
      });
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err);
      setLoading(false);
      Alert.alert('Error', 'Gagal mengambil data pengguna.');
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1a73e8" />
        <Text>Memuat pengguna...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>Terjadi kesalahan: {error.message}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchUsers}>
          <Text style={styles.retryButtonText}>🔄 Coba Lagi</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.userCard}>
      <Text style={styles.userName}>👤 {item.nama}</Text>
      <Text style={styles.userInfo}>📧 {item.email}</Text>
      <Text style={styles.userInfo}>📱 {item.no_telepon}</Text>
      <Text style={styles.userInfo}>🏠 {item.alamat}</Text>
      <Text style={styles.userRole}>🛡️ Role: <Text style={styles.roleText}>{item.role}</Text></Text>
      <Text style={styles.userId}>ID Pengguna: {item.id}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👥 Daftar Pengguna</Text>
      {users.length === 0 ? (
        <Text style={styles.emptyText}>Belum ada data pengguna.</Text>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f8fb',
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#1a73e8',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#777',
  },
  userCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  userInfo: {
    fontSize: 14,
    marginBottom: 3,
    color: '#444',
  },
  userRole: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
  },
  roleText: {
    textTransform: 'capitalize',
    color: '#1a73e8',
  },
  userId: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  retryButton: {
    marginTop: 12,
    backgroundColor: '#1a73e8',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default AdminUsersScreen;
