import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { widgetsData } from '../../data/dummyData';
import styles from './Widgets.module.css';

const Widgets = ({ user }) => {
  const [widgets, setWidgets] = useState(widgetsData);
  const [draggedWidget, setDraggedWidget] = useState(null);

  const toggleWidget = (widgetId) => {
    setWidgets(widgets.map(widget => 
      widget.id === widgetId 
        ? { ...widget, active: !widget.active }
        : widget
    ));
  };

  const addNewWidget = () => {
    const newWidget = {
      id: widgets.length + 1,
      title: "New Widget",
      type: "custom",
      size: "medium",
      data: {},
      active: true
    };
    setWidgets([...widgets, newWidget]);
  };

  const renderWidget = (widget) => {
    switch (widget.type) {
      case 'chart':
        return (
          <div className={styles.chartWidget}>
            <div className={styles.chartBars}>
              {widget.data.values.map((value, index) => (
                <div key={index} className={styles.chartBar}>
                  <div 
                    className={styles.bar}
                    style={{ height: `${(value / Math.max(...widget.data.values)) * 100}%` }}
                  ></div>
                  <span className={styles.barLabel}>{widget.data.labels[index]}</span>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'list':
        return (
          <div className={styles.listWidget}>
            {widget.data.slice(0, 3).map((customer, index) => (
              <div key={index} className={styles.listItem}>
                <div className={styles.customerInfo}>
                  <strong>{customer.name}</strong>
                  <span>{customer.location}</span>
                </div>
                <div className={styles.customerValue}>
                  ${customer.total_spent.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        );
      
      case 'progress':
        return (
          <div className={styles.progressWidget}>
            <div className={styles.progressCircle}>
              <div className={styles.progressValue}>{widget.data.percentage}%</div>
            </div>
            <div className={styles.progressInfo}>
              <div>${widget.data.current.toLocaleString()} / ${widget.data.target.toLocaleString()}</div>
              <div className={styles.progressLabel}>Revenue Goal</div>
            </div>
          </div>
        );
      
      case 'feed':
        return (
          <div className={styles.feedWidget}>
            {widget.data.map((activity, index) => (
              <div key={index} className={styles.feedItem}>
                <div className={styles.feedAction}>{activity.action}</div>
                <div className={styles.feedTime}>{activity.time}</div>
              </div>
            ))}
          </div>
        );
      
      default:
        return <div className={styles.customWidget}>Custom Widget Content</div>;
    }
  };

  return (
    <DashboardLayout user={user}>
      <div className={styles.widgetsPage}>
        <div className={styles.header}>
          <h1>Widgets</h1>
          <div className={styles.headerActions}>
            <button className={styles.addBtn} onClick={addNewWidget}>
              + Add Widget
            </button>
            <button className={styles.layoutBtn}>Save Layout</button>
          </div>
        </div>

        <div className={styles.widgetControls}>
          <h3>Available Widgets</h3>
          <div className={styles.controlList}>
            {widgets.map(widget => (
              <div key={widget.id} className={styles.controlItem}>
                <label className={styles.widgetToggle}>
                  <input
                    type="checkbox"
                    checked={widget.active}
                    onChange={() => toggleWidget(widget.id)}
                  />
                  <span className={styles.toggleSlider}></span>
                  {widget.title}
                </label>
                <span className={`${styles.widgetSize} ${styles[widget.size]}`}>
                  {widget.size}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.widgetGrid}>
          {widgets
            .filter(widget => widget.active)
            .map(widget => (
              <div 
                key={widget.id} 
                className={`${styles.widgetCard} ${styles[widget.size]}`}
                draggable
                onDragStart={() => setDraggedWidget(widget.id)}
              >
                <div className={styles.widgetHeader}>
                  <h4>{widget.title}</h4>
                  <div className={styles.widgetActions}>
                    <button className={styles.configBtn}>⚙️</button>
                    <button 
                      className={styles.closeBtn}
                      onClick={() => toggleWidget(widget.id)}
                    >
                      ✕
                    </button>
                  </div>
                </div>
                <div className={styles.widgetContent}>
                  {renderWidget(widget)}
                </div>
              </div>
            ))}
        </div>

        <div className={styles.widgetLibrary}>
          <h3>Widget Library</h3>
          <div className={styles.libraryGrid}>
            <div className={styles.libraryItem}>
              <div className={styles.libraryIcon}>📊</div>
              <div className={styles.libraryInfo}>
                <h4>Chart Widget</h4>
                <p>Display data in bar charts</p>
              </div>
              <button className={styles.addLibraryBtn}>Add</button>
            </div>
            <div className={styles.libraryItem}>
              <div className={styles.libraryIcon}>📋</div>
              <div className={styles.libraryInfo}>
                <h4>List Widget</h4>
                <p>Show items in a list format</p>
              </div>
              <button className={styles.addLibraryBtn}>Add</button>
            </div>
            <div className={styles.libraryItem}>
              <div className={styles.libraryIcon}>🎯</div>
              <div className={styles.libraryInfo}>
                <h4>Progress Widget</h4>
                <p>Track goals and progress</p>
              </div>
              <button className={styles.addLibraryBtn}>Add</button>
            </div>
            <div className={styles.libraryItem}>
              <div className={styles.libraryIcon}>📰</div>
              <div className={styles.libraryInfo}>
                <h4>Activity Feed</h4>
                <p>Recent activity updates</p>
              </div>
              <button className={styles.addLibraryBtn}>Add</button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Widgets;
