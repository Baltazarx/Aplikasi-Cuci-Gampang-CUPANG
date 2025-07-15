import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import screens
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import UserVehiclesScreen from './screens/UserVehiclesScreen';
import MyOrdersScreen from './screens/MyOrdersScreen';
import PaketCuciScreen from './screens/PaketCuciScreen';
import RatingScreen from './screens/RatingScreen';
import AdminDashboardScreen from './screens/AdminDashboardScreen';
import AdminOrdersScreen from './screens/AdminOrdersScreen';
import AdminRatingsScreen from './screens/AdminRatingsScreen';
import AdminUsersScreen from './screens/AdminUsersScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {/* Public Routes */}
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />

        {/* Authenticated Routes */}
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="MyVehicles" component={UserVehiclesScreen} options={{ title: 'Kendaraan Saya' }} />
        <Stack.Screen name="MyOrders" component={MyOrdersScreen} options={{ title: 'Pesanan Saya' }} />
        <Stack.Screen name="PaketCuci" component={PaketCuciScreen} options={{ title: 'Pesan Cuci' }} />
        <Stack.Screen name="Rating" component={RatingScreen} options={{ title: 'Beri Rating' }} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} options={{ title: 'Dasbor Admin' }} />
        <Stack.Screen name="AdminOrders" component={AdminOrdersScreen} options={{ title: 'Kelola Pesanan' }} />
        <Stack.Screen name="AdminRatings" component={AdminRatingsScreen} options={{ title: 'Daftar Ratings Admin' }} />
        <Stack.Screen name="AdminUsers" component={AdminUsersScreen} options={{ title: 'Kelola Pengguna Admin' }} />
        {/* Tambahkan rute terautentikasi lainnya di sini */}
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
