import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import axios from 'axios';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { FontAwesome } from '@expo/vector-icons';

WebBrowser.maybeCompleteAuthSession();

const GOOGLE_WEB_CLIENT_ID = '629949434744-frmf71vh8cc8d7oe5be5lpf1r33f70hl.apps.googleusercontent.com';
const GOOGLE_ANDROID_CLIENT_ID = '629949434744-rlusjbrlejtva63esct1ole1pklqrbbg.apps.googleusercontent.com';
const GOOGLE_IOS_CLIENT_ID = 'GANTI_DENGAN_CLIENT_ID_IOS_ANDA.apps.googleusercontent.com';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: GOOGLE_WEB_CLIENT_ID,
    androidClientId: GOOGLE_ANDROID_CLIENT_ID,
    iosClientId: GOOGLE_IOS_CLIENT_ID,
    webClientId: GOOGLE_WEB_CLIENT_ID,
  });

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      sendGoogleTokenToBackend(authentication.idToken);
    }
  }, [response]);

  const sendGoogleTokenToBackend = async (idToken) => {
    try {
      const backendResponse = await axios.post(
        'http://192.168.1.14:5000/auth/google',
        { idToken },
        { withCredentials: true }
      );

      Alert.alert('Login Berhasil', backendResponse.data.message);
      navigation.replace('Home');
    } catch (error) {
      console.error('Error sending Google token to backend:', error);
      Alert.alert('Login Gagal', error.response?.data?.message || 'Terjadi kesalahan saat login dengan Google.');
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://192.168.1.14:5000/auth/login', {
        email,
        password,
      });
      Alert.alert('Login Berhasil', response.data.message);
      navigation.replace('Home');
    } catch (error) {
      console.error('Error logging in:', error);
      Alert.alert('Login Gagal', error.response?.data?.message || 'Terjadi kesalahan saat login.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Masuk ke Akun Anda</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#999"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#999"
        />

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.registerButtonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.googleLoginButton}
          disabled={!request}
          onPress={() => promptAsync()}
        >
          <View style={styles.iconButtonContent}>
            <FontAwesome name="google" size={20} color="#fff" style={styles.icon} />
            <Text style={styles.googleLoginButtonText}>Login with Google</Text>
          </View>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eaf0f6',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#1a1a1a',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f7f7f7',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    color: '#333',
  },
  loginButton: {
    backgroundColor: '#1a73e8',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 4, // Mengurangi jarak bawah
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  googleLoginButton: {
    backgroundColor: '#db4437',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 4, // Mengurangi jarak atas
    marginBottom: 8, // Tetap 8 untuk memisahkan dari bottom of card
  },
  googleLoginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  iconButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 10,
  },
  registerButton: {
    backgroundColor: '#34a853',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 4, // Mengurangi jarak atas
    marginBottom: 4, // Mengurangi jarak bawah
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
