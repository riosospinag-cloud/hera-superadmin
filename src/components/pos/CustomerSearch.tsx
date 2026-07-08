import type { FirebaseCustomer } from "../../services/customerService";

type CustomerSearchProps = {
  customers: FirebaseCustomer[];
  selectedCustomer: FirebaseCustomer | null;
  customerSearch: string;
  setCustomerSearch: (value: string) => void;
  setSelectedCustomer: (customer: FirebaseCustomer | null) => void;
  onSelectCustomer: (customer: FirebaseCustomer) => void;
};

function CustomerSearch({
  customers,
  selectedCustomer,
  customerSearch,
  setCustomerSearch,
  setSelectedCustomer,
  onSelectCustomer,
}: CustomerSearchProps) {
  const search = customerSearch.toLowerCase();

  const filteredCustomers = customers.filter((customer) => {
    return (
      customer.name.toLowerCase().includes(search) ||
      customer.documentNumber.includes(search) ||
      customer.phone.includes(search) ||
      customer.email.toLowerCase().includes(search)
    );
  });

  return (
    <div className="customer-box">
      <input
        type="text"
        placeholder="Buscar cliente por nombre, DNI, RUC, celular o correo..."
        value={customerSearch}
        onChange={(e) => {
          setCustomerSearch(e.target.value);
          setSelectedCustomer(null);
        }}
      />

      {customerSearch && !selectedCustomer && (
        <div className="customer-results">
          {filteredCustomers.length === 0 ? (
            <p className="no-results">No se encontraron clientes.</p>
          ) : (
            filteredCustomers.map((customer) => (
              <button
                key={customer.firebaseId}
                onClick={() => onSelectCustomer(customer)}
              >
                <strong>{customer.name}</strong>
                <small>
                  {customer.documentType}: {customer.documentNumber}
                </small>
                <small>📱 {customer.phone}</small>
              </button>
            ))
          )}
        </div>
      )}

      {selectedCustomer && (
        <div className="selected-customer">
          <h4>{selectedCustomer.name}</h4>
          <p>
            {selectedCustomer.documentType} {selectedCustomer.documentNumber}
          </p>
          <p>📱 {selectedCustomer.phone}</p>
          <p>⭐ {selectedCustomer.points} puntos</p>
        </div>
      )}
    </div>
  );
}

export default CustomerSearch;