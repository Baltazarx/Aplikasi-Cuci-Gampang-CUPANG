import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Alert,
  ActivityIndicator,
  Button,
  StyleSheet,
} from 'react-native';
import { Picker } from '@react-native-picker/picker'; // ✅ Perbaikan utama
import axios from 'axios';

const PaketCuciScreen = ({ navigation }) => {
  const [paketCuci, setPaketCuci] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [ratingSummaries, setRatingSummaries] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedPaket, setSelectedPaket] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const paketResponse = await axios.get('http://192.168.18.118:5000/paket-cuci', { withCredentials: true });
      const vehicleResponse = await axios.get('http://192.168.18.118:5000/users/kendaraan', { withCredentials: true });
      const ratingSummaryResponse = await axios.get('http://192.168.18.118:5000/ratings/summary/paket', { withCredentials: true });

      setPaketCuci(paketResponse.data);
      setVehicles(vehicleResponse.data);
      setRatingSummaries(ratingSummaryResponse.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Gagal mengambil data.');
      setLoading(false);
    }
  };

  const handleCreatePesanan = async () => {
    if (!selectedPaket || !selectedVehicle) {
      Alert.alert('Peringatan', 'Harap pilih paket cuci dan kendaraan Anda.');
      return;
    }

    try {
      const response = await axios.post(
        'http://192.168.18.118:5000/pesanan',
        {
          paket_cuci_id: selectedPaket,
          kendaraan_id: selectedVehicle,
        },
        { withCredentials: true }
      );
      Alert.alert('Pesanan Berhasil', response.data.message);
      navigation.navigate('MyOrders');
    } catch (error) {
      console.error('Error creating order:', error);
      Alert.alert('Pesanan Gagal', error.response?.data?.message || 'Terjadi kesalahan saat membuat pesanan.');
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1a73e8" />
        <Text>Memuat data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pilih Paket Cuci & Kendaraan</Text>

      <Text style={styles.sectionTitle}>Pilih Paket Cuci:</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={selectedPaket}
          onValueChange={(itemValue) => setSelectedPaket(itemValue)}
        >
          <Picker.Item label="-- Pilih Paket Cuci --" value={null} />
          {paketCuci.map((paket) => (
            <Picker.Item key={paket.id} label={`${paket.nama_paket} (Rp${paket.harga})`} value={paket.id} />
          ))}
        </Picker>
      </View>

      <Text style={styles.sectionTitle}>Pilih Kendaraan:</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={selectedVehicle}
          onValueChange={(itemValue) => setSelectedVehicle(itemValue)}
        >
          <Picker.Item label="-- Pilih Kendaraan --" value={null} />
          {vehicles.map((vehicle) => (
            <Picker.Item key={vehicle.id} label={`${vehicle.merk} - ${vehicle.nomor_polisi}`} value={vehicle.id} />
          ))}
        </Picker>
      </View>

      <Button title="Buat Pesanan" onPress={handleCreatePesanan} disabled={!selectedPaket || !selectedVehicle} />

      <Text style={styles.sectionTitle}>Daftar Paket Cuci:</Text>
      <FlatList
        data={paketCuci}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.paketItem}>
            <Text style={styles.paketText}>🧽 {item.nama_paket}</Text>
            <Text style={styles.paketText}>💸 Rp{item.harga}</Text>
            <Text style={styles.paketText}>📝 {item.deskripsi}</Text>
            {ratingSummaries[item.id] && (
              <Text style={styles.ratingText}>
                ⭐ {ratingSummaries[item.id].rata_rating} ({ratingSummaries[item.id].total_ulasan} ulasan)
              </Text>
            )}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f8fb',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a73e8',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
  },
  pickerWrapper: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 10,
  },
  paketItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  paketText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#777',
  },
});

export default PaketCuciScreen;
