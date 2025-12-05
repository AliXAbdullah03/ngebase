"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { EnhancedHeader } from '@/components/enhanced-header';
import { EnhancedFooter } from '@/components/enhanced-footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OrderForm } from '@/components/admin/order-form';
import { StatusUpdateForm } from '@/components/admin/status-update-form';
import { UserForm } from '@/components/admin/user-form';
import { CustomerForm } from '@/components/admin/customer-form';
import { 
  BarChart3,
  Users,
  ShoppingCart,
  Package,
  Building2,
  Shield,
  UserCog,
  Globe,
  Upload,
  Save,
  Plus,
  Edit,
  Trash2,
  Search,
  ArrowRight,
  Image as ImageIcon,
  Settings,
  MapPin,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Layers,
  Star,
  X,
  Clock,
  Loader2
} from 'lucide-react';
import Image from 'next/image';
import { getCurrentUser, hasPermission, Permissions, type UserRole } from '@/lib/auth';
import { getApiUrl, apiRequest } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

export default function AdminPage() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [activeTab, setActiveTab] = useState("dashboard");
  const [openOrderForm, setOpenOrderForm] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      // Check if user has authentication token
      const token = typeof window !== 'undefined' 
        ? localStorage.getItem('authToken') || sessionStorage.getItem('authToken')
        : null;

      if (!token) {
        // No token found, redirect to login
        console.log('No authentication token found, redirecting to login...');
        router.push('/login');
        return;
      }

      // Token exists, allow access
      setCurrentUser(getCurrentUser());
      setIsCheckingAuth(false);
    };

    checkAuth();
  }, [router]);

  // Show loading state while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/5">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <EnhancedHeader />
      
      <main className="flex-grow pt-20 bg-gradient-to-br from-primary/5 via-background to-primary/5">
        <div className="container mx-auto px-4 md:px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-muted-foreground text-lg">
                  Manage your logistics operations and website content
                </p>
              </div>
              <Badge variant="outline" className="text-lg px-4 py-2">
                {currentUser?.role || 'User'}
              </Badge>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 mb-8 h-auto">
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="customers" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Customers</span>
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline">Orders</span>
              </TabsTrigger>
              <TabsTrigger value="shipments" className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                <span className="hidden sm:inline">Shipments</span>
              </TabsTrigger>
              <TabsTrigger value="branches" className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                <span className="hidden sm:inline">Branches</span>
              </TabsTrigger>
              {hasPermission(currentUser, Permissions.USER_VIEW) && (
                <TabsTrigger value="users" className="flex items-center gap-2">
                  <UserCog className="w-4 h-4" />
                  <span className="hidden sm:inline">Users</span>
                </TabsTrigger>
              )}
              {hasPermission(currentUser, Permissions.FRONTEND_EDIT) && (
                <TabsTrigger value="webpage" className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <span className="hidden sm:inline">Web Page</span>
                </TabsTrigger>
              )}
            </TabsList>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard">
              <DashboardTab 
                currentUser={currentUser} 
                onNewOrder={() => {
                  setOpenOrderForm(true);
                  setActiveTab("orders");
                }}
              />
            </TabsContent>

            {/* Customer Management Tab */}
            <TabsContent value="customers">
              <CustomerManagementTab />
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders">
              <OrdersTab currentUser={currentUser} openCreateForm={openOrderForm} onFormClose={() => setOpenOrderForm(false)} />
            </TabsContent>

            {/* Shipments Tab */}
            <TabsContent value="shipments">
              <ShipmentsTab currentUser={currentUser} />
            </TabsContent>

            {/* Branch Management Tab */}
            <TabsContent value="branches">
              <BranchManagementTab />
            </TabsContent>

            {/* User Management Tab */}
            {hasPermission(currentUser, Permissions.USER_VIEW) && (
              <TabsContent value="users">
                <UserManagementTab currentUser={currentUser} />
              </TabsContent>
            )}

            {/* Web Page Management Tab */}
            {hasPermission(currentUser, Permissions.FRONTEND_EDIT) && (
              <TabsContent value="webpage">
                <WebPageManagementTab />
              </TabsContent>
            )}
          </Tabs>
        </div>
      </main>

      <EnhancedFooter />
    </div>
  );
}

