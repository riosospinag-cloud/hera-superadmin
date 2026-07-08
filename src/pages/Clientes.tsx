import { useEffect, useState } from "react";
import {
  createCustomer,
  deleteCustomer,
  getCustomers,
  type FirebaseCustomer,
} from "../services/customerService";
import type { Customer } from "../types/customer";

function Clientes() {
  const [customers, setCustomers] = useState<FirebaseCustomer[]>([]);
  const [form, setForm] = useState<Customer>({
    name: "",
    documentType: "DNI",
    documentNumber: "",
    phone: "",
    email: "",
    birthday: "",
    points: 0,
    status: "activo",
  });

  async function loadCustomers() {
    const data = await getCustomers();
    setCustomers(data);
  }

  useEffect(() => {
    loadCustomers();
  }, []);

  function resetForm() {
    setForm({
      name: "",
      documentType: "DNI",
      documentNumber: "",
      phone: "",
      email: "",
      birthday: "",
      points: 0,
      status: "activo",
    });
  }

  async function saveCustomer() {
    if (!form.name || !form.documentNumber || !form.phone) {
      alert("Completa nombre, documento y teléfono.");
      return;
    }

    await createCustomer(form);
    resetForm();
    loadCustomers();
  }

  async function handleDelete(firebaseId: string) {
    const confirmDelete = confirm("¿Eliminar este cliente?");
    if (!confirmDelete) return;

    await deleteCustomer(firebaseId);
    loadCustomers();
  }

  return (
    <section className="inventory-page">
      <div className="inventory-summary">
        <InventoryCard title="Clientes" value={customers.length} icon="👥" />
        <InventoryCard
          title="Clientes activos"
          value={customers.filter((c) => c.status === "activo").length}
          icon="✅"
        />
        <InventoryCard
          title="Puntos acumulados"
          value={customers.reduce((sum, c) => sum + Number(c.points || 0), 0)}
          icon="⭐"
        />
      </div>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>Nuevo cliente</h2>
            <p>Registra clientes frecuentes para historial y fidelización.</p>
          </div>
        </div>

        <div className="inventory-form">
          <input
            placeholder="Nombre completo"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <select
            value={form.documentType}
            onChange={(e) =>
              setForm({
                ...form,
                documentType: e.target.value as "DNI" | "RUC",
              })
            }
          >
            <option value="DNI">DNI</option>
            <option value="RUC">RUC</option>
          </select>

          <input
            placeholder="N° documento"
            value={form.documentNumber}
            onChange={(e) =>
              setForm({ ...form, documentNumber: e.target.value })
            }
          />

          <input
            placeholder="Celular"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />

          <input
            placeholder="Correo"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            type="date"
            value={form.birthday}
            onChange={(e) => setForm({ ...form, birthday: e.target.value })}
          />

          <button onClick={saveCustomer}>Agregar cliente</button>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>Clientes</h2>
            <p>Base de clientes guardada en Firebase Firestore.</p>
          </div>

          <button onClick={loadCustomers}>Actualizar</button>
        </div>

        <div className="inventory-table">
          <table>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Documento</th>
                <th>Celular</th>
                <th>Correo</th>
                <th>Cumpleaños</th>
                <th>Puntos</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {customers.map((customer) => (
                <tr key={customer.firebaseId}>
                  <td>
                    <strong>{customer.name}</strong>
                  </td>
                  <td>
                    {customer.documentType} {customer.documentNumber}
                  </td>
                  <td>{customer.phone}</td>
                  <td>{customer.email || "-"}</td>
                  <td>{customer.birthday || "-"}</td>
                  <td>{customer.points}</td>
                  <td>
                    <span className="status disponible">
                      {customer.status}
                    </span>
                  </td>
                  <td className="table-actions">
                    <button
                      className="danger"
                      onClick={() => handleDelete(customer.firebaseId)}
                    >
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

export default Clientes;