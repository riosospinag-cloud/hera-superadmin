import { useEffect, useState } from "react";
import {
  closeCashRegister,
  getCashRegisters,
  openCashRegister,
  type FirebaseCashRegister,
} from "../services/cashRegisterService";

function Caja() {
  const [cashRegisters, setCashRegisters] = useState<FirebaseCashRegister[]>([]);
  const [openingAmount, setOpeningAmount] = useState("");
  const [closingAmount, setClosingAmount] = useState("");

  const openRegister = cashRegisters.find((cash) => cash.status === "open");

  async function loadCashRegisters() {
    const data = await getCashRegisters();
    setCashRegisters(data);
  }

  useEffect(() => {
    loadCashRegisters();
  }, []);

  async function handleOpenCash() {
    if (!openingAmount) {
      alert("Ingresa el monto inicial.");
      return;
    }

    await openCashRegister({
  openingAmount: Number(openingAmount),
  cashSales: 0,
  yapeSales: 0,
  plinSales: 0,
  cardSales: 0,
  totalSales: 0,
  status: "open",
  openedBy: "Kevin",
});

    setOpeningAmount("");
    loadCashRegisters();
  }

  async function handleCloseCash() {
    if (!openRegister) return;

    if (!closingAmount) {
      alert("Ingresa el monto contado al cierre.");
      return;
    }

    const expectedAmount = openRegister.openingAmount;
    const difference = Number(closingAmount) - expectedAmount;

    await closeCashRegister(openRegister.firebaseId, {
      closingAmount: Number(closingAmount),
      expectedAmount,
      difference,
      status: "closed",
      closedBy: "Kevin",
    });

    setClosingAmount("");
    loadCashRegisters();
  }

  return (
    <section className="inventory-page">
      <div className="inventory-summary">
        <CashCard
          title="Estado"
          value={openRegister ? "Abierta" : "Cerrada"}
          icon={openRegister ? "🟢" : "🔴"}
        />

        <CashCard
          title="Monto inicial"
          value={`S/ ${openRegister?.openingAmount?.toFixed(2) || "0.00"}`}
          icon="💵"
        />

        <CashCard
          title="Cajas registradas"
          value={String(cashRegisters.length)}
          icon="📒"
        />
      </div>

      {!openRegister ? (
        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>Abrir caja</h2>
              <p>Registra el monto inicial para iniciar operaciones.</p>
            </div>
          </div>

          <div className="inventory-form">
            <input
              type="number"
              placeholder="Monto inicial"
              value={openingAmount}
              onChange={(e) => setOpeningAmount(e.target.value)}
            />

            <button onClick={handleOpenCash}>Abrir caja</button>
          </div>
        </section>
      ) : (
        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>Cerrar caja</h2>
              <p>Ingresa el monto contado al finalizar el día.</p>
            </div>
          </div>

          <div className="inventory-form">
            <input
              type="number"
              placeholder="Monto contado"
              value={closingAmount}
              onChange={(e) => setClosingAmount(e.target.value)}
            />

            <button onClick={handleCloseCash}>Cerrar caja</button>
          </div>
        </section>
      )}

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>Historial de caja</h2>
            <p>Aperturas y cierres registrados en Firebase.</p>
          </div>

          <button onClick={loadCashRegisters}>Actualizar</button>
        </div>

        <div className="inventory-table">
          <table>
            <thead>
              <tr>
                <th>Estado</th>
                <th>Apertura</th>
                <th>Cierre</th>
                <th>Inicial</th>
                <th>Esperado</th>
                <th>Contado</th>
                <th>Diferencia</th>
                <th>Responsable</th>
              </tr>
            </thead>

            <tbody>
              {cashRegisters.map((cash) => (
                <tr key={cash.firebaseId}>
                  <td>
                    <span
                      className={`status ${
                        cash.status === "open" ? "disponible" : "agotado"
                      }`}
                    >
                      {cash.status === "open" ? "Abierta" : "Cerrada"}
                    </span>
                  </td>

                  <td>{formatDate(cash.openedAt?.seconds)}</td>
                  <td>{formatDate(cash.closedAt?.seconds)}</td>
                  <td>S/ {cash.openingAmount?.toFixed(2)}</td>
                  <td>S/ {(cash.expectedAmount || 0).toFixed(2)}</td>
                  <td>S/ {(cash.closingAmount || 0).toFixed(2)}</td>
                  <td>S/ {(cash.difference || 0).toFixed(2)}</td>
                  <td>{cash.openedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}

function CashCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
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

function formatDate(seconds?: number) {
  if (!seconds) return "-";
  return new Date(seconds * 1000).toLocaleString();
}

export default Caja;