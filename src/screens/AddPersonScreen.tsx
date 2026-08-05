import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Linking,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import {
  addPerson,
  deletePerson,
  loadPeople,
  updatePerson,
} from '../storage/peopleStorage';
import { confirmAsync, notify } from '../utils/dialogs';
import { pickContactFromDevice } from '../utils/contacts';
import { Theme, useTheme } from '../theme/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'AddPerson'>;

export function AddPersonScreen({ navigation, route }: Props) {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const personId = route.params?.personId;
  const isEditing = personId !== undefined;

  const [name, setName] = useState('');
  const [frequencyDays, setFrequencyDays] = useState('7');
  const [notes, setNotes] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEditing);

  useEffect(() => {
    navigation.setOptions({
      title: isEditing ? 'Editar persona' : 'Afegir persona',
    });
  }, [navigation, isEditing]);

  useEffect(() => {
    if (!personId) return;
    loadPeople().then((people) => {
      const person = people.find((p) => p.id === personId);
      if (person) {
        setName(person.name);
        setFrequencyDays(String(person.frequencyDays));
        setNotes(person.notes ?? '');
        setPhoneNumber(person.phoneNumber ?? '');
      }
      setLoading(false);
    });
  }, [personId]);

  async function handleSave() {
    const trimmedName = name.trim();
    const frequency = parseInt(frequencyDays, 10);

    if (!trimmedName) {
      notify('Falta el nom', 'Escriu el nom de la persona.');
      return;
    }
    if (!Number.isFinite(frequency) || frequency <= 0) {
      notify(
        'Freqüència no vàlida',
        'Indica cada quants dies vols parlar amb aquesta persona.'
      );
      return;
    }

    const trimmedNotes = notes.trim();
    const trimmedPhone = phoneNumber.trim();
    setSaving(true);
    const current = await loadPeople();
    if (isEditing && personId) {
      await updatePerson(current, personId, {
        name: trimmedName,
        frequencyDays: frequency,
        notes: trimmedNotes,
        phoneNumber: trimmedPhone,
      });
    } else {
      await addPerson(current, trimmedName, frequency, trimmedNotes, trimmedPhone);
    }
    setSaving(false);
    navigation.goBack();
  }

  async function handlePickContact() {
    try {
      const picked = await pickContactFromDevice();
      if (!picked) return;
      if (picked.name) setName(picked.name);
      if (picked.phoneNumber) setPhoneNumber(picked.phoneNumber);
    } catch {
      notify('No s\'ha pogut obrir els contactes', 'Torna-ho a provar més tard.');
    }
  }

  function handleCall() {
    const trimmedPhone = phoneNumber.trim();
    if (!trimmedPhone) return;
    Linking.openURL(`tel:${trimmedPhone}`);
  }

  async function handleDelete() {
    if (!personId) return;
    const confirmed = await confirmAsync(
      'Eliminar persona',
      `Segur que vols eliminar ${name || 'aquesta persona'} del teu jardí?`
    );
    if (!confirmed) return;
    const current = await loadPeople();
    await deletePerson(current, personId);
    navigation.goBack();
  }

  if (loading) {
    return <View style={styles.container} />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>
          {isEditing ? 'Editar persona' : 'Nova persona'}
        </Text>

        {Platform.OS !== 'web' && (
          <Pressable style={styles.contactButton} onPress={handlePickContact}>
            <Text style={styles.contactButtonText}>
              📇 Triar dels contactes
            </Text>
          </Pressable>
        )}

        <Text style={styles.label}>Nom</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Ex. Anna"
          placeholderTextColor={theme.textSecondary}
          autoFocus={!isEditing}
        />

        <Text style={styles.label}>Cada quants dies vols parlar-hi?</Text>
        <TextInput
          style={styles.input}
          value={frequencyDays}
          onChangeText={setFrequencyDays}
          placeholder="Ex. 7"
          placeholderTextColor={theme.textSecondary}
          keyboardType="number-pad"
        />

        <Text style={styles.label}>Telèfon (opcional)</Text>
        <View style={styles.phoneRow}>
          <TextInput
            style={[styles.input, styles.phoneInput]}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="Ex. +34 600 000 000"
            placeholderTextColor={theme.textSecondary}
            keyboardType="phone-pad"
          />
          {phoneNumber.trim().length > 0 && (
            <Pressable style={styles.callButton} onPress={handleCall}>
              <Text style={styles.callButtonText}>📞</Text>
            </Pressable>
          )}
        </View>

        <Text style={styles.label}>Notes (opcional)</Text>
        <TextInput
          style={[styles.input, styles.notesInput]}
          value={notes}
          onChangeText={setNotes}
          placeholder="Aniversari, de què vau parlar, idees de regal…"
          placeholderTextColor={theme.textSecondary}
          multiline
          textAlignVertical="top"
        />

        <Pressable
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.saveButtonText}>
            {saving ? 'Desant…' : isEditing ? 'Desar canvis' : 'Afegir al jardí'}
          </Text>
        </Pressable>

        {isEditing && (
          <Pressable style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>Eliminar persona</Text>
          </Pressable>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollContent: {
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: '700',
      color: theme.textPrimary,
      marginBottom: 20,
    },
    label: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.textSecondary,
      marginBottom: 6,
      marginTop: 12,
    },
    input: {
      backgroundColor: theme.cardBackground,
      borderRadius: 10,
      paddingHorizontal: 14,
      paddingVertical: 12,
      fontSize: 16,
      borderWidth: 1,
      borderColor: theme.border,
      color: theme.textPrimary,
    },
    notesInput: {
      minHeight: 90,
    },
    contactButton: {
      backgroundColor: theme.accentSubtleBackground,
      borderRadius: 10,
      paddingVertical: 12,
      alignItems: 'center',
      marginBottom: 8,
    },
    contactButtonText: {
      color: theme.accentSubtleText,
      fontWeight: '600',
      fontSize: 14,
    },
    phoneRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    phoneInput: {
      flex: 1,
    },
    callButton: {
      marginLeft: 8,
      width: 46,
      height: 46,
      borderRadius: 23,
      backgroundColor: theme.accent,
      alignItems: 'center',
      justifyContent: 'center',
    },
    callButtonText: {
      fontSize: 20,
    },
    saveButton: {
      backgroundColor: theme.accent,
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
    deleteButton: {
      borderRadius: 10,
      paddingVertical: 14,
      alignItems: 'center',
      marginTop: 16,
    },
    deleteButtonText: {
      color: '#E53935',
      fontSize: 15,
      fontWeight: '600',
    },
  });
}
