"use client"

import type { ShipmentHistory, ShipmentStatus } from '@/lib/types';
import { cn } from '@/lib/utils';
import { CheckCircle, ClipboardList, Home, PackageCheck, Truck, CircleAlert, MapPin, Clock } from 'lucide-react';

const statusIcons: Record<ShipmentStatus, React.ReactNode> = {
  Processing: <ClipboardList className="h-5 w-5" />,
  'In Transit': <Truck className="h-5 w-5" />,
  'Out for Delivery': <PackageCheck className="h-5 w-5" />,
  Delivered: <Home className="h-5 w-5" />,
  'On Hold': <CircleAlert className="h-5 w-5" />,
};

const statusColors: Record<ShipmentStatus, string> = {
  Processing: 'bg-blue-500',
  'In Transit': 'bg-primary',
  'Out for Delivery': 'bg-yellow-500',
  Delivered: 'bg-green-500',
  'On Hold': 'bg-red-500',
};

// Map internal status to display text
const getStatusDisplayText = (status: ShipmentStatus): string => {
  if (status === 'Processing') {
    return 'Shipment Received';
  }
  return status;
};

type TrackingTimelineProps = {
  history: ShipmentHistory[];
  currentStatus: ShipmentStatus;
};

export function TrackingTimeline({ history, currentStatus }: TrackingTimelineProps) {
  const reversedHistory = [...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const latestStatusDate = reversedHistory.length > 0 ? new Date(reversedHistory[0].date) : new Date();

  return (
    <div className="space-y-6">
      {reversedHistory.map((event, index) => {
        const isCurrent = index === 0;
        const isDelivered = event.status === 'Delivered';
        const isCompleted = !isCurrent;

        return (
          <div 
            key={index} 
            className="flex gap-4 group"
            style={{ animation: `fadeIn 0.6s ease-out ${index * 0.1}s both` }}
          >
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'flex h-12 w-12 items-center justify-center rounded-full border-4 transition-all duration-300',
                  isCurrent 
                    ? `bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/50 scale-110` 
                    : 'bg-muted text-muted-foreground border-muted-foreground/30',
                  isCompleted && 'bg-green-500 text-white border-green-500'
                )}
              >
                {isCurrent && isDelivered ? (
                  <CheckCircle className="h-6 w-6" />
                ) : isCompleted ? (
                  <CheckCircle className="h-6 w-6" />
                ) : (
                  statusIcons[event.status]
                )}
              </div>
              {index < reversedHistory.length - 1 && (
                <div className={cn(
                  "h-full w-1 mt-2 transition-colors duration-300",
                  isCompleted ? 'bg-green-500' : 'bg-border'
                )} />
              )}
            </div>
            <div className={cn(
              'flex-1 pt-1.5 pb-6 transition-all duration-300',
              { 'pb-8': index < reversedHistory.length - 1 }
            )}>
              <div className="flex items-center gap-2 mb-1">
                <p className={cn(
                  'font-semibold text-lg',
                  isCurrent ? 'text-primary' : isCompleted ? 'text-green-600' : 'text-muted-foreground'
                )}>
                  {getStatusDisplayText(event.status)}
                </p>
                {isCurrent && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                    Current
                  </span>
                )}
              </div>
              <div className="flex items-start gap-2 mb-2">
                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">{event.location}</p>
              </div>
              {event.notes && (
                <p className="text-sm text-muted-foreground italic mb-2 pl-6 border-l-2 border-primary/20">
                  "{event.notes}"
                </p>
              )}
              <div className="flex items-center gap-2 text-xs text-muted-foreground pl-6">
                <Clock className="w-3 h-3" />
                <span>
                  {new Date(event.date).toLocaleString([], { 
                    dateStyle: 'medium', 
                    timeStyle: 'short' 
                  })}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
