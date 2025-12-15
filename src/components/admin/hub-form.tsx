"use client"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { apiRequest } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface HubFormProps {
  hub?: any;
  onSave: (hubData: any) => void;
  onCancel: () => void;
}

export function HubForm({ hub, onSave, onCancel }: HubFormProps) {
  const [formData, setFormData] = useState({
    name: hub?.name || '',
    code: hub?.code || '',
    address: hub?.address || '',
    email: hub?.email || '',
    mobile: hub?.mobile || '',
    operatingTime: hub?.operatingTime || '',
    operatingDays: hub?.operatingDays || '',
    timeZone: hub?.timeZone || '',
    timeZoneOffset: hub?.timeZoneOffset || '',
    mapEmbedUrl: hub?.mapEmbedUrl || '',
    description: hub?.description || '',
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.code || !formData.address || !formData.email || !formData.mobile) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill in all required fields: Name, Code, Address, Email, and Mobile",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      onSave(formData);
    } catch (err: any) {
      console.error('Error saving hub:', err);
      toast({
        title: "Error",
        description: "Failed to save hub: " + err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{hub ? 'Edit Hub' : 'Create Hub'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Hub Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Dubai Hub"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">Hub Code *</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toLowerCase() })}
                placeholder="e.g., dubai or manila"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Full address"
              required
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile *</Label>
              <Input
                id="mobile"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                placeholder="+971 50 123 4567"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="operatingDays">Operating Days</Label>
              <Input
                id="operatingDays"
                value={formData.operatingDays}
                onChange={(e) => setFormData({ ...formData, operatingDays: e.target.value })}
                placeholder="e.g., EVERYDAY or WEEKDAYS"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="operatingTime">Operating Time</Label>
              <Input
                id="operatingTime"
                value={formData.operatingTime}
                onChange={(e) => setFormData({ ...formData, operatingTime: e.target.value })}
                placeholder="e.g., 9 AM - 6 PM"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="timeZone">Time Zone Name</Label>
              <Input
                id="timeZone"
                value={formData.timeZone}
                onChange={(e) => setFormData({ ...formData, timeZone: e.target.value })}
                placeholder="e.g., UAE Time Zone"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeZoneOffset">Time Zone Offset</Label>
              <Input
                id="timeZoneOffset"
                value={formData.timeZoneOffset}
                onChange={(e) => setFormData({ ...formData, timeZoneOffset: e.target.value })}
                placeholder="e.g., GMT+4"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mapEmbedUrl">Google Maps Embed URL</Label>
            <Textarea
              id="mapEmbedUrl"
              value={formData.mapEmbedUrl}
              onChange={(e) => setFormData({ ...formData, mapEmbedUrl: e.target.value })}
              placeholder="Paste the full Google Maps embed URL here"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the hub"
              rows={2}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {hub ? 'Update Hub' : 'Create Hub'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

