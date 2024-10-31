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
  type: Yup.string().required("Please select offer or demand."),
  category: Yup.string().required("Category is required."),
  subcategory: Yup.string().required("Subcategory is required."),
  city: Yup.string().required("City is required."),
  province: Yup.string().required("Province is required."),
  distance: Yup.number().required("Distance is required."),
  description: Yup.string()
    .min(10, "Description must be at least 10 characters.")
    .required("Description is required."),
});

const CreatePublication: React.FC<CreatePublicationProps> = ({ onClose, profileImage }) => {
  const [selectedType, setSelectedType] = useState<"offer" | "demand" | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Fetch user data when the component mounts
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const userData = await getUserData();
        if (userData) {
          setCurrentUser(userData as User);
          console.log(currentUser);
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
      // Retrieve the user's profile picture URL
      const profilePicture = currentUser?.profilePicture; 
      console.log(profileImage)// Ensure this matches your user data structure

      await addDoc(collection(db, "advertisements"), {
        ...values,
        creator: currentUser?.name,
        profilePicture, // Store the profile picture URL with the ad
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      ToastAndroid.show("Announcement created successfully!", ToastAndroid.SHORT);
      onClose();
    } catch (error: any) {
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
      <Text style={styles.pageTitle}>Post</Text>
      <Formik
        initialValues={{
          type: "",
          category: "",
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
                  Offer
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
                  Demand
                </Text>
              </TouchableOpacity>
            </View>
            {touched.type && errors.type && (
              <Text style={styles.errorText}>{errors.type}</Text>
            )}
            <Picker
  selectedValue={values.category}
  onValueChange={(itemValue: any) =>
    setFieldValue("category", itemValue)
  }
  style={styles.picker}
>
  <Picker.Item label="Select Category" value="" />
  <Picker.Item label="Category 1" value="category1" />
  <Picker.Item label="Category 2" value="category2" />
</Picker>
            {touched.category && errors.category && (
              <Text style={styles.errorText}>{errors.category}</Text>
            )}

            <Picker
              selectedValue={values.subcategory}
              onValueChange={(itemValue: any) =>
                setFieldValue("subcategory", itemValue)
              }
              style={styles.picker}
            >
              <Picker.Item label="Select Subcategory" value="" />
              <Picker.Item label="Subcategory 1" value="subcategory1" />
              <Picker.Item label="Subcategory 2" value="subcategory2" />
            </Picker>
            {touched.subcategory && errors.subcategory && (
              <Text style={styles.errorText}>{errors.subcategory}</Text>
            )}

            <View style={styles.row}>
              <Picker 
                selectedValue={values.city}
                onValueChange={(itemValue: any) =>
                  setFieldValue("city", itemValue)
                }
                style={[styles.picker, styles.halfPicker]}
              >
                <Picker.Item label="Select City" value="" />
                <Picker.Item label="City 1" value="city1" />
                <Picker.Item label="City 2" value="city2" />
              </Picker>
              <Picker
                selectedValue={values.province}
                onValueChange={(itemValue: any) =>
                  setFieldValue("province", itemValue)
                }
                style={[styles.picker, styles.halfPicker]}
              >
                <Picker.Item label="Select Province" value="" />
                <Picker.Item label="Province 1" value="province1" />
                <Picker.Item label="Province 2" value="province2" />
              </Picker>
            </View>
            {touched.city && errors.city && (
              <Text style={styles.errorText}>{errors.city}</Text>
            )}
            {touched.province && errors.province && (
              <Text style={styles.errorText}>{errors.province}</Text>
            )}

            <Picker
              selectedValue={values.distance}
              onValueChange={(itemValue: any) =>
                setFieldValue("distance", itemValue)
              }
              style={styles.picker}
            >
              <Picker.Item label="Select Distance (km)" value="" />
              <Picker.Item label="0-5 km" value="5" />
              <Picker.Item label="6-10 km" value="10" />
              <Picker.Item label="11-20 km" value="20" />
              <Picker.Item label="21-50 km" value="50" />
              <Picker.Item label="50+ km" value="50+" />
            </Picker>
            {touched.distance && errors.distance && (
              <Text style={styles.errorText}>{errors.distance}</Text>
            )}

            <Text style={styles.label}>
              WRITE YOUR AD WITH KEYWORDS USING WHICH OTHERS USERS WILL BE ABLE
              TO FIND YOU THROUGH THE PROGRAMMED FILTER:
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
                <Text style={styles.submitButtonText}>Create Announcement</Text>
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
  },
  typeButton: {
    flex: 1,
    padding: 15,
    marginHorizontal: 5,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: "center",
  },
  selectedButton: {
    backgroundColor: "#2196F3",
    borderColor: "#2196F3",
  },
  typeText: {
    fontSize: 16,
    color: "#000",
  },
  selectedText: {
    color: "#fff",
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
    backgroundColor: "#2196F3",
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default CreatePublication;
