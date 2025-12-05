import type { Parcel, Shipment, ShipmentStatus } from './types';

// In-memory store for shipments
let shipments: Shipment[] = [
  {
    id: 'NGE12345678',
    shipper: {
      firstName: 'John',
      lastName: 'Doe',
      address: '123 Beacon St, New York, USA',
      phone: '212-555-0199',
      email: 'john.doe@email.com'
    },
    receiver: {
      firstName: 'Jane',
      lastName: 'Doe',
      address: '789 Oak St, London, UK',
      phone: '020-7946-0958'
    },
    invoiceNumber: 'INV-2024-001',
    batchNumber: 'BCH-2024-001',
    parcels: [{ items: 'Electronics', weight: '5kg' }, { items: 'Books', weight: '2kg' }],
    departureDate: new Date('2024-08-15T09:00:00Z').toISOString(),
    currentStatus: 'In Transit',
    history: [
      {
        status: 'Processing',
        location: 'New York, USA',
        date: new Date('2024-08-14T14:30:00Z').toISOString(),
        notes: 'Shipment information received.'
      },
      {
        status: 'In Transit',
        location: 'JFK Airport, USA',
        date: new Date('2024-08-15T10:00:00Z').toISOString(),
        notes: 'Departed from origin facility.'
      }
    ]
  },
  {
    id: 'NGE87654321',
    shipper: {
      firstName: 'Li',
      lastName: 'Wei',
      address: '456 Nanjing Rd, Shanghai, CN',
      phone: '+86 21 5555 8888',
    },
    receiver: {
      firstName: 'Jane',
      lastName: 'Smith',
      address: '101 Rodeo Dr, Los Angeles, USA',
      phone: '310-555-0188',
      email: 'jane.smith@email.com'
    },
    invoiceNumber: 'INV-2024-002',
    batchNumber: 'BCH-2024-002',
    parcels: [{ items: 'Crate of Textiles', weight: '50kg' }],
    departureDate: new Date('2024-08-16T04:00:00Z').toISOString(),
    currentStatus: 'Delivered',
    history: [
      { status: 'Processing', location: 'Shanghai, CN', date: new Date('2024-08-15T18:00:00Z').toISOString() },
      { status: 'In Transit', location: 'Shanghai Port, CN', date: new Date('2024-08-16T05:00:00Z').toISOString() },
      { status: 'In Transit', location: 'Pacific Ocean', date: new Date('2024-08-20T12:00:00Z').toISOString(), notes: 'On vessel.' },
      { status: 'Out for Delivery', location: 'Los Angeles, USA', date: new Date('2024-08-25T08:00:00Z').toISOString(), notes: 'Cleared customs.' },
      { status: 'Delivered', location: 'Los Angeles, USA', date: new Date('2024-08-25T15:45:00Z').toISOString(), notes: 'Signed by consignee.' }
    ]
  },
   {
    id: 'NGE11122233',
    shipper: {
      firstName: 'Maria',
      lastName: 'Garcia',
      address: 'Gran Via 28, Madrid, ES',
      phone: '+34 912 34 56 78',
    },
    receiver: {
      firstName: 'Hiroshi',
      lastName: 'Sato',
      address: 'Shibuya Crossing, Tokyo, JP',
      phone: '+81 3-5555-8765',
    },
    invoiceNumber: 'INV-2024-004',
    batchNumber: 'BCH-2024-001',
    parcels: [{ items: 'Fashion Apparel', weight: '15kg' }],
    departureDate: new Date('2024-08-18T12:00:00Z').toISOString(),
    currentStatus: 'In Transit',
    history: [
      { status: 'Processing', location: 'Madrid, ES', date: new Date('2024-08-18T10:00:00Z').toISOString() },
      { status: 'In Transit', location: 'Madrid Barajas Airport, ES', date: new Date('2024-08-18T14:00:00Z').toISOString(), notes: 'Departed.' },
    ]
  },
  {
    id: 'NGE55566677',
    shipper: {
      firstName: 'Klaus',
      lastName: 'Müller',
      address: 'Unter den Linden 77, Frankfurt, DE',
      phone: '+49 30 12345678'
    },
    receiver: {
      firstName: 'Yuki',
      lastName: 'Tanaka',
      address: '1-1, Chiyoda, Tokyo, JP',
      phone: '+81 3-3213-1111'
    },
    invoiceNumber: 'INV-2024-003',
    batchNumber: 'BCH-2024-003',
    parcels: [{ items: 'Machine Parts', weight: '120kg' }],
    departureDate: new Date('2024-08-20T11:00:00Z').toISOString(),
    currentStatus: 'Processing',
    history: [
        { status: 'Processing', location: 'Frankfurt, DE', date: new Date().toISOString(), notes: 'Awaiting customs clearance.' }
    ]
  }
];

// Simulate network delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function getShipments(): Promise<Shipment[]> {
  await delay(500);
  return shipments.sort((a, b) => new Date(b.departureDate).getTime() - new Date(a.departureDate).getTime());
}

export async function getShipmentById(id: string): Promise<Shipment | undefined> {
  await delay(500);
  return shipments.find(s => s.id.toLowerCase() === id.toLowerCase());
}

export async function createShipment(data: {
    shipper: { firstName: string; lastName: string; address: string; phone: string; email?: string; };
    receiver: { firstName: string; lastName: string; address: string; phone: string; email?: string; };
    invoiceNumber: string;
    batchNumber: string;
    parcels: Parcel[];
    departureDate: string;
}): Promise<Shipment> {
  await delay(1000);
  const newShipment: Shipment = {
    ...data,
    id: `NGE${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
    currentStatus: 'Processing',
    history: [{
      status: 'Processing',
      location: data.shipper.address,
      date: new Date().toISOString(),
      notes: 'Shipment created and information received.'
    }]
  };
  shipments.unshift(newShipment);
  return newShipment;
}

export async function updateShipmentStatus(id: string, status: ShipmentStatus, notes: string, location: string): Promise<Shipment | undefined> {
    await delay(1000);
    const shipmentIndex = shipments.findIndex(s => s.id === id);
    if (shipmentIndex === -1) {
        return undefined;
    }

    const updatedShipment = { ...shipments[shipmentIndex] };
    updatedShipment.currentStatus = status;
    updatedShipment.history.push({
        status,
        notes,
        location,
        date: new Date().toISOString()
    });

    shipments[shipmentIndex] = updatedShipment;
    return updatedShipment;
}

export async function updateBatchStatus(batchNumber: string, status: ShipmentStatus, notes: string, location: string): Promise<string[]> {
    await delay(1000);
    const updatedShipmentIds: string[] = [];
    
    shipments.forEach((shipment, index) => {
        if (shipment.batchNumber === batchNumber) {
            const updatedShipment = { ...shipment };
            updatedShipment.currentStatus = status;
            updatedShipment.history.push({
                status,
                notes,
                location,
                date: new Date().toISOString()
            });
            shipments[index] = updatedShipment;
            updatedShipmentIds.push(shipment.id);
        }
    });

    return updatedShipmentIds;
}
