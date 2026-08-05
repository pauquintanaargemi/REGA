import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Theme, useTheme } from '../theme/theme';

interface Props {
  message: string;
  onUndo: () => void;
}

export function UndoSnackbar({ message, onUndo }: Props) {
  const theme = useTheme();
  const styles = makeStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
      <Pressable onPress={onUndo} hitSlop={8}>
        <Text style={styles.undo}>Desfer</Text>
      </Pressable>
    </View>
  );
}

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      position: 'absolute',
      left: 16,
      right: 16,
      bottom: 20,
      backgroundColor: theme.scheme === 'dark' ? '#2E322E' : '#1B1B1B',
      borderRadius: 10,
      paddingVertical: 12,
      paddingHorizontal: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      shadowColor: '#000',
      shadowOpacity: 0.2,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 3 },
      elevation: 4,
    },
    message: {
      color: '#fff',
      fontSize: 14,
      flexShrink: 1,
      marginRight: 12,
    },
    undo: {
      color: theme.accent,
      fontSize: 14,
      fontWeight: '700',
    },
  });
}
