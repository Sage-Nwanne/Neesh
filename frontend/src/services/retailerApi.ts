import { config } from '@/lib/config';

export interface SalesDataPoint {
  period: string;
  value: number;
}

export interface DashboardAnalytics {
  totalSales: number;
  totalOrders: number;
  deliveredCount: number;
  pendingCount: number;
  returnedCount: number;
  salesData: SalesDataPoint[];
  growthPercentage: number;
  orders: Order[];
}

export interface Order {
  id: string;
  magazine_id: string;
  quantity: number;
  total_price: string;
  status: 'pending' | 'delivered' | 'returned' | 'cancelled';
  created_at: string;
  magazines?: {
    title: string;
    price: string;
  };
}

export interface Magazine {
  id: string;
  title: string;
  price: string;
  cover_image_url?: string;
  category: string;
  inventory: number;
  status: 'in_stock' | 'out_of_stock';
  publishers?: {
    company_name: string;
  };
}

export interface MagazineAnalytics {
  magazine: Magazine;
  analytics: {
    totalSales: number;
    totalSold: number;
    totalReturned: number;
    totalOrders: number;
    growthPercentage: number;
    salesData: SalesDataPoint[];
    inventoryByLocation: Array<{
      location: string;
      current: number;
      total: number;
    }>;
  };
  orders: Order[];
  publisher: {
    name: string;
    username: string;
    email: string;
  };
}

class RetailerApiService {
  private baseUrl = config.api.baseUrl;

  private getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  async getDashboardAnalytics(): Promise<DashboardAnalytics> {
    try {
      const response = await fetch(`${this.baseUrl}/retailer/dashboard/analytics`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard analytics');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching dashboard analytics:', error);
      throw error;
    }
  }

  async getMagazines(): Promise<Magazine[]> {
    try {
      const response = await fetch(`${this.baseUrl}/retailer/dashboard/magazines`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch magazines');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching magazines:', error);
      throw error;
    }
  }

  async getMagazineAnalytics(magazineId: string): Promise<MagazineAnalytics> {
    try {
      const response = await fetch(`${this.baseUrl}/retailer/magazine/${magazineId}/analytics`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch magazine analytics');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching magazine analytics:', error);
      throw error;
    }
  }

  async createOrder(magazineId: string, quantity: number): Promise<Order> {
    try {
      const response = await fetch(`${this.baseUrl}/retailer/orders`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          magazine_id: magazineId,
          quantity
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }
}

export const retailerApi = new RetailerApiService();
