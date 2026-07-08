type PaymentPanelProps = {
  documentType: "boleta" | "factura";
  setDocumentType: (value: "boleta" | "factura") => void;

  ruc: string;
  setRuc: (value: string) => void;

  businessName: string;
  setBusinessName: (value: string) => void;

  paymentMethod: string;
  setPaymentMethod: (value: string) => void;

  cashReceived: string;
  setCashReceived: (value: string) => void;

  change: number;
};

function PaymentPanel({
  documentType,
  setDocumentType,
  ruc,
  setRuc,
  businessName,
  setBusinessName,
  paymentMethod,
  setPaymentMethod,
  cashReceived,
  setCashReceived,
  change,
}: PaymentPanelProps) {
  return (
    <>
      <div className="document-types">
        <button
          className={documentType === "boleta" ? "selected" : ""}
          onClick={() => setDocumentType("boleta")}
        >
          Boleta
        </button>

        <button
          className={documentType === "factura" ? "selected" : ""}
          onClick={() => setDocumentType("factura")}
        >
          Factura
        </button>
      </div>

      {documentType === "factura" && (
        <div className="invoice-data">
          <input
            type="text"
            placeholder="RUC (11 dígitos)"
            value={ruc}
            onChange={(e) => setRuc(e.target.value)}
          />

          <input
            type="text"
            placeholder="Razón social"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
          />
        </div>
      )}

      <div className="payment-methods">
        {["Efectivo", "Yape", "Plin", "Tarjeta"].map((method) => (
          <button
            key={method}
            className={paymentMethod === method ? "selected" : ""}
            onClick={() => setPaymentMethod(method)}
          >
            {method}
          </button>
        ))}
      </div>

      {paymentMethod === "Efectivo" && (
        <div className="cash-box">
          <input
            type="number"
            placeholder="Efectivo recibido"
            value={cashReceived}
            onChange={(e) => setCashReceived(e.target.value)}
          />

          <div>
            <span>Vuelto</span>
            <strong>S/ {change > 0 ? change.toFixed(2) : "0.00"}</strong>
          </div>
        </div>
      )}
    </>
  );
}

export default PaymentPanel;