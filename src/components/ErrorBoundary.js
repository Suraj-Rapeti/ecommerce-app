import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' }}>
          <h1 style={{ color: '#d32f2f', marginBottom: '20px' }}>Application Error</h1>
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', textAlign: 'left', maxWidth: '600px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <h2 style={{ color: '#666', marginTop: 0 }}>Error Details:</h2>
            <pre style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '4px', overflow: 'auto', color: '#d32f2f' }}>
              {this.state.error && this.state.error.toString()}
            </pre>
            <details style={{ marginTop: '20px', color: '#666' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>Stack Trace</summary>
              <pre style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '4px', overflow: 'auto', fontSize: '12px', marginTop: '10px' }}>
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </details>
            <p style={{ color: '#999', marginTop: '20px', fontSize: '14px' }}>
              Check the browser console for more details. Ensure Firebase environment variables are configured.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
