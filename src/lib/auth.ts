// Role-based permission system
export type UserRole = 'Super Admin' | 'Admin' | 'Hub Receiver';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  branchId?: string;
}

// Permission definitions
export const Permissions = {
  // Order permissions
  ORDER_CREATE: 'order:create',
  ORDER_MODIFY: 'order:modify',
  ORDER_DELETE: 'order:delete',
  ORDER_VIEW: 'order:view',
  
  // Shipment permissions
  SHIPMENT_STATUS_UPDATE: 'shipment:status_update',
  SHIPMENT_BULK_UPDATE: 'shipment:bulk_update',
  SHIPMENT_VIEW: 'shipment:view',
  
  // User management
  USER_CREATE: 'user:create',
  USER_MODIFY: 'user:modify',
  USER_DELETE: 'user:delete',
  USER_VIEW: 'user:view',
  
  // Frontend editing
  FRONTEND_EDIT: 'frontend:edit',
  FRONTEND_REVIEWS: 'frontend:reviews',
  
  // Settings
  SETTINGS_MODIFY: 'settings:modify',
} as const;

// Role permissions mapping
export const RolePermissions: Record<UserRole, string[]> = {
  'Hub Receiver': [
    Permissions.ORDER_CREATE,
    Permissions.ORDER_VIEW,
    Permissions.SHIPMENT_VIEW,
  ],
  'Admin': [
    Permissions.ORDER_CREATE,
    Permissions.ORDER_MODIFY,
    Permissions.ORDER_VIEW,
    Permissions.SHIPMENT_STATUS_UPDATE,
    Permissions.SHIPMENT_BULK_UPDATE,
    Permissions.SHIPMENT_VIEW,
    Permissions.USER_VIEW,
  ],
  'Super Admin': [
    Permissions.ORDER_CREATE,
    Permissions.ORDER_MODIFY,
    Permissions.ORDER_DELETE,
    Permissions.ORDER_VIEW,
    Permissions.SHIPMENT_STATUS_UPDATE,
    Permissions.SHIPMENT_BULK_UPDATE,
    Permissions.SHIPMENT_VIEW,
    Permissions.USER_CREATE,
    Permissions.USER_MODIFY,
    Permissions.USER_DELETE,
    Permissions.USER_VIEW,
    Permissions.FRONTEND_EDIT,
    Permissions.FRONTEND_REVIEWS,
    Permissions.SETTINGS_MODIFY,
  ],
};

// Check if user has permission
export function hasPermission(user: User | null, permission: string): boolean {
  if (!user) return false;
  const userPermissions = RolePermissions[user.role] || [];
  return userPermissions.includes(permission);
}

// Get current user from localStorage (set after login)
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const userData = JSON.parse(userStr);
      return {
        id: userData.id || '',
        email: userData.email || '',
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        role: (userData.role || 'Admin') as UserRole,
        branchId: userData.branchId || undefined,
      };
    }
  } catch (error) {
    console.error('Error parsing user data:', error);
  }
  
  return null;
}

