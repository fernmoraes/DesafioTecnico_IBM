import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Header as CarbonHeader,
  HeaderName,
  HeaderNavigation,
  HeaderMenuItem,
  HeaderGlobalBar,
  HeaderGlobalAction,
} from '@carbon/react';
import { Select, SelectItem } from '@carbon/react';
import { UserAvatar } from '@carbon/icons-react';
import { useUser } from '../../context/UserContext';

const LANGUAGES = [
  { code: 'en', label: 'EN — English'   },
  { code: 'pt', label: 'PT — Português' },
  { code: 'es', label: 'ES — Español'   },
];

const Header = () => {
  const { user } = useUser();
  const location = useLocation();
  const { t, i18n } = useTranslation();

  return (
    <CarbonHeader aria-label={t('nav.ariaHeader')}>
      <HeaderName href="/" prefix="IBM">
        AI Summarizer
      </HeaderName>

      <HeaderNavigation aria-label={t('nav.ariaHeader')}>
        <HeaderMenuItem element={Link} to="/" isCurrentPage={location.pathname === '/'}>
          {t('nav.summarize')}
        </HeaderMenuItem>
        <HeaderMenuItem element={Link} to="/history" isCurrentPage={location.pathname === '/history'}>
          {t('nav.history')}
        </HeaderMenuItem>
      </HeaderNavigation>

      <HeaderGlobalBar>
        {/* Language dropdown */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          paddingLeft: '0.5rem',
          paddingRight: '0.25rem',
          '--cds-background':     '#ffffff',
          '--cds-text-primary':   '#161616',
          '--cds-text-secondary': '#525252',
          '--cds-border-strong':  '#8d8d8d',
          '--cds-border-subtle':  '#c6c6c6',
          '--cds-field':          '#f4f4f4',
          '--cds-field-hover':    '#e8e8e8',
          '--cds-icon-primary':   '#161616',
        }}>
          <Select
            id="lang-select"
            hideLabel
            size="sm"
            value={i18n.resolvedLanguage || 'en'}
            onChange={(e) => i18n.changeLanguage(e.target.value)}
            style={{ width: '9rem' }}
          >
            {LANGUAGES.map(({ code, label }) => (
              <SelectItem key={code} value={code} text={label} />
            ))}
          </Select>
        </div>

        {/* User */}
        <HeaderGlobalAction
          aria-label={user ? user.name : t('nav.login')}
          tooltipAlignment="end"
          as={Link}
          to={user ? '/profile' : '/login'}
        >
          <UserAvatar size={20} />
        </HeaderGlobalAction>
      </HeaderGlobalBar>
    </CarbonHeader>
  );
};

export default Header;
