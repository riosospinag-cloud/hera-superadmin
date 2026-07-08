type SaleSummaryProps = {
  documentType: "boleta" | "factura";
  subtotal: number;
  igv: number;
  total: number;
};

function SaleSummary({
  documentType,
  subtotal,
  igv,
  total,
}: SaleSummaryProps) {
  return (
    <div className="sale-summary">
      {documentType === "factura" && (
        <>
          <div>
            <span>Subtotal</span>
            <strong>S/ {subtotal.toFixed(2)}</strong>
          </div>

          <div>
            <span>IGV (18%)</span>
            <strong>S/ {igv.toFixed(2)}</strong>
          </div>
        </>
      )}

      <div className="total-row">
        <span>Total</span>
        <strong>S/ {total.toFixed(2)}</strong>
      </div>
    </div>
  );
}

export default SaleSummary;