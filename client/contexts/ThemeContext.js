import React, { createContext, useState } from 'react';
import { Appearance } from 'react-native';

export const ThemeContext = createContext();

const lightTheme = {
  backgroundColor: '#eee',
  textColor: '#000',
  tertiaryTextColor: '#888',
  secondaryTextColor: '#111',
  inputBackground: '#fff',
  optionBackground: '#fff',
  buttonText: '#fff',
  borderColor: '#ccc',
  placeholderTextColor: '#ccc',
  iconColor: '#3e3e3e',
  violet: '#7049f6',
  darkIconColor: '#3e3e3e'
};

const darkTheme = {
  secondaryTextColor: '#ddd',
  backgroundColor: '#151419',
  textColor: '#fff',
  tertiaryTextColor: '#999',
  inputBackground: '#232323',
  optionBackground: '#3a3a3a',
  buttonText: '#fff',
  borderColor: '#393939',
  placeholderTextColor: '#808080',
  iconColor: '#eee',
  violet: '#8867f7',
  darkIconColor: '#c0c0c0',
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(Appearance.getColorScheme() || 'light');

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const currentTheme = theme === 'light' ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, currentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};