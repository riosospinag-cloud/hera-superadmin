import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import type { CashRegister } from "../types/cashRegister";

const cashCollection = collection(db, "cashRegisters");

export type FirebaseCashRegister = CashRegister & {
  firebaseId: string;
  openedAt?: { seconds: number };
  closedAt?: { seconds: number };
};

export async function getCashRegisters() {
  const q = query(cashCollection, orderBy("openedAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((document) => ({
    firebaseId: document.id,
    ...document.data(),
  })) as FirebaseCashRegister[];
}

export async function getOpenCashRegister() {
  const registers = await getCashRegisters();
  return registers.find((cash) => cash.status === "open") || null;
}

export async function openCashRegister(data: CashRegister) {
  return addDoc(cashCollection, {
    ...data,
    openedAt: serverTimestamp(),
  });
}

export async function updateCashRegister(
  firebaseId: string,
  data: Partial<CashRegister>
) {
  const cashRef = doc(db, "cashRegisters", firebaseId);
  return updateDoc(cashRef, data);
}

export async function closeCashRegister(
  firebaseId: string,
  data: Partial<CashRegister>
) {
  const cashRef = doc(db, "cashRegisters", firebaseId);

  return updateDoc(cashRef, {
    ...data,
    closedAt: serverTimestamp(),
  });
}