import React, { useState, useEffect } from 'react';
import { analytics } from '@/services/analytics';

interface AnalyticsEvent {
  timestamp: string;
  type: 'page_view' | 'event';
  data: any;
}

const AnalyticsDebugger: React.FC = () => {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  // Only show in development
  const isDevelopment = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1';

  useEffect(() => {
    if (!isDevelopment) return;

    // Override console.log to capture analytics events
    const originalLog = console.log;
    console.log = (...args) => {
      if (args[0] && typeof args[0] === 'string' && args[0].includes('📊')) {
        const event: AnalyticsEvent = {
          timestamp: new Date().toLocaleTimeString(),
          type: args[0].includes('Page view') ? 'page_view' : 'event',
          data: args.slice(1)
        };
        setEvents(prev => [event, ...prev.slice(0, 49)]); // Keep last 50 events
      }
      originalLog(...args);
    };

    return () => {
      console.log = originalLog;
    };
  }, [isDevelopment]);

  if (!isDevelopment) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-blue-600 text-white px-3 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
      >
        📊 Analytics ({events.length})
      </button>

      {isVisible && (
        <div className="absolute bottom-12 right-0 w-96 max-h-96 bg-white border border-gray-300 rounded-lg shadow-xl overflow-hidden">
          <div className="bg-gray-100 px-4 py-2 border-b border-gray-300">
            <h3 className="font-semibold text-gray-800">Analytics Events (Dev Mode)</h3>
            <button
              onClick={() => setEvents([])}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Clear
            </button>
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {events.length === 0 ? (
              <div className="p-4 text-gray-500 text-center">
                No events tracked yet
              </div>
            ) : (
              events.map((event, index) => (
                <div
                  key={index}
                  className={`p-3 border-b border-gray-100 ${
                    event.type === 'page_view' ? 'bg-blue-50' : 'bg-green-50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className={`text-xs px-2 py-1 rounded ${
                      event.type === 'page_view' 
                        ? 'bg-blue-200 text-blue-800' 
                        : 'bg-green-200 text-green-800'
                    }`}>
                      {event.type}
                    </span>
                    <span className="text-xs text-gray-500">{event.timestamp}</span>
                  </div>
                  <div className="mt-2 text-sm text-gray-700">
                    <pre className="whitespace-pre-wrap text-xs">
                      {JSON.stringify(event.data, null, 2)}
                    </pre>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDebugger;