// Dashboard Tab Component
function DashboardTab({ currentUser, onNewOrder }: { currentUser: any; onNewOrder?: () => void }) {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const apiUrl = getApiUrl();
        const endpoint = `/dashboard/stats`;
        console.log('Backend API URL:', apiUrl);
        console.log('Fetching dashboard data from:', `${apiUrl}${endpoint}`);
        
        // Use apiRequest helper which automatically includes auth token
        const response = await apiRequest(endpoint, {
          method: 'GET',
          cache: 'no-store', // Ensure fresh data
        });

        console.log('Response status:', response.status);
        
        if (!response.ok) {
          // Handle 401 Unauthorized - redirect to login or show login message
          if (response.status === 401) {
            const errorText = await response.text();
            console.error('Authentication error:', errorText);
            throw new Error('UNAUTHORIZED: Authentication required. Please log in.');
          }
          
          const errorText = await response.text();
          console.error('Response error:', errorText);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Dashboard data received:', result);

        if (!result.success) {
          throw new Error(result.error?.message || 'Failed to fetch dashboard data');
        }

        if (result.data) {
          setDashboardData(result.data);
          console.log('Dashboard data set successfully');
        } else {
          throw new Error('No data received from server');
        }
      } catch (err: any) {
        console.error('Error fetching dashboard data:', err);
        
        // Provide more helpful error messages
        let errorMessage = 'Failed to load dashboard data.';
        
        if (err.message?.includes('UNAUTHORIZED') || err.message?.includes('Authentication required') || err.message?.includes('status: 401')) {
          errorMessage = `Authentication Required\n\nYou need to log in to access the dashboard.\n\nPlease:\n1. Log in to your account at /login\n2. Make sure your authentication token is valid\n3. Check if your session has expired`;
        } else if (err.message?.includes('Failed to fetch') || err.message?.includes('ERR_CONNECTION_REFUSED')) {
          const apiUrl = getApiUrl();
          errorMessage = `Cannot connect to backend at ${apiUrl}\n\nPlease check:\n1. Is your backend server running?\n2. Is the backend URL correct in .env.local? (NEXT_PUBLIC_API_URL)\n3. Is the backend running on the correct port?`;
        } else {
          errorMessage = err.message || 'Failed to load dashboard data. Please check the console for details.';
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    
    // Set up real-time updates - refresh every 30 seconds
    const intervalId = setInterval(() => {
      fetchDashboardData();
    }, 30000); // 30 seconds
    
    return () => clearInterval(intervalId);
  }, []);

  const stats = dashboardData ? [
    { label: "Total Customers", value: dashboardData.totalCustomers.toLocaleString(), icon: Users, color: "text-blue-500" },
    { label: "Active Orders", value: dashboardData.activeOrders.toLocaleString(), icon: ShoppingCart, color: "text-green-500" },
    { label: "In Transit", value: dashboardData.inTransit.toLocaleString(), icon: Package, color: "text-yellow-500" },
    { label: "Total Revenue", value: `$${dashboardData.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: BarChart3, color: "text-primary" },
  ] : [
    { label: "Total Customers", value: "0", icon: Users, color: "text-blue-500" },
    { label: "Active Orders", value: "0", icon: ShoppingCart, color: "text-green-500" },
    { label: "In Transit", value: "0", icon: Package, color: "text-yellow-500" },
    { label: "Total Revenue", value: "$0.00", icon: BarChart3, color: "text-primary" },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border-2 border-primary/20 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Loading...</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold animate-pulse">---</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    const fetchDashboardData = async () => {
      try {
        setError(null);
        const apiUrl = getApiUrl();
        const endpoint = `/dashboard/stats`;
        console.log('Retrying fetch from:', `${apiUrl}${endpoint}`);
        
        // Use apiRequest helper which automatically includes auth token
        const response = await apiRequest(endpoint, {
          method: 'GET',
          cache: 'no-store',
        });

        console.log('Response status:', response.status);
        
        if (!response.ok) {
          // Handle 401 Unauthorized
          if (response.status === 401) {
            throw new Error('UNAUTHORIZED: Authentication required. Please log in.');
          }
          const errorText = await response.text();
          console.error('Response error:', errorText);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Dashboard data received:', result);

        if (!result.success) {
          throw new Error(result.error?.message || 'Failed to fetch dashboard data');
        }

        if (result.data) {
          setDashboardData(result.data);
          console.log('Dashboard data set successfully');
        } else {
          throw new Error('No data received from server');
        }
      } catch (err: any) {
        console.error('Error fetching dashboard data:', err);
        
        // Provide more helpful error messages
        let errorMessage = 'Failed to load dashboard data.';
        
        if (err.message?.includes('UNAUTHORIZED') || err.message?.includes('Authentication required') || err.message?.includes('status: 401')) {
          errorMessage = `Authentication Required\n\nYou need to log in to access the dashboard.\n\nPlease:\n1. Log in to your account at /login\n2. Make sure your authentication token is valid\n3. Check if your session has expired`;
        } else if (err.message?.includes('Failed to fetch') || err.message?.includes('ERR_CONNECTION_REFUSED')) {
          const apiUrl = getApiUrl();
          errorMessage = `Cannot connect to backend at ${apiUrl}\n\nPlease check:\n1. Is your backend server running?\n2. Is the backend URL correct in .env.local? (NEXT_PUBLIC_API_URL)\n3. Is the backend running on the correct port?`;
        } else {
          errorMessage = err.message || 'Failed to load dashboard data. Please check the console for details.';
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  };

  if (error) {
    const apiUrl = getApiUrl();
    return (
      <Card className="border-2 border-red-200 shadow-xl">
        <CardContent className="p-6">
          <div className="flex items-start gap-3 text-red-600 mb-4">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold mb-2">Error loading dashboard data</p>
              <p className="text-sm text-red-500 whitespace-pre-line">{error}</p>
            </div>
          </div>
          <div className="space-y-3 mt-4 pt-4 border-t">
            <div className="text-sm">
              <p className="font-medium mb-1">Current Backend URL:</p>
              <code className="text-xs bg-gray-100 p-2 rounded block break-all">{apiUrl}</code>
            </div>
            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-1">To fix this:</p>
              {(error.includes('Authentication Required') || error.includes('UNAUTHORIZED')) ? (
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Click "Go to Login" button below to log in</li>
                  <li>Enter your email and password</li>
                  <li>After successful login, return to this page</li>
                  <li>Make sure your authentication token is stored in browser storage</li>
                </ol>
              ) : (
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Make sure your backend server is running</li>
                  <li>Check your <code className="bg-gray-100 px-1 rounded">.env.local</code> file has <code className="bg-gray-100 px-1 rounded">NEXT_PUBLIC_API_URL</code> set correctly</li>
                  <li>Verify the backend port matches the URL above</li>
                  <li>Check the browser console (F12) for more details</li>
                </ol>
              )}
            </div>
            <div className="flex gap-2 mt-4">
              {error.includes('Authentication Required') || error.includes('UNAUTHORIZED') ? (
                <Button 
                  onClick={() => window.location.href = '/login'} 
                  className="bg-primary hover:bg-primary/90"
                >
                  Go to Login
                </Button>
              ) : (
                <Button 
                  onClick={handleRetry} 
                  variant="outline" 
                >
                  Retry Fetch
                </Button>
              )}
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline" 
              >
                Reload Page
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-2 border-primary/20 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">Live data from database</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-2 border-primary/20 shadow-xl">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest customer orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData?.recentOrders && dashboardData.recentOrders.length > 0 ? (
                dashboardData.recentOrders.map((order: any) => (
                  <div key={order.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="font-medium">{order.orderNumber}</p>
                      <p className="text-sm text-muted-foreground">{order.customer}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        ${order.amount?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                    <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                      {order.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No recent orders</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-primary/20 shadow-xl">
          <CardHeader>
            <CardTitle>Recent Shipments</CardTitle>
            <CardDescription>Latest shipments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData?.recentShipments && dashboardData.recentShipments.length > 0 ? (
                dashboardData.recentShipments.map((shipment: any) => (
                  <div key={shipment.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="font-medium">{shipment.trackingId}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(shipment.date).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={
                      shipment.status === 'Delivered' ? 'default' : 
                      shipment.status === 'In Transit' ? 'secondary' : 
                      'outline'
                    }>
                      {shipment.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No recent shipments</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-primary/20 shadow-xl">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {hasPermission(currentUser, Permissions.ORDER_CREATE) && (
                <Button 
                  variant="outline" 
                  className="h-auto py-3 flex-col"
                  onClick={onNewOrder}
                >
                  <Plus className="w-5 h-5 mb-2" />
                  New Order
                </Button>
              )}
              <Button variant="outline" className="h-auto py-3 flex-col">
                <Users className="w-5 h-5 mb-2" />
                Add Customer
              </Button>
              <Button variant="outline" className="h-auto py-3 flex-col">
                <Package className="w-5 h-5 mb-2" />
                View Shipments
              </Button>
              <Button variant="outline" className="h-auto py-3 flex-col">
                <Building2 className="w-5 h-5 mb-2" />
                Add Branch
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Customer Management Tab Component
function CustomerManagementTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<any>(null);
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);

  // Fetch customers from backend
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const params = new URLSearchParams({
          page: page.toString(),
          limit: '10',
        });
        
        if (searchQuery) {
          params.append('search', searchQuery);
        }

        const response = await apiRequest(`/customers?${params.toString()}`, {
          method: 'GET',
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Authentication required. Please log in.');
          }
          throw new Error(`Failed to fetch customers: ${response.status}`);
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error?.message || 'Failed to fetch customers');
        }

        // Handle all possible response structures
        let customersData = [];
        
        if (result.data) {
          if (Array.isArray(result.data)) {
            customersData = result.data;
          } else if (result.data.customers && Array.isArray(result.data.customers)) {
            // Handle structure: data.customers
            customersData = result.data.customers;
          } else if (result.data.items && Array.isArray(result.data.items)) {
            // Handle structure: data.items (paginated)
            customersData = result.data.items;
          }
        }
        
        // Ensure customersData is an array
        if (!Array.isArray(customersData)) {
          customersData = [];
        }
        
        setCustomers(customersData);
        
        // Update pagination if available
        if (result.data?.pagination) {
          setTotalPages(result.data.pagination.totalPages || 1);
        } else {
          setTotalPages(1);
        }
      } catch (err: any) {
        console.error('Error fetching customers:', err);
        setError(err.message || 'Failed to load customers');
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(() => {
      fetchCustomers();
    }, searchQuery ? 500 : 0);

    return () => clearTimeout(timeoutId);
  }, [page, searchQuery]);

  const handleCreateCustomer = async (data: any) => {
    try {
      const response = await apiRequest('/customers', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || errorData.message || 'Failed to create customer');
      }

      const result = await response.json();
      console.log('Customer created successfully:', result);
      
      // Fetch the updated customers list from backend to get complete data structure
      // This ensures we have the latest data with proper structure
      try {
        setPage(1);
        const fetchResponse = await apiRequest(`/customers?page=1&limit=10${searchQuery ? `&search=${searchQuery}` : ''}`, {
          method: 'GET',
        });
        if (fetchResponse.ok) {
          const fetchResult = await fetchResponse.json();
          let customersData = [];
          
          if (fetchResult.data) {
            if (Array.isArray(fetchResult.data)) {
              customersData = fetchResult.data;
            } else if (fetchResult.data.customers && Array.isArray(fetchResult.data.customers)) {
              // Handle structure: data.customers
              customersData = fetchResult.data.customers;
            } else if (fetchResult.data.items && Array.isArray(fetchResult.data.items)) {
              // Handle structure: data.items
              customersData = fetchResult.data.items;
            }
          }
          
          if (!Array.isArray(customersData)) {
            customersData = [];
          }
          
          setCustomers(customersData);
          
          // Update pagination if available
          if (fetchResult.data?.pagination) {
            setTotalPages(fetchResult.data.pagination.totalPages || 1);
          }
        } else {
          throw new Error('Failed to fetch updated customers list');
        }
      } catch (err) {
        console.error('Could not fetch updated customers list:', err);
        // Fallback: try to add the customer from the response if available
        const newCustomer = result?.data || result;
        if (newCustomer && (newCustomer._id || newCustomer.id)) {
          setCustomers(prevCustomers => {
            const customerId = newCustomer.id || newCustomer._id;
            const exists = prevCustomers.some(c => (c.id || c._id) === customerId);
            if (!exists) {
              return [newCustomer, ...prevCustomers];
            }
            return prevCustomers;
          });
        }
      }
      
      toast({
        title: "Success",
        description: "Customer created successfully!",
        variant: "default",
      });
      setShowCreateForm(false);
    } catch (err: any) {
      console.error('Error creating customer:', err);
      toast({
        title: "Error",
        description: "Failed to create customer: " + err.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdateCustomer = async (data: any) => {
    if (!editingCustomer) return;

    try {
      const customerId = editingCustomer.id || editingCustomer._id;
      const response = await apiRequest(`/customers/${customerId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || errorData.message || 'Failed to update customer');
      }

      // Update customer in the list
      setCustomers(prevCustomers => 
        prevCustomers.map(c => {
          const cId = c.id || c._id;
          if (cId === customerId) {
            return { ...c, ...data };
          }
          return c;
        })
      );

      toast({
        title: "Success",
        description: "Customer updated successfully!",
        variant: "default",
      });
      setEditingCustomer(null);
    } catch (err: any) {
      console.error('Error updating customer:', err);
      toast({
        title: "Error",
        description: "Failed to update customer: " + err.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = (customerId: string) => {
    setCustomerToDelete(customerId);
  };

  const confirmDeleteCustomer = async () => {
    if (!customerToDelete) return;

    try {
      const response = await apiRequest(`/customers/${customerToDelete}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete customer');
      }

      // Remove customer from the list
      setCustomers(prevCustomers => prevCustomers.filter(c => (c.id || c._id) !== customerToDelete));
      
      toast({
        title: "Success",
        description: "Customer deleted successfully!",
        variant: "default",
      });
      setCustomerToDelete(null);
    } catch (err: any) {
      console.error('Error deleting customer:', err);
      toast({
        title: "Error",
        description: "Failed to delete customer: " + err.message,
        variant: "destructive",
      });
      setCustomerToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={customerToDelete !== null} onOpenChange={(open) => !open && setCustomerToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the customer from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteCustomer}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create/Edit Customer Dialog */}
      <Dialog open={showCreateForm || editingCustomer !== null} onOpenChange={(open) => {
        if (!open) {
          setShowCreateForm(false);
          setEditingCustomer(null);
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingCustomer ? 'Edit Customer' : 'Add New Customer'}</DialogTitle>
          </DialogHeader>
          <CustomerForm 
            customer={editingCustomer} 
            onSave={editingCustomer ? handleUpdateCustomer : handleCreateCustomer} 
            onCancel={() => {
              setShowCreateForm(false);
              setEditingCustomer(null);
            }} 
          />
        </DialogContent>
      </Dialog>

      <Card className="border-2 border-primary/20 shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="text-2xl">Customer Management</CardTitle>
              <CardDescription>Manage all your customers</CardDescription>
            </div>
            <Button 
              className="bg-primary hover:bg-primary/90"
              onClick={() => setShowCreateForm(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Customer
            </Button>
          </div>
          <div className="mt-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search customers..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1); // Reset to first page on new search
                }}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading customers...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
                <p className="text-red-600 font-semibold mb-2">Error loading customers</p>
                <p className="text-sm text-muted-foreground">{error}</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
              </div>
            </div>
          ) : customers.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Users className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No customers found</p>
                {searchQuery && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Try adjusting your search query
                  </p>
                )}
              </div>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer.id || customer._id}>
                      <TableCell className="font-medium">
                        {customer.firstName} {customer.lastName}
                      </TableCell>
                      <TableCell>{customer.email || 'N/A'}</TableCell>
                      <TableCell>{customer.phone || 'N/A'}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {customer.address || customer.city || 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={customer.status === 'active' ? 'default' : 'secondary'}>
                          {customer.status || 'active'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            title="Edit"
                            onClick={() => setEditingCustomer(customer)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            title="Delete"
                            onClick={() => handleDelete(customer.id || customer._id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Orders Tab Component
function OrdersTab({ currentUser, openCreateForm: initialOpenForm = false, onFormClose }: { currentUser: any; openCreateForm?: boolean; onFormClose?: () => void }) {
  const [orders, setOrders] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreateForm, setShowCreateForm] = useState(initialOpenForm);
  const [editingOrder, setEditingOrder] = useState<any>(null);
  const [orderToDelete, setOrderToDelete] = useState<string | number | null>(null);
  
  // Update form state when prop changes
  useEffect(() => {
    if (initialOpenForm) {
      setShowCreateForm(true);
    }
  }, [initialOpenForm]);
  
  const handleFormClose = () => {
    setShowCreateForm(false);
    onFormClose?.();
  };

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      handleFormClose();
    } else {
      setShowCreateForm(true);
    }
  };

  // Fetch orders from backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const params = new URLSearchParams({
          page: page.toString(),
          limit: '10',
        });
        
        if (searchQuery) {
          params.append('search', searchQuery);
        }

        const response = await apiRequest(`/orders?${params.toString()}`, {
          method: 'GET',
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Authentication required. Please log in.');
          }
          throw new Error(`Failed to fetch orders: ${response.status}`);
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error?.message || 'Failed to fetch orders');
        }

        // Handle all possible response structures
        let ordersData = [];
        
        if (result.data) {
          if (Array.isArray(result.data)) {
            ordersData = result.data;
          } else if (result.data.orders && Array.isArray(result.data.orders)) {
            // Handle structure: data.orders
            ordersData = result.data.orders;
          } else if (result.data.items && Array.isArray(result.data.items)) {
            // Handle structure: data.items (paginated)
            ordersData = result.data.items;
          }
        }
        
        // Ensure ordersData is an array
        if (!Array.isArray(ordersData)) {
          ordersData = [];
        }
        
        setOrders(ordersData);
        
        // Update pagination if available
        if (result.data?.pagination) {
          setTotalPages(result.data.pagination.totalPages || 1);
        } else {
          setTotalPages(1);
        }
      } catch (err: any) {
        console.error('Error fetching orders:', err);
        setError(err.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(() => {
      fetchOrders();
    }, searchQuery ? 500 : 0);

    return () => clearTimeout(timeoutId);
  }, [page, searchQuery]);

  const handleCreateOrder = async (data: any) => {
    try {
      const response = await apiRequest('/orders', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to create order');
      }

      // Refresh orders list
      setPage(1);
      setSearchQuery('');
      setShowCreateForm(false);
      
      // Refetch orders to get updated list
      try {
        const fetchResponse = await apiRequest('/orders?page=1&limit=10', {
          method: 'GET',
        });
        if (fetchResponse.ok) {
          const fetchResult = await fetchResponse.json();
          let ordersData = [];
          
          if (fetchResult.data) {
            if (Array.isArray(fetchResult.data)) {
              ordersData = fetchResult.data;
            } else if (fetchResult.data.orders && Array.isArray(fetchResult.data.orders)) {
              ordersData = fetchResult.data.orders;
            } else if (fetchResult.data.items && Array.isArray(fetchResult.data.items)) {
              ordersData = fetchResult.data.items;
            }
          }
          
          if (!Array.isArray(ordersData)) {
            ordersData = [];
          }
          
          setOrders(ordersData);
          
          if (fetchResult.data?.pagination) {
            setTotalPages(fetchResult.data.pagination.totalPages || 1);
          }
        }
      } catch (err) {
        console.error('Could not fetch updated orders list:', err);
      }
      
      toast({
        title: "Success",
        description: "Order created successfully!",
        variant: "default",
      });
    } catch (err: any) {
      console.error('Error creating order:', err);
      toast({
        title: "Error",
        description: "Failed to create order: " + err.message,
        variant: "destructive",
      });
    }
  };

  const handleModifyOrder = async (data: any) => {
    try {
      const orderId = editingOrder.id || editingOrder._id;
      const response = await apiRequest(`/orders/${orderId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update order');
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to update order');
      }

      // Refresh orders list
      setOrders(orders.map(o => (o.id || o._id) === orderId ? result.data : o));
      setEditingOrder(null);
    } catch (err: any) {
      console.error('Error updating order:', err);
      toast({
        title: "Error",
        description: "Failed to update order: " + err.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteOrder = (id: string | number) => {
    if (!hasPermission(currentUser, Permissions.ORDER_DELETE)) {
      toast({
        title: "Permission Denied",
        description: "You do not have permission to delete orders",
        variant: "destructive",
      });
      return;
    }
    setOrderToDelete(id);
  };

  const confirmDeleteOrder = async () => {
    if (!orderToDelete) return;

    try {
      const response = await apiRequest(`/orders/${orderToDelete}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete order');
      }

      // Remove from list
      setOrders(prevOrders => prevOrders.filter(o => (o.id || o._id) !== orderToDelete));
      
      toast({
        title: "Success",
        description: "Order deleted successfully!",
        variant: "default",
      });
      setOrderToDelete(null);
    } catch (err: any) {
      console.error('Error deleting order:', err);
      toast({
        title: "Error",
        description: "Failed to delete order: " + err.message,
        variant: "destructive",
      });
      setOrderToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={orderToDelete !== null} onOpenChange={(open) => !open && setOrderToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the order from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteOrder}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Card className="border-2 border-primary/20 shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="text-2xl">Orders Management</CardTitle>
              <CardDescription>View and manage all orders</CardDescription>
            </div>
            {hasPermission(currentUser, Permissions.ORDER_CREATE) && (
              <Dialog open={showCreateForm} onOpenChange={handleDialogChange}>
                <DialogTrigger asChild>
                  <Button 
                    className="bg-primary hover:bg-primary/90"
                    onClick={() => setShowCreateForm(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Order
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Order</DialogTitle>
                  </DialogHeader>
                  <OrderForm onSave={handleCreateOrder} onCancel={handleFormClose} />
                </DialogContent>
              </Dialog>
            )}
          </div>
          <div className="mt-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1); // Reset to first page on new search
                }}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading orders...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
                <p className="text-red-600 font-semibold mb-2">Error loading orders</p>
                <p className="text-sm text-muted-foreground">{error}</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
              </div>
            </div>
          ) : orders.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <ShoppingCart className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No orders found</p>
                {searchQuery && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Try adjusting your search query
                  </p>
                )}
              </div>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Departure Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => {
                    const orderId = order.id || order._id;
                    const orderDate = order.createdAt ? new Date(order.createdAt) : (order.date ? new Date(order.date) : new Date());
                    const departureDate = order.departureDate ? new Date(order.departureDate) : null;
                    const customerName = order.customerId?.firstName && order.customerId?.lastName 
                      ? `${order.customerId.firstName} ${order.customerId.lastName}`
                      : order.customer || 'N/A';
                    const amount = order.totalAmount || order.amount || 0;

                    return (
                      <TableRow key={orderId}>
                        <TableCell className="font-medium">{order.orderNumber || orderId}</TableCell>
                        <TableCell>{customerName}</TableCell>
                        <TableCell>{orderDate.toLocaleDateString()}</TableCell>
                        <TableCell>
                          {departureDate ? (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-muted-foreground" />
                              {departureDate.toLocaleDateString()}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">N/A</span>
                          )}
                        </TableCell>
                        <TableCell>${typeof amount === 'number' ? amount.toFixed(2) : '0.00'}</TableCell>
                        <TableCell>
                          <Badge variant={order.status === 'completed' || order.status === 'Completed' ? "default" : "secondary"}>
                            {order.status || 'pending'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {hasPermission(currentUser, Permissions.ORDER_MODIFY) && (
                              <Dialog open={editingOrder?.id === orderId || editingOrder?._id === orderId} onOpenChange={(open) => !open && setEditingOrder(null)}>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="icon" onClick={() => setEditingOrder(order)}>
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle>Modify Order</DialogTitle>
                                  </DialogHeader>
                                  <OrderForm 
                                    order={order} 
                                    onSave={handleModifyOrder} 
                                    onCancel={() => setEditingOrder(null)} 
                                  />
                                </DialogContent>
                              </Dialog>
                            )}
                            {hasPermission(currentUser, Permissions.ORDER_DELETE) && (
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleDeleteOrder(orderId)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Shipments Tab Component
function ShipmentsTab({ currentUser }: { currentUser: any }) {
  const [shipments, setShipments] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedShipments, setSelectedShipments] = useState<string[]>([]);
  const [showBulkUpdate, setShowBulkUpdate] = useState(false);
  const [showIndividualUpdate, setShowIndividualUpdate] = useState(false);
  const [updatingShipment, setUpdatingShipment] = useState<any>(null);

  // Fetch shipments from backend
  useEffect(() => {
    const fetchShipments = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const params = new URLSearchParams({
          page: page.toString(),
          limit: '10',
        });
        
        if (searchQuery) {
          params.append('search', searchQuery);
        }

        const response = await apiRequest(`/shipments?${params.toString()}`, {
          method: 'GET',
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Authentication required. Please log in.');
          }
          throw new Error(`Failed to fetch shipments: ${response.status}`);
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error?.message || 'Failed to fetch shipments');
        }

        // Handle paginated response
        if (result.data?.items) {
          setShipments(result.data.items);
          setTotalPages(result.data.pagination?.totalPages || 1);
        } else if (Array.isArray(result.data)) {
          // Handle non-paginated response
          setShipments(result.data);
        } else {
          setShipments([]);
        }
      } catch (err: any) {
        console.error('Error fetching shipments:', err);
        setError(err.message || 'Failed to load shipments');
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(() => {
      fetchShipments();
    }, searchQuery ? 500 : 0);

    return () => clearTimeout(timeoutId);
  }, [page, searchQuery]);

  const handleBulkUpdate = async (data: any) => {
    try {
      const response = await apiRequest('/shipments/bulk/status', {
        method: 'PUT',
        body: JSON.stringify({
          shipmentIds: selectedShipments,
          status: data.status,
          notes: data.notes || '',
          location: data.location || '',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update shipments');
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to update shipments');
      }

      // Refresh shipments list
      setSelectedShipments([]);
      setShowBulkUpdate(false);
      
      // Refetch shipments
      const fetchResponse = await apiRequest(`/shipments?page=${page}&limit=10`, {
        method: 'GET',
      });
      const fetchResult = await fetchResponse.json();
      if (fetchResult.success && fetchResult.data?.items) {
        setShipments(fetchResult.data.items);
      }
    } catch (err: any) {
      console.error('Error updating shipments:', err);
      toast({
        title: "Error",
        description: "Failed to update shipments: " + err.message,
        variant: "destructive",
      });
    }
  };

  const handleIndividualUpdate = async (data: any) => {
    try {
      const shipmentId = updatingShipment.id || updatingShipment._id;
      const response = await apiRequest(`/shipments/${shipmentId}/status`, {
        method: 'PUT',
        body: JSON.stringify({
          status: data.status,
          notes: data.notes || '',
          location: data.location || '',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update shipment');
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to update shipment');
      }

      // Refresh shipments list
      setShipments(shipments.map(s => 
        (s.id || s._id) === shipmentId 
          ? { ...s, currentStatus: data.status } 
          : s
      ));
      setUpdatingShipment(null);
      setShowIndividualUpdate(false);
    } catch (err: any) {
      console.error('Error updating shipment:', err);
      toast({
        title: "Error",
        description: "Failed to update shipment: " + err.message,
        variant: "destructive",
      });
    }
  };

  const toggleSelection = (trackingId: string) => {
    setSelectedShipments(prev => 
      prev.includes(trackingId) 
        ? prev.filter(id => id !== trackingId)
        : [...prev, trackingId]
    );
  };

  const selectAll = () => {
    if (selectedShipments.length === shipments.length) {
      setSelectedShipments([]);
    } else {
      setSelectedShipments(shipments.map(s => s.trackingId || s.id || s._id));
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-primary/20 shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="text-2xl">Shipments Management</CardTitle>
              <CardDescription>Track and manage all shipments</CardDescription>
            </div>
            <div className="flex gap-2">
              {hasPermission(currentUser, Permissions.SHIPMENT_BULK_UPDATE) && selectedShipments.length > 0 && (
                <Dialog open={showBulkUpdate} onOpenChange={setShowBulkUpdate}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Layers className="w-4 h-4 mr-2" />
                      Bulk Update ({selectedShipments.length})
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Bulk Status Update</DialogTitle>
                    </DialogHeader>
                    <StatusUpdateForm
                      shipmentIds={selectedShipments}
                      isBulk={true}
                      onSave={handleBulkUpdate}
                      onCancel={() => setShowBulkUpdate(false)}
                    />
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
          <div className="mt-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search shipments..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1); // Reset to first page on new search
                }}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading shipments...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
                <p className="text-red-600 font-semibold mb-2">Error loading shipments</p>
                <p className="text-sm text-muted-foreground">{error}</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
              </div>
            </div>
          ) : shipments.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Package className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No shipments found</p>
                {searchQuery && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Try adjusting your search query
                  </p>
                )}
              </div>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    {hasPermission(currentUser, Permissions.SHIPMENT_BULK_UPDATE) && (
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedShipments.length === shipments.length && shipments.length > 0}
                          onCheckedChange={selectAll}
                        />
                      </TableHead>
                    )}
                    <TableHead>Tracking ID</TableHead>
                    <TableHead>Shipper</TableHead>
                    <TableHead>Receiver</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shipments.map((shipment) => {
                    const shipmentId = shipment.id || shipment._id;
                    const trackingId = shipment.trackingId || shipmentId;
                    const shipmentDate = shipment.createdAt ? new Date(shipment.createdAt) : (shipment.date ? new Date(shipment.date) : new Date());
                    const shipperName = shipment.shipperId?.firstName && shipment.shipperId?.lastName
                      ? `${shipment.shipperId.firstName} ${shipment.shipperId.lastName}`
                      : shipment.shipper?.firstName && shipment.shipper?.lastName
                      ? `${shipment.shipper.firstName} ${shipment.shipper.lastName}`
                      : shipment.shipper || 'N/A';
                    const receiverName = shipment.receiverId?.firstName && shipment.receiverId?.lastName
                      ? `${shipment.receiverId.firstName} ${shipment.receiverId.lastName}`
                      : shipment.receiver?.firstName && shipment.receiver?.lastName
                      ? `${shipment.receiver.firstName} ${shipment.receiver.lastName}`
                      : shipment.receiver || 'N/A';
                    const status = shipment.currentStatus || shipment.status || 'Processing';

                    return (
                      <TableRow key={shipmentId}>
                        {hasPermission(currentUser, Permissions.SHIPMENT_BULK_UPDATE) && (
                          <TableCell>
                            <Checkbox
                              checked={selectedShipments.includes(trackingId)}
                              onCheckedChange={() => toggleSelection(trackingId)}
                            />
                          </TableCell>
                        )}
                        <TableCell className="font-medium">{trackingId}</TableCell>
                        <TableCell>{shipperName}</TableCell>
                        <TableCell>{receiverName}</TableCell>
                        <TableCell>
                          <Badge variant={
                            status === 'Delivered' ? 'default' : 
                            status === 'In Transit' ? 'secondary' : 
                            'outline'
                          }>
                            {status}
                          </Badge>
                        </TableCell>
                        <TableCell>{shipmentDate.toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {hasPermission(currentUser, Permissions.SHIPMENT_STATUS_UPDATE) && (
                              <Dialog 
                                open={showIndividualUpdate && (updatingShipment?.id === shipmentId || updatingShipment?._id === shipmentId)} 
                                onOpenChange={(open) => {
                                  if (!open) {
                                    setShowIndividualUpdate(false);
                                    setUpdatingShipment(null);
                                  }
                                }}
                              >
                                <DialogTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => {
                                      setUpdatingShipment(shipment);
                                      setShowIndividualUpdate(true);
                                    }}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Update Shipment Status</DialogTitle>
                                  </DialogHeader>
                                  <StatusUpdateForm
                                    shipmentIds={[trackingId]}
                                    isBulk={false}
                                    onSave={handleIndividualUpdate}
                                    onCancel={() => {
                                      setShowIndividualUpdate(false);
                                      setUpdatingShipment(null);
                                    }}
                                  />
                                </DialogContent>
                              </Dialog>
                            )}
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => window.open(`/track/${trackingId}`, '_blank')}
                              title="View Details"
                            >
                              <ArrowRight className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Branch Management Tab Component
function BranchManagementTab() {
  const [branches, setBranches] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingBranch, setEditingBranch] = useState<any>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [branchToDelete, setBranchToDelete] = useState<string | null>(null);

  // Fetch branches from backend
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiRequest('/branches', {
          method: 'GET',
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Authentication required. Please log in.');
          }
          throw new Error(`Failed to fetch branches: ${response.status}`);
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error?.message || 'Failed to fetch branches');
        }

        // Handle response - ensure it's always an array
        let branchesData = [];
        
        if (result.data) {
          if (Array.isArray(result.data)) {
            branchesData = result.data;
          } else if (result.data.items && Array.isArray(result.data.items)) {
            branchesData = result.data.items;
          } else if (Array.isArray(result.data)) {
            branchesData = result.data;
          }
        }
        
        // Ensure branchesData is an array
        if (!Array.isArray(branchesData)) {
          branchesData = [];
        }
        
        // Filter by search query if provided
        const filtered = searchQuery
          ? branchesData.filter((branch: any) => 
              branch.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              branch.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              branch.city?.toLowerCase().includes(searchQuery.toLowerCase())
            )
          : branchesData;

        setBranches(filtered);
      } catch (err: any) {
        console.error('Error fetching branches:', err);
        setError(err.message || 'Failed to load branches');
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(() => {
      fetchBranches();
    }, searchQuery ? 500 : 0);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleDelete = (branchId: string) => {
    setBranchToDelete(branchId);
  };

  const confirmDeleteBranch = async () => {
    if (!branchToDelete) return;

    try {
      const response = await apiRequest(`/branches/${branchToDelete}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete branch');
      }

      // Remove branch from the list
      setBranches(prevBranches => prevBranches.filter(b => (b.id || b._id) !== branchToDelete));
      
      toast({
        title: "Success",
        description: "Branch deleted successfully!",
        variant: "default",
      });
      setBranchToDelete(null);
    } catch (err: any) {
      console.error('Error deleting branch:', err);
      toast({
        title: "Error",
        description: "Failed to delete branch: " + err.message,
        variant: "destructive",
      });
      setBranchToDelete(null);
    }
  };

  const handleCreateBranch = async (data: any) => {
    try {
      const response = await apiRequest('/branches', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create branch');
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to create branch');
      }

      // Refresh branches list
      setBranches([...branches, result.data]);
      setShowCreateForm(false);
    } catch (err: any) {
      console.error('Error creating branch:', err);
      toast({
        title: "Error",
        description: "Failed to create branch: " + err.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdateBranch = async (data: any) => {
    try {
      const branchId = editingBranch.id || editingBranch._id;
      const response = await apiRequest(`/branches/${branchId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update branch');
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to update branch');
      }

      // Refresh branches list
      setBranches(branches.map(b => (b.id || b._id) === branchId ? result.data : b));
      setEditingBranch(null);
    } catch (err: any) {
      console.error('Error updating branch:', err);
      toast({
        title: "Error",
        description: "Failed to update branch: " + err.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={branchToDelete !== null} onOpenChange={(open) => !open && setBranchToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the branch from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteBranch}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Card className="border-2 border-primary/20 shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="text-2xl">Branch Management</CardTitle>
              <CardDescription>Manage all branch locations</CardDescription>
            </div>
            <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Branch
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Branch</DialogTitle>
                </DialogHeader>
                <BranchForm onSave={handleCreateBranch} onCancel={() => setShowCreateForm(false)} />
              </DialogContent>
            </Dialog>
          </div>
          <div className="mt-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search branches..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading branches...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
                <p className="text-red-600 font-semibold mb-2">Error loading branches</p>
                <p className="text-sm text-muted-foreground">{error}</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
              </div>
            </div>
          ) : !Array.isArray(branches) || branches.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Building2 className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No branches found</p>
                {searchQuery && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Try adjusting your search query
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.isArray(branches) && branches.map((branch) => {
                const branchId = branch.id || branch._id;
                const location = branch.address 
                  ? `${branch.address}${branch.city ? ', ' + branch.city : ''}${branch.country ? ', ' + branch.country : ''}`
                  : branch.location || 'N/A';

                return (
                  <Card key={branchId} className="border-2 border-primary/10">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{branch.name || 'Unnamed Branch'}</CardTitle>
                        <Badge variant={branch.status === 'active' ? 'default' : 'secondary'}>
                          {branch.status || 'active'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span className="truncate">{location}</span>
                        </div>
                        {branch.phone && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="w-4 h-4" />
                            {branch.phone}
                          </div>
                        )}
                        {branch.email && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="w-4 h-4" />
                            <span className="truncate">{branch.email}</span>
                          </div>
                        )}
                        <div className="flex gap-2 pt-2">
                          <Dialog 
                            open={editingBranch?.id === branchId || editingBranch?._id === branchId} 
                            onOpenChange={(open) => !open && setEditingBranch(null)}
                          >
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1"
                                onClick={() => setEditingBranch(branch)}
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Branch</DialogTitle>
                              </DialogHeader>
                              <BranchForm 
                                branch={branch} 
                                onSave={handleUpdateBranch} 
                                onCancel={() => setEditingBranch(null)} 
                              />
                            </DialogContent>
                          </Dialog>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => handleDelete(branchId)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Simple Branch Form Component
function BranchForm({ branch, onSave, onCancel }: { branch?: any; onSave: (data: any) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState({
    name: branch?.name || '',
    address: branch?.address || '',
    city: branch?.city || '',
    country: branch?.country || '',
    phone: branch?.phone || '',
    email: branch?.email || '',
    status: branch?.status || 'active',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Branch Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="status">Status</Label>
        <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-primary hover:bg-primary/90">
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
      </div>
    </form>
  );
}

// User Management Tab Component
function UserManagementTab({ currentUser }: { currentUser: any }) {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [userToDelete, setUserToDelete] = useState<string | number | null>(null);

  // Fetch users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiRequest('/users');
        
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Authentication required. Please log in again.');
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        // Handle response - ensure it's always an array
        // Backend returns: { success: true, data: { users: [...], pagination: {...} } }
        let usersData = [];
        
        if (result.data) {
          if (Array.isArray(result.data)) {
            usersData = result.data;
          } else if (result.data.users && Array.isArray(result.data.users)) {
            // Handle structure: data.users
            usersData = result.data.users;
          } else if (result.data.items && Array.isArray(result.data.items)) {
            // Handle structure: data.items
            usersData = result.data.items;
          }
        }
        
        // Ensure usersData is an array
        if (!Array.isArray(usersData)) {
          usersData = [];
        }
        
        // Filter by search query if provided
        const filtered = searchQuery
          ? usersData.filter((user: any) => 
              user.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              user.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              user.email?.toLowerCase().includes(searchQuery.toLowerCase())
            )
          : usersData;

        setUsers(filtered);
      } catch (err: any) {
        console.error('Error fetching users:', err);
        setError(err.message || 'Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(() => {
      fetchUsers();
    }, searchQuery ? 500 : 0);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleCreateUser = async (data: any) => {
    try {
      // Prepare create data - ensure roleId and branchId are correct
      const createData: any = {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone || '',
      };

      // Handle roleId - ensure it's the ID, not the role name
      if (data.roleId) {
        createData.roleId = data.roleId;
      } else if (data.role?._id || data.role?.id) {
        createData.roleId = data.role._id || data.role.id;
      } else {
        throw new Error('Role is required');
      }

      // Handle branchId - send null if empty, otherwise send the ID
      if (data.branchId && data.branchId !== '' && data.branchId !== 'none') {
        createData.branchId = data.branchId;
      } else {
        createData.branchId = null;
      }

      console.log('Creating user with data:', createData);

      const response = await apiRequest('/users', {
        method: 'POST',
        body: JSON.stringify(createData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || errorData.message || `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      const result = await response.json().catch(() => null);
      console.log('User created successfully:', result);

      // Fetch the updated users list from backend to get complete data structure
      // This ensures roleId and branchId are properly populated as objects with name
      try {
        const userRes = await apiRequest(`/users`);
        if (userRes.ok) {
          const usersResult = await userRes.json();
          let usersData = [];
          if (usersResult.data) {
            if (Array.isArray(usersResult.data)) {
              usersData = usersResult.data;
            } else if (usersResult.data.users && Array.isArray(usersResult.data.users)) {
              usersData = usersResult.data.users;
            } else if (usersResult.data.items && Array.isArray(usersResult.data.items)) {
              usersData = usersResult.data.items;
            }
          }
          if (!Array.isArray(usersData)) usersData = [];
          // Update the list with fresh data from backend - this will automatically refresh the table
          setUsers(usersData);
        } else {
          throw new Error('Failed to fetch updated users list');
        }
      } catch (err) {
        console.error('Could not fetch updated users list:', err);
        // Fallback: try to add the user from the response if available
        const newUser = result?.data || result;
        if (newUser && (newUser._id || newUser.id)) {
          setUsers(prevUsers => {
            const userId = newUser.id || newUser._id;
            const exists = prevUsers.some(u => (u.id || u._id) === userId);
            if (!exists) {
              return [newUser, ...prevUsers];
            }
            return prevUsers;
          });
        }
      }
      
      // Show success message
      toast({
        title: "Success",
        description: "User created successfully!",
        variant: "default",
      });
      setShowUserForm(false);
    } catch (err: any) {
      console.error('Error creating user:', err);
      toast({
        title: "Error",
        description: "Failed to create user: " + err.message,
        variant: "destructive",
      });
    }
  };

  const handleModifyUser = async (data: any) => {
    if (!editingUser) return;

    try {
      const userId = editingUser.id || editingUser._id;
      
      // Prepare update data - ensure roleId and branchId are correct
      const updateData: any = {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone || '',
      };

      // Handle roleId - ensure it's the ID, not the role name
      if (data.roleId) {
        updateData.roleId = data.roleId;
      } else if (data.role?._id || data.role?.id) {
        updateData.roleId = data.role._id || data.role.id;
      }

      // Handle branchId - send null if empty, otherwise send the ID
      if (data.branchId && data.branchId !== '' && data.branchId !== 'none') {
        updateData.branchId = data.branchId;
      } else {
        updateData.branchId = null;
      }

      // Only include password if provided and not empty
      if (data.password && data.password.trim() !== '') {
        updateData.password = data.password;
      }

      console.log('Updating user:', userId, 'with data:', updateData);

      const response = await apiRequest(`/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || errorData.message || `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      const result = await response.json().catch(() => null);
      console.log('User updated successfully:', result);

      // Optimistically update the user in the local state
      // This avoids a full page refresh and only updates the specific user row
      setUsers(prevUsers => {
        return prevUsers.map(u => {
          const uId = u.id || u._id;
          if (uId === userId) {
            // Update the user with the new data from the response, or merge with existing
            const updatedUser = result?.data || result || {};
            return {
              ...u,
              ...updatedUser,
              // Ensure roleId and branchId are properly structured
              roleId: updatedUser.roleId || u.roleId,
              branchId: updatedUser.branchId || u.branchId,
            };
          }
          return u;
        });
      });

      // Optionally fetch the updated user to ensure we have the latest data
      // This is a lightweight request for just one user
      try {
        const userRes = await apiRequest(`/users/${userId}`);
        if (userRes.ok) {
          const userData = await userRes.json();
          const updatedUser = userData.data || userData;
          
          // Update only this specific user in the list
          setUsers(prevUsers => {
            return prevUsers.map(u => {
              const uId = u.id || u._id;
              if (uId === userId) {
                return {
                  ...u,
                  ...updatedUser,
                  roleId: updatedUser.roleId || u.roleId,
                  branchId: updatedUser.branchId || u.branchId,
                };
              }
              return u;
            });
          });
        }
      } catch (err) {
        console.warn('Could not fetch updated user, using optimistic update:', err);
      }

      // Show success message
      toast({
        title: "Success",
        description: "User updated successfully!",
        variant: "default",
      });
      setEditingUser(null);
    } catch (err: any) {
      console.error('Error updating user:', err);
      toast({
        title: "Error",
        description: "Failed to update user: " + err.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = (userId: string | number) => {
    if (!hasPermission(currentUser, Permissions.USER_DELETE)) {
      toast({
        title: "Permission Denied",
        description: "You do not have permission to delete users",
        variant: "destructive",
      });
      return;
    }
    setUserToDelete(userId);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      const response = await apiRequest(`/users/${userToDelete}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      // Remove the user from the list without refreshing the entire page
      setUsers(prevUsers => prevUsers.filter(u => (u.id || u._id) !== userToDelete));
      
      toast({
        title: "Success",
        description: "User deleted successfully!",
        variant: "default",
      });
      
      setUserToDelete(null);
    } catch (err: any) {
      console.error('Error deleting user:', err);
      toast({
        title: "Error",
        description: "Failed to delete user: " + err.message,
        variant: "destructive",
      });
      setUserToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={userToDelete !== null} onOpenChange={(open) => !open && setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteUser}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Card className="border-2 border-primary/20 shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="text-2xl">User Management</CardTitle>
              <CardDescription>Manage system users and their access</CardDescription>
            </div>
            {hasPermission(currentUser, Permissions.USER_CREATE) && (
              <Dialog open={showUserForm} onOpenChange={setShowUserForm}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Add User
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                  </DialogHeader>
                  <UserForm onSave={handleCreateUser} onCancel={() => setShowUserForm(false)} />
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {/* Search Input */}
          <div className="mb-4">
            <Input
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>

          {/* Error State */}
          {error ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-center">
                <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-4" />
                <p className="text-destructive font-medium mb-2">Error loading users</p>
                <p className="text-sm text-muted-foreground mb-4">{error}</p>
                {error.includes('Authentication') && (
                  <Button
                    variant="outline"
                    onClick={() => window.location.href = '/login'}
                  >
                    Go to Login
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  className="mt-2"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
              </div>
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : !Array.isArray(users) || users.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Users className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No users found</p>
                {searchQuery && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Try adjusting your search query
                  </p>
                )}
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => {
                  const userId = user.id || user._id;
                  // Backend returns role in roleId object: { _id: "...", name: "..." }
                  const roleName = user.roleId?.name || user.role?.name || user.role || 'N/A';
                  // Backend returns branch in branchId object: { _id: "...", name: "..." }
                  const branchName = user.branchId?.name || user.branch?.name || user.branch || 'N/A';
                  const status = user.status || 'active';
                  
                  return (
                    <TableRow key={userId}>
                      <TableCell className="font-medium">
                        {user.firstName} {user.lastName}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{roleName}</Badge>
                      </TableCell>
                      <TableCell>{branchName}</TableCell>
                      <TableCell>
                        <Badge variant={status === 'active' ? 'default' : 'secondary'}>
                          {status === 'active' ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {hasPermission(currentUser, Permissions.USER_MODIFY) && (
                            <Dialog 
                              open={editingUser && (editingUser.id === userId || editingUser._id === userId)} 
                              onOpenChange={(open) => !open && setEditingUser(null)}
                            >
                              <DialogTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => setEditingUser(user)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Modify User</DialogTitle>
                                </DialogHeader>
                                <UserForm 
                                  user={user} 
                                  onSave={handleModifyUser} 
                                  onCancel={() => setEditingUser(null)} 
                                />
                              </DialogContent>
                            </Dialog>
                          )}
                          {hasPermission(currentUser, Permissions.USER_DELETE) && (
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDeleteUser(userId)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Web Page Management Tab Component
// Hero image type
type HeroImage = {
  id: number;
  name: string;
  path?: string;
  url?: string;
  title?: string;
};

function WebPageManagementTab() {
  const [activeSubTab, setActiveSubTab] = useState("images");
  
  // Load hero images from localStorage or use default
  const loadHeroImages = (): HeroImage[] => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('heroImages');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Error parsing hero images from localStorage:', e);
        }
      }
    }
    // Default images from public folder
    return [
      { id: 1, name: "Hero Image 1", path: "/hero-images/hero-1.jpg", title: "Global Reach, Personal Touch." },
      { id: 2, name: "Hero Image 2", path: "/hero-images/hero-2.jpg", title: "Fast. Reliable. Secure." },
    ];
  };

  const [heroImages, setHeroImages] = useState<HeroImage[]>(loadHeroImages());
  const [reviews, setReviews] = useState([
    { id: 1, platform: 'Google', image: '', rating: 5 },
    { id: 2, platform: 'Facebook', image: '', rating: 5 },
  ]);

  // Save hero images to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('heroImages', JSON.stringify(heroImages));
    }
  }, [heroImages]);

  const [showAddImageDialog, setShowAddImageDialog] = useState(false);
  const [newImagePath, setNewImagePath] = useState('');
  const [newImageTitle, setNewImageTitle] = useState('');

  const handleAddHeroImage = () => {
    if (newImagePath && newImagePath.startsWith('/')) {
      const newImage = {
        id: Date.now(),
        name: newImagePath.split('/').pop() || 'New Image',
        path: newImagePath,
        title: newImageTitle || 'Hero Image',
      };
      setHeroImages([...heroImages, newImage]);
      toast({
        title: "Success",
        description: "Hero image added! Make sure the image exists in the public folder.",
        variant: "default",
      });
      setNewImagePath('');
      setNewImageTitle('');
      setShowAddImageDialog(false);
    } else if (newImagePath) {
      toast({
        title: "Error",
        description: "Image path must start with '/' (e.g., /hero-images/image.jpg)",
        variant: "destructive",
      });
    }
  };

  const [imageToDelete, setImageToDelete] = useState<number | null>(null);

  const handleDeleteHeroImage = (id: number) => {
    setImageToDelete(id);
  };

  const confirmDeleteHeroImage = () => {
    if (!imageToDelete) return;
    setHeroImages(heroImages.filter((img: HeroImage) => img.id !== imageToDelete));
    toast({
      title: "Success",
      description: "Image removed from slider",
      variant: "default",
    });
    setImageToDelete(null);
  };

  const handleUpdateHeroImage = (id: number, field: string, value: string) => {
    setHeroImages(heroImages.map(img => 
      img.id === id ? { ...img, [field]: value } : img
    ));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'hero' | 'review') => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === 'review') {
        const reader = new FileReader();
        reader.onload = (event) => {
          const newReview = {
            id: reviews.length + 1,
            platform: 'Google',
            image: event.target?.result as string,
            rating: 5,
          };
          setReviews([...reviews, newReview]);
        };
        reader.readAsDataURL(file);
      } else {
        toast({
          title: "Info",
          description: "Please upload images to the public/hero-images/ folder and add them using 'Add Image' button",
          variant: "default",
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={imageToDelete !== null} onOpenChange={(open) => !open && setImageToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the image from the hero slider. The image file in the public folder will not be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteHeroImage}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add Image Dialog */}
      <Dialog open={showAddImageDialog} onOpenChange={setShowAddImageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Hero Image</DialogTitle>
            <DialogDescription>
              Enter the path to an image in the public folder (e.g., /hero-images/image.jpg)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="image-path">Image Path</Label>
              <Input
                id="image-path"
                placeholder="/hero-images/image.jpg"
                value={newImagePath}
                onChange={(e) => setNewImagePath(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Path must start with / and point to a file in the public folder
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="image-title">Image Title</Label>
              <Input
                id="image-title"
                placeholder="Hero Image Title"
                value={newImageTitle}
                onChange={(e) => setNewImageTitle(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddImageDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddHeroImage}>
              Add Image
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Tabs value={activeSubTab} onValueChange={setActiveSubTab}>
        <TabsList className="grid w-full max-w-2xl grid-cols-4">
          <TabsTrigger value="images">Hero Images</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="hubs">Hub Information</TabsTrigger>
          <TabsTrigger value="settings">Site Settings</TabsTrigger>
        </TabsList>

        {/* Hero Images Sub-tab */}
        <TabsContent value="images">
          <Card className="border-2 border-primary/20 shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <CardTitle className="text-2xl">Hero Slider Images</CardTitle>
                  <CardDescription>
                    Manage hero slider images from the public folder. Images should be placed in <code className="px-1 py-0.5 bg-muted rounded text-xs">public/hero-images/</code>
                  </CardDescription>
                </div>
                <Button 
                  onClick={() => setShowAddImageDialog(true)}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Image
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {heroImages.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <ImageIcon className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No hero images configured</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Add images from the public folder
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {heroImages.map((image) => (
                    <Card key={image.id} className="border-2 border-primary/10 overflow-hidden">
                      <div className="relative h-48">
                        <Image
                          src={image.path || image.url || '/placeholder-hero.jpg'}
                          alt={image.name}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            // Fallback if image doesn't exist
                            (e.target as HTMLImageElement).src = '/placeholder-hero.jpg';
                          }}
                        />
                      </div>
                      <CardContent className="p-4">
                        <div className="space-y-2 mb-3">
                          <Input
                            placeholder="Image Name"
                            value={image.name}
                            onChange={(e) => handleUpdateHeroImage(image.id, 'name', e.target.value)}
                            className="text-sm"
                          />
                          <Input
                            placeholder="Image Path (e.g., /hero-images/image.jpg)"
                            value={image.path || image.url || ''}
                            onChange={(e) => handleUpdateHeroImage(image.id, 'path', e.target.value)}
                            className="text-xs font-mono"
                          />
                          <Input
                            placeholder="Image Title"
                            value={image.title || ''}
                            onChange={(e) => handleUpdateHeroImage(image.id, 'title', e.target.value)}
                            className="text-sm"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => handleDeleteHeroImage(image.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Remove
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reviews Sub-tab */}
        <TabsContent value="reviews">
          <Card className="border-2 border-primary/20 shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <CardTitle className="text-2xl">Review Screenshots</CardTitle>
                  <CardDescription>Upload screenshots from Google or Facebook reviews</CardDescription>
                </div>
                <div>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'review')}
                    className="hidden"
                    id="review-upload"
                  />
                  <Button asChild className="bg-primary hover:bg-primary/90">
                    <label htmlFor="review-upload" className="cursor-pointer">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Screenshot
                    </label>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {reviews.map((review) => (
                  <Card key={review.id} className="border-2 border-primary/10 overflow-hidden">
                    <div className="relative h-64">
                      {review.image ? (
                        <Image
                          src={review.image}
                          alt={`${review.platform} Review`}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-muted">
                          <div className="text-center">
                            <Star className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">No image uploaded</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge>{review.platform}</Badge>
                        <div className="flex items-center gap-1">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button variant="destructive" size="sm" className="flex-1">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Hub Information Sub-tab */}
        <TabsContent value="hubs">
          <HubInformationManagement />
        </TabsContent>

        {/* Site Settings Sub-tab */}
        <TabsContent value="settings">
          <SiteSettingsManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Hub Information Management Component
function HubInformationManagement() {
  const [hubs, setHubs] = useState([
    {
      id: 1,
      name: "Dubai Hub",
      address: "Warehouse 42, Al Quoz Industrial Area 3, Dubai, UAE",
      email: "customercare@nge.ae",
      phone: "+971 50 123 4567",
      operatingTime: "9 AM - 6 PM",
      timeZone: "UAE Time Zone (GMT+4)",
    },
    {
      id: 2,
      name: "Manila Hub",
      address: "Unit 14, Cargo Complex, 123 Airline Avenue, Pasay City, Metro Manila, Philippines",
      email: "customercare.ph@nge.com",
      phone: "+63 917 123 4567",
      operatingTime: "8 AM - 5 PM",
      timeZone: "PH Time Zone (GMT+8)",
    },
  ]);

  const [editingHub, setEditingHub] = useState<number | null>(null);

  return (
    <Card className="border-2 border-primary/20 shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <CardTitle className="text-2xl">Hub Information</CardTitle>
            <CardDescription>Manage hub locations and contact information</CardDescription>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Add Hub
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {hubs.map((hub) => (
            <Card key={hub.id} className="border-2 border-primary/10">
              {editingHub === hub.id ? (
                <HubEditForm hub={hub} onSave={() => setEditingHub(null)} onCancel={() => setEditingHub(null)} />
              ) : (
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-2">{hub.name}</h3>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setEditingHub(hub.id)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <p className="font-semibold">Address</p>
                        <p className="text-sm text-muted-foreground">{hub.address}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <p className="font-semibold">Email</p>
                        <p className="text-sm text-muted-foreground">{hub.email}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <p className="font-semibold">Phone</p>
                        <p className="text-sm text-muted-foreground">{hub.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <p className="font-semibold">Operating Time</p>
                        <p className="text-sm text-muted-foreground">{hub.operatingTime}</p>
                        <p className="text-sm text-muted-foreground">{hub.timeZone}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Hub Edit Form Component
function HubEditForm({ hub, onSave, onCancel }: { hub: any; onSave: () => void; onCancel: () => void }) {
  const [formData, setFormData] = useState(hub);

  return (
    <CardContent className="p-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Hub Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="address">Address</Label>
          <Textarea
            id="address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            rows={2}
          />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="operatingTime">Operating Time</Label>
            <Input
              id="operatingTime"
              value={formData.operatingTime}
              onChange={(e) => setFormData({ ...formData, operatingTime: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="timeZone">Time Zone</Label>
            <Input
              id="timeZone"
              value={formData.timeZone}
              onChange={(e) => setFormData({ ...formData, timeZone: e.target.value })}
            />
          </div>
        </div>
        <div className="flex gap-2 pt-4">
          <Button onClick={onSave} className="bg-primary hover:bg-primary/90">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
          <Button variant="outline" onClick={onCancel}>
            <XCircle className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </div>
      </div>
    </CardContent>
  );
}

// Site Settings Management Component
function SiteSettingsManagement() {
  const [settings, setSettings] = useState({
    siteName: "Next Global Express",
    siteDescription: "Your trusted logistics partner",
    contactEmail: "customercare@nge.ae",
    contactPhone: "+971 50 123 4567",
    address: "Warehouse 42, Al Quoz Industrial Area 3, Dubai, UAE",
    facebook: "",
    twitter: "",
    linkedin: "",
    instagram: "",
  });

  return (
    <Card className="border-2 border-primary/20 shadow-xl">
      <CardHeader>
        <div>
          <CardTitle className="text-2xl">Site Settings</CardTitle>
          <CardDescription>Configure general website settings</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">General Information</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.siteDescription}
                  onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    value={settings.contactPhone}
                    onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  rows={2}
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Social Media Links</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="facebook">Facebook URL</Label>
                <Input
                  id="facebook"
                  type="url"
                  value={settings.facebook}
                  onChange={(e) => setSettings({ ...settings, facebook: e.target.value })}
                  placeholder="https://facebook.com/..."
                />
              </div>
              <div>
                <Label htmlFor="twitter">Twitter URL</Label>
                <Input
                  id="twitter"
                  type="url"
                  value={settings.twitter}
                  onChange={(e) => setSettings({ ...settings, twitter: e.target.value })}
                  placeholder="https://twitter.com/..."
                />
              </div>
              <div>
                <Label htmlFor="linkedin">LinkedIn URL</Label>
                <Input
                  id="linkedin"
                  type="url"
                  value={settings.linkedin}
                  onChange={(e) => setSettings({ ...settings, linkedin: e.target.value })}
                  placeholder="https://linkedin.com/..."
                />
              </div>
              <div>
                <Label htmlFor="instagram">Instagram URL</Label>
                <Input
                  id="instagram"
                  type="url"
                  value={settings.instagram}
                  onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                  placeholder="https://instagram.com/..."
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button className="bg-primary hover:bg-primary/90">
              <Save className="w-4 h-4 mr-2" />
              Save All Settings
            </Button>
            <Button variant="outline">
              Reset to Default
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
