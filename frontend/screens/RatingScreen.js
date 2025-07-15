import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';

const RatingScreen = ({ navigation }) => {
  const route = useRoute();
  const { pesananId } = route.params;

  const [rating, setRating] = useState('5'); // Default rating
  const [ulasan, setUlasan] = useState('');

  const handleSubmitRating = async () => {
    if (!rating || !ulasan) {
      Alert.alert('Peringatan', 'Harap isi rating dan ulasan.');
      return;
    }

    try {
      const response = await axios.post('http://192.168.1.14:5000/ratings', {
        pesanan_id: pesananId,
        rating: parseInt(rating),
        ulasan,
      }, { withCredentials: true });

      Alert.alert('Rating Berhasil', response.data.message || 'Rating berhasil ditambahkan.');
      navigation.goBack(); // Kembali ke layar sebelumnya (MyOrdersScreen)
    } catch (error) {
      console.error('Error submitting rating:', error);
      Alert.alert('Rating Gagal', error.response?.data?.message || 'Terjadi kesalahan saat mengirim rating.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Beri Rating untuk Pesanan ID: {pesananId}</Text>

      <Text style={styles.label}>Rating (1-5):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        maxLength={1}
        value={rating}
        onChangeText={(text) => setRating(text.replace(/[^1-5]/g, ''))} // Hanya angka 1-5
      />

      <Text style={styles.label}>Ulasan:</Text>
      <TextInput
        style={[styles.input, styles.ulasanInput]}
        placeholder="Tulis ulasan Anda..."
        multiline
        numberOfLines={4}
        value={ulasan}
        onChangeText={setUlasan}
      />

      <Button title="Kirim Rating" onPress={handleSubmitRating} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  ulasanInput: {
    height: 100,
    textAlignVertical: 'top',
  },
});

export default RatingScreen; 