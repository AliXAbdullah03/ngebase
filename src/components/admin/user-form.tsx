"use client"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, X } from 'lucide-react';
import { apiRequest } from '@/lib/api';

interface UserFormProps {
  user?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}

export function UserForm({ user, onSave, onCancel }: UserFormProps) {
  const [formData, setFormData] = useState({
    email: user?.email || '',
    password: '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    // Backend returns roleId as object: { _id: "...", name: "..." }
    roleId: user?.roleId?._id || user?.roleId || user?.role?._id || user?.role?.id || '',
    // Backend returns branchId as object: { _id: "...", name: "..." }
    branchId: user?.branchId?._id || user?.branchId || user?.branch?._id || user?.branch?.id || '',
  });
  const [roles, setRoles] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch roles and branches
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch roles - handle all possible response structures
        const rolesRes = await apiRequest('/roles');
        if (rolesRes.ok) {
          const rolesData = await rolesRes.json();
          let rolesList = [];
          
          if (rolesData.data) {
            if (Array.isArray(rolesData.data)) {
              rolesList = rolesData.data;
            } else if (rolesData.data.roles && Array.isArray(rolesData.data.roles)) {
              rolesList = rolesData.data.roles;
            } else if (rolesData.data.items && Array.isArray(rolesData.data.items)) {
              rolesList = rolesData.data.items;
            }
          }
          
          // Ensure it's an array
          if (!Array.isArray(rolesList)) {
            rolesList = [];
          }
          
          setRoles(rolesList);
        }

        // Fetch branches - handle all possible response structures
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
          
          // Ensure it's an array
          if (!Array.isArray(branchesList)) {
            branchesList = [];
          }
          
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Convert empty branchId to null
    const submitData = {
      ...formData,
      branchId: formData.branchId || null,
    };
    onSave(submitData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{user ? 'Modify User' : 'Add New User'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="password">{user ? 'New Password (leave blank to keep current)' : 'Password'}</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required={!user}
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

          <div>
            <Label htmlFor="roleId">Role</Label>
            <Select
              value={formData.roleId}
              onValueChange={(value) => setFormData({ ...formData, roleId: value })}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder={loading ? "Loading roles..." : "Select role"} />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => {
                  const roleId = role.id || role._id;
                  const roleName = role.name || role.role || 'Unknown';
                  return (
                    <SelectItem key={roleId} value={roleId}>
                      {roleName}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="branchId">Branch (Optional)</Label>
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
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              <Save className="w-4 h-4 mr-2" />
              {user ? 'Update User' : 'Create User'}
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

