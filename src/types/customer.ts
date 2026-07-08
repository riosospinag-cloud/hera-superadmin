export type Customer = {
  id?: string;
  name: string;
  documentType: "DNI" | "RUC";
  documentNumber: string;
  phone: string;
  email: string;
  birthday: string;
  points: number;
  status: "activo" | "inactivo";
};