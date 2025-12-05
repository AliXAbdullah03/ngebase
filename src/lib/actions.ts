'use server';

import { z } from 'zod';
import { createShipment as apiCreateShipment, updateShipmentStatus as apiUpdateShipmentStatus, getShipments, updateBatchStatus as apiUpdateBatchStatus } from './data';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { ShipmentStatus, Parcel } from './types';

const contactInfoSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  address: z.string().min(10, { message: "Address must be at least 10 characters." }),
  phone: z.string().min(7, { message: "Please enter a valid phone number." }),
  email: z.string().email({ message: "Please enter a valid email." }).optional().or(z.literal('')),
});

const parcelSchema = z.object({
  items: z.string().min(1, { message: "Item description is required." }),
  weight: z.string().min(1, { message: "Weight is required." }),
});

const shipmentSchema = z.object({
  shipper: contactInfoSchema,
  receiver: contactInfoSchema,
  invoiceNumber: z.string().min(1, { message: "Invoice number is required." }),
  batchNumber: z.string().min(1, { message: "Batch number is required." }),
  parcels: z.array(parcelSchema).min(1, { message: "At least one parcel is required." }),
  departureDate: z.string().min(1, 'Departure date is required'),
});

export async function createShipment(prevState: any, formData: FormData) {
  
  const parcelItems = formData.getAll('parcelItems[]');
  const parcelWeights = formData.getAll('parcelWeights[]');
  
  const parcels: Parcel[] = parcelItems.map((items, index) => ({
    items: items as string,
    weight: parcelWeights[index] as string,
  }));

  const validatedFields = shipmentSchema.safeParse({
    shipper: {
      firstName: formData.get('shipperFirstName'),
      lastName: formData.get('shipperLastName'),
      address: formData.get('shipperAddress'),
      phone: formData.get('shipperPhone'),
      email: formData.get('shipperEmail'),
    },
    receiver: {
      firstName: formData.get('receiverFirstName'),
      lastName: formData.get('receiverLastName'),
      address: formData.get('receiverAddress'),
      phone: formData.get('receiverPhone'),
      email: formData.get('receiverEmail'),
    },
    invoiceNumber: formData.get('invoiceNumber'),
    batchNumber: formData.get('batchNumber'),
    parcels: parcels,
    departureDate: formData.get('departureDate'),
  });

  if (!validatedFields.success) {
    console.log(validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Error: Please check the form fields.',
    };
  }

  try {
    const newShipment = await apiCreateShipment({
      ...validatedFields.data,
      departureDate: new Date(validatedFields.data.departureDate).toISOString(),
    });
    revalidatePath('/admin/shipments');
    revalidatePath('/admin/batch-status');
    // We will redirect in the component after showing a success toast
    return { success: true, message: `Shipment ${newShipment.id} created successfully.`, shipmentId: newShipment.id };
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Shipment.',
    };
  }
}

const updateStatusSchema = z.object({
    shipmentId: z.string(),
    status: z.string(),
    notes: z.string().optional(),
    location: z.string().min(2, 'Location is required.'),
});

export async function updateShipmentStatus(prevState: any, formData: FormData) {
    const validatedFields = updateStatusSchema.safeParse({
        shipmentId: formData.get('shipmentId'),
        status: formData.get('status'),
        notes: formData.get('notes'),
        location: formData.get('location'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Error: Please provide all required fields.',
        };
    }
    
    try {
        const { shipmentId, status, notes, location } = validatedFields.data;
        const updated = await apiUpdateShipmentStatus(shipmentId, status as ShipmentStatus, notes || '', location);
        if (!updated) {
            return { message: 'Error: Shipment not found.' };
        }
        revalidatePath('/admin/shipments');
        revalidatePath(`/admin/shipments/${shipmentId}`);
        revalidatePath(`/track/${shipmentId}`);
        revalidatePath('/admin/batch-status');
        return { success: true, message: `Status updated to ${status}.`};
    } catch (error) {
        return { message: 'Database Error: Failed to update status.' };
    }
}

const updateBatchStatusSchema = z.object({
    batchNumber: z.string(),
    status: z.string(),
    notes: z.string().optional(),
    location: z.string().min(2, 'Location is required.'),
});

export async function updateBatchStatus(prevState: any, formData: FormData) {
    const validatedFields = updateBatchStatusSchema.safeParse({
        batchNumber: formData.get('batchNumber'),
        status: formData.get('status'),
        notes: formData.get('notes'),
        location: formData.get('location'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Error: Please provide all required fields.',
        };
    }

    try {
        const { batchNumber, status, notes, location } = validatedFields.data;
        const updatedShipmentIds = await apiUpdateBatchStatus(batchNumber, status as ShipmentStatus, notes || '', location);

        revalidatePath('/admin/shipments');
        revalidatePath('/admin/batch-status');
        updatedShipmentIds.forEach(id => {
            revalidatePath(`/admin/shipments/${id}`);
            revalidatePath(`/track/${id}`);
        });

        return { success: true, message: `Status for batch ${batchNumber} updated to ${status}.`};
    } catch (error) {
        return { message: 'Database Error: Failed to update batch status.' };
    }
}
