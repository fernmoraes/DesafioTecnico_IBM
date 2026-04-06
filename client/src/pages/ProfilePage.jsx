import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { UserAvatar, Email, Calendar, Document, Logout, Edit } from '@carbon/icons-react';
import { Button, TextInput } from '@carbon/react';
import { useUser } from '../context/UserContext';
import { useSummary } from '../context/SummaryContext';
import { formatDate } from '../utils/formatters';
import toast, { Toaster } from 'react-hot-toast';

const PAGE_MAX = '1312px';
const PAGE_PX  = 'clamp(1rem, 5vw, 5rem)';

const ProfileRow = ({ label, value, onEdit, t }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr auto', alignItems: 'center', gap: '1rem', padding: '1.25rem 0', borderBottom: '1px solid var(--ibm-gray-20)' }}>
    <p style={{ fontSize: '0.875rem', color: 'var(--ibm-gray-70)', margin: 0 }}>{label}</p>
    <p style={{ fontSize: '0.875rem', color: 'var(--ibm-gray-100)', margin: 0 }}>{value || '—'}</p>
    {onEdit && (
      <button onClick={onEdit} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ibm-blue)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.375rem', padding: 0, whiteSpace: 'nowrap' }}>
        <Edit size={14} /> {t('profile.edit')}
      </button>
    )}
  </div>
);

