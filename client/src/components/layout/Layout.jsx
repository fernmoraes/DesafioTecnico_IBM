import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--ibm-white)' }}>
      <Header />
      {/* Carbon Header is 48px tall — offset content */}
      <main style={{ flex: 1, marginTop: '3rem' }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
