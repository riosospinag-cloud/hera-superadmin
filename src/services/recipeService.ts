import { addDoc, collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import type { Recipe } from "../types/recipe";

const recipesCollection = collection(db, "recipes");

export type FirebaseRecipe = Recipe & {
  firebaseId: string;
};

export async function getRecipes() {
  const snapshot = await getDocs(recipesCollection);

  return snapshot.docs.map((document) => ({
    firebaseId: document.id,
    ...document.data(),
  })) as FirebaseRecipe[];
}

export async function createRecipe(recipe: Recipe) {
  return addDoc(recipesCollection, recipe);
}

export async function deleteRecipe(firebaseId: string) {
  return deleteDoc(doc(db, "recipes", firebaseId));
}