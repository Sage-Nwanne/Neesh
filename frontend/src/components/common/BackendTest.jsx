import { useState } from 'react';
import axios from 'axios';
import Button from './Button';
import Card from '../common/Card';
import styles from './BackendTest.module.css';

const API_URL = 'https://neesh-backend-8378fc8ecdf9.herokuapp.com/api';

const BackendTest = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const testEndpoints = async () => {
    setLoading(true);
    const testResults = {};
    
    // Define endpoints to test
    const endpoints = [
      { path: '/health', method: 'GET', name: 'Health Check' },
      { path: '/auth/login', method: 'POST', name: 'Login', data: { email: 'test@example.com', password: 'password' } },
      { path: '/auth/signup', method: 'POST', name: 'Signup', data: { username: 'testuser', email: 'test@example.com', password: 'password', role: 'Retailer' } },
      { path: '/auth/me', method: 'GET', name: 'Get Current User' },
      { path: '/publisher/magazines', method: 'GET', name: 'Get Publisher Magazines' },
      { path: '/retailer/inventory', method: 'GET', name: 'Get Retailer Inventory' }
    ];
    
    for (const endpoint of endpoints) {
      try {
        let response;
        
        if (endpoint.method === 'GET') {
          response = await axios.get(`${API_URL}${endpoint.path}`);
        } else if (endpoint.method === 'POST') {
          response = await axios.post(`${API_URL}${endpoint.path}`, endpoint.data);
        }
        
        testResults[endpoint.name] = {
          status: 'Success',
          statusCode: response.status,
          data: response.data
        };
      } catch (error) {
        testResults[endpoint.name] = {
          status: 'Error',
          statusCode: error.response ? error.response.status : 'No response',
          message: error.message,
          details: error.response ? error.response.data : null
        };
      }
    }
    
    setResults(testResults);
    setLoading(false);
  };
  
  return (
    <Card className={styles.testCard}>
      <h3>Backend API Test</h3>
      <p>Test the connection to your backend API endpoints</p>
      
      <Button onClick={testEndpoints} disabled={loading} className={styles.testButton}>
        {loading ? 'Testing...' : 'Run API Tests'}
      </Button>
      
      {results && (
        <div className={styles.results}>
          <h4>Test Results:</h4>
          {Object.entries(results).map(([name, result]) => (
            <div key={name} className={`${styles.resultItem} ${result.status === 'Success' ? styles.success : styles.error}`}>
              <div className={styles.resultHeader}>
                <strong>{name}</strong>
                <span className={styles.statusBadge}>
                  {result.statusCode} - {result.status}
                </span>
              </div>
              
              {result.message && (
                <div className={styles.resultMessage}>
                  {result.message}
                </div>
              )}
              
              {(result.data || result.details) && (
                <details className={styles.resultDetails}>
                  <summary>Response Data</summary>
                  <pre>
                    {JSON.stringify(result.data || result.details, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default BackendTest;