import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export type DashboardSaleItem = {
  name: string;
  quantity: number;
  price: number;
  lineTotal: number;
};

export type DashboardSale = {
  id: string;
  total: number;
  paymentMethod: string;
  documentType: string;
  businessName: string;
  items: DashboardSaleItem[];
  createdAt?: {
    seconds: number;
  };
};

export async function getSalesForDashboard() {
  const salesRef = collection(db, "sales");
  const q = query(salesRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as DashboardSale[];
}