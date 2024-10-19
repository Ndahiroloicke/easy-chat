import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Entypo, MaterialIcons } from '@expo/vector-icons';

interface MenuModalProps {
  visible: boolean;
  onClose: () => void;
}

const MenuModal: React.FC<MenuModalProps> = ({ visible, onClose }) => {
  const menuItems = [
    { id: '1', name: 'Profile', icon: <MaterialIcons name="person" size={24} color="#000" /> },
    { id: '2', name: 'Chat', icon: <Entypo name="chat" size={24} color="#000" /> },
    { id: '3', name: 'Communication', icon: <Entypo name="message" size={24} color="#000" /> },
    { id: '4', name: 'Announcements', icon: <Entypo name="megaphone" size={24} color="#000" /> },
    { id: '5', name: 'Publications', icon: <Entypo name="book" size={24} color="#000" /> },
  ];

  const handlePress = (name: string) => {
    // You can handle navigation here based on the item pressed
    console.log(`${name} clicked`);
    onClose(); // Close the modal after an item is clicked
  };

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
      </TouchableOpacity> j'  
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
