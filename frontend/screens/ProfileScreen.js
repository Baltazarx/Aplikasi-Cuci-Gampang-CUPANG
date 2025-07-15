import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import axios from 'axios';

const ProfileScreen = ({ navigation }) => {
  const [nama, setNama] = useState('');
  const [alamat, setAlamat] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('http://192.168.1.14:5000/users/me');
        setNama(response.data.user.nama);
        setAlamat(response.data.user.alamat);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        Alert.alert('Error', 'Gagal mengambil data profil.');
      }
    };
    fetchUserProfile();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      const response = await axios.put('http://192.168.1.14:5000/users/update-profile', {
        nama,
        alamat,
      });
      Alert.alert('Update Berhasil', response.data.message);
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Update Gagal', error.response?.data?.message || 'Terjadi kesalahan saat memperbarui profil.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.inner}>
        <View style={styles.card}>
          <Text style={styles.title}>Edit Profil</Text>

          <TextInput
            style={styles.input}
            placeholder="Nama"
            value={nama}
            onChangeText={setNama}
            placeholderTextColor="#999"
          />
          <TextInput
            style={styles.input}
            placeholder="Alamat"
            value={alamat}
            onChangeText={setAlamat}
            placeholderTextColor="#999"
          />

          <TouchableOpacity style={styles.button} onPress={handleUpdateProfile}>
            <Text style={styles.buttonText}>Simpan Perubahan</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eaf0f6',
  },
  inner: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    backgroundColor: '#f7f7f7',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    color: '#333',
  },
  button: {
    backgroundColor: '#1a73e8',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
