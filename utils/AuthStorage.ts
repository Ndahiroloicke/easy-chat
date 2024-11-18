import * as SecureStore from "expo-secure-store";
import { db } from "./firebase.config";
import { getDoc } from "firebase/firestore";
import { doc } from "firebase/firestore";

const USER_KEY = "user"; 


export const storeUserData = async (userData: UserData): Promise<void> => {
  try {
    const userDataString = JSON.stringify(userData);
    await SecureStore.setItemAsync(USER_KEY, userDataString);
  } catch (error) {
    console.error("Error storing user data:", error);
  }
};


export const getUserData = async (): Promise<UserData | null> => {
  try {
    const userDataString = await SecureStore.getItemAsync(USER_KEY);
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      console.log("Local storage userData:", userData); // Debug log
      
      // If the profile picture is not in the local data, fetch it from Firestore
      if (!userData.profile) { // Changed from profilePicture to profile
        const userDocRef = doc(db, "users", userData.id); // Changed from userData.name to userData.id
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const userFirestoreData = userDoc.data();
          // Update with the correct field name from Firestore
          userData.profile = userFirestoreData.profile;
          
          console.log("Fetched profile is", userData.profile);
          
          // Update local storage with the new data
          await SecureStore.setItemAsync(USER_KEY, JSON.stringify(userData));
        }
      }
      
      return userData;
    }
    return null;
  } catch (error) {
    console.error("Error getting user data:", error);
    return null;
  }
};


export const removeUserData = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(USER_KEY);
  } catch (error) {
    console.error("Error deleting user data:", error);
  }
};
