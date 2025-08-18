import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { analyticsData } from '../../data/dummyData.jsx';
import styles from './Analytics.module.css';

const Analytics = ({ user }) => {
  const [timeRange, setTimeRange] = useState('6months');
  const [analytics] = useState(analyticsData);

  return (
    <DashboardLayout user={user}>
      <div className={styles.analyticsPage}>
        <div className={styles.header}>
          <h1>Analytics</h1>
          <div className={styles.headerActions}>
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              className={styles.timeSelect}
            >
              <option value="1month">Last Month</option>
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last Year</option>
            </select>
            <button className={styles.exportBtn}>Export Report</button>
          </div>
        </div>

        <div className={styles.metricsGrid}>
          <div className={styles.metricCard}>
            <div className={styles.metricHeader}>
              <h3>Total Revenue</h3>
              <span className={styles.growth}>+{analytics.revenue.growth_rate}%</span>
            </div>
            <div className={styles.metricValue}>${analytics.revenue.total_this_month.toLocaleString()}</div>
            <div className={styles.metricSubtext}>This month</div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricHeader}>
              <h3>Page Views</h3>
              <span className={styles.growth}>+12.5%</span>
            </div>
            <div className={styles.metricValue}>{analytics.traffic.page_views.toLocaleString()}</div>
            <div className={styles.metricSubtext}>This month</div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricHeader}>
              <h3>Conversion Rate</h3>
              <span className={styles.growth}>+0.3%</span>
            </div>
            <div className={styles.metricValue}>{analytics.traffic.conversion_rate}%</div>
            <div className={styles.metricSubtext}>This month</div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricHeader}>
              <h3>Unique Visitors</h3>
              <span className={styles.growth}>+8.2%</span>
            </div>
            <div className={styles.metricValue}>{analytics.traffic.unique_visitors.toLocaleString()}</div>
            <div className={styles.metricSubtext}>This month</div>
          </div>
        </div>

        <div className={styles.chartsGrid}>
          <div className={styles.chartCard}>
            <h3>Revenue Trend</h3>
            <div className={styles.chart}>
              <div className={styles.chartBars}>
                {analytics.revenue.monthly.map((month, index) => (
                  <div key={index} className={styles.chartBar}>
                    <div 
                      className={styles.bar}
                      style={{ height: `${(month.amount / 3000) * 100}%` }}
                    ></div>
                    <span className={styles.barLabel}>{month.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.chartCard}>
            <h3>Top Products</h3>
            <div className={styles.productList}>
              {analytics.top_products.map((product, index) => (
                <div key={index} className={styles.productItem}>
                  <div className={styles.productInfo}>
                    <span className={styles.productName}>{product.name}</span>
                    <span className={styles.productSales}>{product.sales} sales</span>
                  </div>
                  <div className={styles.productRevenue}>${product.revenue.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.detailsGrid}>
          <div className={styles.detailCard}>
            <h3>Traffic Sources</h3>
            <div className={styles.sourceList}>
              <div className={styles.sourceItem}>
                <span>Direct</span>
                <div className={styles.sourceBar}>
                  <div className={styles.sourceProgress} style={{ width: '45%' }}></div>
                </div>
                <span>45%</span>
              </div>
              <div className={styles.sourceItem}>
                <span>Search</span>
                <div className={styles.sourceBar}>
                  <div className={styles.sourceProgress} style={{ width: '30%' }}></div>
                </div>
                <span>30%</span>
              </div>
              <div className={styles.sourceItem}>
                <span>Social</span>
                <div className={styles.sourceBar}>
                  <div className={styles.sourceProgress} style={{ width: '15%' }}></div>
                </div>
                <span>15%</span>
              </div>
              <div className={styles.sourceItem}>
                <span>Referral</span>
                <div className={styles.sourceBar}>
                  <div className={styles.sourceProgress} style={{ width: '10%' }}></div>
                </div>
                <span>10%</span>
              </div>
            </div>
          </div>

          <div className={styles.detailCard}>
            <h3>Best Selling Product</h3>
            <div className={styles.bestProduct}>
              <h4>{analytics.revenue.best_selling_product}</h4>
              <p>Leading in sales this month with exceptional performance</p>
              <div className={styles.productStats}>
                <div className={styles.stat}>
                  <span>Sales</span>
                  <strong>156</strong>
                </div>
                <div className={styles.stat}>
                  <span>Revenue</span>
                  <strong>$1,558.44</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
