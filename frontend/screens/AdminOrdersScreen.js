import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TextInput,
  TouchableOpacity
} from 'react-native';
import axios from 'axios';

const AdminOrdersScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://192.168.18.118:5000/admin/pesanan', { withCredentials: true });
      setOrders(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err);
      setLoading(false);
      Alert.alert('Error', 'Gagal mengambil data pesanan.');
    }
  };

  const handleUpdateStatus = async (id) => {
    try {
      await axios.put(
        `http://192.168.18.118:5000/admin/pesanan/${id}/status`,
        { status: newStatus },
        { withCredentials: true }
      );
      Alert.alert('✅ Berhasil', 'Status pesanan berhasil diupdate.');
      setEditingOrderId(null);
      setNewStatus('');
      fetchOrders();
    } catch (error) {
      console.error('Error updating status:', error);
      Alert.alert('❌ Error', error.response?.data?.message || 'Gagal mengupdate status pesanan.');
    }
  };

  const handleDeleteOrder = async (id) => {
    try {
      await axios.delete(`http://192.168.18.118:5000/admin/pesanan/${id}`, { withCredentials: true });
      Alert.alert('✅ Berhasil', 'Pesanan berhasil dihapus.');
      fetchOrders();
    } catch (error) {
      console.error('Error deleting order:', error);
      Alert.alert('❌ Error', error.response?.data?.message || 'Gagal menghapus pesanan.');
    }
  };

  const ActionButton = ({ title, color, onPress }) => (
    <TouchableOpacity style={[styles.actionButton, { backgroundColor: color }]} onPress={onPress}>
      <Text style={styles.actionButtonText}>{title}</Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => (
    <View style={styles.orderCard}>
      <Text style={styles.orderTitle}>🧾 Pesanan #{item.id}</Text>
      <Text style={styles.orderText}>👤 Pelanggan: {item.nama_pelanggan}</Text>
      <Text style={styles.orderText}>🚘 Nomor Polisi: {item.nomor_polisi}</Text>
      <Text style={styles.orderText}>🧼 Paket: {item.nama_paket}</Text>
      <Text style={styles.orderText}>📍 Lokasi: {item.lokasi}</Text>
      <Text style={styles.orderText}>💰 Total: Rp{item.total_harga}</Text>
      <Text style={styles.orderText}>📌 Status: {item.status}</Text>
      <Text style={styles.orderText}>🕒 Dibuat: {new Date(item.created_at).toLocaleString()}</Text>

      {editingOrderId === item.id ? (
        <View style={styles.editContainer}>
          <TextInput
            style={styles.input}
            placeholder="Status Baru"
            value={newStatus}
            onChangeText={setNewStatus}
          />
          <ActionButton title="💾 Simpan" color="#1a73e8" onPress={() => handleUpdateStatus(item.id)} />
          <ActionButton title="❌ Batal" color="#fbbc05" onPress={() => { setEditingOrderId(null); setNewStatus(''); }} />
        </View>
      ) : (
        <View style={styles.buttonRow}>
          <ActionButton title="✏️ Ubah Status" color="#34a853" onPress={() => { setEditingOrderId(item.id); setNewStatus(item.status); }} />
          <ActionButton title="🗑️ Hapus" color="#ea4335" onPress={() => handleDeleteOrder(item.id)} />
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1a73e8" />
        <Text>Memuat pesanan...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>Terjadi kesalahan: {error.message}</Text>
        <ActionButton title="🔄 Coba Lagi" color="#1a73e8" onPress={fetchOrders} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📋 Kelola Pesanan</Text>
      {orders.length === 0 ? (
        <Text style={styles.emptyText}>Tidak ada pesanan untuk ditampilkan.</Text>
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1a73e8',
    marginBottom: 20,
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
  },
  orderCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  orderText: {
    fontSize: 14,
    marginBottom: 4,
    color: '#555',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginVertical: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  editContainer: {
    marginTop: 10,
  },
});

export default AdminOrdersScreen;
