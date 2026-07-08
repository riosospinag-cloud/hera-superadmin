import { db } from "../firebase/firebaseConfig";

import {
  collection,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";

export interface FirebaseClient {
  firebaseId: string;

  name: string;
  documentType: string;
  documentNumber: string;

  phone: string;
  email: string;

  birthday: string;

  points: number;
  active: boolean;
}

const clientsCollection = collection(db, "clients");

export async function getClients(): Promise<FirebaseClient[]> {
  const snapshot = await getDocs(clientsCollection);

  return snapshot.docs.map((docSnap) => ({
    firebaseId: docSnap.id,
    ...(docSnap.data() as Omit<FirebaseClient, "firebaseId">),
  }));
}

export async function updateClient(
  firebaseId: string,
  data: Partial<FirebaseClient>
) {
  const ref = doc(db, "clients", firebaseId);

  return updateDoc(ref, data);
}