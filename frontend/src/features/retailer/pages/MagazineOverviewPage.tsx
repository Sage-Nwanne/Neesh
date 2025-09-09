import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { retailerApi, type MagazineAnalytics } from '@/services/retailerApi';
import SalesChart from '@/components/charts/SalesChart';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { 
  ArrowLeft,
  TrendingUp,
  MessageCircle,
  Mail,
  User,
  ShoppingCart,
  ChevronDown,
  Heart,
  Bell,
  Menu
} from 'lucide-react';

const MagazineOverviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState<MagazineAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('ALL');
  const [showAllOrders, setShowAllOrders] = useState(false);

  useEffect(() => {
    if (id) {
      loadMagazineData(id);
    }
  }, [id]);

  const loadMagazineData = async (magazineId: string) => {
    try {
      setLoading(true);
      
      // Dummy data for now
      const dummyAnalytics: MagazineAnalytics = {
        magazine: {
          id: magazineId,
          title: 'Matter Magazine',
          price: '40.00',
          category: 'Science',
          inventory: 120,
          status: 'in_stock',
          cover_image_url: '/api/placeholder/200/260',
          publishers: { company_name: 'Matter Publishing' }
        },
        analytics: {
          totalSales: 460.21,
          totalSold: 120,
          totalReturned: 10,
          totalOrders: 8,
          growthPercentage: 12.30,
          salesData: [
            { period: 'D', value: 46.02 },
            { period: 'W', value: 138.06 },
            { period: 'M', value: 276.13 },
            { period: 'Q', value: 368.17 },
            { period: 'YTD', value: 414.19 },
            { period: 'Y', value: 460.21 },
            { period: 'ALL', value: 460.21 }
          ],
          inventoryByLocation: [
            { location: 'New York', current: 100, total: 100 },
            { location: 'Arizona', current: 100, total: 200 }
          ]
        },
        orders: [
          {
            id: '#0038',
            magazine_id: magazineId,
            quantity: 2,
            total_price: '540.00',
            status: 'delivered',
            created_at: '2025-08-14T14:30:00Z',
            magazines: { title: 'Matter', price: '270.00' }
          },
          {
            id: '#0037',
            magazine_id: magazineId,
            quantity: 1,
            total_price: '540.00',
            status: 'returned',
            created_at: '2025-08-14T14:30:00Z',
            magazines: { title: 'Matter', price: '540.00' }
          }
        ],
        publisher: {
          name: 'Matter Publishing',
          username: 'matter_pub',
          email: 'contact@matterpublishing.com'
        }
      };

      setAnalytics(dummyAnalytics);
    } catch (error) {
      console.error('Error loading magazine data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    navigate('/retailer-dashboard');
  };

  const handleReorder = () => {
    // TODO: Implement reorder functionality
    console.log('Reorder clicked');
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
          <p className="text-gray-600">Loading magazine data...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Magazine not found</p>
          <Button onClick={handleBackToDashboard} className="mt-4">
            Back to Dashboard
          </Button>
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
            <span className="text-gray-600">Retailer - Dashboard Magazine Overview</span>
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
        {/* Back Navigation */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={handleBackToDashboard}
            className="text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Leads back to Full Dashboard
          </Button>
        </div>

        {/* Magazine Header */}
        <div className="flex items-center space-x-4 mb-8">
          <h2 className="text-2xl font-bold text-gray-900">{analytics.magazine.title}</h2>
          <Button variant="ghost" size="sm">
            <Heart className="h-4 w-4" />
          </Button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Sales Analytics */}
          <div className="lg:col-span-2 space-y-6">
            {/* Sales Summary */}
            <Card padding="lg">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Total Sales</h3>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-bold text-gray-900">
                      ${analytics.analytics.totalSales.toFixed(2)}
                    </span>
                    <div className="flex items-center text-green-600">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      <span className="text-sm font-medium">+{analytics.analytics.growthPercentage}%</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600 mb-1">
                    {analytics.analytics.totalSold}/{analytics.analytics.totalSold + analytics.analytics.totalReturned} Sold
                  </div>
                  <div className="text-sm text-gray-600">
                    {analytics.analytics.totalReturned}/{analytics.analytics.totalSold + analytics.analytics.totalReturned} Returned
                  </div>
                </div>
              </div>

              {/* Chart */}
              <div className="h-48 mb-4">
                <SalesChart data={analytics.analytics.salesData} height={192} />
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

            {/* Issues In Stock */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Issues In Stock</h3>
                  <Button variant="ghost" size="sm">
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {analytics.analytics.inventoryByLocation.map((location, index) => (
                    <div key={location.location} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">{analytics.magazine.title}</h4>
                      <p className="text-sm text-gray-600 mb-1">{location.location}</p>
                      <p className="text-sm text-gray-900 font-medium">
                        {location.current}/{location.total}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Latest Orders */}
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Latest Orders</h3>
                  <Button variant="ghost" size="sm">
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  {/* Table Header */}
                  <div className="grid grid-cols-6 gap-2 text-xs font-medium text-gray-600 pb-2 border-b border-gray-200">
                    <span>Order</span>
                    <span>Publisher</span>
                    <span>Total</span>
                    <span>Time</span>
                    <span>Volume</span>
                    <span>Type</span>
                    <span>Fulfillment</span>
                  </div>

                  {/* Table Rows */}
                  {analytics.orders.map((order) => (
                    <div key={order.id} className="grid grid-cols-6 gap-2 text-xs py-2">
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
              </Card>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Pricing Info */}
            <Card>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">WSP</span>
                  <span className="text-sm font-medium text-gray-900">$175</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">MSRP</span>
                  <span className="text-sm font-medium text-gray-900">${analytics.magazine.price}</span>
                </div>
              </div>
            </Card>

            {/* Publisher Contact */}
            <Card>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Contact Publisher</h3>
              <div className="space-y-3">
                <Button variant="outline" size="sm" className="w-full justify-start text-red-600">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Leads to messages
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start text-red-600">
                  <Mail className="h-4 w-4 mr-2" />
                  Opens email app
                </Button>
              </div>
            </Card>

            {/* Publisher Profile */}
            <Card>
              <Button variant="outline" size="sm" className="w-full justify-start text-red-600">
                <User className="h-4 w-4 mr-2" />
                Leads to Publisher Profile
              </Button>
            </Card>

            {/* Re-order */}
            <Card>
              <Button 
                onClick={handleReorder}
                variant="outline" 
                size="sm" 
                className="w-full justify-start text-red-600"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Adds this listing to cart, opens and updates cart
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MagazineOverviewPage;
