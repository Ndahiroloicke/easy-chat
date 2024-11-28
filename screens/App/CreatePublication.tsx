import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { Picker } from "@react-native-picker/picker";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../utils/firebase.config";
import { Ionicons } from "@expo/vector-icons";
import { getUserData } from "../../utils/AuthStorage";

interface CreatePublicationProps {
  onClose: () => void;
  profileImage: string | null | undefined;
}

const validationSchema = Yup.object().shape({
  type: Yup.string().required("Por favor selecciona oferta o demanda."),
  subcategory: Yup.string().required("La subcategoría es requerida."),
  city: Yup.string().required("La ciudad es requerida."),
  province: Yup.string().required("La provincia es requerida."),
  distance: Yup.number().required("La distancia es requerida."),
  description: Yup.string()
    .min(10, "La descripción debe tener al menos 10 caracteres.")
    .required("La descripción es requerida."),
});

const CreatePublication: React.FC<CreatePublicationProps> = ({ onClose, profileImage }) => {
  const [selectedType, setSelectedType] = useState<"offer" | "demand" | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showAgreementOptions, setShowAgreementOptions] = useState(false);
  const [showSubcategoryOptions, setShowSubcategoryOptions] = useState(false);
  const [selectedAgreement, setSelectedAgreement] = useState<string>("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");
  const [showCityOptions, setShowCityOptions] = useState(false);
  const [showProvinceOptions, setShowProvinceOptions] = useState(false);
  const [showDistanceOptions, setShowDistanceOptions] = useState(false);
  const [selectedDistance, setSelectedDistance] = useState<string>("");

  const options = [
    "INTERCAMBIO DE SERVICIOS",
    "INTERCAMBIO DE PRODUCTOS-TRUEQUE",
    "INTERCAMBIO DE SERVICIOS POR PRODUCTOS",
    "VENTA DE SERVICIOS",
    "VENTA DE PRODUCTOS"
  ];

  const cities = [
    "City 1", "City 2",
  ];

  const provinces = [
    "Province 1", "Province 2",
  ];

  const distanceOptions = [
    { label: "0-5 km", value: "5" },
    { label: "6-10 km", value: "10" },
    { label: "11-20 km", value: "20" },
    { label: "21-50 km", value: "50" },
    { label: "50+ km", value: "50+" },
  ];

  // Fetch user data when the component mounts
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const userData = await getUserData();
        if (userData) {
          setCurrentUser(userData as User);
          console.log(currentUser?.profile);
        }
      } catch (error) {
        console.error("Failed to fetch current user:", error);
      }
    };
    fetchCurrentUser();
  }, []);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const docData = {
        ...values,
        creator: currentUser?.name || 'Anonymous',
        uploaderImage: currentUser?.profile || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await addDoc(collection(db, "advertisements"), docData);
      ToastAndroid.show("Announcement created successfully!", ToastAndroid.SHORT);
      onClose();
    } catch (error: any) {
      console.error('Error creating announcement:', error);
      ToastAndroid.show(`Error: ${error.message}`, ToastAndroid.LONG);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={onClose} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
     
      <Formik
        initialValues={{
          type: "",
          subcategory: "",
          city: "",
          province: "",
          distance: "",
          description: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          values,
          errors,
          touched,
        }) => (
          <View style={styles.form}>
            <View style={styles.questionContainer}>
              <Text style={styles.questionText}>¿Estas ofertando o demandando?</Text>
            </View>
            <View style={styles.typeContainer}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  selectedType === "offer" && styles.selectedButton,
                ]}
                onPress={() => {
                  setSelectedType("offer");
                  setFieldValue("type", "offer");
                }}
              >
                <Text
                  style={[
                    styles.typeText,
                    selectedType === "offer" && styles.selectedText,
                  ]}
                >
                  Oferta
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  selectedType === "demand" && styles.selectedButton,
                ]}
                onPress={() => {
                  setSelectedType("demand");
                  setFieldValue("type", "demand");
                }}
              >
                <Text
                  style={[
                    styles.typeText,
                    selectedType === "demand" && styles.selectedText,
                  ]}
                >
                  Demanda
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.questionContainer}>
              <Text style={styles.questionText}>¿Qué tipo de acuerdo o negocio quieres hacer?</Text>
            </View>

            <TouchableOpacity
              style={[
                styles.pickerButton,
                { marginBottom: showAgreementOptions ? 0 : 10 }
              ]}
              onPress={() => setShowAgreementOptions(!showAgreementOptions)}
            >
              <Text style={styles.pickerButtonText}>
                {selectedAgreement || "ELIGE TU ACUERDO"}
              </Text>
              <Ionicons name="chevron-down" size={20} color="white" />
            </TouchableOpacity>

            {showAgreementOptions && (
              <View style={styles.optionsContainer}>
                {options.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.optionItem}
                    onPress={() => {
                      setFieldValue("agreement", option);
                      setSelectedAgreement(option);
                      setShowAgreementOptions(false);
                    }}
                  >
                    <Text style={styles.optionText}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {touched.subcategory && errors.subcategory && (
              <Text style={styles.errorText}>{errors.subcategory}</Text>
            )}

            <TouchableOpacity
              style={[
                styles.pickerButton,
                { marginBottom: 15 }
              ]}
              onPress={() => setShowSubcategoryOptions(!showSubcategoryOptions)}
            >
              <Text style={styles.pickerButtonText}>
                {selectedSubcategory || "Subcategorías"}
              </Text>
              <Ionicons name="chevron-down" size={20} color="white" />
            </TouchableOpacity>

            {showSubcategoryOptions && (
              <View style={[styles.optionsContainer, { marginBottom: 15 }]}>
                <TouchableOpacity
                  style={styles.optionItem}
                  onPress={() => {
                    setFieldValue("subcategory", "subcategory1");
                    setSelectedSubcategory("subcategory1");
                    setShowSubcategoryOptions(false);
                  }}
                >
                  <Text style={styles.optionText}>Subcategory 1</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.optionItem}
                  onPress={() => {
                    setFieldValue("subcategory", "subcategory2");
                    setSelectedSubcategory("subcategory2");
                    setShowSubcategoryOptions(false);
                  }}
                >
                  <Text style={styles.optionText}>Subcategory 2</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.row}>
              <View style={styles.halfPicker}>
                <TouchableOpacity
                  style={styles.pickerButton}
                  onPress={() => setShowCityOptions(!showCityOptions)}
                >
                  <Text style={styles.pickerButtonText}>
                    {values.city || "Ciudad"}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color="white" />
                </TouchableOpacity>

                {showCityOptions && (
                  <View style={styles.optionsContainer}>
                    {cities.map((city, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.optionItem}
                        onPress={() => {
                          setFieldValue("city", city);
                          setShowCityOptions(false);
                        }}
                      >
                        <Text style={styles.optionText}>{city}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              <View style={styles.halfPicker}>
                <TouchableOpacity
                  style={styles.pickerButton}
                  onPress={() => setShowProvinceOptions(!showProvinceOptions)}
                >
                  <Text style={styles.pickerButtonText}>
                    {values.province || "Provincia"}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color="white" />
                </TouchableOpacity>

                {showProvinceOptions && (
                  <View style={styles.optionsContainer}>
                    {provinces.map((province, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.optionItem}
                        onPress={() => {
                          setFieldValue("province", province);
                          setShowProvinceOptions(false);
                        }}
                      >
                        <Text style={styles.optionText}>{province}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.pickerButton, 
                { 
                  marginBottom: showDistanceOptions ? 0 : 15,
                  marginTop: 15  // Added spacing above the distance picker
                }
              ]}
              onPress={() => setShowDistanceOptions(!showDistanceOptions)}
            >
              <Text style={styles.pickerButtonText}>
                {selectedDistance || "Seleccionar Distancia (km)"}
              </Text>
              <Ionicons name="chevron-down" size={20} color="white" />
            </TouchableOpacity>

            {showDistanceOptions && (
              <View style={styles.optionsContainer}>
                {distanceOptions.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.optionItem}
                    onPress={() => {
                      setFieldValue("distance", option.value);
                      setSelectedDistance(option.value);
                      setShowDistanceOptions(false);
                    }}
                  >
                    <Text style={styles.optionText}>{option.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <Text style={styles.label}>
              ESCRIBE TU ANUNCIO CON PALABRAS CLAVE QUE OTROS USUARIOS PODRÁN 
              USAR PARA ENCONTRARTE A TRAVÉS DEL FILTRO PROGRAMADO:
            </Text>
            <TextInput
              multiline
              numberOfLines={4}
              onChangeText={handleChange("description")}
              onBlur={handleBlur("description")}
              value={values.description}
              style={[styles.input, styles.textArea]}
            />
            {touched.description && errors.description && (
              <Text style={styles.errorText}>{errors.description}</Text>
            )}

            <TouchableOpacity
              onPress={handleSubmit as any}
              style={styles.submitButton}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Crear Anuncio</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  form: {
    width: "100%",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  typeContainer: {
    flexDirection: "row",
    marginBottom: 20,
    width: '100%',
    justifyContent: 'space-between',
  },
  typeButton: {
    flex: 1,
    padding: 15,
    marginHorizontal: 5,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: '#4AA3F2',
    borderColor: '#4AA3F2',
  },
  selectedButton: {
    backgroundColor: '#6B3FA0',
    borderColor: '#6B3FA0',
  },
  typeText: {
    fontSize: 16,
    color: 'white',
  },
  selectedText: {
    color: 'white',
  },
  picker: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 10,
  },
  halfPicker: {
    flex: 1,
    marginHorizontal: 5,
  },
  row: {
    flexDirection: "row",
    width: "100%",
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 10,
  },
  textArea: {
    height: 100,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  submitButton: {
    width: "100%",
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#FF9F43",
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  questionContainer: {
    backgroundColor: '#6B3FA0',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    marginBottom: 15,
  },
  questionText: {
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  pickerButton: {
    backgroundColor: '#4AA3F2',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  pickerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  optionsContainer: {
    width: '100%',
    marginBottom: 10,
  },
  optionItem: {
    backgroundColor: '#FF9F43',
    padding: 15,
    marginVertical: 2,
    borderRadius: 8,
  },
  optionText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default CreatePublication;
