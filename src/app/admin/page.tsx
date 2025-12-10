"use client"

import { useState, useEffect, useCallback, Fragment } from 'react';
import { useRouter } from 'next/navigation';
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
  Loader2,
  Home,
  RefreshCw,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import Image from 'next/image';
import { getCurrentUser, hasPermission, Permissions, RolePermissions, type UserRole } from '@/lib/auth';
import { getApiUrl, apiRequest } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

export default function AdminPage() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [activeTab, setActiveTab] = useState(() => {
    const user = getCurrentUser();
    return user?.role === 'Driver' ? 'orders' : 'dashboard';
  });
  const [openOrderForm, setOpenOrderForm] = useState(false);
  const [dashboardRefreshSignal, setDashboardRefreshSignal] = useState(0);

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
      const user = getCurrentUser();
      if (user?.role === 'Driver') {
        setActiveTab('orders');
      }
      setIsCheckingAuth(false);
    };

    checkAuth();
  }, [router]);

  // Handle logout and redirect to home
  const handleHome = () => {
    // Clear authentication tokens
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
    }
    // Redirect to home page
    router.push('/');
  };

  // Show loading state while checking authentication
  if (isCheckingAuth) {
  return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-violet-50 via-purple-50/30 to-pink-50/20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  const isDriver = currentUser?.role === 'Driver';

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-grow bg-gradient-to-br from-violet-50 via-purple-50/30 to-pink-50/20">
        <div className="container mx-auto px-4 md:px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-muted-foreground text-lg">
                  Manage your logistics operations and website content
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="text-lg px-4 py-2">
                  {currentUser?.role || 'User'}
                </Badge>
                <Button 
                  onClick={() => setDashboardRefreshSignal((value) => value + 1)}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Refresh</span>
                </Button>
                <Button 
                  onClick={handleHome}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  <span>Logout</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-8 mb-8 h-auto">
              {!isDriver && (
                <TabsTrigger value="dashboard" className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </TabsTrigger>
              )}
              {!isDriver && (
                <TabsTrigger value="customers" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span className="hidden sm:inline">Customers</span>
                </TabsTrigger>
              )}
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline">Orders</span>
              </TabsTrigger>
              {!isDriver && (
                <TabsTrigger value="shipments" className="flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  <span className="hidden sm:inline">Shipments</span>
                </TabsTrigger>
              )}
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
              {hasPermission(currentUser, Permissions.USER_VIEW) && (
                <TabsTrigger value="roles" className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span className="hidden sm:inline">Roles</span>
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
            {!isDriver && (
              <TabsContent value="dashboard">
                <DashboardTab 
                  currentUser={currentUser} 
                  refreshSignal={dashboardRefreshSignal}
                  onNewOrder={() => {
                    setOpenOrderForm(true);
                    setActiveTab("orders");
                  }}
                />
              </TabsContent>
            )}

            {/* Customer Management Tab */}
            {!isDriver && (
              <TabsContent value="customers">
                <CustomerManagementTab />
              </TabsContent>
            )}

            {/* Orders Tab */}
            <TabsContent value="orders">
              <OrdersTab currentUser={currentUser} openCreateForm={openOrderForm} onFormClose={() => setOpenOrderForm(false)} />
            </TabsContent>

            {/* Shipments Tab */}
            {!isDriver && (
              <TabsContent value="shipments">
                <ShipmentsTab currentUser={currentUser} />
              </TabsContent>
            )}

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

            {/* Roles Management Tab */}
            {hasPermission(currentUser, Permissions.USER_VIEW) && (
              <TabsContent value="roles">
                <RolesManagementTab />
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
    </div>
  );
}

// Dashboard Tab Component
function DashboardTab({ currentUser, onNewOrder, refreshSignal }: { currentUser: any; onNewOrder?: () => void; refreshSignal: number }) {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Drivers should not access dashboard stats
  if (currentUser?.role === 'Driver') {
    return (
      <Card className="border-2 border-violet-300/30 shadow-xl">
        <CardContent className="p-6">
          <div className="text-center space-y-3">
            <AlertCircle className="w-6 h-6 text-amber-500 mx-auto" />
            <p className="font-semibold">Dashboard not available for drivers</p>
            <p className="text-sm text-muted-foreground">Please use the Shipments tab to manage your deliveries.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const fetchDashboardData = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData, refreshSignal]);

  const stats = dashboardData ? [
    { label: "Total Customers", value: dashboardData.totalCustomers.toLocaleString(), icon: Users, color: "text-blue-500" },
    { label: "Active Orders", value: dashboardData.activeOrders.toLocaleString(), icon: ShoppingCart, color: "text-green-500" },
    { label: "In Transit", value: dashboardData.inTransit.toLocaleString(), icon: Package, color: "text-yellow-500" },
    { label: "Total Revenue", value: `$${dashboardData.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: BarChart3, color: "text-violet-600" },
  ] : [
    { label: "Total Customers", value: "0", icon: Users, color: "text-blue-500" },
    { label: "Active Orders", value: "0", icon: ShoppingCart, color: "text-green-500" },
    { label: "In Transit", value: "0", icon: Package, color: "text-yellow-500" },
    { label: "Total Revenue", value: "$0.00", icon: BarChart3, color: "text-violet-600" },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border-2 border-violet-300/30 shadow-xl">
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
                  className="bg-gradient-violet hover:opacity-90"
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
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="border-2 border-violet-300/30 shadow-xl">
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
        <Card className="border-2 border-violet-300/30 shadow-xl">
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

        <Card className="border-2 border-violet-300/30 shadow-xl">
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

        <Card className="border-2 border-violet-300/30 shadow-xl">
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
      // Remove status field if it exists (we don't use status anymore)
      const { status, ...customerData } = data;
      
      const response = await apiRequest('/customers', {
        method: 'POST',
        body: JSON.stringify(customerData),
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
      // Remove status field if it exists (we don't use status anymore)
      const { status, ...customerData } = data;
      
      const customerId = editingCustomer.id || editingCustomer._id;
      const response = await apiRequest(`/customers/${customerId}`, {
        method: 'PUT',
        body: JSON.stringify(customerData),
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
    console.log('confirmDeleteCustomer called with customerToDelete:', customerToDelete);
    
    if (!customerToDelete) {
      console.warn('No customer ID to delete');
      return;
    }

    try {
      // Log the API URL and endpoint for debugging
      const apiUrl = getApiUrl();
      const endpoint = `/customers/${customerToDelete}`;
      const fullUrl = `${apiUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
      console.log('Deleting customer:', {
        customerId: customerToDelete,
        endpoint,
        fullUrl,
        apiUrl,
        method: 'DELETE'
      });

      const response = await apiRequest(endpoint, {
        method: 'DELETE',
      });

      console.log('Delete response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || errorData.message || `HTTP error! status: ${response.status}`;
        console.error('Delete failed:', errorMessage, errorData);
        throw new Error(errorMessage);
      }

      const result = await response.json();
      
      // Verify deletion was successful
      if (result.success === false) {
        throw new Error(result.error?.message || 'Failed to delete customer');
      }

      // Refetch customers from backend to ensure we have the latest data
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: '10',
        });
        
        if (searchQuery) {
          params.append('search', searchQuery);
        }

        const fetchResponse = await apiRequest(`/customers?${params.toString()}`, {
          method: 'GET',
        });

        if (fetchResponse.ok) {
          const fetchResult = await fetchResponse.json();
          let customersData = [];
          
          if (fetchResult.data) {
            if (Array.isArray(fetchResult.data)) {
              customersData = fetchResult.data;
            } else if (fetchResult.data.customers && Array.isArray(fetchResult.data.customers)) {
              customersData = fetchResult.data.customers;
            } else if (fetchResult.data.items && Array.isArray(fetchResult.data.items)) {
              customersData = fetchResult.data.items;
            }
          }
          
          if (!Array.isArray(customersData)) {
            customersData = [];
          }
          
          setCustomers(customersData);
          
          if (fetchResult.data?.pagination) {
            setTotalPages(fetchResult.data.pagination.totalPages || 1);
          }
        }
      } catch (fetchErr) {
        console.error('Error refetching customers after deletion:', fetchErr);
        // Fallback: remove from local state
        setCustomers(prevCustomers => prevCustomers.filter(c => (c.id || c._id) !== customerToDelete));
      }
      
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

      <Card className="border-2 border-violet-300/30 shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="text-2xl">Customer Management</CardTitle>
              <CardDescription>Manage all your customers</CardDescription>
            </div>
            <Button 
              className="bg-gradient-violet hover:opacity-90"
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
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500 mx-auto mb-4"></div>
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
  const isDriver = currentUser?.role === 'Driver';
  const [autoBatching, setAutoBatching] = useState(false);
  const [lastAutoBatchSignature, setLastAutoBatchSignature] = useState(() => {
    if (typeof window === 'undefined') return "";
    return sessionStorage.getItem('autoBatchSignature') || "";
  });
  
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
        
        // For drivers, filter by status on backend (more efficient)
        if (isDriver) {
          params.append('status', 'out_for_delivery,in_transit');
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

        // If driver, limit to out_for_delivery or in_transit orders only
        const filteredOrders = isDriver
          ? ordersData.filter((o: any) => {
              const st = (o.status || '').toLowerCase().replace(/[_\s-]/g, '');
              // Match: out_for_delivery, out-for-delivery, out for delivery, outfordelivery, etc.
              // Match: in_transit, in-transit, in transit, intransit, etc.
              return st === 'outfordelivery' || st === 'intransit';
            })
          : ordersData;
        
        if (isDriver) {
          console.log('Driver orders filter:', {
            totalOrders: ordersData.length,
            filteredOrders: filteredOrders.length,
            sampleStatuses: ordersData.slice(0, 3).map((o: any) => o.status)
          });
        }
        
        setOrders(filteredOrders);
        
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

  // Auto-create shipments by departure date for orders that are not yet assigned
  useEffect(() => {
    if (autoBatching) return;

    const unbatchedOrders = orders.filter((order: any) => order.departureDate && !order.shipmentId && !order.shipment);
    if (unbatchedOrders.length === 0) {
      setLastAutoBatchSignature("");
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('autoBatchSignature');
      }
      return;
    }

    const signature = unbatchedOrders
      .map((order: any) => order.id || order._id || "")
      .filter(Boolean)
      .sort()
      .join("|");

    if (!signature || signature === lastAutoBatchSignature) {
      return;
    }

    setAutoBatching(true);
    setLastAutoBatchSignature(signature);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('autoBatchSignature', signature);
    }

    handleCreateShipmentsFromOrders(unbatchedOrders, true)
      .finally(() => setAutoBatching(false));
  }, [orders, autoBatching, lastAutoBatchSignature]);

  const handleCreateOrder = async (data: any) => {
    try {
      let customerId = data.customerId;
      
      // If customer data is provided (new order), check for existing customer or create new one
      if (data.customerData && !customerId) {
        const { customerData } = data;
        
        // Check if customer with this phone number exists
        if (customerData.phone) {
          try {
            // Normalize phone number for comparison (remove spaces, dashes, etc.)
            const normalizePhone = (phone: string) => phone.replace(/[\s\-\(\)]/g, '').trim();
            const normalizedSearchPhone = normalizePhone(customerData.phone);
            
            const searchResponse = await apiRequest(`/customers?search=${encodeURIComponent(customerData.phone)}&limit=100`);
            if (searchResponse.ok) {
              const searchResult = await searchResponse.json();
              let customersList = [];
              
              if (searchResult.data) {
                if (Array.isArray(searchResult.data)) {
                  customersList = searchResult.data;
                } else if (searchResult.data.customers && Array.isArray(searchResult.data.customers)) {
                  customersList = searchResult.data.customers;
                } else if (searchResult.data.items && Array.isArray(searchResult.data.items)) {
                  customersList = searchResult.data.items;
                }
              }
              
              // Find customer with matching phone number (normalized comparison)
              const existingCustomer = customersList.find((c: any) => 
                c.phone && normalizePhone(c.phone) === normalizedSearchPhone
              );
              
              if (existingCustomer) {
                // Use existing customer
                customerId = existingCustomer.id || existingCustomer._id;
                console.log('Using existing customer:', customerId);
              } else {
                // Create new customer
                console.log('Creating new customer with phone:', customerData.phone);
                const createCustomerResponse = await apiRequest('/customers', {
                  method: 'POST',
                  body: JSON.stringify(customerData),
                });
                
                if (createCustomerResponse.ok) {
                  const customerResult = await createCustomerResponse.json();
                  const newCustomer = customerResult.data || customerResult;
                  customerId = newCustomer.id || newCustomer._id;
                  console.log('New customer created:', customerId);
                } else {
                  const errorData = await createCustomerResponse.json().catch(() => ({}));
                  throw new Error(errorData.error?.message || errorData.message || 'Failed to create customer');
                }
              }
            }
          } catch (err: any) {
            console.error('Error checking/creating customer:', err);
            throw new Error('Failed to process customer: ' + err.message);
          }
        } else {
          throw new Error('Phone number is required to create or match customer');
        }
      }
      
      if (!customerId) {
        throw new Error('Customer ID is required');
      }
      
      // Prepare order data without customerData
      const { customerData, ...orderData } = data;
      const orderPayload = {
        ...orderData,
        customerId,
      };
      
      const response = await apiRequest('/orders', {
        method: 'POST',
        body: JSON.stringify(orderPayload),
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
      
      // When editing, use existing customerId (don't create new customers)
      const { customerData, ...orderData } = data;
      const orderPayload = {
        ...orderData,
        // Keep existing customerId if available, otherwise use from formData
        customerId: data.customerId || editingOrder.customerId?._id || editingOrder.customerId?.id || editingOrder.customerId,
      };
      
      const response = await apiRequest(`/orders/${orderId}`, {
        method: 'PUT',
        body: JSON.stringify(orderPayload),
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

  const handleCreateShipmentsFromOrders = async (sourceOrders: any[] = orders, isAuto = false) => {
    try {
      // Group orders by departure date
      const ordersByDate: { [key: string]: any[] } = {};
      
      sourceOrders.forEach((order: any) => {
        if (order.departureDate) {
          const dateKey = new Date(order.departureDate).toISOString().split('T')[0]; // YYYY-MM-DD
          if (!ordersByDate[dateKey]) {
            ordersByDate[dateKey] = [];
          }
          // Only include orders that don't already have a shipment
          if (!order.shipmentId && !order.shipment) {
            ordersByDate[dateKey].push(order);
          }
        }
      });

      // Filter out dates with no orders
      const datesWithOrders = Object.keys(ordersByDate).filter(date => ordersByDate[date].length > 0);

      if (datesWithOrders.length === 0) {
        if (!isAuto) {
          toast({
            title: "No Orders Available",
            description: "No orders with departure dates found, or all orders are already assigned to shipments.",
            variant: "default",
          });
        }
        return;
      }

      // Create shipments for each departure date
      let createdCount = 0;
      for (const date of datesWithOrders) {
        const ordersForDate = ordersByDate[date];
        const orderIds = ordersForDate.map(o => o.id || o._id);

        try {
          const response = await apiRequest('/shipments/create-from-orders', {
            method: 'POST',
            body: JSON.stringify({
              // Let backend use the persisted departureDate for these orders
              orderIds: orderIds,
            }),
          });

          if (response.ok) {
            const result = await response.json();
            if (result.success) {
              createdCount++;
            }
          }
        } catch (err) {
          console.error(`Error creating shipment for date ${date}:`, err);
        }
      }

      if (createdCount > 0) {
        toast({
          title: isAuto ? "Shipments auto-batched" : "Success",
          description: isAuto 
            ? `Automatically grouped ${createdCount} batch(es) by departure date.`
            : `Created ${createdCount} shipment(s) from orders grouped by departure date.`,
          variant: "default",
        });

        // Refresh orders list
        const fetchResponse = await apiRequest(`/orders?page=${page}&limit=10`, {
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
          if (Array.isArray(ordersData)) {
            setOrders(ordersData);
          }
        }
      } else {
        toast({
          title: "Warning",
          description: "No shipments were created. Please check if orders have departure dates.",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      console.error('Error creating shipments:', err);
      if (!isAuto) {
        toast({
          title: "Error",
          description: "Failed to create shipments: " + err.message,
          variant: "destructive",
        });
      } else {
        // Reset signature so we can retry on next data change
        setLastAutoBatchSignature("");
        toast({
          title: "Auto-batch failed",
          description: err.message || "Unable to group shipments automatically.",
          variant: "destructive",
        });
      }
    }
  };

  const handleOrderStatusChange = async (orderId: string | number, newStatus: string) => {
    if (!hasPermission(currentUser, Permissions.ORDER_MODIFY)) {
      toast({
        title: "Permission Denied",
        description: "You do not have permission to modify orders",
        variant: "destructive",
      });
      return;
    }

    // For drivers, only allow specific status changes
    if (isDriver) {
      const normalizedNewStatus = newStatus.toLowerCase().replace(/[_\s-]/g, '');
      if (normalizedNewStatus !== 'outfordelivery' && normalizedNewStatus !== 'delivered') {
        toast({
          title: "Invalid Status",
          description: "Drivers can only update orders to 'Out for Delivery' or 'Delivered'",
          variant: "destructive",
        });
        return;
      }
    }

    try {
      const response = await apiRequest(`/orders/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || errorData.message || `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to update order status');
      }

      // Update order in the list
      setOrders(prevOrders => 
        prevOrders.map(o => {
          const oId = o.id || o._id;
          if (oId === orderId) {
            return { ...o, status: newStatus };
          }
          return o;
        })
      );

      toast({
        title: "Success",
        description: `Order status updated to ${newStatus}`,
        variant: "default",
      });
    } catch (err: any) {
      console.error('Error updating order status:', err);
      toast({
        title: "Error",
        description: "Failed to update order status: " + err.message,
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
      // Log the API URL and endpoint for debugging
      const apiUrl = getApiUrl();
      const endpoint = `/orders/${orderToDelete}`;
      const fullUrl = `${apiUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
      console.log('Deleting order:', {
        orderId: orderToDelete,
        endpoint,
        fullUrl,
        apiUrl
      });

      const response = await apiRequest(endpoint, {
        method: 'DELETE',
      });

      console.log('Delete response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || errorData.message || `HTTP error! status: ${response.status}`;
        console.error('Delete failed:', errorMessage, errorData);
        throw new Error(errorMessage);
      }

      const result = await response.json();
      
      // Verify deletion was successful
      if (result.success === false) {
        throw new Error(result.error?.message || 'Failed to delete order');
      }

      // Refetch orders from backend to ensure we have the latest data
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: '10',
        });
        
        if (searchQuery) {
          params.append('search', searchQuery);
        }

        const fetchResponse = await apiRequest(`/orders?${params.toString()}`, {
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
      } catch (fetchErr) {
        console.error('Error refetching orders after deletion:', fetchErr);
        // Fallback: remove from local state
        setOrders(prevOrders => prevOrders.filter(o => (o.id || o._id) !== orderToDelete));
      }
      
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

      <Card className="border-2 border-violet-300/30 shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="text-2xl">Orders Management</CardTitle>
              <CardDescription>View and manage all orders</CardDescription>
            </div>
            <div className="flex gap-2">
              {hasPermission(currentUser, Permissions.ORDER_CREATE) && (
                <Dialog open={showCreateForm} onOpenChange={handleDialogChange}>
                  <DialogTrigger asChild>
                    <Button 
                      className="bg-gradient-violet hover:opacity-90"
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
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500 mx-auto mb-4"></div>
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
                {isDriver && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Drivers can only see orders with status "Out for Delivery" or "In Transit"
                  </p>
                )}
                {searchQuery && !isDriver && (
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
                        <TableCell>
                          {hasPermission(currentUser, Permissions.ORDER_MODIFY) ? (
                            <Select
                              value={(order.status || 'pending').toLowerCase()}
                              onValueChange={(newStatus) => handleOrderStatusChange(orderId, newStatus)}
                            >
                              <SelectTrigger className="w-[200px] md:w-[220px]">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                {isDriver ? (
                                  <>
                                    <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                                    <SelectItem value="delivered">Delivered</SelectItem>
                                  </>
                                ) : (
                                  <>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="processing">Processing</SelectItem>
                                    <SelectItem value="confirmed">Confirmed</SelectItem>
                                    <SelectItem value="in_transit">In Transit</SelectItem>
                                    <SelectItem value="delivered">Delivered</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                  </>
                                )}
                              </SelectContent>
                            </Select>
                          ) : (
                            <Badge variant={order.status === 'completed' || order.status === 'Completed' ? "default" : "secondary"}>
                              {order.status || 'pending'}
                            </Badge>
                          )}
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
  const [expandedShipments, setExpandedShipments] = useState<Set<string>>(new Set());
  const [shipmentOrders, setShipmentOrders] = useState<Record<string, any[]>>({});
  const [loadingOrders, setLoadingOrders] = useState<Record<string, boolean>>({});
  const isDriver = currentUser?.role === 'Driver';

  const fetchShipments = useCallback(async () => {
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

      // Handle different response structures from Shipment Collection
      let shipmentsData = [];
      
      if (result.data) {
        if (Array.isArray(result.data)) {
          shipmentsData = result.data;
        } else if (result.data.items && Array.isArray(result.data.items)) {
          // Paginated response: data.items
          shipmentsData = result.data.items;
        } else if (result.data.shipments && Array.isArray(result.data.shipments)) {
          // Response: data.shipments
          shipmentsData = result.data.shipments;
        }
      }
      
      // Ensure we have an array
      if (!Array.isArray(shipmentsData)) {
        shipmentsData = [];
      }
      
      // If driver, only show shipments that are out_for_delivery
      const filtered = isDriver
        ? shipmentsData.filter((s: any) => {
            const st = (s.currentStatus || s.status || '').toLowerCase();
            return st === 'out_for_delivery' || st === 'in_transit';
          })
        : shipmentsData;

      setShipments(filtered);
      
      // Update pagination if available
      if (result.data?.pagination) {
        setTotalPages(result.data.pagination.totalPages || 1);
      } else {
        setTotalPages(1);
      }
    } catch (err: any) {
      console.error('Error fetching shipments:', err);
      setError(err.message || 'Failed to load shipments');
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery]);

  // Fetch shipments from backend
  useEffect(() => {
    // Debounce search
    const timeoutId = setTimeout(() => {
      fetchShipments();
    }, searchQuery ? 500 : 0);

    return () => clearTimeout(timeoutId);
  }, [page, searchQuery, fetchShipments]);

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
      await fetchShipments();
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
      // Update shipment status (backend expects status in body; endpoint without /status to avoid 404)
      const response = await apiRequest(`/shipments/${shipmentId}`, {
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

      // Refetch shipments from backend to get updated data from Shipment Collection
      await fetchShipments();
      
      // Refresh orders if shipment is expanded
      const updatedShipmentId = updatingShipment?.id || updatingShipment?._id;
      if (updatedShipmentId && expandedShipments.has(String(updatedShipmentId))) {
        await fetchShipmentOrders(String(updatedShipmentId));
      }
      
      setUpdatingShipment(null);
      setShowIndividualUpdate(false);
      
      toast({
        title: "Success",
        description: `Shipment status updated to ${data.status}. All orders in this shipment have been updated.`,
        variant: "default",
      });
    } catch (err: any) {
      console.error('Error updating shipment:', err);
      toast({
        title: "Error",
        description: "Failed to update shipment: " + err.message,
        variant: "destructive",
      });
    }
  };

  const handleShipmentStatusChange = async (shipmentId: string | number, newStatus: string) => {
    if (!hasPermission(currentUser, Permissions.SHIPMENT_STATUS_UPDATE)) {
      toast({
        title: "Permission Denied",
        description: "You do not have permission to update shipment status",
        variant: "destructive",
      });
      return;
    }

    try {
      // Update shipment status (backend expects status in body; endpoint without /status to avoid 404)
      const response = await apiRequest(`/shipments/${shipmentId}`, {
        method: 'PUT',
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || errorData.message || `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to update shipment status');
      }

      await fetchShipments();
      
      // Refresh orders if shipment is expanded
      if (expandedShipments.has(String(shipmentId))) {
        await fetchShipmentOrders(String(shipmentId));
      }

      toast({
        title: "Success",
        description: `Shipment status updated to ${newStatus}. All orders in this shipment have been updated automatically.`,
        variant: "default",
      });
    } catch (err: any) {
      console.error('Error updating shipment status:', err);
      toast({
        title: "Error",
        description: "Failed to update shipment status: " + err.message,
        variant: "destructive",
      });
    }
  };

  const fetchShipmentOrders = async (shipmentId: string) => {
    try {
      setLoadingOrders(prev => ({ ...prev, [shipmentId]: true }));
      
      const response = await apiRequest(`/shipments/${shipmentId}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch shipment orders');
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to fetch shipment orders');
      }

      const shipment = result.data;
      // Get orders from shipment - can be populated orders array or orderIds array
      const orders = shipment.orders || shipment.orderIds || [];
      
      // If orders are just IDs, fetch each order's details
      if (orders.length > 0 && typeof orders[0] === 'string') {
        const orderDetails = await Promise.all(
          orders.map(async (orderId: string) => {
            try {
              const orderResponse = await apiRequest(`/orders/${orderId}`, {
                method: 'GET',
              });
              if (orderResponse.ok) {
                const orderResult = await orderResponse.json();
                return orderResult.data || orderResult;
              }
              return { id: orderId, orderNumber: orderId, status: 'pending' };
            } catch (err) {
              return { id: orderId, orderNumber: orderId, status: 'pending' };
            }
          })
        );
        setShipmentOrders(prev => ({ ...prev, [shipmentId]: orderDetails }));
      } else {
        setShipmentOrders(prev => ({ ...prev, [shipmentId]: orders }));
      }
    } catch (err: any) {
      console.error('Error fetching shipment orders:', err);
      toast({
        title: "Error",
        description: "Failed to load order details: " + err.message,
        variant: "destructive",
      });
    } finally {
      setLoadingOrders(prev => ({ ...prev, [shipmentId]: false }));
    }
  };

  const toggleShipmentExpansion = (shipmentId: string) => {
    setExpandedShipments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(shipmentId)) {
        newSet.delete(shipmentId);
      } else {
        newSet.add(shipmentId);
        // Fetch orders when expanding
        if (!shipmentOrders[shipmentId]) {
          fetchShipmentOrders(shipmentId);
        }
      }
      return newSet;
    });
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
      <Card className="border-2 border-violet-300/30 shadow-xl">
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
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500 mx-auto mb-4"></div>
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
                    <TableHead>Batch/Shipment ID</TableHead>
                    <TableHead>Departure Date</TableHead>
                    <TableHead>Orders Count</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shipments.map((shipment) => {
                    const shipmentId = shipment.id || shipment._id;
                    // Get batchNumber from Shipment Collection
                    const batchNumber = shipment.batchNumber || shipment.trackingId || shipment.id || `BATCH-${shipmentId}`;
                    // Get dates from Shipment Collection
                    const shipmentDate = shipment.createdAt ? new Date(shipment.createdAt) : (shipment.date ? new Date(shipment.date) : new Date());
                    const departureDate = shipment.departureDate ? new Date(shipment.departureDate) : null;
                    // Get status from Shipment Collection (support both currentStatus and status fields)
                    const rawStatus = shipment.currentStatus || shipment.status || 'pending';
                    const status = (rawStatus || '').toLowerCase();
                    // Get orders from Shipment Collection - can be populated orders array or orderIds array
                    const orders = shipment.orders || shipment.orderIds || [];
                    const ordersCount = Array.isArray(orders) ? orders.length : (shipment.orderIds ? shipment.orderIds.length : 0);
                    const isExpanded = expandedShipments.has(shipmentId);

                    return (
                      <Fragment key={shipmentId}>
                        <TableRow>
                          {hasPermission(currentUser, Permissions.SHIPMENT_BULK_UPDATE) && (
                            <TableCell>
                              <Checkbox
                                checked={selectedShipments.includes(shipmentId)}
                                onCheckedChange={() => toggleSelection(shipmentId)}
                              />
                            </TableCell>
                          )}
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => toggleShipmentExpansion(shipmentId)}
                              >
                                {isExpanded ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </Button>
                              {batchNumber}
                            </div>
                          </TableCell>
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
                          <TableCell>
                            <Badge variant="outline">{ordersCount} orders</Badge>
                          </TableCell>
                          <TableCell>
                            {hasPermission(currentUser, Permissions.SHIPMENT_STATUS_UPDATE) ? (
                              <Select
                                value={status}
                                onValueChange={(newStatus) => handleShipmentStatusChange(shipmentId, newStatus)}
                              >
                                <SelectTrigger className="w-[200px] md:w-[220px]">
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                  {isDriver ? (
                                    <>
                                      <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                                      <SelectItem value="delivered">Delivered</SelectItem>
                                    </>
                                  ) : (
                                    <>
                                      <SelectItem value="pending">Pending</SelectItem>
                                      <SelectItem value="processing">Processing</SelectItem>
                                      <SelectItem value="confirmed">Confirmed</SelectItem>
                                      <SelectItem value="in_transit">In Transit</SelectItem>
                                      <SelectItem value="delivered">Delivered</SelectItem>
                                      <SelectItem value="completed">Completed</SelectItem>
                                      <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </>
                                  )}
                                </SelectContent>
                              </Select>
                            ) : (
                              <Badge variant={
                                status === 'delivered' || status === 'completed' ? 'default' : 
                                status === 'in_transit' ? 'secondary' : 
                                'outline'
                              }>
                                {status}
                              </Badge>
                            )}
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
                                    shipmentIds={[shipmentId]}
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
                            onClick={() => {
                              const trackingLinkId = shipment.trackingId || batchNumber || shipmentId;
                              if (trackingLinkId) {
                                window.open(`/track/${trackingLinkId}`, '_blank');
                              } else {
                                toast({
                                  title: "Tracking unavailable",
                                  description: "No tracking ID or batch number found for this shipment.",
                                  variant: "destructive",
                                });
                              }
                            }}
                            title="View Details"
                          >
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      {isExpanded && ordersCount > 0 && (
                        <TableRow>
                          <TableCell colSpan={hasPermission(currentUser, Permissions.SHIPMENT_BULK_UPDATE) ? 7 : 6} className="bg-muted/50">
                            <div className="py-4">
                              <h4 className="font-semibold mb-3">Orders in this Shipment ({ordersCount}):</h4>
                              <div className="space-y-2">
                                {loadingOrders[shipmentId] ? (
                                  <div className="flex items-center justify-center py-4">
                                    <div className="text-center">
                                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-violet-500 mx-auto mb-2"></div>
                                      <p className="text-sm text-muted-foreground">Loading order details...</p>
                                    </div>
                                  </div>
                                ) : shipmentOrders[shipmentId] && shipmentOrders[shipmentId].length > 0 ? (
                                  shipmentOrders[shipmentId].map((order: any, idx: number) => {
                                    const orderId = order.id || order._id || '';
                                    const orderNumber = order.orderNumber || orderId;
                                    const orderStatus = order.status || 'pending';
                                    
                                    return (
                                      <div key={orderId || idx} className="flex items-center justify-between p-2 border rounded">
                                        <div className="flex items-center gap-4">
                                          <span className="font-medium">{orderNumber}</span>
                                          <Badge variant={orderStatus === 'completed' ? 'default' : 'secondary'}>
                                            {orderStatus}
                                          </Badge>
                                        </div>
                                      </div>
                                    );
                                  })
                                ) : Array.isArray(orders) && orders.length > 0 ? (
                                  orders.map((order: any, idx: number) => {
                                    // Fallback to original orders if fetched orders not available
                                    const isOrderId = typeof order === 'string';
                                    const orderId = isOrderId ? order : (order.id || order._id || order);
                                    const orderNumber = isOrderId 
                                      ? orderId
                                      : (order.orderNumber || order.orderId?.orderNumber || order.orderId || orderId);
                                    const orderStatus = isOrderId 
                                      ? 'pending'
                                      : (order.status || order.orderId?.status || 'pending');
                                    
                                    return (
                                      <div key={idx} className="flex items-center justify-between p-2 border rounded">
                                        <div className="flex items-center gap-4">
                                          <span className="font-medium">{orderNumber}</span>
                                          <Badge variant={orderStatus === 'completed' ? 'default' : 'secondary'}>
                                            {orderStatus}
                                          </Badge>
                                        </div>
                                      </div>
                                    );
                                  })
                                ) : (
                                  <p className="text-sm text-muted-foreground">No orders found in this shipment</p>
                                )}
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </Fragment>
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
          } else if (result.data.branches && Array.isArray(result.data.branches)) {
            branchesData = result.data.branches;
          } else if (result.data.items && Array.isArray(result.data.items)) {
            branchesData = result.data.items;
          }
        }
        
        // Ensure branchesData is an array
        if (!Array.isArray(branchesData)) {
          branchesData = [];
        }
        
        // If search query is provided, filter on frontend (or backend should handle it)
        // For now, backend should handle search, but we can also filter here as fallback
        const filtered = searchQuery
          ? branchesData.filter((branch: any) => 
              branch.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              branch.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              branch.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              branch.country?.toLowerCase().includes(searchQuery.toLowerCase())
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
      // Log the API URL and endpoint for debugging
      const apiUrl = getApiUrl();
      const endpoint = `/branches/${branchToDelete}`;
      const fullUrl = `${apiUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
      console.log('Deleting branch:', {
        branchId: branchToDelete,
        endpoint,
        fullUrl,
        apiUrl
      });

      const response = await apiRequest(endpoint, {
        method: 'DELETE',
      });

      console.log('Delete response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || errorData.message || `HTTP error! status: ${response.status}`;
        console.error('Delete failed:', errorMessage, errorData);
        throw new Error(errorMessage);
      }

      const result = await response.json();
      
      // Verify deletion was successful
      if (result.success === false) {
        throw new Error(result.error?.message || 'Failed to delete branch');
      }

      // Refetch branches from backend to ensure we have the latest data
      try {
        const params = new URLSearchParams();
        if (searchQuery) {
          params.append('search', searchQuery);
        }

        const fetchResponse = await apiRequest(`/branches${params.toString() ? `?${params.toString()}` : ''}`, {
          method: 'GET',
        });

        if (fetchResponse.ok) {
          const fetchResult = await fetchResponse.json();
          let branchesData = [];
          
          if (fetchResult.data) {
            if (Array.isArray(fetchResult.data)) {
              branchesData = fetchResult.data;
            } else if (fetchResult.data.branches && Array.isArray(fetchResult.data.branches)) {
              branchesData = fetchResult.data.branches;
            } else if (fetchResult.data.items && Array.isArray(fetchResult.data.items)) {
              branchesData = fetchResult.data.items;
            }
          }
          
          if (!Array.isArray(branchesData)) {
            branchesData = [];
          }
          
          setBranches(branchesData);
        }
      } catch (fetchErr) {
        console.error('Error refetching branches after deletion:', fetchErr);
        // Fallback: remove from local state
        setBranches(prevBranches => prevBranches.filter(b => (b.id || b._id) !== branchToDelete));
      }
      
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
      // Remove status field if it exists (we don't use status anymore)
      const { status, ...branchData } = data;
      
      const response = await apiRequest('/branches', {
        method: 'POST',
        body: JSON.stringify(branchData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || errorData.message || `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to create branch');
      }

      // Refetch branches from backend to ensure we have the latest data
      try {
        const params = new URLSearchParams();
        if (searchQuery) {
          params.append('search', searchQuery);
        }

        const fetchResponse = await apiRequest(`/branches${params.toString() ? `?${params.toString()}` : ''}`, {
          method: 'GET',
        });

        if (fetchResponse.ok) {
          const fetchResult = await fetchResponse.json();
          let branchesData = [];
          
          if (fetchResult.data) {
            if (Array.isArray(fetchResult.data)) {
              branchesData = fetchResult.data;
            } else if (fetchResult.data.branches && Array.isArray(fetchResult.data.branches)) {
              branchesData = fetchResult.data.branches;
            } else if (fetchResult.data.items && Array.isArray(fetchResult.data.items)) {
              branchesData = fetchResult.data.items;
            }
          }
          
          if (!Array.isArray(branchesData)) {
            branchesData = [];
          }
          
          setBranches(branchesData);
        }
      } catch (fetchErr) {
        console.error('Error refetching branches after creation:', fetchErr);
        // Fallback: add to local state
        const newBranch = result.data || result;
        if (newBranch && (newBranch._id || newBranch.id)) {
          setBranches([...branches, newBranch]);
        }
      }
      
      toast({
        title: "Success",
        description: "Branch created successfully!",
        variant: "default",
      });
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
      // Remove status field if it exists (we don't use status anymore)
      const { status, ...branchData } = data;
      
      const branchId = editingBranch.id || editingBranch._id;
      const response = await apiRequest(`/branches/${branchId}`, {
        method: 'PUT',
        body: JSON.stringify(branchData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || errorData.message || `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to update branch');
      }

      // Refetch branches from backend to ensure we have the latest data
      try {
        const params = new URLSearchParams();
        if (searchQuery) {
          params.append('search', searchQuery);
        }

        const fetchResponse = await apiRequest(`/branches${params.toString() ? `?${params.toString()}` : ''}`, {
          method: 'GET',
        });

        if (fetchResponse.ok) {
          const fetchResult = await fetchResponse.json();
          let branchesData = [];
          
          if (fetchResult.data) {
            if (Array.isArray(fetchResult.data)) {
              branchesData = fetchResult.data;
            } else if (fetchResult.data.branches && Array.isArray(fetchResult.data.branches)) {
              branchesData = fetchResult.data.branches;
            } else if (fetchResult.data.items && Array.isArray(fetchResult.data.items)) {
              branchesData = fetchResult.data.items;
            }
          }
          
          if (!Array.isArray(branchesData)) {
            branchesData = [];
          }
          
          setBranches(branchesData);
        }
      } catch (fetchErr) {
        console.error('Error refetching branches after update:', fetchErr);
        // Fallback: update local state
        setBranches(branches.map(b => (b.id || b._id) === branchId ? result.data : b));
      }
      
      toast({
        title: "Success",
        description: "Branch updated successfully!",
        variant: "default",
      });
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

      <Card className="border-2 border-violet-300/30 shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="text-2xl">Branch Management</CardTitle>
              <CardDescription>Manage all branch locations</CardDescription>
            </div>
            <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-violet hover:opacity-90">
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
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500 mx-auto mb-4"></div>
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
                  <Card key={branchId} className="border-2 border-violet-500/10">
                    <CardHeader>
                      <CardTitle className="text-lg">{branch.name || 'Unnamed Branch'}</CardTitle>
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
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-gradient-violet hover:opacity-90">
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
      // Log the API URL and endpoint for debugging
      const apiUrl = getApiUrl();
      const endpoint = `/users/${userToDelete}`;
      const fullUrl = `${apiUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
      console.log('Deleting user:', {
        userId: userToDelete,
        endpoint,
        fullUrl,
        apiUrl
      });

      const response = await apiRequest(endpoint, {
        method: 'DELETE',
      });

      console.log('Delete response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || errorData.message || `HTTP error! status: ${response.status}`;
        console.error('Delete failed:', errorMessage, errorData);
        throw new Error(errorMessage);
      }

      const result = await response.json();
      
      // Verify deletion was successful
      if (result.success === false) {
        throw new Error(result.error?.message || 'Failed to delete user');
      }

      // Refetch users from backend to ensure we have the latest data
      try {
        const params = new URLSearchParams();
        if (searchQuery) {
          params.append('search', searchQuery);
        }

        const fetchResponse = await apiRequest(`/users${params.toString() ? `?${params.toString()}` : ''}`, {
          method: 'GET',
        });

        if (fetchResponse.ok) {
          const fetchResult = await fetchResponse.json();
          let usersData = [];
          
          if (fetchResult.data) {
            if (Array.isArray(fetchResult.data)) {
              usersData = fetchResult.data;
            } else if (fetchResult.data.users && Array.isArray(fetchResult.data.users)) {
              usersData = fetchResult.data.users;
            } else if (fetchResult.data.items && Array.isArray(fetchResult.data.items)) {
              usersData = fetchResult.data.items;
            }
          }
          
          if (!Array.isArray(usersData)) {
            usersData = [];
          }
          
          setUsers(usersData);
        }
      } catch (fetchErr) {
        console.error('Error refetching users after deletion:', fetchErr);
        // Fallback: remove from local state
        setUsers(prevUsers => prevUsers.filter(u => (u.id || u._id) !== userToDelete));
      }
      
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

      <Card className="border-2 border-violet-300/30 shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="text-2xl">User Management</CardTitle>
              <CardDescription>Manage system users and their access</CardDescription>
            </div>
            {hasPermission(currentUser, Permissions.USER_CREATE) && (
              <Dialog open={showUserForm} onOpenChange={setShowUserForm}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-violet hover:opacity-90">
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
              <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
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
                  // Map old role names to new ones if needed
                  let roleName = user.roleId?.name || user.role?.name || user.role || 'N/A';
                  
                  // Map old role names to correct role names
                  const roleNameMap: Record<string, string> = {
                    'Staff': 'Hub Receiver',
                    'Manager': 'Admin',
                    'staff': 'Hub Receiver',
                    'manager': 'Admin',
                    'Staff Member': 'Hub Receiver',
                    'Manager Role': 'Admin',
                  };
                  
                  // If role name is in the map, use the mapped value
                  if (roleNameMap[roleName]) {
                    roleName = roleNameMap[roleName];
                  }
                  
                  // Ensure role name matches one of our defined roles
                  const validRoles = ['Driver', 'Super Admin', 'Admin', 'Hub Receiver'];
                  if (!validRoles.includes(roleName)) {
                    // Try to find a match (case-insensitive)
                    const matchedRole = validRoles.find(r => 
                      r.toLowerCase() === roleName.toLowerCase() ||
                      roleName.toLowerCase().includes(r.toLowerCase()) ||
                      r.toLowerCase().includes(roleName.toLowerCase())
                    );
                    if (matchedRole) {
                      roleName = matchedRole;
                    }
                  }
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

// Roles Management Tab Component
function RolesManagementTab() {
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingRole, setEditingRole] = useState<any | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  // Permission descriptions mapping
  const permissionDescriptions: Record<string, string> = {
    'order:create': 'Create new orders',
    'order:modify': 'Edit and update orders',
    'order:delete': 'Delete orders',
    'order:view': 'View orders',
    'shipment:status_update': 'Update shipment status',
    'shipment:bulk_update': 'Bulk update shipments',
    'shipment:view': 'View shipments',
    'user:create': 'Create new users',
    'user:modify': 'Edit and update users',
    'user:delete': 'Delete users',
    'user:view': 'View users and roles',
    'frontend:edit': 'Edit website content',
    'frontend:reviews': 'Manage website reviews',
    'settings:modify': 'Modify system settings',
  };

  // Permission categories
  const permissionCategories: Record<string, { title: string; permissions: string[] }> = {
    orders: {
      title: 'Order Management',
      permissions: ['order:create', 'order:modify', 'order:delete', 'order:view']
    },
    shipments: {
      title: 'Shipment Management',
      permissions: ['shipment:status_update', 'shipment:bulk_update', 'shipment:view']
    },
    users: {
      title: 'User Management',
      permissions: ['user:create', 'user:modify', 'user:delete', 'user:view']
    },
    frontend: {
      title: 'Website Management',
      permissions: ['frontend:edit', 'frontend:reviews']
    },
    settings: {
      title: 'System Settings',
      permissions: ['settings:modify']
    }
  };

  // Fetch roles from backend
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiRequest('/roles', {
          method: 'GET',
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Authentication required. Please log in.');
          }
          throw new Error(`Failed to fetch roles: ${response.status}`);
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error?.message || 'Failed to fetch roles');
        }

        // Handle different response structures and fall back to root array
        let rolesData = [];
        
        if (result.data) {
          if (Array.isArray(result.data)) {
            rolesData = result.data;
          } else if (result.data.roles && Array.isArray(result.data.roles)) {
            rolesData = result.data.roles;
          } else if (result.data.items && Array.isArray(result.data.items)) {
            rolesData = result.data.items;
          }
        } else if (Array.isArray(result)) {
          // Fallback if backend returns array at root
          rolesData = result;
        }
        
        if (!Array.isArray(rolesData)) {
          rolesData = [];
        }
        
        // Keep all roles as returned by backend to allow updating any role
        setRoles(rolesData);
      } catch (err: any) {
        console.error('Error fetching roles:', err);
        setError(err.message || 'Failed to load roles');
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  // Get permissions for a role
  const getRolePermissions = (role: any): string[] => {
    // If role has permissions array, use it
    if (role.permissions && Array.isArray(role.permissions)) {
      return role.permissions;
    }
    
    // If role has permissionIds array, use it
    if (role.permissionIds && Array.isArray(role.permissionIds)) {
      return role.permissionIds.map((p: any) => p.permission || p);
    }
    
    // Fallback: use role name to get permissions from RolePermissions
    const roleName = role.name || role.role || role._id || role.id;
    if (RolePermissions[roleName as UserRole]) {
      return RolePermissions[roleName as UserRole];
    }
    
    return [];
  };

  // Group permissions by category
  const groupPermissionsByCategory = (permissions: string[]) => {
    const grouped: Record<string, string[]> = {};
    
    Object.keys(permissionCategories).forEach(category => {
      const categoryPerms = permissionCategories[category].permissions.filter(p => permissions.includes(p));
      if (categoryPerms.length > 0) {
        grouped[category] = categoryPerms;
      }
    });
    
    return grouped;
  };

  // Get all available permissions
  const getAllPermissions = (): string[] => {
    return Object.values(permissionCategories).flatMap(cat => cat.permissions);
  };

  // Handle role click to edit permissions
  const handleRoleClick = (role: any) => {
    const permissions = getRolePermissions(role);
    setEditingRole(role);
    setSelectedPermissions([...permissions]);
  };

  // Toggle permission selection
  const togglePermission = (permission: string) => {
    setSelectedPermissions(prev => {
      if (prev.includes(permission)) {
        return prev.filter(p => p !== permission);
      } else {
        return [...prev, permission];
      }
    });
  };

  // Save role permissions
  const handleSavePermissions = async () => {
    if (!editingRole) return;

    try {
      setSaving(true);
      const roleId = editingRole.id || editingRole._id;

      const response = await apiRequest(`/roles/${roleId}`, {
        method: 'PUT',
        body: JSON.stringify({
          permissions: selectedPermissions,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || 'Failed to update role permissions');
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to update role permissions');
      }

      // Update the role in the local state
      setRoles(prevRoles => 
        prevRoles.map(role => {
          const rId = role.id || role._id;
          if (rId === roleId) {
            return {
              ...role,
              permissions: selectedPermissions,
            };
          }
          return role;
        })
      );

      setEditingRole(null);
      toast({
        title: "Success",
        description: "Role permissions updated successfully!",
        variant: "default",
      });
    } catch (err: any) {
      console.error('Error updating role permissions:', err);
      toast({
        title: "Error",
        description: err.message || "Failed to update role permissions",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-violet-300/30 shadow-xl">
        <CardHeader>
          <div>
            <CardTitle className="text-2xl">Roles & Permissions</CardTitle>
            <CardDescription>View what each role can do in the system</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500 mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading roles...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
                <p className="text-red-600 font-semibold mb-2">Error loading roles</p>
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
          ) : roles.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Shield className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No roles found</p>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {roles.map((role) => {
                const roleId = role.id || role._id;
                let roleName = role.name || role.role || 'Unknown Role';
                
                // Map old role names to correct role names
                const roleNameMap: Record<string, string> = {
                  'Staff': 'Hub Receiver',
                  'Manager': 'Admin',
                  'staff': 'Hub Receiver',
                  'manager': 'Admin',
                  'Staff Member': 'Hub Receiver',
                  'Manager Role': 'Admin',
                };
                
                // If role name is in the map, use the mapped value
                if (roleNameMap[roleName]) {
                  roleName = roleNameMap[roleName];
                }
                
                // Ensure role name matches one of our defined roles
                const validRoles = ['Driver', 'Super Admin', 'Admin', 'Hub Receiver'];
                if (!validRoles.includes(roleName)) {
                  // Try to find a match (case-insensitive)
                  const matchedRole = validRoles.find(r => 
                    r.toLowerCase() === roleName.toLowerCase() ||
                    roleName.toLowerCase().includes(r.toLowerCase()) ||
                    r.toLowerCase().includes(roleName.toLowerCase())
                  );
                  if (matchedRole) {
                    roleName = matchedRole;
                  }
                }
                
                const roleDescription = role.description || role.desc || '';
                const permissions = getRolePermissions(role);
                const groupedPermissions = groupPermissionsByCategory(permissions);

                return (
                  <Card 
                    key={roleId} 
                    className="border-2 border-violet-500/10 cursor-pointer hover:border-violet-500/30 transition-colors"
                    onClick={() => handleRoleClick(role)}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{roleName}</CardTitle>
                      </div>
                      {roleDescription && (
                        <CardDescription className="mt-2">{roleDescription}</CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {Object.keys(groupedPermissions).length > 0 ? (
                          Object.keys(groupedPermissions).map((category) => (
                            <div key={category}>
                              <h4 className="font-semibold text-sm mb-2 text-violet-600">
                                {permissionCategories[category].title}
                              </h4>
                              <ul className="space-y-1">
                                {groupedPermissions[category].map((permission) => (
                                  <li key={permission} className="flex items-start gap-2 text-sm">
                                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span className="text-muted-foreground">
                                      {permissionDescriptions[permission] || permission}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">No permissions assigned</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Permissions Dialog */}
      <Dialog open={!!editingRole} onOpenChange={(open) => !open && setEditingRole(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Edit Permissions: {editingRole ? (editingRole.name || editingRole.role || 'Unknown Role') : ''}
            </DialogTitle>
            <DialogDescription>
              Select or deselect permissions for this role. Changes will be saved to the backend.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {Object.keys(permissionCategories).map((category) => {
              const categoryData = permissionCategories[category];
              return (
                <div key={category} className="space-y-3">
                  <h4 className="font-semibold text-base text-violet-600 border-b pb-2">
                    {categoryData.title}
                  </h4>
                  <div className="space-y-2 pl-4">
                    {categoryData.permissions.map((permission) => {
                      const isSelected = selectedPermissions.includes(permission);
                      return (
                        <div 
                          key={permission} 
                          className="flex items-center space-x-3 cursor-pointer hover:bg-muted/50 p-2 rounded"
                          onClick={() => togglePermission(permission)}
                        >
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => togglePermission(permission)}
                          />
                          <Label 
                            htmlFor={`perm-${permission}`}
                            className="flex-1 cursor-pointer"
                          >
                            {permissionDescriptions[permission] || permission}
                          </Label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditingRole(null)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSavePermissions}
              disabled={saving}
              className="bg-gradient-violet hover:opacity-90"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Permissions
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

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
      { id: 1, name: "Hero Image 1", path: "/hero-images/image1.jpg", title: "Global Reach, Personal Touch." },
      { id: 2, name: "Hero Image 2", path: "/hero-images/image2.jpg", title: "Fast. Reliable. Secure." },
      { id: 3, name: "Hero Image 3", path: "/hero-images/logistics-in-india-scaled.webp", title: "Worldwide Network." },
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
          <Card className="border-2 border-violet-300/30 shadow-xl">
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
                  className="bg-gradient-violet hover:opacity-90"
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
                    <Card key={image.id} className="border-2 border-violet-500/10 overflow-hidden">
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
          <Card className="border-2 border-violet-300/30 shadow-xl">
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
                  <Button asChild className="bg-gradient-violet hover:opacity-90">
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
                  <Card key={review.id} className="border-2 border-violet-500/10 overflow-hidden">
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
    <Card className="border-2 border-violet-300/30 shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <CardTitle className="text-2xl">Hub Information</CardTitle>
            <CardDescription>Manage hub locations and contact information</CardDescription>
          </div>
          <Button className="bg-gradient-violet hover:opacity-90">
            <Plus className="w-4 h-4 mr-2" />
            Add Hub
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {hubs.map((hub) => (
            <Card key={hub.id} className="border-2 border-violet-500/10">
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
                      <MapPin className="w-5 h-5 text-violet-600 mt-1" />
                      <div>
                        <p className="font-semibold">Address</p>
                        <p className="text-sm text-muted-foreground">{hub.address}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-violet-600 mt-1" />
                      <div>
                        <p className="font-semibold">Email</p>
                        <p className="text-sm text-muted-foreground">{hub.email}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-violet-600 mt-1" />
                      <div>
                        <p className="font-semibold">Phone</p>
                        <p className="text-sm text-muted-foreground">{hub.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-violet-600 mt-1" />
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
          <Button onClick={onSave} className="bg-gradient-violet hover:opacity-90">
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
    <Card className="border-2 border-violet-300/30 shadow-xl">
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
            <Button className="bg-gradient-violet hover:opacity-90">
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
