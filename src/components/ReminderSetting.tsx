import React, { useEffect, useState } from 'react';
import { Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import {
  loadReminderTime,
  saveReminderTime,
  ReminderTime,
} from '../storage/settingsStorage';
import { scheduleDailyReminder } from '../notifications/notifications';
import { Theme, useTheme } from '../theme/theme';

function pad(n: number): string {
  return n.toString().padStart(2, '0');
}

export function ReminderSetting() {
  const theme = useTheme();
  const styles = makeStyles(theme);

  const [time, setTime] = useState<ReminderTime | null>(null);
  const [draft, setDraft] = useState<ReminderTime>({ hour: 20, minute: 0 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    loadReminderTime().then(setTime);
  }, []);

  function openModal() {
    if (time) setDraft(time);
    setVisible(true);
  }

  function changeHour(delta: number) {
    setDraft((d) => ({ ...d, hour: (d.hour + delta + 24) % 24 }));
  }

  function changeMinute(delta: number) {
    setDraft((d) => ({ ...d, minute: (d.minute + delta + 60) % 60 }));
  }

  async function handleSave() {
    await saveReminderTime(draft);
    if (Platform.OS !== 'web') {
      await scheduleDailyReminder(draft);
    }
    setTime(draft);
    setVisible(false);
  }

  return (
    <>
      <Pressable style={styles.row} onPress={openModal}>
        <Text style={styles.rowText}>
          🔔 Recordatori diari{time ? ` a les ${pad(time.hour)}:${pad(time.minute)}` : ''}
        </Text>
      </Pressable>

      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.card}>
            <Text style={styles.title}>Hora del recordatori</Text>

            <View style={styles.pickerRow}>
              <Stepper
                label="Hora"
                value={pad(draft.hour)}
                onDecrease={() => changeHour(-1)}
                onIncrease={() => changeHour(1)}
              />
              <Text style={styles.colon}>:</Text>
              <Stepper
                label="Minut"
                value={pad(draft.minute)}
                onDecrease={() => changeMinute(-5)}
                onIncrease={() => changeMinute(5)}
              />
            </View>

            <View style={styles.actions}>
              <Pressable
                style={[styles.actionButton, styles.cancelButton]}
                onPress={() => setVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel·la</Text>
              </Pressable>
              <Pressable
                style={[styles.actionButton, styles.saveButton]}
                onPress={handleSave}
              >
                <Text style={styles.saveText}>Desar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

interface StepperProps {
  label: string;
  value: string;
  onDecrease: () => void;
  onIncrease: () => void;
}

function Stepper({ label, value, onDecrease, onIncrease }: StepperProps) {
  const theme = useTheme();
  const styles = makeStyles(theme);

  return (
    <View style={styles.stepper}>
      <Text style={styles.stepperLabel}>{label}</Text>
      <View style={styles.stepperControls}>
        <Pressable style={styles.stepperButton} onPress={onDecrease}>
          <Text style={styles.stepperButtonText}>−</Text>
        </Pressable>
        <Text style={styles.stepperValue}>{value}</Text>
        <Pressable style={styles.stepperButton} onPress={onIncrease}>
          <Text style={styles.stepperButtonText}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    row: {
      marginHorizontal: 20,
      marginBottom: 8,
    },
    rowText: {
      fontSize: 13,
      color: theme.accent,
      fontWeight: '600',
    },
    overlay: {
      flex: 1,
      backgroundColor: theme.overlay,
      alignItems: 'center',
      justifyContent: 'center',
    },
    card: {
      backgroundColor: theme.cardBackground,
      borderRadius: 16,
      padding: 24,
      width: 300,
    },
    title: {
      fontSize: 17,
      fontWeight: '700',
      marginBottom: 20,
      textAlign: 'center',
      color: theme.textPrimary,
    },
    pickerRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'center',
    },
    colon: {
      fontSize: 24,
      fontWeight: '700',
      marginHorizontal: 8,
      marginBottom: 10,
      color: theme.textPrimary,
    },
    stepper: {
      alignItems: 'center',
    },
    stepperLabel: {
      fontSize: 12,
      color: theme.textSecondary,
      marginBottom: 6,
    },
    stepperControls: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    stepperButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.accentSubtleBackground,
      alignItems: 'center',
      justifyContent: 'center',
    },
    stepperButtonText: {
      fontSize: 18,
      color: theme.accentSubtleText,
      fontWeight: '700',
    },
    stepperValue: {
      fontSize: 22,
      fontWeight: '700',
      color: theme.textPrimary,
      width: 48,
      textAlign: 'center',
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 24,
    },
    actionButton: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 10,
      alignItems: 'center',
    },
    cancelButton: {
      backgroundColor: theme.scheme === 'dark' ? '#2A2A2A' : '#F0F0F0',
      marginRight: 8,
    },
    saveButton: {
      backgroundColor: theme.accent,
      marginLeft: 8,
    },
    cancelText: {
      color: theme.textSecondary,
      fontWeight: '600',
    },
    saveText: {
      color: '#fff',
      fontWeight: '700',
    },
  });
}
