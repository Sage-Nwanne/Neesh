import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/analytics/DatePickerWithRange';
import { RevenueChart } from '@/components/analytics/RevenueChart';
import { OrderStatusChart } from '@/components/analytics/OrderStatusChart';
import { TopProductsChart } from '@/components/analytics/TopProductsChart';
import { MetricsCards } from '@/components/analytics/MetricsCards';
import { RecentOrdersTable } from '@/components/analytics/RecentOrdersTable';
import { ShelfScoreCard } from '@/components/analytics/ShelfScoreCard';
import { PerformanceInsights } from '@/components/analytics/PerformanceInsights';
import { ComparativeAnalytics } from '@/components/analytics/ComparativeAnalytics';
import { ROITracker } from '@/components/analytics/ROITracker';
import { DollarSign, TrendingUp, Package, Users, Download, Calendar, Store } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { addDays, startOfMonth, endOfMonth, format } from 'date-fns';

const Analytics = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date())
  });
  const [timeframe, setTimeframe] = useState('month');
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    if (user && profile?.role === 'publisher') {
      fetchAnalyticsData();
    }
  }, [user, profile, dateRange, timeframe]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      // Fetch analytics data from Supabase
      const { data, error } = await supabase
        .from('analytics_view')
        .select('*')
        .eq('publisher_id', profile?.id)
        .gte('date', format(dateRange.from, 'yyyy-MM-dd'))
        .lte('date', format(dateRange.to, 'yyyy-MM-dd'));

      if (error) throw error;
      setAnalyticsData(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast({
        title: "Error",
        description: "Failed to load analytics data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (profile?.role !== 'publisher') {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <Store className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Publisher Access Required</h2>
            <p className="text-muted-foreground">
              Analytics are only available for publisher accounts.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gradient">Analytics Dashboard</h1>
              <p className="text-muted-foreground">
                Track your publishing performance and insights
              </p>
            </div>
            <div className="flex items-center gap-4">
              <DatePickerWithRange
                date={dateRange}
                onDateChange={setDateRange}
              />
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Week</SelectItem>
                  <SelectItem value="month">Month</SelectItem>
                  <SelectItem value="quarter">Quarter</SelectItem>
                  <SelectItem value="year">Year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Metrics Overview */}
          <MetricsCards data={analyticsData} loading={loading} />

          {/* Main Analytics Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="customers">Customers</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RevenueChart data={analyticsData} loading={loading} />
                <OrderStatusChart data={analyticsData} loading={loading} />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <TopProductsChart data={analyticsData} loading={loading} />
                </div>
                <ShelfScoreCard data={analyticsData} loading={loading} />
              </div>
              <RecentOrdersTable data={analyticsData} loading={loading} />
            </TabsContent>

            <TabsContent value="revenue" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RevenueChart data={analyticsData} loading={loading} detailed />
                <ROITracker data={analyticsData} loading={loading} />
              </div>
              <ComparativeAnalytics data={analyticsData} loading={loading} />
            </TabsContent>

            <TabsContent value="products" className="space-y-6">
              <TopProductsChart data={analyticsData} loading={loading} detailed />
              <PerformanceInsights data={analyticsData} loading={loading} />
            </TabsContent>

            <TabsContent value="customers" className="space-y-6">
              {/* Customer analytics components would go here */}
              <Card>
                <CardHeader>
                  <CardTitle>Customer Analytics</CardTitle>
                  <CardDescription>
                    Detailed customer insights and behavior analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Customer analytics coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="insights" className="space-y-6">
              <PerformanceInsights data={analyticsData} loading={loading} detailed />
              <ComparativeAnalytics data={analyticsData} loading={loading} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Analytics;