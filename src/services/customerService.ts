import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import type { Customer } from "../types/customer";

const customersCollection = collection(db, "customers");

export type FirebaseCustomer = Customer & {
  firebaseId: string;
};

export async function getCustomers() {
  const snapshot = await getDocs(customersCollection);

  return snapshot.docs.map((document) => ({
    firebaseId: document.id,
    ...document.data(),
  })) as FirebaseCustomer[];
}

export async function createCustomer(customer: Customer) {
  return addDoc(customersCollection, customer);
}

export async function updateCustomer(
  firebaseId: string,
  customer: Partial<Customer>
) {
  const customerRef = doc(db, "customers", firebaseId);
  return updateDoc(customerRef, customer);
}

export async function deleteCustomer(firebaseId: string) {
  const customerRef = doc(db, "customers", firebaseId);
  return deleteDoc(customerRef);
}