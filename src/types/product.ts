export type ProductType =
  | "Producto terminado"
  | "Insumo"
  | "Materia prima"
  | "Bebida"
  | "Postre"
  | "Descartable"
  | "Envase";

export type Product = {
  id?: number;
  firebaseId?: string;
  name: string;
  category: string;
  type: ProductType;
  price: number;
  stock: number;
  minStock: number;
};

export type CartItem = Product & {
  quantity: number;
};