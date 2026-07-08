import { useEffect, useState } from "react";
import { getProducts, updateProduct, type FirebaseProduct } from "../services/productService";
import { createRecipe, deleteRecipe, getRecipes, type FirebaseRecipe } from "../services/recipeService";
import type { RecipeIngredient } from "../types/recipe";

function Produccion() {
  const [products, setProducts] = useState<FirebaseProduct[]>([]);
  const [recipes, setRecipes] = useState<FirebaseRecipe[]>([]);
  const [name, setName] = useState("");
  const [site, setSite] = useState("Hera Cafetería Surco");
  const [finalProductId, setFinalProductId] = useState("");
  const [quantityProduced, setQuantityProduced] = useState("1");
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>([]);

  async function loadData() {
    setProducts(await getProducts());
    setRecipes(await getRecipes());
  }

  useEffect(() => {
    loadData();
  }, []);

  const finalProducts = products.filter((p) =>
    ["Producto terminado", "Bebida", "Postre"].includes(p.type)
  );

  const ingredientProducts = products.filter((p) =>
    ["Insumo", "Materia prima", "Descartable", "Envase"].includes(p.type)
  );

  function addIngredient() {
    const first = ingredientProducts[0];
    if (!first) return alert("Primero registra insumos en Inventario.");

    setIngredients([
      ...ingredients,
      {
        productFirebaseId: first.firebaseId,
        name: first.name,
        quantity: 1,
        unit: "und",
      },
    ]);
  }

  function updateIngredient(index: number, field: keyof RecipeIngredient, value: string) {
    const updated = [...ingredients];

    if (field === "productFirebaseId") {
      const product = products.find((p) => p.firebaseId === value);
      updated[index].productFirebaseId = value;
      updated[index].name = product?.name || "";
    } else if (field === "quantity") {
      updated[index].quantity = Number(value);
    } else {
      updated[index][field] = value;
    }

    setIngredients(updated);
  }

  async function saveRecipe() {
    const finalProduct = products.find((p) => p.firebaseId === finalProductId);

    if (!name || !finalProduct || ingredients.length === 0) {
      alert("Completa receta, producto final e ingredientes.");
      return;
    }

    await createRecipe({
      name,
      site,
      finalProductFirebaseId: finalProduct.firebaseId,
      finalProductName: finalProduct.name,
      quantityProduced: Number(quantityProduced),
      ingredients,
      status: "active",
    });

    setName("");
    setFinalProductId("");
    setQuantityProduced("1");
    setIngredients([]);
    loadData();
  }

  async function produce(recipe: FirebaseRecipe) {
    const multiplier = Number(prompt("¿Cuántas tandas deseas producir?", "1") || "1");
    if (multiplier <= 0) return;

    for (const ingredient of recipe.ingredients) {
      const product = products.find((p) => p.firebaseId === ingredient.productFirebaseId);
      if (!product) continue;

      await updateProduct(product.firebaseId, {
        stock: product.stock - ingredient.quantity * multiplier,
      });
    }

    const finalProduct = products.find((p) => p.firebaseId === recipe.finalProductFirebaseId);

    if (finalProduct) {
      await updateProduct(finalProduct.firebaseId, {
        stock: finalProduct.stock + recipe.quantityProduced * multiplier,
      });
    }

    alert("Producción registrada correctamente.");
    loadData();
  }

  async function removeRecipe(firebaseId: string) {
    if (!confirm("¿Eliminar receta?")) return;
    await deleteRecipe(firebaseId);
    loadData();
  }

  return (
    <section className="inventory-page">
      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>Centro de Producción</h2>
            <p>Recetas, consumo de insumos y producción para Hera.</p>
          </div>
        </div>

        <div className="inventory-form">
          <input
            placeholder="Nombre de receta"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <select value={site} onChange={(e) => setSite(e.target.value)}>
            <option>Hera Cafetería Surco</option>
            <option>Hera Express VMT</option>
            <option>Hera Express Miraflores</option>
            <option>Hera Express San Borja</option>
          </select>

          <select value={finalProductId} onChange={(e) => setFinalProductId(e.target.value)}>
            <option value="">Producto final</option>
            {finalProducts.map((product) => (
              <option key={product.firebaseId} value={product.firebaseId}>
                {product.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Cantidad producida"
            value={quantityProduced}
            onChange={(e) => setQuantityProduced(e.target.value)}
          />

          <button onClick={addIngredient}>Agregar insumo</button>
          <button onClick={saveRecipe}>Guardar receta</button>
        </div>

        {ingredients.map((ingredient, index) => (
          <div className="inventory-form" key={index} style={{ marginTop: 14 }}>
            <select
              value={ingredient.productFirebaseId}
              onChange={(e) => updateIngredient(index, "productFirebaseId", e.target.value)}
            >
              {ingredientProducts.map((product) => (
                <option key={product.firebaseId} value={product.firebaseId}>
                  {product.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              value={ingredient.quantity}
              onChange={(e) => updateIngredient(index, "quantity", e.target.value)}
            />

            <input
              placeholder="Unidad: und, g, ml, kg"
              value={ingredient.unit}
              onChange={(e) => updateIngredient(index, "unit", e.target.value)}
            />
          </div>
        ))}
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>Recetas registradas</h2>
            <p>Ejecuta producción y actualiza inventario automáticamente.</p>
          </div>
          <button onClick={loadData}>Actualizar</button>
        </div>

        <div className="inventory-table">
          <table>
            <thead>
              <tr>
                <th>Receta</th>
                <th>Sede</th>
                <th>Producto final</th>
                <th>Produce</th>
                <th>Insumos</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {recipes.map((recipe) => (
                <tr key={recipe.firebaseId}>
                  <td><strong>{recipe.name}</strong></td>
                  <td>{recipe.site}</td>
                  <td>{recipe.finalProductName}</td>
                  <td>{recipe.quantityProduced}</td>
                  <td>
                    {recipe.ingredients.map((i) => (
                      <div key={i.productFirebaseId}>
                        {i.name}: {i.quantity} {i.unit}
                      </div>
                    ))}
                  </td>
                  <td className="table-actions">
                    <button onClick={() => produce(recipe)}>Producir</button>
                    <button className="danger" onClick={() => removeRecipe(recipe.firebaseId)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}

export default Produccion;