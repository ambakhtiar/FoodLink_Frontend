export type FoodCategory = "produce" | "bakery" | "dairy" | "meat" | "prepared" | "pantry" | "beverages";

export type DonationStatus = "available" | "reserved" | "picked_up" | "delivered" | "expired";

export interface Donation {
  id: string;
  donorId: string;
  title: string;
  description: string;
  category: FoodCategory;
  quantity: number;
  quantityUnit: string;
  expirationDate: string;
  pickupAddress: string;
  pickupWindowStart: string;
  pickupWindowEnd: string;
  status: DonationStatus;
  reservedBy?: string;
  reservedAt?: string;
  pickedUpAt?: string;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
  donor?: {
    id: string;
    name: string;
    businessName?: string;
  };
  receiver?: {
    id: string;
    name: string;
    organizationName?: string;
  };
}

export interface CreateDonationInput {
  title: string;
  description: string;
  category: FoodCategory;
  quantity: number;
  quantityUnit: string;
  expirationDate: string;
  pickupAddress: string;
  pickupWindowStart: string;
  pickupWindowEnd: string;
}
