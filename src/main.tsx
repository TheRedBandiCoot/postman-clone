import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sooner } from '@/components/ui/sonner';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    <App />
    <Toaster />
    <Sooner
      expand={false}
      toastOptions={{
        style: {
          backgroundColor: 'rgb(25 38 57)',
          color: '#64748b',
          fontWeight: 'bolder',
          fontSize: '0.9rem'
        }
      }}
    />
  </>
);
