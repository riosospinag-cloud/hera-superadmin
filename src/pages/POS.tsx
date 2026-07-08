import { useEffect, useState } from "react";
import {
  getProducts,
  updateProduct,
  type FirebaseProduct,
} from "../services/productService";
import { createSale } from "../services/saleService";
import {
  getCustomers,
  updateCustomer,
  type FirebaseCustomer,
} from "../services/customerService";
import {
  getOpenCashRegister,
  updateCashRegister,
  type FirebaseCashRegister,
} from "../services/cashRegisterService";

import CustomerSearch from "../components/pos/CustomerSearch";
import ProductGrid from "../components/pos/ProductGrid";
import Cart from "../components/pos/Cart";
import SaleSummary from "../components/pos/SaleSummary";
import PaymentPanel from "../components/pos/PaymentPanel";

type CartItem = FirebaseProduct & {
  quantity: number;
};

function POS() {
  const [inventory, setInventory] = useState<FirebaseProduct[]>([]);
  const [customers, setCustomers] = useState<FirebaseCustomer[]>([]);
  const [openCash, setOpenCash] = useState<FirebaseCashRegister | null>(null);
  const [selectedCustomer, setSelectedCustomer] =
    useState<FirebaseCustomer | null>(null);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [documentType, setDocumentType] = useState<"boleta" | "factura">("boleta");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [ruc, setRuc] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [cashReceived, setCashReceived] = useState("");

  async function loadProducts() {
    const data = await getProducts();
    setInventory(data);
  }

  async function loadCustomers() {
    const data = await getCustomers();
    setCustomers(data);
  }

  async function loadOpenCash() {
    const data = await getOpenCashRegister();
    setOpenCash(data);
  }

  useEffect(() => {
    loadProducts();
    loadCustomers();
    loadOpenCash();
  }, []);

  const categories = [
    "Todas",
    ...Array.from(new Set(inventory.map((p) => p.category))),
  ];

  const filteredProducts = inventory.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "Todas" || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const subtotal = documentType === "factura" ? total / 1.18 : total;
  const igv = documentType === "factura" ? total - subtotal : 0;

  const change =
    paymentMethod === "Efectivo" ? Number(cashReceived || 0) - total : 0;

  function selectCustomer(customer: FirebaseCustomer) {
    setSelectedCustomer(customer);
    setCustomerSearch(customer.name);

    if (customer.documentType === "RUC") {
      setDocumentType("factura");
      setRuc(customer.documentNumber);
      setBusinessName(customer.name);
    }
  }

  function getAvailableStock(product: FirebaseProduct) {
    const itemInCart = cart.find(
      (item) => item.firebaseId === product.firebaseId
    );

    return product.stock - (itemInCart?.quantity || 0);
  }

  function addProduct(product: FirebaseProduct) {
    const availableStock = getAvailableStock(product);

    if (availableStock <= 0) {
      alert("No hay stock disponible para este producto.");
      return;
    }

    const exists = cart.find((p) => p.firebaseId === product.firebaseId);

    if (exists) {
      setCart(
        cart.map((p) =>
          p.firebaseId === product.firebaseId
            ? { ...p, quantity: p.quantity + 1 }
            : p
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  }

  function decreaseProduct(firebaseId: string) {
    setCart(
      cart
        .map((p) =>
          p.firebaseId === firebaseId
            ? { ...p, quantity: p.quantity - 1 }
            : p
        )
        .filter((p) => p.quantity > 0)
    );
  }

  function removeProduct(firebaseId: string) {
    setCart(cart.filter((p) => p.firebaseId !== firebaseId));
  }

  function newSale() {
    setCart([]);
    setDocumentType("boleta");
    setPaymentMethod("");
    setRuc("");
    setBusinessName("");
    setCashReceived("");
    setSelectedCustomer(null);
    setCustomerSearch("");
  }

  async function updateCashAfterSale() {
    if (!openCash) return;

    const dataToUpdate = {
      totalSales: Number(openCash.totalSales || 0) + total,
      cashSales:
        paymentMethod === "Efectivo"
          ? Number(openCash.cashSales || 0) + total
          : Number(openCash.cashSales || 0),
      yapeSales:
        paymentMethod === "Yape"
          ? Number(openCash.yapeSales || 0) + total
          : Number(openCash.yapeSales || 0),
      plinSales:
        paymentMethod === "Plin"
          ? Number(openCash.plinSales || 0) + total
          : Number(openCash.plinSales || 0),
      cardSales:
        paymentMethod === "Tarjeta"
          ? Number(openCash.cardSales || 0) + total
          : Number(openCash.cardSales || 0),
    };

    await updateCashRegister(openCash.firebaseId, dataToUpdate);
  }

  async function finishSale() {
    if (!openCash) {
      return alert("No existe una caja abierta. Debes abrir caja antes de vender.");
    }

    if (cart.length === 0) return alert("Agrega al menos un producto.");
    if (!paymentMethod) return alert("Selecciona un método de pago.");

    if (paymentMethod === "Efectivo" && Number(cashReceived || 0) < total) {
      return alert("El efectivo recibido no cubre el total.");
    }

    if (documentType === "factura") {
      if (ruc.trim().length !== 11) {
        return alert("Ingresa un RUC válido de 11 dígitos.");
      }

      if (!businessName.trim()) {
        return alert("Ingresa la razón social.");
      }
    }

    await createSale({
      documentType,
      paymentMethod,
      ruc: documentType === "factura" ? ruc : "",
      businessName:
        documentType === "factura"
          ? businessName
          : selectedCustomer?.name || "Consumidor final",
      subtotal,
      igv,
      total,
      userName: "Kevin",
      status: "completed",
      items: cart.map((item) => ({
        productId: item.id ?? 0,
        firebaseId: item.firebaseId,
        name: item.name,
        category: item.category,
        price: item.price,
        quantity: item.quantity,
        lineTotal: item.price * item.quantity,
      })),
    });

    for (const item of cart) {
      await updateProduct(item.firebaseId, {
        stock: item.stock - item.quantity,
      });
    }

    if (selectedCustomer) {
      await updateCustomer(selectedCustomer.firebaseId, {
        points: Number(selectedCustomer.points || 0) + Math.floor(total),
      });
    }

    await updateCashAfterSale();

    alert(
      `Venta registrada correctamente\nCliente: ${
        selectedCustomer?.name || "Consumidor final"
      }\nDocumento: ${documentType.toUpperCase()}\nPago: ${paymentMethod}\nTotal: S/ ${total.toFixed(
        2
      )}`
    );

    newSale();
    loadProducts();
    loadCustomers();
    loadOpenCash();
  }

  return (
    <section className="pos-grid">
      <div className="panel pos-products">
        <div className="panel-header">
          <div>
            <h2>Punto de Venta</h2>
            <p>
              {openCash
                ? "Caja abierta. Puedes registrar ventas."
                : "Debes abrir caja antes de vender."}
            </p>
          </div>

          <button onClick={newSale}>Nueva venta</button>
        </div>

        {!openCash && (
          <div className="no-results">
            ⚠ No existe una caja abierta. Ve a Caja diaria y abre caja.
          </div>
        )}

        <div className="pos-tools">
          <input
            type="text"
            placeholder="Buscar producto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="category-tabs">
            {categories.map((category) => (
              <button
                key={category}
                className={selectedCategory === category ? "selected" : ""}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <ProductGrid
          products={filteredProducts}
          getAvailableStock={getAvailableStock}
          onAddProduct={addProduct}
        />
      </div>

      <div className="panel pos-cart">
        <h2>Detalle de venta</h2>

        <CustomerSearch
          customers={customers}
          selectedCustomer={selectedCustomer}
          customerSearch={customerSearch}
          setCustomerSearch={setCustomerSearch}
          setSelectedCustomer={setSelectedCustomer}
          onSelectCustomer={selectCustomer}
        />

        <Cart
          cart={cart}
          onAddProduct={addProduct}
          onDecreaseProduct={decreaseProduct}
          onRemoveProduct={removeProduct}
          onClearCart={() => setCart([])}
        />

        <SaleSummary
          documentType={documentType}
          subtotal={subtotal}
          igv={igv}
          total={total}
        />

        <PaymentPanel
          documentType={documentType}
          setDocumentType={setDocumentType}
          ruc={ruc}
          setRuc={setRuc}
          businessName={businessName}
          setBusinessName={setBusinessName}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          cashReceived={cashReceived}
          setCashReceived={setCashReceived}
          change={change}
        />

        <button
          className="finish-sale"
          disabled={cart.length === 0 || !openCash}
          onClick={finishSale}
        >
          Finalizar venta
        </button>
      </div>
    </section>
  );
}

export default POS;