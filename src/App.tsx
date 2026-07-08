import { useState } from "react";
import "./App.css";

import heraHorizontal from "./assets/logos/hera-horizontal.png";

import Dashboard from "./pages/Dashboard";
import POS from "./pages/POS";
import Inventario from "./pages/Inventario";
import Caja from "./pages/Caja";
import Ventas from "./pages/Ventas";
import Clientes from "./pages/Clientes";
import Produccion from "./pages/Produccion";

const menuItems = [
  ["📊", "Dashboard", "dashboard"],
  ["💳", "Punto de Venta", "pos"],
  ["📦", "Inventario", "inventario"],
  ["🥐", "Producción", "produccion"],
  ["🚚", "Compras", "compras"],
  ["💰", "Caja diaria", "caja"],
  ["👥", "Clientes", "clientes"],
  ["📈", "Reportes", "reportes"],
  ["⚙️", "Configuración", "configuracion"],
];

function App() {
  const [activePage, setActivePage] = useState("dashboard");

  const completedPages = [
    "dashboard",
    "pos",
    "inventario",
    "caja",
    "reportes",
    "clientes",
  ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <img src={heraHorizontal} alt="Hera Cafetería" />
          <div className="brand-line">
            <span></span>
            <p>ERP</p>
            <span></span>
          </div>
        </div>

        <nav className="menu">
          {menuItems.map(([icon, text, key]) => (
            <div
              key={key}
              onClick={() => setActivePage(key)}
              className={`menu-item ${activePage === key ? "active" : ""}`}
            >
              <span className="menu-icon">{icon}</span>
              <span>{text}</span>
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="footer-icon">☕</div>
          <div>
            <strong>Hera Cafetería</strong>
            <p>Sistema de gestión integral</p>
            <small>Versión 1.0</small>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="title-block">
            <button className="menu-button">☰</button>

            <div>
              <span className="eyebrow">
                {activePage === "dashboard"
                  ? "Buenos días, Kevin 👋"
                  : "Módulo operativo Hera"}
              </span>

              <h1>
                {activePage === "dashboard"
                  ? "Dashboard Ejecutivo"
                  : getPageTitle(activePage)}
              </h1>

              <p>
                {activePage === "dashboard"
                  ? "Control interno de ventas, caja, inventario y operación diaria."
                  : getPageDescription(activePage)}
              </p>
            </div>
          </div>

          <div className="top-actions">
            <div className="search-box">
              <span>🔎</span>
              <input placeholder="Buscar producto, venta o cliente..." />
            </div>

            <button className="notification-button">
              🔔
              <span>3</span>
            </button>

            <div className="profile">
              <div className="user-badge">K</div>
              <div>
                <strong>Kevin</strong>
                <p>Administrador</p>
              </div>
            </div>
          </div>
        </header>

        {activePage === "dashboard" && <Dashboard />}
        {activePage === "pos" && <POS />}
        {activePage === "inventario" && <Inventario />}
        {activePage === "produccion" && <Produccion />}
        {activePage === "caja" && <Caja />}
        {activePage === "reportes" && <Ventas />}
        {activePage === "clientes" && <Clientes />}

        {!completedPages.includes(activePage) && (
          <section className="panel">
            <h2>{getPageTitle(activePage)}</h2>
            <p>Esta sección se desarrollará próximamente.</p>
          </section>
        )}

        <footer className="footer">
          © 2026 Hera Cafetería ERP. Todos los derechos reservados.
        </footer>
      </main>
    </div>
  );
}

function getPageTitle(page: string) {
  const titles: Record<string, string> = {
    pos: "Punto de Venta",
    inventario: "Inventario",
    produccion: "Producción",
    compras: "Compras",
    caja: "Caja diaria",
    clientes: "Clientes",
    reportes: "Reportes",
    configuracion: "Configuración",
  };

  return titles[page] ?? "Dashboard Ejecutivo";
}

function getPageDescription(page: string) {
  const descriptions: Record<string, string> = {
    pos: "Registra ventas, productos, métodos de pago y operaciones del día.",
    inventario: "Controla stock, insumos, productos terminados y alertas.",
    produccion:
      "Administra recetas, producción diaria, mermas y consumo de insumos.",
    compras: "Registra compras, proveedores, comprobantes y gastos operativos.",
    caja: "Gestiona apertura, cierre, movimientos y arqueo de caja.",
    clientes: "Administra clientes frecuentes, historial y fidelización.",
    reportes: "Consulta indicadores, ventas, utilidad y desempeño del negocio.",
    configuracion:
      "Configura usuarios, permisos, locales y parámetros del sistema.",
  };

  return descriptions[page] ?? "Control interno de Hera Cafetería.";
}

export default App;