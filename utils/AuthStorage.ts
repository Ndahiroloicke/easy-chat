import * as SecureStore from "expo-secure-store";

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
      return JSON.parse(userDataString);
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
