import type { FirebaseProduct } from "../../services/productService";

type CartItem = FirebaseProduct & {
  quantity: number;
};

type CartProps = {
  cart: CartItem[];
  onAddProduct: (product: FirebaseProduct) => void;
  onDecreaseProduct: (firebaseId: string) => void;
  onRemoveProduct: (firebaseId: string) => void;
  onClearCart: () => void;
};

function Cart({
  cart,
  onAddProduct,
  onDecreaseProduct,
  onRemoveProduct,
  onClearCart,
}: CartProps) {
  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <span style={{ fontSize: 50 }}>🛒</span>
        <p>Aún no hay productos agregados.</p>
      </div>
    );
  }

  return (
    <div>
      {cart.map((item) => (
        <div key={item.firebaseId} className="cart-item">
          <div>
            <strong>{item.name}</strong>
            <p>
              {item.quantity} × S/ {item.price.toFixed(2)}
            </p>
          </div>

          <div className="quantity-controls">
            <button onClick={() => onDecreaseProduct(item.firebaseId)}>-</button>
            <span>{item.quantity}</span>
            <button onClick={() => onAddProduct(item)}>+</button>
            <button
              className="delete"
              onClick={() => onRemoveProduct(item.firebaseId)}
            >
              ❌
            </button>
          </div>
        </div>
      ))}

      <button className="clear-cart" onClick={onClearCart}>
        Vaciar carrito
      </button>
    </div>
  );
}

export default Cart;