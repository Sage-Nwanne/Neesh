import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <Card className="m-4">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="mx-auto h-16 w-16 text-destructive mb-4" />
            <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
            <Button onClick={() => window.location.reload()}>
              Reload Page
            </Button>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}