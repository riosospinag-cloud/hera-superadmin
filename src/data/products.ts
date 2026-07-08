import type { Product } from "../types/product";

export const products: Product[] = [
  {
    id: 1,
    name: "Frappe Pie de Limón",
    category: "Bebidas",
    type: "Bebida",
    price: 12,
    stock: 10,
    minStock: 3,
  },
  {
    id: 2,
    name: "Croissant de Pollo",
    category: "Sandwiches",
    type: "Producto terminado",
    price: 14,
    stock: 8,
    minStock: 2,
  },
  {
    id: 3,
    name: "Cheesecake Maracuyá",
    category: "Postres",
    type: "Postre",
    price: 9,
    stock: 6,
    minStock: 2,
  },
  {
    id: 4,
    name: "Waffle Clásico",
    category: "Waffles",
    type: "Producto terminado",
    price: 13,
    stock: 5,
    minStock: 2,
  },
];