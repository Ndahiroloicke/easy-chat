import { lightColors, darkColors } from "./colors";
import { useColorScheme } from "react-native";
import React, { createContext, useContext, useEffect, useState } from "react";

interface Theme {
  dark: boolean;
  colors: {
    primary: string;
    text: string;
    background: string;
  };
  setScheme: (scheme: string) => void;
}

export const ThemeContext = createContext<Theme>({
  dark: true,
  colors: lightColors,
  setScheme: () => {},
});

interface Props{
    children: React.ReactNode
}

export const ThemeProvider:React.FC<Props> = (props) => {
  const colorScheme = useColorScheme();
  
  const [isDark, setIsDark] = useState(colorScheme == "dark");

  useEffect(() => {
    setIsDark(colorScheme == "dark");
  }, [colorScheme]);

  const defaultTheme = {
    dark: isDark,
    colors: isDark ? darkColors : lightColors,
    setScheme: (scheme: string) => setIsDark(scheme === "dark"),
  };
  return (
    <ThemeContext.Provider value={defaultTheme}>
      {props.children}
    </ThemeContext.Provider>
  );
};

export const useTheme = ():Theme => useContext(ThemeContext);
