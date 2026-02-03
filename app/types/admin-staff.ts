export type AdminRole =
  | "Super Admin"
  | "Ops"
  | "Finance"
  | "Logistics"
  | "Support"
  | "Read-Only";

export type Admin = {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  isActive: boolean;
  role: AdminRole;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
};
