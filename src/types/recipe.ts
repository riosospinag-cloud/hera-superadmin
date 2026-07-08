export type RecipeIngredient = {
  productFirebaseId: string;
  name: string;
  quantity: number;
  unit: string;
};

export type Recipe = {
  name: string;
  site: string;
  finalProductFirebaseId: string;
  finalProductName: string;
  quantityProduced: number;
  ingredients: RecipeIngredient[];
  status: "active" | "inactive";
};