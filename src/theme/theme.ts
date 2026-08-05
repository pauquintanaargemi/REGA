import { useColorScheme } from 'react-native';

export interface Theme {
  scheme: 'light' | 'dark';
  background: string;
  cardBackground: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  accent: string;
  accentSubtleBackground: string;
  accentSubtleText: string;
  overlay: string;
  statusBarStyle: 'dark' | 'light';
}

export const lightTheme: Theme = {
  scheme: 'light',
  background: '#F7F7F5',
  cardBackground: '#FFFFFF',
  textPrimary: '#1B1B1B',
  textSecondary: '#777777',
  border: '#E0E0E0',
  accent: '#4CAF50',
  accentSubtleBackground: '#EEF6EE',
  accentSubtleText: '#2E7D32',
  overlay: 'rgba(0,0,0,0.4)',
  statusBarStyle: 'dark',
};

export const darkTheme: Theme = {
  scheme: 'dark',
  background: '#121412',
  cardBackground: '#1E211E',
  textPrimary: '#F2F2F0',
  textSecondary: '#9AA09A',
  border: '#2E322E',
  accent: '#66BB6A',
  accentSubtleBackground: '#20301F',
  accentSubtleText: '#8CD98F',
  overlay: 'rgba(0,0,0,0.6)',
  statusBarStyle: 'light',
};

export function useTheme(): Theme {
  const scheme = useColorScheme();
  return scheme === 'dark' ? darkTheme : lightTheme;
}
