import { useEffect, useState } from "react";
import {
  getProducts,
  createProduct,
  deleteProduct,
  updateProduct,
  type FirebaseProduct,
} from "../services/productService";
import type { Product, ProductType } from "../types/product";

const productTypes: ProductType[] = [
  "Producto terminado",
  "Insumo",
  "Materia prima",
  "Bebida",
  "Postre",
  "Descartable",
  "Envase",
];

function Inventario() {
  const [items, setItems] = useState<FirebaseProduct[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    category: "",
    type: "Producto terminado" as ProductType,
    price: "",
    stock: "",
    minStock: "",
  });

  async function loadProducts() {
    const data = await getProducts();
    setItems(data);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function resetForm() {
    setForm({
      name: "",
      category: "",
      type: "Producto terminado",
      price: "",
      stock: "",
      minStock: "",
    });
    setEditingId(null);
  }

  async function saveProduct() {
    if (
      !form.name ||
      !form.category ||
      !form.type ||
      !form.price ||
      !form.stock ||
      !form.minStock
    ) {
      alert("Completa todos los campos.");
      return;
    }

    const productData: Omit<Product, "id"> = {
      name: form.name,
      category: form.category,
      type: form.type,
      price: Number(form.price),
      stock: Number(form.stock),
      minStock: Number(form.minStock),
    };

    if (editingId) {
      await updateProduct(editingId, productData);
    } else {
      await createProduct(productData);
    }

    resetForm();
    loadProducts();
  }

  function editProduct(product: FirebaseProduct) {
    setEditingId(product.firebaseId);
    setForm({
      name: product.name,
      category: product.category,
      type: product.type ?? "Producto terminado",
      price: String(product.price),
      stock: String(product.stock),
      minStock: String(product.minStock),
    });
  }

  async function handleDelete(firebaseId: string) {
    const confirmDelete = confirm("¿Eliminar este producto?");
    if (!confirmDelete) return;

    await deleteProduct(firebaseId);
    loadProducts();
  }

  return (
    <section className="inventory-page">
      <div className="inventory-summary">
        <InventoryCard title="Productos" value={items.length} icon="📦" />
        <InventoryCard
          title="Stock crítico"
          value={items.filter((p) => p.stock <= p.minStock).length}
          icon="⚠️"
        />
        <InventoryCard
          title="Disponibles"
          value={items.filter((p) => p.stock > p.minStock).length}
          icon="✅"
        />
      </div>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>{editingId ? "Editar producto" : "Nuevo producto"}</h2>
            <p>Registra productos, insumos y materiales para Hera.</p>
          </div>

          {editingId && <button onClick={resetForm}>Cancelar edición</button>}
        </div>

        <div className="inventory-form">
          <input
            placeholder="Nombre del producto"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            placeholder="Categoría"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />

          <select
            value={form.type}
            onChange={(e) =>
              setForm({ ...form, type: e.target.value as ProductType })
            }
          >
            {productTypes.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Precio de venta"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />

          <input
            type="number"
            placeholder="Stock actual"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
          />

          <input
            type="number"
            placeholder="Stock mínimo"
            value={form.minStock}
            onChange={(e) => setForm({ ...form, minStock: e.target.value })}
          />

          <button onClick={saveProduct}>
            {editingId ? "Guardar cambios" : "Agregar producto"}
          </button>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>Inventario</h2>
            <p>Productos guardados en Firebase Firestore.</p>
          </div>

          <button onClick={loadProducts}>Actualizar</button>
        </div>

        <div className="inventory-table">
          <table>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Tipo</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Mínimo</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {items.map((product) => {
                const status =
                  product.stock === 0
                    ? "Agotado"
                    : product.stock <= product.minStock
                    ? "Bajo stock"
                    : "Disponible";

                return (
                  <tr key={product.firebaseId}>
                    <td>
                      <strong>{product.name}</strong>
                    </td>
                    <td>{product.category}</td>
                    <td>{product.type}</td>
                    <td>S/ {product.price.toFixed(2)}</td>
                    <td>{product.stock}</td>
                    <td>{product.minStock}</td>
                    <td>
                      <span
                        className={`status ${status
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {status}
                      </span>
                    </td>
                    <td className="table-actions">
                      <button onClick={() => editProduct(product)}>
                        Editar
                      </button>
                      <button
                        className="danger"
                        onClick={() => handleDelete(product.firebaseId)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}

function InventoryCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: string;
}) {
  return (
    <div className="inventory-card">
      <span>{icon}</span>
      <div>
        <p>{title}</p>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

export default Inventario;