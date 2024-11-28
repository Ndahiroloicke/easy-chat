import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeUserData = async (userData: any) => {
    try {
        const jsonValue = JSON.stringify(userData);
        await AsyncStorage.setItem('userData', jsonValue);
    } catch (e) {
        console.error('Error storing user data:', e);
    }
};

export const getUserData = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem('userData');
        if (jsonValue != null) {
            return JSON.parse(jsonValue);
        }
        return null;
    } catch (e) {
        console.error('Error getting user data:', e);
        return null;
    }
};

export const removeUserData = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem('userData');
  } catch (error) {
    console.error("Error deleting user data:", error);
  }
};

