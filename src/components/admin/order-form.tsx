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
  const [formData, setFormData] = useState({
    customerId: order?.customerId || order?.customerId?._id || order?.customerId?.id || '',
    branchId: order?.branchId || order?.branchId?._id || order?.branchId?.id || '',
    items: order?.items || [{ description: '', quantity: 1 }],
    totalAmount: order?.totalAmount || 0,
    notes: order?.notes || '',
    departureDate: order?.departureDate ? new Date(order.departureDate) : undefined,
  });

  const [departureDateOpen, setDepartureDateOpen] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch customers and branches from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch customers
        const customersRes = await apiRequest('/customers?limit=100');
        if (customersRes.ok) {
          const customersData = await customersRes.json();
          let customersList = [];
          
          if (customersData.data) {
            if (Array.isArray(customersData.data)) {
              customersList = customersData.data;
            } else if (customersData.data.customers && Array.isArray(customersData.data.customers)) {
              customersList = customersData.data.customers;
            } else if (customersData.data.items && Array.isArray(customersData.data.items)) {
              customersList = customersData.data.items;
            }
          }
          
          if (!Array.isArray(customersList)) customersList = [];
          setCustomers(customersList);
        }

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
    
    // Convert empty branchId to null
    const submitData = {
      ...formData,
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
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customerId">Customer *</Label>
              <Select
                value={formData.customerId}
                onValueChange={(value) => setFormData({ ...formData, customerId: value })}
                disabled={loading}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder={loading ? "Loading customers..." : "Select customer"} />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => {
                    const customerId = customer.id || customer._id;
                    const customerName = `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || customer.email || 'Unknown';
                    return (
                      <SelectItem key={customerId} value={customerId}>
                        {customerName} {customer.email ? `(${customer.email})` : ''}
                      </SelectItem>
                    );
                  })}
                  {customers.length === 0 && !loading && (
                    <SelectItem value="" disabled>No customers found</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
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
                    const branchName = branch.name || 'Unknown';
                    return (
                      <SelectItem key={branchId} value={branchId}>
                        {branchName}
                      </SelectItem>
                    );
                  })}
                  {branches.length === 0 && !loading && (
                    <SelectItem value="" disabled>No branches found</SelectItem>
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

