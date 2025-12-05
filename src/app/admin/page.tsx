"use client"

import { useState } from 'react';
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
  AlertCircle
} from 'lucide-react';
import Image from 'next/image';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="flex min-h-screen flex-col">
      <EnhancedHeader />
      
      <main className="flex-grow pt-20 bg-gradient-to-br from-primary/5 via-background to-primary/5">
        <div className="container mx-auto px-4 md:px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground text-lg">
              Manage your logistics operations and website content
            </p>
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
              <TabsTrigger value="roles" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span className="hidden sm:inline">Roles</span>
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <UserCog className="w-4 h-4" />
                <span className="hidden sm:inline">Users</span>
              </TabsTrigger>
              <TabsTrigger value="webpage" className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">Web Page</span>
              </TabsTrigger>
            </TabsList>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard">
              <DashboardTab />
            </TabsContent>

            {/* Customer Management Tab */}
            <TabsContent value="customers">
              <CustomerManagementTab />
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders">
              <OrdersTab />
            </TabsContent>

            {/* Shipments Tab */}
            <TabsContent value="shipments">
              <ShipmentsTab />
            </TabsContent>

            {/* Branch Management Tab */}
            <TabsContent value="branches">
              <BranchManagementTab />
            </TabsContent>

            {/* Roles & Permissions Tab */}
            <TabsContent value="roles">
              <RolesPermissionsTab />
            </TabsContent>

            {/* User Management Tab */}
            <TabsContent value="users">
              <UserManagementTab />
            </TabsContent>

            {/* Web Page Management Tab */}
            <TabsContent value="webpage">
              <WebPageManagementTab />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <EnhancedFooter />
    </div>
  );
}

