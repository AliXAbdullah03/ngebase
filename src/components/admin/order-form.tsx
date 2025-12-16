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
import { toast } from '@/hooks/use-toast';

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
    items: order?.items || [{ description: '', quantity: '' }],
    totalAmount: order?.totalAmount || 0,
    notes: order?.notes || '',
    departureDate: order?.departureDate ? new Date(order.departureDate) : undefined,
  });

  const [departureDateOpen, setDepartureDateOpen] = useState(false);
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<any[]>([]);
  const [customerSearch, setCustomerSearch] = useState(
    existingCustomer 
      ? `${existingCustomer.firstName || ''} ${existingCustomer.lastName || ''}`.trim() || existingCustomer.phone || ''
      : ''
  );
  const [showCustomerSuggestions, setShowCustomerSuggestions] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
    order?.customerId?._id || order?.customerId?.id || order?.customerId || null
  );

  // Fetch branches and customers from backend
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

        // Fetch customers
        const customersRes = await apiRequest('/customers?limit=1000');
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
      // For quantity field, allow empty string but convert to number when valid
      if (field === 'quantity') {
        const numValue = value === '' ? '' : (parseInt(value) || '');
        newItems[index] = { ...newItems[index], [field]: numValue };
      } else {
        newItems[index] = { ...newItems[index], [field]: value };
      }
      return {
        ...prevFormData,
        items: newItems,
      };
    });
  };

  const addItem = () => {
    setFormData(prevFormData => ({
      ...prevFormData,
      items: [...prevFormData.items, { description: '', quantity: '' }]
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

  // Filter customers based on search query
  const filteredCustomers = customers.filter((customer: any) => {
    if (!customerSearch.trim()) return false;
    const searchLower = customerSearch.toLowerCase();
    const firstName = (customer.firstName || '').toLowerCase();
    const lastName = (customer.lastName || '').toLowerCase();
    const phone = (customer.phone || '').toLowerCase();
    const email = (customer.email || '').toLowerCase();
    
    return firstName.includes(searchLower) || 
           lastName.includes(searchLower) || 
           phone.includes(searchLower) ||
           email.includes(searchLower) ||
           `${firstName} ${lastName}`.includes(searchLower);
  });

  // Handle customer selection
  const handleCustomerSelect = (customer: any) => {
    const customerId = customer.id || customer._id;
    setSelectedCustomerId(customerId);
    setCustomerSearch(`${customer.firstName || ''} ${customer.lastName || ''}`.trim() || customer.phone || '');
    setShowCustomerSuggestions(false);
    
    // Auto-fill all customer fields
    setFormData(prevFormData => ({
      ...prevFormData,
      customerId: customerId,
      customerFirstName: customer.firstName || '',
      customerLastName: customer.lastName || '',
      customerEmail: customer.email || '',
      customerPhone: customer.phone || '',
      customerAddress: customer.address || '',
      customerCity: customer.city || '',
      customerCountry: customer.country || '',
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate items - check for empty or invalid quantities
    const invalidItems = formData.items.filter((item: any, index: number) => {
      const quantity = item.quantity;
      return !quantity || quantity === '' || quantity === 0 || isNaN(quantity) || quantity < 1;
    });
    
    if (invalidItems.length > 0) {
      toast({
        title: "Validation Error",
        description: "At least 1 quantity is required for all items. Please ensure all items have a quantity of 1 or more.",
        variant: "destructive",
      });
      return;
    }
    
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
    
    // Convert empty branchId to null and ensure quantities are numbers
    const submitData = {
      ...formData,
      customerData, // Include customer data for processing
      branchId: formData.branchId && formData.branchId !== 'none' ? formData.branchId : null,
      departureDate: formData.departureDate?.toISOString(),
      items: formData.items.map((item: any) => ({
        ...item,
        quantity: typeof item.quantity === 'string' ? parseInt(item.quantity) || 1 : (item.quantity || 1)
      }))
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
            
            {/* Customer Search Autocomplete */}
            {!order?.customerId && (
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="customerSearch">Search Existing Customer</Label>
                  {selectedCustomerId && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedCustomerId(null);
                        setCustomerSearch('');
                        setFormData(prevFormData => ({
                          ...prevFormData,
                          customerId: '',
                          customerFirstName: '',
                          customerLastName: '',
                          customerEmail: '',
                          customerPhone: '',
                          customerAddress: '',
                          customerCity: '',
                          customerCountry: '',
                        }));
                      }}
                      className="text-xs h-6"
                    >
                      Clear Selection
                    </Button>
                  )}
                </div>
                <Input
                  id="customerSearch"
                  type="text"
                  placeholder="Type customer name, phone, or email to search..."
                  value={customerSearch}
                  onChange={(e) => {
                    setCustomerSearch(e.target.value);
                    setShowCustomerSuggestions(true);
                    // Clear selection if user starts typing
                    if (selectedCustomerId && e.target.value !== customerSearch) {
                      setSelectedCustomerId(null);
                    }
                  }}
                  onFocus={() => {
                    if (customerSearch.trim()) {
                      setShowCustomerSuggestions(true);
                    }
                  }}
                  onBlur={() => {
                    // Delay hiding suggestions to allow click events
                    setTimeout(() => setShowCustomerSuggestions(false), 200);
                  }}
                  className="w-full"
                />
                {selectedCustomerId && (
                  <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                    <span>✓</span> Customer selected - fields below are auto-filled
                  </p>
                )}
                {showCustomerSuggestions && filteredCustomers.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                    {filteredCustomers.slice(0, 10).map((customer: any) => {
                      const customerId = customer.id || customer._id;
                      const fullName = `${customer.firstName || ''} ${customer.lastName || ''}`.trim();
                      return (
                        <div
                          key={customerId}
                          className="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                          onMouseDown={(e) => {
                            e.preventDefault(); // Prevent onBlur from firing
                            handleCustomerSelect(customer);
                          }}
                        >
                          <div className="font-medium">{fullName || 'Unnamed Customer'}</div>
                          <div className="text-sm text-muted-foreground">
                            {customer.phone && <span>📞 {customer.phone}</span>}
                            {customer.email && <span className="ml-2">✉️ {customer.email}</span>}
                          </div>
                          {customer.address && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {customer.address}{customer.city ? `, ${customer.city}` : ''}{customer.country ? `, ${customer.country}` : ''}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
                {showCustomerSuggestions && customerSearch.trim() && filteredCustomers.length === 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-4 text-sm text-muted-foreground">
                    No customers found. You can create a new customer by filling the fields below.
                  </div>
                )}
              </div>
            )}
            
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
                <div key={index} className="space-y-2">
                  <div className="grid grid-cols-12 gap-2 items-start">
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
                        placeholder="Quantity (min: 1)"
                        value={item.quantity === undefined || item.quantity === null || item.quantity === '' ? '' : item.quantity}
                        onChange={(e) => {
                          const value = e.target.value;
                          // Allow empty string, but validate on submit
                          if (value === '') {
                            handleItemChange(index, 'quantity', '');
                          } else {
                            const numValue = parseInt(value);
                            handleItemChange(index, 'quantity', isNaN(numValue) ? '' : numValue);
                          }
                        }}
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
                  {(item.quantity === '' || item.quantity === 0 || (item.quantity !== undefined && item.quantity !== null && item.quantity < 1)) && (
                    <p className="text-xs text-red-500 text-center col-span-12">At least 1 is required</p>
                  )}
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

