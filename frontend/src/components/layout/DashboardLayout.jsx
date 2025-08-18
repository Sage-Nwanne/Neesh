import styles from './DashboardLayout.module.css';

const DashboardLayout = ({ children, user }) => {
  return (
    <div className={styles.dashboardLayout}>
      <div className={styles.dashboardContent}>
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;

