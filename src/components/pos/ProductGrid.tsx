import type { FirebaseProduct } from "../../services/productService";

type ProductGridProps = {
  products: FirebaseProduct[];
  getAvailableStock: (product: FirebaseProduct) => number;
  onAddProduct: (product: FirebaseProduct) => void;
};

function ProductGrid({
  products,
  getAvailableStock,
  onAddProduct,
}: ProductGridProps) {
  return (
    <div className="product-grid">
      {products.map((product) => {
        const availableStock = getAvailableStock(product);
        const isOutOfStock = availableStock <= 0;
        const isLowStock =
          availableStock > 0 && availableStock <= product.minStock;

        return (
          <button
            key={product.firebaseId}
            className={`product-card ${isOutOfStock ? "out-stock" : ""}`}
            onClick={() => onAddProduct(product)}
            disabled={isOutOfStock}
          >
            <span>{product.category}</span>
            <h3>{product.name}</h3>
            <strong>S/ {product.price.toFixed(2)}</strong>

            <small className={isLowStock ? "stock-low" : ""}>
              Stock: {availableStock}
            </small>

            {isOutOfStock && <em>Agotado</em>}
          </button>
        );
      })}
    </div>
  );
}

export default ProductGrid;