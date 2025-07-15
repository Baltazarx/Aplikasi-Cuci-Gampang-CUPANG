import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Alert,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import axios from 'axios';

const UserVehiclesScreen = ({ navigation }) => {
  const [vehicles, setVehicles] = useState([]);
  const [merk, setMerk] = useState('');
  const [model, setModel] = useState('');
  const [nomorPolisi, setNomorPolisi] = useState('');
  const [jenis, setJenis] = useState('');
  const [editingVehicleId, setEditingVehicleId] = useState(null);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await axios.get('http://192.168.1.14:5000/users/kendaraan');
      setVehicles(response.data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      Alert.alert('Error', 'Gagal mengambil data kendaraan.');
    }
  };

  const handleAddVehicle = async () => {
    try {
      const response = await axios.post('http://192.168.1.14:5000/users/kendaraan', {
        merk,
        model,
        nomor_polisi: nomorPolisi,
        jenis,
      });
      Alert.alert('Berhasil', response.data.message || 'Kendaraan berhasil ditambahkan.');
      resetForm();
      fetchVehicles();
    } catch (error) {
      console.error('Error adding vehicle:', error);
      Alert.alert('Error', error.response?.data?.message || 'Gagal menambah kendaraan.');
    }
  };

  const handleEditPress = (vehicle) => {
    setEditingVehicleId(vehicle.id);
    setMerk(vehicle.merk);
    setModel(vehicle.model);
    setNomorPolisi(vehicle.nomor_polisi);
    setJenis(vehicle.jenis);
  };

  const handleUpdateVehicle = async () => {
    try {
      const response = await axios.put(
        `http://192.168.1.14:5000/users/kendaraan/${editingVehicleId}`,
        {
          merk,
          model,
          nomor_polisi: nomorPolisi,
          jenis,
        }
      );
      Alert.alert('Berhasil', response.data.message || 'Kendaraan berhasil diupdate.');
      resetForm();
      fetchVehicles();
    } catch (error) {
      console.error('Error updating vehicle:', error);
      Alert.alert('Error', error.response?.data?.message || 'Gagal mengupdate kendaraan.');
    }
  };

  const handleDeleteVehicle = async (id) => {
    try {
      const response = await axios.delete(`http://192.168.1.14:5000/users/kendaraan/${id}`);
      Alert.alert('Berhasil', response.data.message || 'Kendaraan berhasil dihapus.');
      fetchVehicles();
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      Alert.alert('Error', error.response?.data?.message || 'Gagal menghapus kendaraan.');
    }
  };

  const resetForm = () => {
    setEditingVehicleId(null);
    setMerk('');
    setModel('');
    setNomorPolisi('');
    setJenis('');
  };

  const renderItem = ({ item }) => (
    <View style={styles.vehicleCard}>
      <Text style={styles.vehicleText}>🚗 Merk: {item.merk}</Text>
      <Text style={styles.vehicleText}>📄 Model: {item.model}</Text>
      <Text style={styles.vehicleText}>🔢 No. Polisi: {item.nomor_polisi}</Text>
      <Text style={styles.vehicleText}>📘 Jenis: {item.jenis}</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.editButton} onPress={() => handleEditPress(item)}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteVehicle(item.id)}>
          <Text style={styles.buttonText}>Hapus</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <>
            <Text style={styles.title}>
              {editingVehicleId ? '✏️ Edit Kendaraan' : '🚘 Kendaraan Saya'}
            </Text>
            <TextInput style={styles.input} placeholder="Merk" value={merk} onChangeText={setMerk} />
            <TextInput style={styles.input} placeholder="Model" value={model} onChangeText={setModel} />
            <TextInput style={styles.input} placeholder="Nomor Polisi" value={nomorPolisi} onChangeText={setNomorPolisi} />
            <TextInput style={styles.input} placeholder="Jenis" value={jenis} onChangeText={setJenis} />
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={editingVehicleId ? handleUpdateVehicle : handleAddVehicle}
            >
              <Text style={styles.buttonText}>
                {editingVehicleId ? 'Update Kendaraan' : 'Tambah Kendaraan'}
              </Text>
            </TouchableOpacity>
            {editingVehicleId && (
              <TouchableOpacity style={styles.cancelButton} onPress={resetForm}>
                <Text style={styles.buttonText}>Batal Edit</Text>
              </TouchableOpacity>
            )}
          </>
        }
        data={vehicles}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#1a73e8',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  primaryButton: {
    backgroundColor: '#1a73e8',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: 'orange',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  editButton: {
    backgroundColor: '#34a853',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#ea4335',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  vehicleCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  vehicleText: {
    fontSize: 16,
    marginBottom: 4,
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
});

export default UserVehiclesScreen;
