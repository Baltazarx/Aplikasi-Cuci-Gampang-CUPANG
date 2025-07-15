import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import axios from 'axios';

const AdminRatingsScreen = ({ navigation }) => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRatings();
  }, []);

  const fetchRatings = async () => {
    try {
      const response = await axios.get('http://192.168.18.118:5000/admin/ratings', {
        withCredentials: true,
      });
      setRatings(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching ratings:', err);
      setError(err);
      setLoading(false);
      Alert.alert('Error', 'Gagal mengambil data rating.');
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1a73e8" />
        <Text>Memuat ratings...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>Terjadi kesalahan: {error.message}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchRatings}>
          <Text style={styles.retryButtonText}>🔄 Coba Lagi</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.ratingCard}>
      <Text style={styles.ratingTitle}>⭐ {item.rating} / 5</Text>
      <Text style={styles.ratingText}>👤 {item.nama_pelanggan}</Text>
      <Text style={styles.ratingText}>🧼 Paket: {item.nama_paket}</Text>
      <Text style={styles.ratingText}>💬 Ulasan: {item.ulasan || 'Tidak ada ulasan.'}</Text>
      <Text style={styles.ratingDate}>🕒 {new Date(item.created_at).toLocaleString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📝 Daftar Rating Pelanggan</Text>
      {ratings.length === 0 ? (
        <Text style={styles.emptyText}>Belum ada rating dari pelanggan.</Text>
      ) : (
        <FlatList
          data={ratings}
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
  ratingCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  ratingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#fbc02d',
  },
  ratingText: {
    fontSize: 14,
    marginBottom: 4,
    color: '#333',
  },
  ratingDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 6,
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

export default AdminRatingsScreen;
