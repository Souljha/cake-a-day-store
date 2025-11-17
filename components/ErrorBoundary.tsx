import React, { ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

// Simple passthrough component for now - Error boundaries can be added later with React 19 compatible setup
const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children }) => {
  return <>{children}</>;
};

export default ErrorBoundary;
