import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import type { Product } from "../types/product";

const productsCollection = collection(db, "products");

export type FirebaseProduct = Product & {
  firebaseId: string;
};

export async function getProducts() {
  const snapshot = await getDocs(productsCollection);

  return snapshot.docs.map((document, index) => {
    const data = document.data() as Partial<Product>;

    return {
      id: data.id ?? index + 1,
      firebaseId: document.id,
      name: data.name ?? "",
      category: data.category ?? "",
      type: data.type ?? "Producto terminado",
      price: data.price ?? 0,
      stock: data.stock ?? 0,
      minStock: data.minStock ?? 0,
    };
  }) as FirebaseProduct[];
}

export async function createProduct(product: Omit<Product, "id" | "firebaseId">) {
  return addDoc(productsCollection, {
    ...product,
    id: Date.now(),
  });
}

export async function updateProduct(
  firebaseId: string,
  product: Partial<Product>
) {
  const productRef = doc(db, "products", firebaseId);
  return updateDoc(productRef, product);
}

export async function deleteProduct(firebaseId: string) {
  const productRef = doc(db, "products", firebaseId);
  return deleteDoc(productRef);
}