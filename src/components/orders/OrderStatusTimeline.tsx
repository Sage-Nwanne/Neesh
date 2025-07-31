import React from 'react';
import { CheckCircle, Clock, Package, Truck, XCircle } from 'lucide-react';

interface OrderStatusTimelineProps {
  currentStatus: string;
  createdAt: string;
}

export const OrderStatusTimeline: React.FC<OrderStatusTimelineProps> = ({
  currentStatus,
  createdAt
}) => {
  const statuses = [
    { key: 'pending', label: 'Order Placed', icon: Clock },
    { key: 'confirmed', label: 'Confirmed', icon: CheckCircle },
    { key: 'shipped', label: 'Shipped', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: Package }
  ];

  const getStatusIndex = (status: string) => {
    return statuses.findIndex(s => s.key === status);
  };

  const currentIndex = getStatusIndex(currentStatus);
  const isCancelled = currentStatus === 'cancelled';

  return (
    <div className="space-y-4">
      {statuses.map((status, index) => {
        const Icon = status.icon;
        const isCompleted = index <= currentIndex && !isCancelled;
        const isCurrent = index === currentIndex && !isCancelled;
        
        return (
          <div key={status.key} className="flex items-center gap-4">
            <div className={`
              flex items-center justify-center w-8 h-8 rounded-full border-2
              ${isCompleted 
                ? 'bg-primary border-primary text-primary-foreground' 
                : isCurrent
                ? 'border-primary text-primary'
                : 'border-muted-foreground text-muted-foreground'
              }
            `}>
              <Icon className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className={`font-medium ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                {status.label}
              </p>
              {index === 0 && (
                <p className="text-sm text-muted-foreground">
                  {new Date(createdAt).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        );
      })}
      
      {isCancelled && (
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-destructive bg-destructive text-destructive-foreground">
            <XCircle className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-destructive">Order Cancelled</p>
          </div>
        </div>
      )}
    </div>
  );
};