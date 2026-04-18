import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import BottomNav from '../components/BottomNav'
import { useLang } from '../context/LangContext'
import { useAuth } from '../context/AuthContext'

export default function ElderProfile() {
  const { t } = useLang()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div style={styles.page}>
      <Header title={t.profile} />

      <div style={styles.header}>
        <div style={styles.avatar}>{user?.name?.[0]?.toUpperCase() || 'E'}</div>
        <div style={styles.name}>{user?.name || 'Elder'}</div>
        <div style={styles.email}>{user?.email || ''}</div>
        <div style={styles.role}>{t.elder} · Rwanda</div>
        <div style={styles.badge}>{t.storyKeeper}</div>
      </div>

      <div style={styles.content}>

        <div style={styles.statRow}>
          <div style={styles.statCard}>
            <div style={styles.statNum}>0</div>
            <div style={styles.statLabel}>Stories told</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNum}>0</div>
            <div style={styles.statLabel}>Families</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNum}>0h</div>
            <div style={styles.statLabel}>Recorded</div>
          </div>
        </div>

        <p style={styles.sectionLabel}>Your features</p>
        <div style={styles.featureGrid}>
          {[
            'Guided recording',
            'Large text mode',
            'AI prompts you',
            'Family vault',
            'Voice-first UI',
            'Helper invite',
          ].map(f => (
            <div key={f} style={styles.featureChip}>
              <div style={styles.chipDot} />{f}
            </div>
          ))}
        </div>

        <button style={styles.recordBtn} onClick={() => navigate('/record')}>
          🎙️ Record your first story
        </button>

        <button style={styles.logoutBtn} onClick={handleLogout}>
          Sign out
        </button>

      </div>
      <BottomNav />
    </div>
  )
}

const styles = {
  page: { minHeight: '100vh', background: '#FDF6EF', paddingBottom: 80 },
  header: {
    background: '#7F4F24', padding: '28px 20px 24px',
    textAlign: 'center',
  },
  avatar: {
    width: 68, height: 68, borderRadius: '50%',
    background: '#E8A87C', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    fontSize: 28, fontWeight: 700, color: '#7F4F24',
    margin: '0 auto 12px', border: '2px solid #C28048',
  },
  name: { color: '#FFF8F0', fontSize: 20, fontWeight: 600 },
  email: { color: '#D4A57A', fontSize: 12, marginTop: 3 },
  role: { color: '#D4A57A', fontSize: 13, marginTop: 4 },
  badge: {
    display: 'inline-block', marginTop: 10,
    background: '#C28048', color: '#FFF8F0',
    padding: '3px 16px', borderRadius: 12, fontSize: 12, fontWeight: 500,
  },
  content: { padding: 16 },
  statRow: { display: 'flex', gap: 10, marginBottom: 20, marginTop: 4 },
  statCard: {
    flex: 1, background: '#FFF8F0', border: '0.5px solid #E8D5C0',
    borderRadius: 10, padding: '12px 8px', textAlign: 'center',
  },
  statNum: { fontSize: 22, fontWeight: 700, color: '#7F4F24' },
  statLabel: { fontSize: 11, color: '#9C7A5A', marginTop: 2 },
  sectionLabel: {
    fontSize: 11, fontWeight: 600, color: '#9C7A5A',
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10,
  },
  featureGrid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr',
    gap: 8, marginBottom: 20,
  },
  featureChip: {
    display: 'flex', alignItems: 'center', gap: 7,
    padding: '8px 10px', background: '#FFF8F0',
    border: '0.5px solid #E8D5C0', borderRadius: 8,
    fontSize: 12, color: '#6B4226',
  },
  chipDot: {
    width: 8, height: 8, borderRadius: '50%',
    background: '#C28048', flexShrink: 0,
  },
  recordBtn: {
    width: '100%', padding: 13, background: '#7F4F24',
    color: '#FFF8F0', border: 'none', borderRadius: 10,
    fontSize: 14, fontWeight: 600, cursor: 'pointer', marginBottom: 10,
  },
  logoutBtn: {
    width: '100%', padding: 12, background: 'transparent',
    border: '1px solid #E8D5C0', borderRadius: 10,
    color: '#9C7A5A', fontSize: 14, cursor: 'pointer',
  },
}