import Navbar from '@/components/Navbar';
import AuthProvider from '@/components/AuthProvider';
import '../globals.css';

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <div style={{
        fontFamily: "'DM Sans', sans-serif",
        background: '#F5F3EE',
        minHeight: '100vh',
        padding: '36px 32px',
      }}>
        <Navbar />
        {children}
      </div>
    </AuthProvider>
  );
}
