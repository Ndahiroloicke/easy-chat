import React, { useEffect, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TextInputProps,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
} from "react-native";

import { images, FONTS, COLORS, data } from "../../constants";
import { useTheme } from "../../Themes/ThemeProvider";
import AppModal from "../AppModal";
import { responseType } from "../../constants/types";
import { areaData } from "../../constants/countries";

interface Props extends TextInputProps {
  handleSelectedCountry: (country: responseType) => void;
}

const PhoneInput: React.FC<Props> = ({
  handleSelectedCountry,
  ...textInputProps
}) => {
  const { dark } = useTheme();

  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [currentstate, setcurrentstate] = useState<responseType>(data.Rwanda);
  const [areas, setareas] = useState<responseType[]>(areaData);
  const [modalVisible, setModalVisible] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };
  const handleVisibility = () => {
    setModalVisible(false);
  };

  const renderItem = (item: responseType) => {
    return (
      <TouchableOpacity
        style={{
          padding: 10,
          flexDirection: "row",
        }}
        onPress={() => {
          setcurrentstate(item), setModalVisible(false);
          handleSelectedCountry(item);
        }}
      >
        <View style={styles.countryCodeNumber}>
          <Text>+{item.callingCodes[0]}</Text>
        </View>
        <Image
          source={{ uri: item.flags.png }}
          style={{
            height: 25,
            width: 40,
            marginRight: 10,
          }}
        />

        <Text style={{ fontSize: 16 }}>{item.name}</Text>
      </TouchableOpacity>
    );
  };
  return (
    <>
      <View style={[styles.inputContainer, isFocused && styles.onfocus]}>
        <View style={styles.phoneSelector}>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={styles.currentCountry}
          >
            <Image
              source={{ uri: currentstate?.flags.png }}
              width={30}
              height={25}
            />
            <MaterialCommunityIcons name="chevron-down" size={24} />
          </TouchableOpacity>
        </View>
        <TextInput
          placeholderTextColor={COLORS.secondaryGray}
          autoCapitalize="none"
          keyboardType="numeric"
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={styles.text}
          {...textInputProps}
        />
      </View>
      <AppModal visible={modalVisible} handleVisibility={handleVisibility}>
        <View style={styles.modal}>
          <View
            style={[
              styles.countryCode,
              { backgroundColor: dark ? COLORS.black : COLORS.white },
            ]}
          >
            <FlatList
              data={areas}
              keyExtractor={(item) => item.alpha2Code}
              renderItem={({ item }) => renderItem(item)}
            />
          </View>
        </View>
      </AppModal>
    </>
  );
};
const styles = StyleSheet.create({
  inputContainer: {
    width: "100%",
    backgroundColor: "#FAFAFA",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 13,
    marginVertical: 10,
    fontFamily: "Regular",
    borderWidth: 2,
    borderColor: "#FAFAFA",
  },
  text: {
    fontSize: 18,
    flex: 1,
  },
  onfocus: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  phoneSelector: {
    height: "100%",
  },
  countryCode: {
    width: "100%",
    padding: 20,
    borderRadius: 10,
  },
  modal: {
    paddingVertical: 100,
  },
  countryCodeNumber: {
    width: 40,
  },
  currentCountry: {
    flexDirection: "row",
  },
});

export default PhoneInput;
