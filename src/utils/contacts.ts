import { Contact, ContactField } from 'expo-contacts';

export interface PickedContact {
  name: string;
  phoneNumber?: string;
}

/**
 * Obre el selector natiu de contactes i retorna el nom i el primer telèfon
 * de la persona triada, o `null` si l'usuari cancel·la.
 */
export async function pickContactFromDevice(): Promise<PickedContact | null> {
  const contact = await Contact.presentPicker();
  if (!contact) return null;

  const details = await contact.getDetails([
    ContactField.FULL_NAME,
    ContactField.PHONES,
  ]);

  return {
    name: details.fullName ?? '',
    phoneNumber: details.phones?.[0]?.number,
  };
}
