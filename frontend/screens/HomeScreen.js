import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';

const HomeScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://192.168.1.14:5000/auth/me');
        setUser(response.data.user);
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'Gagal mengambil data pengguna.');
        navigation.replace('Login');
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('http://192.168.1.14:5000/auth/logout');
      Alert.alert('Logout Berhasil', 'Anda telah berhasil keluar.');
      navigation.replace('Login');
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Logout Gagal', error.response?.data?.message || 'Terjadi kesalahan saat logout.');
    }
  };

  const CustomButton = ({ title, onPress }) => (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Selamat Datang</Text>
      {user ? (
        <View style={styles.card}>
          <Text style={styles.userName}>{user.nama}</Text>
          <Text style={styles.userInfo}>📧 {user.email}</Text>
          <Text style={styles.userInfo}>🛡️ {user.role}</Text>
          <Text style={styles.userInfo}>📍 {user.alamat}</Text>

          <View style={styles.buttonGroup}>
            {user.role === 'admin' ? (
              <>
                <CustomButton title="✏️ Edit Profil" onPress={() => navigation.navigate('Profile')} />
                <CustomButton title="🧾 Kelola Pesanan" onPress={() => navigation.navigate('AdminOrders')} />
                <CustomButton title="⭐ Lihat Ratings" onPress={() => navigation.navigate('AdminRatings')} />
                <CustomButton title="👥 Kelola Pengguna" onPress={() => navigation.navigate('AdminUsers')} />
                <CustomButton title="🚪 Logout" onPress={handleLogout} />
              </>
            ) : (
              <>
                <CustomButton title="✏️ Edit Profil" onPress={() => navigation.navigate('Profile')} />
                <CustomButton title="🚘 Kendaraan Saya" onPress={() => navigation.navigate('MyVehicles')} />
                <CustomButton title="📦 Pesanan Saya" onPress={() => navigation.navigate('MyOrders')} />
                <CustomButton title="🧽 Pesan Cuci Mobil" onPress={() => navigation.navigate('PaketCuci')} />
                <CustomButton title="🚪 Logout" onPress={handleLogout} />
              </>
            )}
          </View>
        </View>
      ) : (
        <Text style={{ fontSize: 16 }}>Memuat data pengguna...</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f0f4f7',
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1a73e8',
  },
  userInfo: {
    fontSize: 16,
    marginBottom: 4,
    color: '#555',
  },
  buttonGroup: {
    marginTop: 20,
  },
  button: {
    backgroundColor: '#1a73e8',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginVertical: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default HomeScreen;
