import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast';
import AppRouter from './routes/AppRouter';
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      gcTime: 0,
      refetchOnMount: 'always',
      refetchOnWindowFocus: 'always',
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRouter />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#27273a',
            color: '#e2e8f0',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#27273a' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#27273a' } },
        }}
      />
    </QueryClientProvider>
  );
}

export default App;
