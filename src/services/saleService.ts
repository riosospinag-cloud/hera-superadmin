import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export type SaleItem = {
  productId: number;
  firebaseId: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  lineTotal: number;
};

export type Sale = {
  documentType: "boleta" | "factura";
  paymentMethod: string;
  ruc?: string;
  businessName?: string;
  subtotal: number;
  igv: number;
  total: number;
  items: SaleItem[];
  userName: string;
  status: "completed";
};

const salesCollection = collection(db, "sales");

export async function createSale(sale: Sale) {
  return addDoc(salesCollection, {
    ...sale,
    createdAt: serverTimestamp(),
  });
}