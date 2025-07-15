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

const MyOrdersScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const fetchMyOrders = async () => {
    try {
      const response = await axios.get('http://192.168.18.118:5000/pesanan/me', {
        withCredentials: true,
      });
      setOrders(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching my orders:', err);
      setError(err);
      setLoading(false);
      Alert.alert('Error', 'Gagal mengambil data pesanan Anda.');
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1a73e8" />
        <Text style={{ marginTop: 10 }}>Memuat pesanan...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: 'red', marginBottom: 10 }}>
          Terjadi kesalahan: {error.message}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchMyOrders}>
          <Text style={styles.buttonText}>Coba Lagi</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.orderCard}>
      <Text style={styles.orderLabel}>🆔 ID: <Text style={styles.orderValue}>{item.id}</Text></Text>
      <Text style={styles.orderLabel}>🚘 Nopol: <Text style={styles.orderValue}>{item.nomor_polisi}</Text></Text>
      <Text style={styles.orderLabel}>🧽 Paket: <Text style={styles.orderValue}>{item.nama_paket}</Text></Text>
      <Text style={styles.orderLabel}>💰 Harga: <Text style={styles.orderValue}>Rp{item.harga_paket}</Text></Text>
      <Text style={styles.orderLabel}>📦 Total: <Text style={styles.orderValue}>Rp{item.total_harga}</Text></Text>
      <Text style={styles.orderLabel}>📍 Lokasi: <Text style={styles.orderValue}>{item.lokasi}</Text></Text>
      <Text style={styles.orderLabel}>📊 Status: <Text style={[styles.orderValue, { fontWeight: 'bold' }]}>{item.status}</Text></Text>
      <Text style={styles.orderLabel}>🕒 Dibuat: <Text style={styles.orderValue}>{new Date(item.created_at).toLocaleString()}</Text></Text>

      {item.status === 'selesai' && (
        <TouchableOpacity
          style={styles.ratingButton}
          onPress={() => navigation.navigate('Rating', { pesananId: item.id })}
        >
          <Text style={styles.buttonText}>Beri Rating</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📋 Pesanan Saya</Text>
      {orders.length === 0 ? (
        <Text style={{ textAlign: 'center', color: '#777' }}>Anda belum memiliki pesanan.</Text>
      ) : (
        <FlatList
          data={orders}
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
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1a73e8',
    marginBottom: 20,
    textAlign: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  retryButton: {
    backgroundColor: '#1a73e8',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  orderCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  orderLabel: {
    fontSize: 16,
    color: '#555',
    marginBottom: 4,
  },
  orderValue: {
    fontWeight: '600',
    color: '#333',
  },
  ratingButton: {
    backgroundColor: '#34a853',
    marginTop: 12,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default MyOrdersScreen;
