import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import DatePicker from "react-native-modern-datepicker";

import { useTheme } from "../../Themes/ThemeProvider";
import { COLORS, FONTS } from "../../constants";
import Button from "../Button";
import { useFormikContext } from "formik";

type inputProp = {
  handleDateselection: (date: string) => void;
};
const AppDatePicker: React.FC<inputProp> = ({ handleDateselection }) => {
  const { dark } = useTheme();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState("2007/03/09");
  const [startedDate, setStartedDate] = useState("2024/6/4");

  function handleChangeStartDate(propDate: string) {
    setStartedDate(propDate);
  }

  const handleModal = () => {
    setIsModalOpen((prev) => !prev);
  };
  return (
    <>
      <TouchableOpacity style={[styles.inputContainer]} onPress={handleModal}>
        <Text style={styles.text}>{selectedDate}</Text>
        <MaterialCommunityIcons
          name="calendar"
          size={24}
          color={COLORS.primary}
        />
      </TouchableOpacity>
      <Modal
        animationType="fade"
        visible={isModalOpen}
        transparent
        statusBarTranslucent
      >
        <TouchableOpacity style={[styles.modalBg]}>
          <View
            style={[
              styles.dateContainer,
              { backgroundColor: dark ? COLORS.black : COLORS.white },
            ]}
          >
            <DatePicker
              mode="calendar"
              selected={startedDate}
              onDateChange={handleChangeStartDate}
              onSelectedChange={(date) => {
                setSelectedDate(date);
                handleDateselection(date);
              }}
              options={{
                backgroundColor: dark ? COLORS.black : COLORS.white,
                textHeaderColor: COLORS.primary,
                textDefaultColor: dark ? COLORS.white : COLORS.black,
                selectedTextColor: COLORS.black,
                mainColor: COLORS.primary,
                textSecondaryColor: dark ? COLORS.white : COLORS.black,
                borderColor: "rgba(122, 146, 165, 0.1)",
              }}
            />
            <View style={{ flexDirection: "row" }}>
              <Button title="close" onpress={handleModal} />
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default AppDatePicker;

const styles = StyleSheet.create({
  inputContainer: {
    width: "100%",
    backgroundColor: "#FAFAFA",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    padding: 13,
    marginVertical: 10,
    fontFamily: "Regular",
    borderWidth: 2,
    borderColor: "#FAFAFA",
  },
  text: {
    ...FONTS.body8,
    opacity: 0.6,
  },
  modalBg: {
    width: "100%",
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  dateContainer: {
    margin: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    padding: 35,
    width: "90%",
  },
  onfocus: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
});
