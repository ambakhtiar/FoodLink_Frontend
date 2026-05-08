export interface User {
  id: string;
  email: string;
  name: string;
  role: "donor" | "receiver" | "admin";
  createdAt: string;
  updatedAt: string;
}

export interface Donor extends User {
  role: "donor";
  businessName?: string;
  address?: string;
  phone?: string;
}

export interface Receiver extends User {
  role: "receiver";
  organizationName?: string;
  address?: string;
  phone?: string;
  capacity?: number;
}
