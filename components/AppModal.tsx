import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Animated } from "react-native";
type ModalProps = {
  visible: boolean;
  children: React.ReactNode;
  handleVisibility:()=>void;
};
const AppModal: React.FC<ModalProps> = ({ visible, children,handleVisibility }) => {
  const [isVisible, setIsvisible] = useState(visible);
  const scaleValue = React.useRef(new Animated.Value(0)).current;
  const toggleModal = () => {
    if (visible) {
      setIsvisible(true);
      Animated.spring(scaleValue, {
        toValue: 1,
        delay: 200,
        useNativeDriver: true,
      }).start();
    } else {
      setIsvisible(false);
    }
  };

  useEffect(() => {
    toggleModal();
  }, [visible]);
  return (
    <Modal transparent statusBarTranslucent visible={isVisible}>
      <TouchableOpacity style={[styles.modalBg]} onPress={()=>handleVisibility()}>
        <Animated.View
          style={[
            styles.modalContainer,
            { transform: [{ scale: scaleValue }] },
          ]}
        >
          {children}
        </Animated.View>
      </TouchableOpacity>
      <StatusBar style="inverted" />
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBg: {
    width: "100%",
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
  },
});
export default AppModal;