const ProfilePage = () => {
  const { t } = useTranslation();
  const { user, createUser, updateUser, logout } = useUser();
  const { clearAll } = useSummary();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('account');
  const [isEditing, setIsEditing] = useState(!user);
  const [formData, setFormData] = useState({ name: user?.name || '', email: user?.email || '' });
  const [loading, setLoading] = useState(false);

  const handleLogout = () => { clearAll(); logout(); navigate('/login'); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) { toast.error(t('errors.fillAllFields')); return; }
    try {
      setLoading(true);
      if (user) { await updateUser(formData); toast.success(t('success.profileUpdated')); }
      else { await createUser(formData.name, formData.email); toast.success(t('success.profileCreated')); }
      setIsEditing(false);
    } catch (err) { toast.error(err.message || t('errors.profileSaveFailed')); }
    finally { setLoading(false); }
  };

  const navItems = [
    { id: 'account', label: t('profile.tabAccount') },
    { id: 'usage',   label: t('profile.tabUsage')   },
    { id: 'session', label: t('profile.tabSession')  },
  ];

  if (!user && !isEditing) {
    return (
      <div style={{ maxWidth: PAGE_MAX, margin: '0 auto', padding: `5rem ${PAGE_PX}`, textAlign: 'center' }}>
        <Toaster position="top-right" />
        <UserAvatar size={64} style={{ color: 'var(--ibm-gray-30)', marginBottom: '1.5rem' }} />
        <h2 style={{ fontFamily: 'IBM Plex Sans', fontWeight: 600, fontSize: '1.75rem', color: 'var(--ibm-gray-100)', marginBottom: '0.75rem' }}>{t('profile.noUserTitle')}</h2>
        <p style={{ color: 'var(--ibm-gray-60)', marginBottom: '2rem' }}>{t('profile.noUserDesc')}</p>
        <Button size="lg" onClick={() => setIsEditing(true)}>{t('profile.createProfileBtn')}</Button>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--ibm-white)' }}>
      <Toaster position="top-right" />

      {/* Page header */}
      <section style={{ borderBottom: '1px solid var(--ibm-gray-20)' }}>
        <div style={{ maxWidth: PAGE_MAX, margin: '0 auto', padding: `3rem ${PAGE_PX} 0` }}>
          <h1 style={{ fontFamily: 'IBM Plex Sans', fontWeight: 300, fontSize: 'clamp(1.75rem, 3vw, 2.625rem)', color: 'var(--ibm-gray-100)', marginBottom: '2rem' }}>
            {t('profile.pageTitle')}
          </h1>
          <div style={{ display: 'flex', gap: 0 }}>
            {navItems.map((item) => (
              <button key={item.id} onClick={() => { setActiveSection(item.id); setIsEditing(false); }}
                style={{ background: 'none', border: 'none', borderBottom: activeSection === item.id ? '3px solid var(--ibm-blue)' : '3px solid transparent', padding: '0.75rem 1.5rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: activeSection === item.id ? 600 : 400, color: activeSection === item.id ? 'var(--ibm-blue)' : 'var(--ibm-gray-70)', transition: 'color 0.15s' }}>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Body */}
      <section style={{ backgroundColor: 'var(--ibm-gray-10)', minHeight: '60vh' }}>
        <div style={{ maxWidth: PAGE_MAX, margin: '0 auto', padding: `0 ${PAGE_PX}`, display: 'grid', minHeight: '60vh' }} className="profile-layout">
          {/* Sidebar */}
          <aside style={{ borderRight: '1px solid var(--ibm-gray-20)', backgroundColor: 'var(--ibm-white)', padding: '2rem 0' }}>
            <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ibm-gray-50)', padding: '0 1.5rem', marginBottom: '0.75rem' }}>
              {t('profile.sectionLabel')}
            </p>
            {navItems.map((item) => (
              <button key={item.id} onClick={() => { setActiveSection(item.id); setIsEditing(false); }}
                style={{ display: 'block', width: '100%', textAlign: 'left', background: 'none', border: 'none', borderLeft: activeSection === item.id ? '4px solid var(--ibm-blue)' : '4px solid transparent', padding: '0.75rem 1.5rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: activeSection === item.id ? 600 : 400, color: activeSection === item.id ? 'var(--ibm-gray-100)' : 'var(--ibm-gray-70)', backgroundColor: activeSection === item.id ? 'var(--ibm-gray-10)' : 'transparent', transition: 'all 0.15s' }}>
                {item.label}
              </button>
            ))}
          </aside>

          {/* Main */}
          <main style={{ backgroundColor: 'var(--ibm-white)', padding: '2.5rem 3rem' }}>

            {/* Account */}
            {activeSection === 'account' && (
              isEditing ? (
                <>
                  <h2 style={{ fontFamily: 'IBM Plex Sans', fontWeight: 600, fontSize: '1.25rem', color: 'var(--ibm-gray-100)', margin: '0 0 2rem' }}>
                    {user ? t('profile.editTitle') : t('profile.createTitle')}
                  </h2>
                  <form onSubmit={handleSubmit} style={{ maxWidth: '28rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <TextInput id="p-name" labelText={t('profile.nameLabel')} value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={t('profile.namePlaceholder')} required disabled={loading} />
                    <TextInput id="p-email" labelText={t('profile.emailLabel')} type="email" value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder={t('profile.emailPlaceholder')} required disabled={loading} />
                    <div style={{ display: 'flex', gap: '1px', marginTop: '0.5rem' }}>
                      <Button type="submit" disabled={loading} size="lg">
                        {loading ? t('profile.saving') : user ? t('profile.saveChanges') : t('profile.createProfileBtn')}
                      </Button>
                      {user && (
                        <Button kind="ghost" size="lg" disabled={loading}
                          onClick={() => { setIsEditing(false); setFormData({ name: user.name, email: user.email }); }}>
                          {t('profile.cancel')}
                        </Button>
                      )}
                    </div>
                  </form>
                </>
              ) : (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1.25rem', borderBottom: '1px solid var(--ibm-gray-20)' }}>
                    <h2 style={{ fontFamily: 'IBM Plex Sans', fontWeight: 600, fontSize: '1.25rem', color: 'var(--ibm-gray-100)', margin: 0 }}>{t('profile.contactInfo')}</h2>
                  </div>
                  {user && (
                    <>
                      <ProfileRow label={t('profile.rowName')}   value={user.name}              onEdit={() => setIsEditing(true)} t={t} />
                      <ProfileRow label={t('profile.rowEmail')}  value={user.email}             onEdit={() => setIsEditing(true)} t={t} />
                      {user.createdAt && <ProfileRow label={t('profile.rowMember')} value={formatDate(user.createdAt)} t={t} />}
                    </>
                  )}
                </>
              )
            )}

            {/* Usage */}
            {activeSection === 'usage' && (
              <>
                <div style={{ paddingBottom: '1.25rem', borderBottom: '1px solid var(--ibm-gray-20)' }}>
                  <h2 style={{ fontFamily: 'IBM Plex Sans', fontWeight: 600, fontSize: '1.25rem', color: 'var(--ibm-gray-100)', margin: 0 }}>{t('profile.usageTitle')}</h2>
                </div>
                <ProfileRow label={t('profile.usagePlan')}  value={t('profile.usageFreeTier')} t={t} />
                <ProfileRow label={t('profile.usageCount')} value={String(user?.summaryCount || 0)} t={t} />
                <div style={{ marginTop: '2.5rem', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1px', backgroundColor: 'var(--ibm-gray-20)' }}>
                  {[
                    { label: t('profile.statsGenerated'), value: user?.summaryCount || 0, color: 'var(--ibm-blue)' },
                    { label: t('profile.statsPlan'),      value: t('profile.statsFree'),   color: 'var(--ibm-gray-100)' },
                  ].map((stat) => (
                    <div key={stat.label} style={{ backgroundColor: 'var(--ibm-gray-10)', padding: '1.5rem', borderLeft: '2px solid var(--ibm-blue)' }}>
                      <p style={{ fontSize: '0.75rem', color: 'var(--ibm-gray-60)', margin: '0 0 0.5rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{stat.label}</p>
                      <p style={{ fontSize: '2rem', fontWeight: 700, color: stat.color, margin: 0, fontFamily: 'IBM Plex Sans' }}>{stat.value}</p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Session */}
            {activeSection === 'session' && (
              <>
                <div style={{ paddingBottom: '1.25rem', borderBottom: '1px solid var(--ibm-gray-20)' }}>
                  <h2 style={{ fontFamily: 'IBM Plex Sans', fontWeight: 600, fontSize: '1.25rem', color: 'var(--ibm-gray-100)', margin: 0 }}>{t('profile.sessionTitle')}</h2>
                </div>
                <div style={{ padding: '2rem 0', borderBottom: '1px solid var(--ibm-gray-20)' }}>
                  <p style={{ fontSize: '0.875rem', color: 'var(--ibm-gray-70)', marginBottom: '1rem' }}
                    dangerouslySetInnerHTML={{ __html: t('profile.sessionText', { email: user?.email || '' }) }} />
                  <Button kind="danger--ghost" renderIcon={Logout} onClick={handleLogout}>{t('profile.signOut')}</Button>
                </div>
              </>
            )}
          </main>
        </div>
      </section>
    </div>
  );
};

export default ProfilePage;
