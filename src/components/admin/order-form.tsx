"use client"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Save, X, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { apiRequest } from '@/lib/api';

interface OrderFormProps {
  order?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}

export function OrderForm({ order, onSave, onCancel }: OrderFormProps) {
  // If editing an order, use existing customer data, otherwise start with empty customer fields
  const existingCustomer = order?.customerId || order?.customer;
  
  const [formData, setFormData] = useState({
    // Customer fields (for new orders or editing)
    customerFirstName: existingCustomer?.firstName || order?.customerFirstName || '',
    customerLastName: existingCustomer?.lastName || order?.customerLastName || '',
    customerEmail: existingCustomer?.email || order?.customerEmail || '',
    customerPhone: existingCustomer?.phone || order?.customerPhone || '',
    customerAddress: existingCustomer?.address || order?.customerAddress || '',
    customerCity: existingCustomer?.city || order?.customerCity || '',
    customerCountry: existingCustomer?.country || order?.customerCountry || '',
    // Order fields
    customerId: order?.customerId?._id || order?.customerId?.id || order?.customerId || '',
    branchId: order?.branchId || order?.branchId?._id || order?.branchId?.id || '',
    items: order?.items || [{ description: '', quantity: 1 }],
    totalAmount: order?.totalAmount || 0,
    notes: order?.notes || '',
    departureDate: order?.departureDate ? new Date(order.departureDate) : undefined,
  });

  const [departureDateOpen, setDepartureDateOpen] = useState(false);
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch branches from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch branches
        const branchesRes = await apiRequest('/branches');
        if (branchesRes.ok) {
          const branchesData = await branchesRes.json();
          let branchesList = [];
          
          if (branchesData.data) {
            if (Array.isArray(branchesData.data)) {
              branchesList = branchesData.data;
            } else if (branchesData.data.branches && Array.isArray(branchesData.data.branches)) {
              branchesList = branchesData.data.branches;
            } else if (branchesData.data.items && Array.isArray(branchesData.data.items)) {
              branchesList = branchesData.data.items;
            }
          }
          
          if (!Array.isArray(branchesList)) branchesList = [];
          setBranches(branchesList);
        }
      } catch (err) {
        console.error('Error fetching form data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleItemChange = (index: number, field: string, value: any) => {
    setFormData(prevFormData => {
      const newItems = [...prevFormData.items];
      newItems[index] = { ...newItems[index], [field]: value };
      return {
        ...prevFormData,
        items: newItems,
      };
    });
  };

  const addItem = () => {
    setFormData(prevFormData => ({
      ...prevFormData,
      items: [...prevFormData.items, { description: '', quantity: 1 }]
    }));
  };

  const removeItem = (index: number) => {
    setFormData(prevFormData => {
      const newItems = prevFormData.items.filter((_item: any, i: number) => i !== index);
      return {
        ...prevFormData,
        items: newItems,
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepare customer data and order data
    const customerData = {
      firstName: formData.customerFirstName,
      lastName: formData.customerLastName,
      email: formData.customerEmail,
      phone: formData.customerPhone,
      address: formData.customerAddress,
      city: formData.customerCity,
      country: formData.customerCountry,
    };
    
    // Convert empty branchId to null
    const submitData = {
      ...formData,
      customerData, // Include customer data for processing
      branchId: formData.branchId && formData.branchId !== 'none' ? formData.branchId : null,
      departureDate: formData.departureDate?.toISOString(),
    };
    
    onSave(submitData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{order ? 'Modify Order' : 'Create New Order'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Information Section */}
          <div className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Customer Information</h3>
              {order?.customerId && (
                <span className="text-sm text-muted-foreground">(Read-only for existing orders)</span>
              )}
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customerFirstName">First Name *</Label>
                <Input
                  id="customerFirstName"
                  value={formData.customerFirstName}
                  onChange={(e) => setFormData({ ...formData, customerFirstName: e.target.value })}
                  required
                  disabled={!!order?.customerId} // Disable if editing existing order with customer
                />
              </div>
              <div>
                <Label htmlFor="customerLastName">Last Name *</Label>
                <Input
                  id="customerLastName"
                  value={formData.customerLastName}
                  onChange={(e) => setFormData({ ...formData, customerLastName: e.target.value })}
                  required
                  disabled={!!order?.customerId}
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customerEmail">Email *</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                  required
                  disabled={!!order?.customerId}
                />
              </div>
              <div>
                <Label htmlFor="customerPhone">Phone *</Label>
                <Input
                  id="customerPhone"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  required
                  disabled={!!order?.customerId}
                  placeholder="Used to match existing customers"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="customerAddress">Address</Label>
              <Input
                id="customerAddress"
                value={formData.customerAddress}
                onChange={(e) => setFormData({ ...formData, customerAddress: e.target.value })}
                disabled={!!order?.customerId}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customerCity">City</Label>
                <Input
                  id="customerCity"
                  value={formData.customerCity}
                  onChange={(e) => setFormData({ ...formData, customerCity: e.target.value })}
                  disabled={!!order?.customerId}
                />
              </div>
              <div>
                <Label htmlFor="customerCountry">Country</Label>
                <Input
                  id="customerCountry"
                  value={formData.customerCountry}
                  onChange={(e) => setFormData({ ...formData, customerCountry: e.target.value })}
                  disabled={!!order?.customerId}
                />
              </div>
            </div>
          </div>

          {/* Order Details Section */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="branchId">Branch</Label>
              <Select
                value={formData.branchId || "none"}
                onValueChange={(value) => setFormData({ ...formData, branchId: value === "none" ? "" : value })}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder={loading ? "Loading branches..." : "Select branch"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {branches.map((branch) => {
                    const branchId = branch.id || branch._id;
                    // Ensure branchId is not empty
                    if (!branchId || branchId === '') {
                      return null;
                    }
                    const branchName = branch.name || 'Unknown';
                    return (
                      <SelectItem key={branchId} value={branchId}>
                        {branchName}
                      </SelectItem>
                    );
                  }).filter(Boolean)}
                  {branches.length === 0 && !loading && (
                    <div className="px-2 py-1.5 text-sm text-muted-foreground">No branches found</div>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Departure Schedule</Label>
            <Popover open={departureDateOpen} onOpenChange={setDepartureDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.departureDate ? (
                    format(formData.departureDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.departureDate}
                  onSelect={(date) => {
                    setFormData({ ...formData, departureDate: date });
                    setDepartureDateOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Order Items</Label>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                Add Item
              </Button>
            </div>
            <div className="space-y-3">
              {formData.items.map((item: any, index: number) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-8">
                    <Input
                      placeholder="Item description"
                      value={item.description || ''}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-span-3">
                    <Input
                      type="number"
                      placeholder="Quantity"
                      value={item.quantity || 1}
                      onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                      min="1"
                      required
                    />
                  </div>
                  <div className="col-span-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              <Save className="w-4 h-4 mr-2" />
              {order ? 'Update Order' : 'Create Order'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

