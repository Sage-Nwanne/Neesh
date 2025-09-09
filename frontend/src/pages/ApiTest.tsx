import React, { useState } from 'react';
import { config } from '@/lib/config';

const ApiTest: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testHealthEndpoint = async () => {
    setLoading(true);
    setTestResult('Testing...');
    
    try {
      const apiBaseUrl = config.api.baseUrl;
      console.log('API Base URL:', apiBaseUrl);
      
      const response = await fetch(`${apiBaseUrl}/health`);
      const data = await response.json();
      
      setTestResult(`✅ Health endpoint working: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      setTestResult(`❌ Health endpoint failed: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testPublisherEndpoint = async () => {
    setLoading(true);
    setTestResult('Testing publisher endpoint...');
    
    try {
      const apiBaseUrl = config.api.baseUrl;
      console.log('API Base URL:', apiBaseUrl);
      
      const testData = {
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        business_name: 'Test Business',
        magazine_title: 'Test Magazine',
        description: 'Test description'
      };
      
      const response = await fetch(`${apiBaseUrl}/publisher/application`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setTestResult(`✅ Publisher endpoint working: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      setTestResult(`❌ Publisher endpoint failed: ${error}`);
      console.error('Publisher endpoint error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>API Connection Test</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Configuration:</h3>
        <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
          API Base URL: {config.api.baseUrl}
        </pre>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testHealthEndpoint}
          disabled={loading}
          style={{ 
            padding: '10px 20px', 
            marginRight: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          Test Health Endpoint
        </button>
        
        <button 
          onClick={testPublisherEndpoint}
          disabled={loading}
          style={{ 
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          Test Publisher Endpoint
        </button>
      </div>
      
      <div>
        <h3>Test Result:</h3>
        <pre style={{ 
          background: '#f8f9fa', 
          padding: '15px', 
          borderRadius: '4px',
          border: '1px solid #dee2e6',
          whiteSpace: 'pre-wrap',
          minHeight: '100px'
        }}>
          {testResult || 'Click a button to test the API connection'}
        </pre>
      </div>
    </div>
  );
};

export default ApiTest;
