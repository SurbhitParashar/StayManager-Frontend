import Navbar from '@/components/Navbar';
import '../globals.css';

export default function RootLayout({ children }) {
  return (
    <html>
      <body style={{
        fontFamily: "'DM Sans', sans-serif",
        background: '#F5F3EE',
        minHeight: '100vh',
        padding: '36px 32px',
      }}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}