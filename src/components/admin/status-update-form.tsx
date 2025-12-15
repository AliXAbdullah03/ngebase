"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, X } from 'lucide-react';

interface StatusUpdateFormProps {
  shipmentIds?: string[];
  isBulk?: boolean;
  onSave: (data: any) => void;
  onCancel: () => void;
}

export function StatusUpdateForm({ shipmentIds = [], isBulk = false, onSave, onCancel }: StatusUpdateFormProps) {
  const [formData, setFormData] = useState({
    status: '',
    location: '',
    notes: '',
  });

  const statusOptions = [
    'Shipment Received',
    'Shipment Processing',
    'Departed from Manila',
    'In Transit going to Dubai Airport',
    'Arrived at Dubai Airport',
    'Shipment Clearance',
    'Out for Delivery',
    'Delivered'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      shipmentIds: isBulk ? shipmentIds : [shipmentIds[0]],
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isBulk ? 'Bulk Status Update' : 'Update Shipment Status'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g., JFK Airport, USA"
              required
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional notes about this status update"
              rows={3}
            />
          </div>

          {isBulk && (
            <div className="p-3 bg-primary/10 rounded-lg">
              <p className="text-sm text-muted-foreground">
                This will update <strong>{shipmentIds.length}</strong> shipment(s)
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              <Save className="w-4 h-4 mr-2" />
              Update Status
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

