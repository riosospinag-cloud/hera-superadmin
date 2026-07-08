import { useEffect, useState } from "react";
import {
  getSalesForDashboard,
  type DashboardSale,
} from "../services/dashboardService";
import { getProducts, type FirebaseProduct } from "../services/productService";

type TopProduct = {
  name: string;
  quantity: number;
};

type PaymentStat = {
  method: string;
  total: number;
};

function Dashboard() {
  const [salesToday, setSalesToday] = useState(0);
  const [salesCount, setSalesCount] = useState(0);
  const [ticketAverage, setTicketAverage] = useState(0);
  const [productsSold, setProductsSold] = useState(0);
  const [criticalStock, setCriticalStock] = useState<FirebaseProduct[]>([]);
  const [latestSales, setLatestSales] = useState<DashboardSale[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [paymentStats, setPaymentStats] = useState<PaymentStat[]>([]);

  async function loadDashboard() {
    const sales = await getSalesForDashboard();
    const products = await getProducts();

    const today = new Date().toDateString();

    const todaySales = sales.filter((sale) => {
      if (!sale.createdAt) return false;
      const saleDate = new Date(sale.createdAt.seconds * 1000).toDateString();
      return saleDate === today;
    });

    const totalSales = todaySales.reduce((sum, sale) => sum + sale.total, 0);

    const totalProducts = todaySales.reduce(
      (sum, sale) =>
        sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
      0
    );

    const productMap: Record<string, number> = {};
    const paymentMap: Record<string, number> = {};

    todaySales.forEach((sale) => {
      paymentMap[sale.paymentMethod] =
        (paymentMap[sale.paymentMethod] || 0) + sale.total;

      sale.items.forEach((item) => {
        productMap[item.name] = (productMap[item.name] || 0) + item.quantity;
      });
    });

    setSalesToday(totalSales);
    setSalesCount(todaySales.length);
    setTicketAverage(todaySales.length > 0 ? totalSales / todaySales.length : 0);
    setProductsSold(totalProducts);
    setCriticalStock(products.filter((p) => p.stock <= p.minStock));
    setLatestSales(sales.slice(0, 5));

    setTopProducts(
      Object.entries(productMap)
        .map(([name, quantity]) => ({ name, quantity }))
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5)
    );

    setPaymentStats(
      Object.entries(paymentMap)
        .map(([method, total]) => ({ method, total }))
        .sort((a, b) => b.total - a.total)
    );
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <>
      <section className="kpi-grid">
        <DashboardCard
          icon="💵"
          title="Ventas de hoy"
          value={`S/ ${salesToday.toFixed(2)}`}
          detail={`${salesCount} operaciones`}
          status="positive"
        />

        <DashboardCard
          icon="🧾"
          title="Ticket promedio"
          value={`S/ ${ticketAverage.toFixed(2)}`}
          detail="Promedio por venta"
          status="positive"
        />

        <DashboardCard
          icon="🥐"
          title="Productos vendidos"
          value={String(productsSold)}
          detail="Unidades vendidas hoy"
          status="positive"
        />

        <DashboardCard
          icon="⚠️"
          title="Stock crítico"
          value={String(criticalStock.length)}
          detail="Productos por revisar"
          status="warning"
        />
      </section>

      <section className="dashboard-grid">
        <div className="panel">
          <div className="panel-header">
            <div>
              <h2>Últimas ventas</h2>
              <p>Movimientos recientes registrados en el POS.</p>
            </div>
            <button onClick={loadDashboard}>Actualizar</button>
          </div>

          <DashboardListEmpty show={latestSales.length === 0} text="No hay ventas registradas." />

          <div className="dashboard-list">
            {latestSales.map((sale) => (
              <div className="dashboard-list-item" key={sale.id}>
                <div>
                  <strong>{sale.businessName || "Consumidor final"}</strong>
                  <span>
                    {sale.paymentMethod} · {sale.documentType.toUpperCase()}
                  </span>
                </div>
                <strong>S/ {sale.total.toFixed(2)}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-header simple">
            <div className="alert-title-icon">🏆</div>
            <h2>Top productos</h2>
          </div>

          <DashboardListEmpty
            show={topProducts.length === 0}
            text="Aún no hay ranking de productos hoy."
          />

          <div className="dashboard-list">
            {topProducts.map((product) => (
              <div className="dashboard-list-item" key={product.name}>
                <strong>{product.name}</strong>
                <span>{product.quantity} vendidos</span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-header simple">
            <div className="alert-title-icon">💳</div>
            <h2>Métodos de pago</h2>
          </div>

          <DashboardListEmpty
            show={paymentStats.length === 0}
            text="Aún no hay pagos registrados hoy."
          />

          <div className="dashboard-list">
            {paymentStats.map((payment) => (
              <div className="dashboard-list-item" key={payment.method}>
                <strong>{payment.method}</strong>
                <span>S/ {payment.total.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-header simple">
            <div className="alert-title-icon">📦</div>
            <h2>Stock crítico</h2>
          </div>

          <DashboardListEmpty
            show={criticalStock.length === 0}
            text="No hay productos en stock crítico."
          />

          <div className="dashboard-list">
            {criticalStock.map((product) => (
              <div className="dashboard-list-item" key={product.firebaseId}>
                <div>
                  <strong>{product.name}</strong>
                  <span>
                    Stock: {product.stock} · Mínimo: {product.minStock}
                  </span>
                </div>
                <span className="warning">Revisar</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function DashboardCard({
  icon,
  title,
  value,
  detail,
  status,
}: {
  icon: string;
  title: string;
  value: string;
  detail: string;
  status: "positive" | "warning";
}) {
  return (
    <div className="kpi-card">
      <div className={`kpi-icon ${status}`}>{icon}</div>
      <div>
        <p>{title}</p>
        <h3>{value}</h3>
        <span className={status}>{detail}</span>
      </div>
    </div>
  );
}

function DashboardListEmpty({
  show,
  text,
}: {
  show: boolean;
  text: string;
}) {
  if (!show) return null;
  return <p className="dashboard-empty">{text}</p>;
}

export default Dashboard;