import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { addPerson, loadPeople } from '../storage/peopleStorage';

type Props = NativeStackScreenProps<RootStackParamList, 'AddPerson'>;

export function AddPersonScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [frequencyDays, setFrequencyDays] = useState('7');
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    const trimmedName = name.trim();
    const frequency = parseInt(frequencyDays, 10);

    if (!trimmedName) {
      Alert.alert('Falta el nom', 'Escriu el nom de la persona.');
      return;
    }
    if (!Number.isFinite(frequency) || frequency <= 0) {
      Alert.alert(
        'Freqüència no vàlida',
        'Indica cada quants dies vols parlar amb aquesta persona.'
      );
      return;
    }

    setSaving(true);
    const current = await loadPeople();
    await addPerson(current, trimmedName, frequency);
    setSaving(false);
    navigation.goBack();
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.title}>Nova persona</Text>

      <Text style={styles.label}>Nom</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Ex. Anna"
        autoFocus
      />

      <Text style={styles.label}>Cada quants dies vols parlar-hi?</Text>
      <TextInput
        style={styles.input}
        value={frequencyDays}
        onChangeText={setFrequencyDays}
        placeholder="Ex. 7"
        keyboardType="number-pad"
      />

      <Pressable
        style={[styles.saveButton, saving && styles.saveButtonDisabled]}
        onPress={handleSave}
        disabled={saving}
      >
        <Text style={styles.saveButtonText}>
          {saving ? 'Desant…' : 'Afegir al jardí'}
        </Text>
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1B1B1B',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 28,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
