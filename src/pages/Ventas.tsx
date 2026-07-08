import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

type SaleItem = {
  name: string;
  quantity: number;
  price: number;
  lineTotal: number;
};

type Sale = {
  id: string;
  documentType: string;
  paymentMethod: string;
  businessName: string;
  subtotal: number;
  igv: number;
  total: number;
  items: SaleItem[];
  createdAt?: {
    seconds: number;
  };
};

function Ventas() {
  const [sales, setSales] = useState<Sale[]>([]);

  async function loadSales() {
    const salesRef = collection(db, "sales");
    const q = query(salesRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Sale[];

    setSales(data);
  }

  useEffect(() => {
    loadSales();
  }, []);

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <h2>Historial de Ventas</h2>
          <p>Consulta las ventas registradas desde el Punto de Venta.</p>
        </div>

        <button onClick={loadSales}>Actualizar</button>
      </div>

      <div className="inventory-table">
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Documento</th>
              <th>Cliente</th>
              <th>Pago</th>
              <th>Productos</th>
              <th>Total</th>
            </tr>
          </thead>

          <tbody>
            {sales.map((sale) => (
              <tr key={sale.id}>
                <td>
                  {sale.createdAt
                    ? new Date(sale.createdAt.seconds * 1000).toLocaleString()
                    : "Sin fecha"}
                </td>
                <td>{sale.documentType.toUpperCase()}</td>
                <td>{sale.businessName || "Consumidor final"}</td>
                <td>{sale.paymentMethod}</td>
                <td>
                  {sale.items.map((item) => (
                    <div key={item.name}>
                      {item.quantity} x {item.name}
                    </div>
                  ))}
                </td>
                <td>
                  <strong>S/ {sale.total.toFixed(2)}</strong>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default Ventas;