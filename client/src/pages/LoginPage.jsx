import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { View, ViewOff, CheckmarkFilled, MisuseOutline } from '@carbon/icons-react';
import toast, { Toaster } from 'react-hot-toast';
import { Button, TextInput, Tab, Tabs, TabList, TabPanels, TabPanel } from '@carbon/react';
import { useUser } from '../context/UserContext';
import { useSummary } from '../context/SummaryContext';
import { validatePassword } from '../utils/formatters';

const PasswordInput = ({ id, labelText, value, onChange, placeholder, disabled, showStrength = false }) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const rules = [
    { labelKey: 'login.pwdRule8chars', pass: value.length >= 8 },
    { labelKey: 'login.pwdRuleUpper',  pass: /[A-Z]/.test(value) },
    { labelKey: 'login.pwdRuleLower',  pass: /[a-z]/.test(value) },
    { labelKey: 'login.pwdRuleNumber', pass: /\d/.test(value) },
    { labelKey: 'login.pwdRuleSpecial',pass: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value) },
  ];

  return (
    <div>
      <div style={{ position: 'relative' }}>
        <TextInput
          id={id} labelText={labelText}
          type={visible ? 'text' : 'password'}
          value={value} onChange={onChange}
          placeholder={placeholder} required disabled={disabled}
        />
        <button type="button" onClick={() => setVisible(v => !v)} tabIndex={-1}
          aria-label={visible ? t('login.hidePassword') : t('login.showPassword')}
          style={{ position: 'absolute', right: '1rem', bottom: '0.75rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ibm-gray-60)', display: 'flex', alignItems: 'center' }}>
          {visible ? <ViewOff size={16} /> : <View size={16} />}
        </button>
      </div>
      {showStrength && value.length > 0 && (
        <ul style={{ marginTop: '0.5rem', listStyle: 'none', padding: 0 }}>
          {rules.map(rule => (
            <li key={rule.labelKey} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: rule.pass ? '#24a148' : 'var(--ibm-gray-50)', marginBottom: '0.25rem' }}>
              {rule.pass
                ? <CheckmarkFilled size={12} style={{ color: '#24a148' }} />
                : <MisuseOutline size={12} style={{ color: 'var(--ibm-gray-40)' }} />}
              {t(rule.labelKey)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const LoginPage = () => {
  const { t } = useTranslation();
  const { login, createUser } = useUser();
  const { clearAll } = useSummary();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      clearAll();
      await login(loginData.email, loginData.password);
      toast.success(t('success.welcomeBack'));
      navigate('/');
    } catch (err) {
      toast.error(err.message || t('errors.invalidCredentials'));
    } finally { setLoading(false); }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const { valid, errors } = validatePassword(registerData.password);
    if (!valid) { toast.error(t('errors.passwordRequirements', { error: errors[0] })); return; }
    try {
      setLoading(true);
      clearAll();
      await createUser(registerData.name, registerData.email, registerData.password);
      toast.success(t('success.accountCreated'));
      navigate('/');
    } catch (err) {
      toast.error(err.message || t('errors.registrationFailed'));
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--ibm-gray-10)', display: 'flex' }}>
      <Toaster position="top-right" />

      {/* Left panel — brand */}
      <div style={{ flex: 1, backgroundColor: 'var(--ibm-gray-100)', flexDirection: 'column', justifyContent: 'center', padding: '4rem', minHeight: '100vh' }} className="login-panel-brand">
        <p style={{ color: 'var(--ibm-blue)', fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
          IBM AI Summarizer
        </p>
        <h1 style={{ color: 'var(--ibm-white)', fontSize: '2.5rem', fontWeight: 300, lineHeight: 1.2, marginBottom: '1.5rem', fontFamily: 'IBM Plex Sans' }}>
          {t('login.brandTitle')}<br />
          <span style={{ color: 'var(--ibm-blue)', fontWeight: 600 }}>{t('login.brandAccent')}</span>
        </h1>
        <p style={{ color: 'var(--ibm-gray-40)', fontSize: '1rem', lineHeight: 1.7, maxWidth: '28rem' }}>
          {t('login.brandDesc')}
        </p>
        <div style={{ marginTop: '3rem', borderLeft: '2px solid var(--ibm-blue)', paddingLeft: '1rem' }}>
          <p style={{ color: 'var(--ibm-gray-30)', fontSize: '0.875rem', lineHeight: 1.6 }}>
            {t('login.quote')}
          </p>
          <p style={{ color: 'var(--ibm-gray-50)', fontSize: '0.75rem', marginTop: '0.5rem' }}>
            {t('login.quoteBy')}
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div style={{ width: '100%', maxWidth: '480px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', backgroundColor: 'var(--ibm-white)' }}>
        <div style={{ width: '100%' }}>
          <div className="login-mobile-brand mb-8 text-center">
            <p style={{ color: 'var(--ibm-gray-100)', fontSize: '1.5rem', fontWeight: 600 }}>{t('login.mobileBrand')}</p>
            <p style={{ color: 'var(--ibm-gray-60)', fontSize: '0.875rem', marginTop: '0.25rem' }}>{t('login.mobileSub')}</p>
          </div>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 600, color: 'var(--ibm-gray-100)', marginBottom: '2rem', fontFamily: 'IBM Plex Sans' }}>
            {t('login.welcome')}
          </h2>

          <Tabs>
            <TabList aria-label={t('login.welcome')}>
              <Tab>{t('login.tabSignIn')}</Tab>
              <Tab>{t('login.tabCreate')}</Tab>
            </TabList>

            <TabPanels>
              {/* Sign in */}
              <TabPanel>
                <form onSubmit={handleLogin} style={{ marginTop: '1.5rem' }} className="space-y-5">
                  <TextInput id="login-email" labelText={t('login.emailLabel')} type="email"
                    value={loginData.email} onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    placeholder={t('login.emailPlaceholder')} required disabled={loading} />
                  <PasswordInput id="login-password" labelText={t('login.passwordLabel')}
                    value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    placeholder={t('login.passwordPlaceholder')} disabled={loading} />
                  <Button type="submit" disabled={loading} size="lg" style={{ width: '100%', maxWidth: '100%', justifyContent: 'center' }}>
                    {loading ? t('login.signingIn') : t('login.signInBtn')}
                  </Button>
                </form>
              </TabPanel>

              {/* Register */}
              <TabPanel>
                <form onSubmit={handleRegister} style={{ marginTop: '1.5rem' }} className="space-y-5">
                  <TextInput id="reg-name" labelText={t('login.nameLabel')} type="text"
                    value={registerData.name} onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                    placeholder={t('login.namePlaceholder')} required disabled={loading} />
                  <TextInput id="reg-email" labelText={t('login.emailLabel')} type="email"
                    value={registerData.email} onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    placeholder={t('login.emailPlaceholder')} required disabled={loading} />
                  <PasswordInput id="reg-password" labelText={t('login.passwordLabel')}
                    value={registerData.password} onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    placeholder={t('login.newPasswordPlaceholder')} disabled={loading} showStrength />
                  <Button type="submit" disabled={loading} size="lg" style={{ width: '100%', maxWidth: '100%', justifyContent: 'center' }}>
                    {loading ? t('login.creatingAccount') : t('login.createAccountBtn')}
                  </Button>
                </form>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
