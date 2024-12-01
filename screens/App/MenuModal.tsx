import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, FlatList, ToastAndroid } from 'react-native';
import { Entypo, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import routes from '../../Navigation/routes';
import { AuthScreenNavigatorProps } from '../../constants/types';
import { auth } from '../../utils/firebase.config';
import { signOut } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface MenuModalProps {
  visible: boolean;
  onClose: () => void;
}

const MenuModal: React.FC<MenuModalProps> = ({ visible, onClose }) => {
  const navigation = useNavigation<AuthScreenNavigatorProps>();
  
  const handleSignOut = async () => {
    try {
      // Sign out from Firebase
      await signOut(auth);
      
      // Clear all relevant AsyncStorage items
      await AsyncStorage.multiRemove([
        'userPassword',
        'profileImage',
        'userData',
        // add any other keys you need to clear
      ]);

      // Force navigation reset to Auth stack
      navigation.reset({
        index: 0,
        routes: [{ name: 'Auth', params: { screen: 'Login' } }],
      });

      ToastAndroid.show('Cerrado sesión con éxito', ToastAndroid.SHORT);
    } catch (error) {
      console.error('Error signing out:', error);
      ToastAndroid.show('Error al cerrar sesión', ToastAndroid.SHORT);
    }
  };

  const handlePress = async (name: string) => {
    if (name === 'Cerrar sesión') {
      await handleSignOut();
    } else {
      console.log(`${name} clicked`);
    }
    onClose();
  };

  const menuItems = [
    { id: '1', name: 'Perfil', icon: <MaterialIcons name="person" size={24} color="#000" /> },
    { id: '2', name: 'Chat', icon: <Entypo name="chat" size={24} color="#000" /> },
    { id: '3', name: 'Comunicación', icon: <Entypo name="message" size={24} color="#000" /> },
    { id: '4', name: 'Anuncios', icon: <Entypo name="megaphone" size={24} color="#000" /> },
    { id: '5', name: 'Publicaciones', icon: <Entypo name="book" size={24} color="#000" /> },
    { id: '6', name: 'Cerrar sesión', icon: <Entypo name="log-out" size={24} color="#000" /> },
  ];

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.modalOverlay} onPress={onClose}>
        <View style={styles.modalContent}>
          <FlatList
            data={menuItems}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.menuItem} onPress={() => handlePress(item.name)}>
                {item.icon}
                <Text style={styles.menuText}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
  },
  modalContent: {
    position: 'absolute',
    top: 100,
    right: 10,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  menuText: {
    marginLeft: 10,
    fontSize: 18,
    color: '#000',
  },
});

export default MenuModal;
