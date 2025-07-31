import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, Calendar, DollarSign, Clock, MapPin, User, CheckCircle, XCircle, Truck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { OrderStatusTimeline } from '@/components/orders/OrderStatusTimeline';

interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
  product: {
    title: string;
    image_url: string;
    publisher: {
      business_name: string;
    };
  };
}

interface Order {
  id: string;
  order_number: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  created_at: string;
  shipping_address: any;
  retailer: {
    business_name: string;
    email: string;
  };
  publisher: {
    business_name: string;
    email: string;
  };
  order_items: OrderItem[];
}

export default function Orders() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrders();
      setupRealtimeSubscription();
    }
  }, [user, statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('orders')
        .select(`
          *,
          retailer:profiles!orders_retailer_id_fkey (
            business_name,
            email
          ),
          publisher:profiles!orders_publisher_id_fkey (
            business_name,
            email
          ),
          order_items (
            *,
            product:products (
              title,
              image_url,
              publisher:profiles!products_publisher_id_fkey (
                business_name
              )
            )
          )
        `)
        .order('created_at', { ascending: false });

      // Filter based on user role
      if (profile?.role === 'retailer') {
        query = query.eq('retailer_id', profile.id);
      } else if (profile?.role === 'publisher') {
        query = query.eq('publisher_id', profile.id);
      }

      // Apply status filter
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('orders')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'orders'
        }, 
        (payload) => {
          fetchOrders(); // Refresh orders on any change
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      fetchOrders();
      toast({
        title: "Success",
        description: "Order status updated successfully"
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <Package className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const canUpdateStatus = (order: Order) => {
    if (profile?.role === 'publisher') {
      return ['pending', 'confirmed'].includes(order.status);
    }
    return false;
  };

  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case 'pending':
        return 'confirmed';
      case 'confirmed':
        return 'shipped';
      case 'shipped':
        return 'delivered';
      default:
        return currentStatus;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gradient">Orders</h1>
            <p className="text-muted-foreground">
              {profile?.role === 'publisher' 
                ? 'Manage incoming orders from retailers'
                : 'Track your orders and deliveries'
              }
            </p>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Orders List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Orders ({orders.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                <div className="space-y-1">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors border-b border-border ${
                        selectedOrder?.id === order.id ? 'bg-muted' : ''
                      }`}
                      onClick={() => setSelectedOrder(order)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">
                          #{order.order_number}
                        </span>
                        <Badge className={`text-xs ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1 capitalize">{order.status}</span>
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <User className="h-3 w-3" />
                          {profile?.role === 'publisher' 
                            ? order.retailer?.business_name 
                            : order.publisher?.business_name
                          }
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-3 w-3" />
                          ${order.total_amount.toFixed(2)}
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          {new Date(order.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                  {orders.length === 0 && (
                    <div className="p-8 text-center text-muted-foreground">
                      <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No orders found</p>
                      <p className="text-sm">
                        {statusFilter === 'all' 
                          ? 'Orders will appear here when placed'
                          : `No ${statusFilter} orders found`
                        }
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Order Details */}
          <div className="lg:col-span-2">
            {selectedOrder ? (
              <div className="space-y-6">
                {/* Order Header */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          Order #{selectedOrder.order_number}
                          <Badge className={`${getStatusColor(selectedOrder.status)}`}>
                            {getStatusIcon(selectedOrder.status)}
                            <span className="ml-1 capitalize">{selectedOrder.status}</span>
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          Placed on {new Date(selectedOrder.created_at).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      {canUpdateStatus(selectedOrder) && (
                        <Button
                          onClick={() => updateOrderStatus(selectedOrder.id, getNextStatus(selectedOrder.status))}
                        >
                          Mark as {getNextStatus(selectedOrder.status)}
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-2">
                          {profile?.role === 'publisher' ? 'Retailer' : 'Publisher'}
                        </h4>
                        <div className="text-sm text-muted-foreground">
                          <p>{profile?.role === 'publisher' 
                            ? selectedOrder.retailer?.business_name 
                            : selectedOrder.publisher?.business_name
                          }</p>
                          <p>{profile?.role === 'publisher' 
                            ? selectedOrder.retailer?.email 
                            : selectedOrder.publisher?.email
                          }</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Order Total</h4>
                        <p className="text-2xl font-bold text-primary">
                          ${selectedOrder.total_amount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Order Status Timeline */}
                <Card>
                  <CardHeader>
                    <CardTitle>Order Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <OrderStatusTimeline 
                      currentStatus={selectedOrder.status}
                      createdAt={selectedOrder.created_at}
                    />
                  </CardContent>
                </Card>

                {/* Order Items */}
                <Card>
                  <CardHeader>
                    <CardTitle>Order Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedOrder.order_items?.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 p-4 border border-border rounded-lg">
                          <img
                            src={item.product?.image_url || '/placeholder.svg'}
                            alt={item.product?.title}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium">{item.product?.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              by {item.product?.publisher?.business_name}
                            </p>
                            <div className="flex items-center gap-4 mt-2">
                              <span className="text-sm">Qty: {item.quantity}</span>
                              <span className="text-sm font-medium">
                                ${item.price.toFixed(2)} each
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Shipping Information */}
                {selectedOrder.shipping_address && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Shipping Address
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm">
                        <p>{selectedOrder.shipping_address.street}</p>
                        <p>
                          {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} {selectedOrder.shipping_address.zip}
                        </p>
                        <p>{selectedOrder.shipping_address.country}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center h-[600px]">
                  <div className="text-center text-muted-foreground">
                    <Package className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>Select an order to view details</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}