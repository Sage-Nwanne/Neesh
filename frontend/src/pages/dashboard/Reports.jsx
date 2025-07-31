import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { reportsData } from '../../data/dummyData';
import styles from './Reports.module.css';

const Reports = ({ user }) => {
  const [reports, setReports] = useState(reportsData);
  const [filter, setFilter] = useState('all');
  const [showScheduleForm, setShowScheduleForm] = useState(false);

  const filteredReports = reports.filter(report => 
    filter === 'all' || report.type.toLowerCase() === filter
  );

  const generateReport = (type) => {
    const newReport = {
      id: reports.length + 1,
      name: `${type} Report`,
      type: type,
      period: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      generated: new Date().toISOString().split('T')[0],
      status: 'Processing',
      file_size: '0 MB',
      download_url: '#'
    };
    setReports([newReport, ...reports]);
  };

  const scheduleReport = (reportData) => {
    const scheduledReport = {
      id: reports.length + 1,
      name: reportData.name,
      type: reportData.type,
      period: reportData.period,
      generated: 'Scheduled',
      status: 'Scheduled',
      file_size: 'N/A',
      download_url: '#',
      schedule: reportData.schedule
    };
    setReports([scheduledReport, ...reports]);
    setShowScheduleForm(false);
  };

  return (
    <DashboardLayout user={user}>
      <div className={styles.reportsPage}>
        <div className={styles.header}>
          <h1>Reports</h1>
          <div className={styles.headerActions}>
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">All Reports</option>
              <option value="sales">Sales</option>
              <option value="customers">Customers</option>
              <option value="products">Products</option>
              <option value="financial">Financial</option>
            </select>
            <button 
              className={styles.scheduleBtn}
              onClick={() => setShowScheduleForm(true)}
            >
              Schedule Report
            </button>
          </div>
        </div>

        <div className={styles.quickActions}>
          <h3>Generate New Report</h3>
          <div className={styles.actionButtons}>
            <button 
              className={styles.generateBtn}
              onClick={() => generateReport('Sales')}
            >
              📊 Sales Report
            </button>
            <button 
              className={styles.generateBtn}
              onClick={() => generateReport('Customers')}
            >
              👥 Customer Report
            </button>
            <button 
              className={styles.generateBtn}
              onClick={() => generateReport('Products')}
            >
              📦 Product Report
            </button>
            <button 
              className={styles.generateBtn}
              onClick={() => generateReport('Financial')}
            >
              💰 Financial Report
            </button>
          </div>
        </div>

        <div className={styles.reportsGrid}>
          <div className={styles.reportsTable}>
            <h3>Recent Reports</h3>
            <div className={styles.tableHeader}>
              <span>Report Name</span>
              <span>Type</span>
              <span>Period</span>
              <span>Generated</span>
              <span>Status</span>
              <span>Size</span>
              <span>Actions</span>
            </div>
            {filteredReports.map(report => (
              <div key={report.id} className={styles.tableRow}>
                <span className={styles.reportName}>{report.name}</span>
                <span className={styles.reportType}>{report.type}</span>
                <span>{report.period}</span>
                <span>{report.generated}</span>
                <span className={`${styles.status} ${styles[report.status.toLowerCase()]}`}>
                  {report.status}
                </span>
                <span>{report.file_size}</span>
                <div className={styles.actions}>
                  {report.status === 'Ready' && (
                    <button className={styles.downloadBtn}>Download</button>
                  )}
                  <button className={styles.viewBtn}>View</button>
                  <button className={styles.deleteBtn}>Delete</button>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.reportsSummary}>
            <h3>Report Summary</h3>
            <div className={styles.summaryStats}>
              <div className={styles.summaryItem}>
                <span>Total Reports</span>
                <strong>{reports.length}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Ready</span>
                <strong>{reports.filter(r => r.status === 'Ready').length}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Processing</span>
                <strong>{reports.filter(r => r.status === 'Processing').length}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Scheduled</span>
                <strong>{reports.filter(r => r.status === 'Scheduled').length}</strong>
              </div>
            </div>

            <div className={styles.recentActivity}>
              <h4>Recent Activity</h4>
              <div className={styles.activityList}>
                <div className={styles.activityItem}>
                  <span>Monthly Sales Report generated</span>
                  <span>2 hours ago</span>
                </div>
                <div className={styles.activityItem}>
                  <span>Customer Analysis downloaded</span>
                  <span>1 day ago</span>
                </div>
                <div className={styles.activityItem}>
                  <span>Product Performance scheduled</span>
                  <span>2 days ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showScheduleForm && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <div className={styles.modalHeader}>
                <h2>Schedule Report</h2>
                <button 
                  className={styles.closeBtn}
                  onClick={() => setShowScheduleForm(false)}
                >
                  ✕
                </button>
              </div>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                scheduleReport({
                  name: formData.get('name'),
                  type: formData.get('type'),
                  period: formData.get('period'),
                  schedule: formData.get('schedule')
                });
              }}>
                <div className={styles.formGroup}>
                  <label>Report Name</label>
                  <input type="text" name="name" required />
                </div>
                <div className={styles.formGroup}>
                  <label>Report Type</label>
                  <select name="type" required>
                    <option value="Sales">Sales</option>
                    <option value="Customers">Customers</option>
                    <option value="Products">Products</option>
                    <option value="Financial">Financial</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Period</label>
                  <select name="period" required>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Yearly">Yearly</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Schedule</label>
                  <select name="schedule" required>
                    <option value="Every Monday">Every Monday</option>
                    <option value="First of Month">First of Month</option>
                    <option value="End of Month">End of Month</option>
                    <option value="End of Quarter">End of Quarter</option>
                  </select>
                </div>
                <div className={styles.formActions}>
                  <button type="button" onClick={() => setShowScheduleForm(false)}>
                    Cancel
                  </button>
                  <button type="submit" className={styles.submitBtn}>
                    Schedule Report
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Reports;
