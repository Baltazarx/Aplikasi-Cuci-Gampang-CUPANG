import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import axios from 'axios';

const RegisterScreen = ({ navigation }) => {
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [noTelepon, setNoTelepon] = useState('');
  const [alamat, setAlamat] = useState('');

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://192.168.18.118:5000/auth/register', {
        nama,
        email,
        password,
        no_telepon: noTelepon,
        alamat,
        role: 'user',
      });
      Alert.alert('Registrasi Berhasil', response.data.message);
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error registering:', error);
      Alert.alert(
        'Registrasi Gagal',
        error.response?.data?.message || 'Terjadi kesalahan saat registrasi.'
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Buat Akun Baru</Text>

      <TextInput
        style={styles.input}
        placeholder="Nama Lengkap"
        value={nama}
        onChangeText={setNama}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Nomor Telepon"
        value={noTelepon}
        onChangeText={setNoTelepon}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Alamat"
        value={alamat}
        onChangeText={setAlamat}
      />

      <TouchableOpacity style={styles.primaryButton} onPress={handleRegister}>
        <Text style={styles.buttonText}>Daftar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.linkText}>Sudah punya akun? Login di sini</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 25,
    backgroundColor: '#f4f8fb',
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#1a73e8',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  primaryButton: {
    backgroundColor: '#1a73e8',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkText: {
    textAlign: 'center',
    color: '#1a73e8',
    fontSize: 14,
  },
});

export default RegisterScreen;
