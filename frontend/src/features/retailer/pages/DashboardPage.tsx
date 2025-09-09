import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { retailerApi, type DashboardAnalytics, type Magazine } from '@/services/retailerApi';
import SalesChart from '@/components/charts/SalesChart';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { useAnalytics } from '@/hooks/useAnalytics';
import {
  TrendingUp,
  Package,
  ShoppingCart,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Bell,
  Menu
} from 'lucide-react';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [magazines, setMagazines] = useState<Magazine[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('ALL');
  const [showAllOrders, setShowAllOrders] = useState(false);

  // Analytics tracking
  const { trackDashboardView, trackMagazineView } = useAnalytics();

  useEffect(() => {
    loadDashboardData();
    trackDashboardView('retailer');
  }, [trackDashboardView]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // For now, use dummy data since we don't have real authentication
      const dummyAnalytics: DashboardAnalytics = {
        totalSales: 7205.90,
        totalOrders: 24,
        deliveredCount: 18,
        pendingCount: 4,
        returnedCount: 2,
        growthPercentage: 12.30,
        salesData: [
          { period: 'D', value: 720.59 },
          { period: 'W', value: 2161.77 },
          { period: 'M', value: 4323.54 },
          { period: 'Q', value: 5764.72 },
          { period: 'YTD', value: 6485.31 },
          { period: 'Y', value: 7205.90 },
          { period: 'ALL', value: 7205.90 }
        ],
        orders: [
          {
            id: '#0038',
            magazine_id: '1',
            quantity: 2,
            total_price: '540.00',
            status: 'delivered',
            created_at: '2025-08-14T14:30:00Z',
            magazines: { title: 'MATTER', price: '270.00' }
          },
          {
            id: '#0037',
            magazine_id: '2',
            quantity: 1,
            total_price: '540.00',
            status: 'returned',
            created_at: '2025-08-14T14:30:00Z',
            magazines: { title: 'MATTER', price: '540.00' }
          },
          {
            id: '#0036',
            magazine_id: '3',
            quantity: 3,
            total_price: '540.00',
            status: 'pending',
            created_at: '2025-08-13T14:30:00Z',
            magazines: { title: 'MATTER', price: '180.00' }
          }
        ]
      };

      const dummyMagazines: Magazine[] = [
        {
          id: '1',
          title: 'Nomad',
          price: '25.00',
          category: 'Travel',
          inventory: 100,
          status: 'in_stock',
          cover_image_url: '/api/placeholder/120/160',
          publishers: { company_name: 'Nomad Publishing' }
        },
        {
          id: '2',
          title: 'Dezeen',
          price: '30.00',
          category: 'Design',
          inventory: 100,
          status: 'in_stock',
          cover_image_url: '/api/placeholder/120/160',
          publishers: { company_name: 'Dezeen Media' }
        },
        {
          id: '3',
          title: 'Openhouse',
          price: '28.00',
          category: 'Architecture',
          inventory: 100,
          status: 'in_stock',
          cover_image_url: '/api/placeholder/120/160',
          publishers: { company_name: 'Openhouse Press' }
        },
        {
          id: '4',
          title: 'The Y',
          price: '22.00',
          category: 'Culture',
          inventory: 100,
          status: 'in_stock',
          cover_image_url: '/api/placeholder/120/160',
          publishers: { company_name: 'Y Publications' }
        },
        {
          id: '5',
          title: 'Kinfolk',
          price: '35.00',
          category: 'Lifestyle',
          inventory: 100,
          status: 'in_stock',
          cover_image_url: '/api/placeholder/120/160',
          publishers: { company_name: 'Kinfolk Media' }
        },
        {
          id: '6',
          title: 'Matter',
          price: '40.00',
          category: 'Science',
          inventory: 100,
          status: 'in_stock',
          cover_image_url: '/api/placeholder/120/160',
          publishers: { company_name: 'Matter Publishing' }
        }
      ];

      setAnalytics(dummyAnalytics);
      setMagazines(dummyMagazines);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMagazineClick = (magazineId: string) => {
    const magazine = magazines.find(m => m.id === magazineId);
    if (magazine) {
      trackMagazineView(magazineId, magazine.title);
    }
    navigate(`/retailer-dashboard/magazine/${magazineId}`);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      delivered: 'success',
      pending: 'warning',
      returned: 'error',
      cancelled: 'default'
    } as const;

    return <Badge variant={variants[status as keyof typeof variants] || 'default'}>{status}</Badge>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-black">NEESH</h1>
            <span className="text-gray-400">|</span>
            <span className="text-gray-600">Retailer - Dashboard</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Overview Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Overview</h2>

          {/* Sales Summary Card */}
          <Card className="mb-6" padding="lg">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Total Sales</h3>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-bold text-gray-900">
                    ${analytics?.totalSales.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                  <div className="flex items-center text-green-600">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span className="text-sm font-medium">+{analytics?.growthPercentage}%</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600 mb-1">{analytics?.deliveredCount}/{analytics?.totalOrders} Sold</div>
              </div>
            </div>

            {/* Chart */}
            <div className="h-48 mb-4">
              <SalesChart data={analytics?.salesData || []} height={192} />
            </div>

            {/* Period Selector */}
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              {['D', 'W', 'M', 'Q', 'YTD', 'Y', 'ALL'].map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    selectedPeriod === period
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Inventory Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Inventory</h3>
              <Button variant="ghost" size="sm">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {magazines.slice(0, 6).map((magazine) => (
                <Card
                  key={magazine.id}
                  hover
                  onClick={() => handleMagazineClick(magazine.id)}
                  className="cursor-pointer"
                >
                  <div className="aspect-[3/4] bg-gray-100 rounded-lg mb-3 overflow-hidden">
                    <img
                      src={magazine.cover_image_url || '/api/placeholder/120/160'}
                      alt={magazine.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">{magazine.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{magazine.inventory}/100</p>
                  <Badge variant={magazine.status === 'in_stock' ? 'success' : 'error'} size="sm">
                    {magazine.status === 'in_stock' ? 'In Stock' : 'Out of Stock'}
                  </Badge>
                </Card>
              ))}
            </div>
          </div>

          {/* Latest Orders Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Latest Orders</h3>
              <Button variant="ghost" size="sm">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>

            <Card>
              <div className="space-y-4">
                {/* Table Header */}
                <div className="grid grid-cols-6 gap-4 text-sm font-medium text-gray-600 pb-2 border-b border-gray-200">
                  <span>Order</span>
                  <span>Publisher</span>
                  <span>Total</span>
                  <span>Time</span>
                  <span>Volume</span>
                  <span>Type</span>
                  <span>Fulfillment</span>
                </div>

                {/* Table Rows */}
                {analytics?.orders.slice(0, showAllOrders ? undefined : 5).map((order) => (
                  <div key={order.id} className="grid grid-cols-6 gap-4 text-sm py-2">
                    <span className="font-medium text-gray-900">{order.id}</span>
                    <span className="text-gray-600">MATTER</span>
                    <span className="text-gray-900">${order.total_price}</span>
                    <span className="text-gray-600">
                      {new Date(order.created_at).toLocaleDateString()}
                    </span>
                    <span className="text-gray-600">{order.quantity}</span>
                    <span className="text-gray-600">Order</span>
                    <div>{getStatusBadge(order.status)}</div>
                  </div>
                ))}
              </div>

              {analytics && analytics.orders.length > 5 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAllOrders(!showAllOrders)}
                    className="w-full"
                  >
                    {showAllOrders ? (
                      <>
                        <ChevronUp className="h-4 w-4 mr-2" />
                        Show Less
                      </>
                    ) : (
                      <>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View All Orders
                      </>
                    )}
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