// Dashboard Tab Component
function DashboardTab() {
  const stats = [
    { label: "Total Customers", value: "1,234", icon: Users, color: "text-blue-500" },
    { label: "Active Orders", value: "456", icon: ShoppingCart, color: "text-green-500" },
    { label: "In Transit", value: "789", icon: Package, color: "text-yellow-500" },
    { label: "Total Revenue", value: "$125,430", icon: BarChart3, color: "text-primary" },
  ];

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
                <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-2 border-primary/20 shadow-xl">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest customer orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium">Order #{1000 + i}</p>
                    <p className="text-sm text-muted-foreground">Customer Name</p>
                  </div>
                  <Badge>Processing</Badge>
                </div>
              ))}
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
              <Button variant="outline" className="h-auto py-3 flex-col">
                <Plus className="w-5 h-5 mb-2" />
                New Order
              </Button>
              <Button variant="outline" className="h-auto py-3 flex-col">
                <Users className="w-5 h-5 mb-2" />
                Add Customer
              </Button>
              <Button variant="outline" className="h-auto py-3 flex-col">
                <Package className="w-5 h-5 mb-2" />
                Create Shipment
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

  return (
    <Card className="border-2 border-primary/20 shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <CardTitle className="text-2xl">Customer Management</CardTitle>
            <CardDescription>Manage all your customers</CardDescription>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
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
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Total Orders</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3, 4, 5].map((i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">Customer {i}</TableCell>
                <TableCell>customer{i}@example.com</TableCell>
                <TableCell>+1 234 567 890{i}</TableCell>
                <TableCell>{i * 5}</TableCell>
                <TableCell>
                  <Badge variant="default">Active</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

// Orders Tab Component
function OrdersTab() {
  return (
    <Card className="border-2 border-primary/20 shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <CardTitle className="text-2xl">Orders Management</CardTitle>
            <CardDescription>View and manage all orders</CardDescription>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Create Order
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3, 4, 5].map((i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">ORD-{1000 + i}</TableCell>
                <TableCell>Customer {i}</TableCell>
                <TableCell>{new Date().toLocaleDateString()}</TableCell>
                <TableCell>${(i * 100).toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant={i % 2 === 0 ? "default" : "secondary"}>
                    {i % 2 === 0 ? "Completed" : "Processing"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

// Shipments Tab Component
function ShipmentsTab() {
  return (
    <Card className="border-2 border-primary/20 shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <CardTitle className="text-2xl">Shipments Management</CardTitle>
            <CardDescription>Track and manage all shipments</CardDescription>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Create Shipment
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tracking ID</TableHead>
              <TableHead>Shipper</TableHead>
              <TableHead>Receiver</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3, 4, 5].map((i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">NGE-{12345678 + i}</TableCell>
                <TableCell>Shipper {i}</TableCell>
                <TableCell>Receiver {i}</TableCell>
                <TableCell>
                  <Badge variant="secondary">In Transit</Badge>
                </TableCell>
                <TableCell>{new Date().toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

// Branch Management Tab Component
function BranchManagementTab() {
  return (
    <Card className="border-2 border-primary/20 shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <CardTitle className="text-2xl">Branch Management</CardTitle>
            <CardDescription>Manage all branch locations</CardDescription>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Add Branch
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            { name: "Dubai Hub", location: "Dubai, UAE", status: "Active" },
            { name: "Manila Hub", location: "Manila, Philippines", status: "Active" },
            { name: "New York Hub", location: "New York, USA", status: "Active" },
          ].map((branch, i) => (
            <Card key={i} className="border-2 border-primary/10">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{branch.name}</CardTitle>
                  <Badge>{branch.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    {branch.location}
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Roles & Permissions Tab Component
function RolesPermissionsTab() {
  return (
    <Card className="border-2 border-primary/20 shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <CardTitle className="text-2xl">Roles & Permissions</CardTitle>
            <CardDescription>Manage user roles and their permissions</CardDescription>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Create Role
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Role Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Users</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              { name: "Super Admin", desc: "Full system access", users: 2, perms: "All" },
              { name: "Admin", desc: "Administrative access", users: 5, perms: "Most" },
              { name: "Manager", desc: "Management access", users: 10, perms: "Limited" },
              { name: "Staff", desc: "Basic access", users: 25, perms: "View Only" },
            ].map((role, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">{role.name}</TableCell>
                <TableCell>{role.desc}</TableCell>
                <TableCell>{role.users}</TableCell>
                <TableCell>
                  <Badge variant="outline">{role.perms}</Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon">
                    <Edit className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

// User Management Tab Component
function UserManagementTab() {
  return (
    <Card className="border-2 border-primary/20 shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <CardTitle className="text-2xl">User Management</CardTitle>
            <CardDescription>Manage system users and their access</CardDescription>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>
      </CardHeader>
      <CardContent>
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
            {[1, 2, 3, 4, 5].map((i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">User {i}</TableCell>
                <TableCell>user{i}@nge.com</TableCell>
                <TableCell>
                  <Badge variant="outline">Admin</Badge>
                </TableCell>
                <TableCell>Dubai Hub</TableCell>
                <TableCell>
                  <Badge variant="default">Active</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

// Web Page Management Tab Component
function WebPageManagementTab() {
  const [activeSubTab, setActiveSubTab] = useState("images");

  return (
    <div className="space-y-6">
      <Tabs value={activeSubTab} onValueChange={setActiveSubTab}>
        <TabsList className="grid w-full max-w-2xl grid-cols-3">
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="hubs">Hub Information</TabsTrigger>
          <TabsTrigger value="settings">Site Settings</TabsTrigger>
        </TabsList>

        {/* Images Sub-tab */}
        <TabsContent value="images">
          <ImageManagement />
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

// Image Management Component
function ImageManagement() {
  const [heroImages, setHeroImages] = useState([
    { id: 1, name: "Hero Image 1", url: "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1200&h=800&fit=crop" },
    { id: 2, name: "Hero Image 2", url: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&h=800&fit=crop" },
    { id: 3, name: "Hero Image 3", url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=800&fit=crop" },
  ]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload to a server
      const reader = new FileReader();
      reader.onload = (event) => {
        const newImage = {
          id: heroImages.length + 1,
          name: file.name,
          url: event.target?.result as string,
        };
        setHeroImages([...heroImages, newImage]);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="border-2 border-primary/20 shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <CardTitle className="text-2xl">Image Management</CardTitle>
            <CardDescription>Upload and manage website images</CardDescription>
          </div>
          <div>
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="image-upload"
            />
            <Button asChild className="bg-primary hover:bg-primary/90">
              <label htmlFor="image-upload" className="cursor-pointer">
                <Upload className="w-4 h-4 mr-2" />
                Upload Image
              </label>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {heroImages.map((image) => (
            <Card key={image.id} className="border-2 border-primary/10 overflow-hidden">
              <div className="relative h-48">
                <Image
                  src={image.url}
                  alt={image.name}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-4">
                <p className="font-medium mb-2">{image.name}</p>
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
                      <Calendar className="w-5 h-5 text-primary mt-1" />
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

