export type ShipmentStatus = 'Processing' | 'In Transit' | 'Out for Delivery' | 'Delivered' | 'On Hold';

export const shipmentStatuses: ShipmentStatus[] = ['Processing', 'In Transit', 'Out for Delivery', 'Delivered', 'On Hold'];

export type ShipmentHistory = {
  status: ShipmentStatus;
  date: string; // ISO 8601 string
  notes?: string;
  location: string;
};

export type ContactInfo = {
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  email?: string;
};

export type Parcel = {
  items: string;
  weight: string;
};

export type Shipment = {
  id: string; // The auto-generated tracking ID
  shipper: ContactInfo;
  receiver: ContactInfo;
  invoiceNumber: string;
  batchNumber: string;
  parcels: Parcel[];
  departureDate: string; // ISO 8601 string
  currentStatus: ShipmentStatus;
  history: ShipmentHistory[];
};
