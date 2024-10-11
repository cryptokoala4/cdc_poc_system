'use client';

import { Toaster } from 'react-hot-toast';

export function ToasterProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        style: {
          background: '#333',
          color: '#fff',
        },
        success: {
          iconTheme: {
            primary: '#10B981',
            secondary: '#333',
          },
        },
        error: {
          iconTheme: {
            primary: '#EF4444',
            secondary: '#333',
          },
        },
      }}
    />
  );
}