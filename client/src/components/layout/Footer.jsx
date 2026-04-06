import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const linkStyle = { color: '#8d8d8d', fontSize: '0.875rem', textDecoration: 'none', lineHeight: 1.5 };
const hoverOn  = (e) => { e.currentTarget.style.color = '#ffffff'; };
const hoverOff = (e) => { e.currentTarget.style.color = '#8d8d8d'; };

const FooterLink = ({ href, to, children }) => (
  <li style={{ marginBottom: '0.625rem' }}>
    {to ? (
      <Link to={to} style={linkStyle} onMouseEnter={hoverOn} onMouseLeave={hoverOff}>
        {children}
      </Link>
    ) : (
      <a href={href} target="_blank" rel="noopener noreferrer"
        style={linkStyle} onMouseEnter={hoverOn} onMouseLeave={hoverOff}>
        {children}
      </a>
    )}
  </li>
);

const FooterSection = ({ title, children }) => (
  <div>
    <p style={{ color: '#ffffff', fontWeight: 600, fontSize: '0.875rem', marginBottom: '1rem' }}>
      {title}
    </p>
    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>{children}</ul>
  </div>
);

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer style={{ backgroundColor: '#161616', fontFamily: 'IBM Plex Sans, sans-serif' }}>
      <div style={{ maxWidth: '1312px', margin: '0 auto', padding: 'clamp(2rem, 4vw, 4rem) clamp(1rem, 5vw, 5rem)' }}>
        <div style={{ display: 'grid', gap: '2rem', alignItems: 'start' }} className="footer-grid">

          <FooterSection title={t('footer.product')}>
            <FooterLink to="/">{t('nav.summarize')}</FooterLink>
            <FooterLink to="/history">{t('nav.history')}</FooterLink>
            <FooterLink to="/profile">{t('profile.pageTitle')}</FooterLink>
            <FooterLink href="https://www.ibm.com/watsonx">IBM watsonx.ai</FooterLink>
            <FooterLink href="https://www.ibm.com/granite">IBM Granite Models</FooterLink>
          </FooterSection>

          <FooterSection title={t('footer.technology')}>
            <FooterLink href="https://www.ibm.com/artificial-intelligence">{t('footer.ibmAI')}</FooterLink>
            <FooterLink href="https://www.ibm.com/cloud">{t('footer.ibmCloud')}</FooterLink>
            <FooterLink href="https://carbondesignsystem.com">{t('footer.carbonDS')}</FooterLink>
            <FooterLink href="https://www.ibm.com/docs">{t('footer.documentation')}</FooterLink>
          </FooterSection>

          <FooterSection title={t('footer.connect')}>
            <FooterLink href="https://www.linkedin.com/company/ibm">LinkedIn</FooterLink>
            <FooterLink href="https://github.com/IBM">GitHub</FooterLink>
            <FooterLink href="https://www.youtube.com/ibm">YouTube</FooterLink>
            <FooterLink href="https://community.ibm.com">{t('footer.ibmCommunity', 'IBM Community')}</FooterLink>
          </FooterSection>

          <FooterSection title={t('footer.about')}>
            <FooterLink href="https://www.ibm.com/about">{t('footer.aboutIBM')}</FooterLink>
            <FooterLink href="https://www.ibm.com/careers">{t('footer.careers')}</FooterLink>
            <FooterLink href="https://www.ibm.com/investor">{t('footer.investor')}</FooterLink>
            <FooterLink href="https://www.ibm.com/security">{t('footer.security')}</FooterLink>
          </FooterSection>
        </div>
      </div>

      <div style={{ borderTop: '1px solid #393939' }}>
        <div style={{ maxWidth: '1312px', margin: '0 auto', padding: '1.25rem clamp(1rem, 5vw, 5rem)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <p style={{ fontSize: '0.8125rem', color: '#6f6f6f', margin: 0 }}>
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </p>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            {[
              { key: 'footer.contactIBM', href: 'https://www.ibm.com/contact' },
              { key: 'footer.privacy',    href: 'https://www.ibm.com/privacy' },
              { key: 'footer.terms',      href: 'https://www.ibm.com/terms' },
              { key: 'footer.accessibility', href: 'https://www.ibm.com/accessibility' },
            ].map(({ key, href }) => (
              <a key={key} href={href} target="_blank" rel="noopener noreferrer"
                style={{ fontSize: '0.8125rem', color: '#6f6f6f', textDecoration: 'none' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#8d8d8d'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#6f6f6f'}
              >
                {t(key)}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
