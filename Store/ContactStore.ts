import { create } from "zustand";
import { data } from "../constants";

interface Contact {
  id: number;
  username: string;
  email: string;
  image: any;
  phone:string,
  // Add any other contact details you need
}
const initialContacts: Contact[] =data.contacts;

interface ContactsState {
  contacts: Contact[];
  addContact: (contact: Contact) => void;
  removeContact: (id: number) => void;
}

const useContactsStore = create<ContactsState>((set) => ({
  contacts: initialContacts,
  addContact: (contact) =>
    set((state) => ({ contacts: [...state.contacts, contact] })),
  removeContact: (id) =>
    set((state) => ({
      contacts: state.contacts.filter((contact) => contact.id !== id),
    })),
}));

export default useContactsStore;
