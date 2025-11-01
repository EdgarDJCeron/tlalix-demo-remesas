export interface Employee {
  id: string;
  name: string;
  position: string;
  wallet: string;
  amount: number;
  status: "pending" | "paid";
}

export const mockEmployees: Employee[] = [
  {
    id: "1",
    name: "Carlos Mendoza",
    position: "Developer",
    wallet: "carlos.eth",
    amount: 500,
    status: "pending",
  },
  {
    id: "2",
    name: "Laura Sánchez",
    position: "Designer",
    wallet: "laura@email.com",
    amount: 450,
    status: "pending",
  },
  {
    id: "3",
    name: "Miguel Torres",
    position: "Marketing",
    wallet: "miguel.eth",
    amount: 400,
    status: "paid",
  },
  {
    id: "4",
    name: "Ana Ramírez",
    position: "Sales",
    wallet: "ana@email.com",
    amount: 425,
    status: "pending",
  },
];
