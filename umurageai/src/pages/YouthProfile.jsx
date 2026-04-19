import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import BottomNav from '../components/BottomNav'
import { useLang } from '../context/LangContext'
import { useAuth } from '../context/AuthContext'

export default function YouthProfile() {
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
        <div style={styles.avatar}>{user?.name?.[0]?.toUpperCase() || 'Y'}</div>
        <div style={styles.name}>{user?.name || 'Youth'}</div>
        <div style={styles.email}>{user?.email || ''}</div>
        <div style={styles.role}>{t.youth} · Rwanda</div>
        <div style={styles.badge}>{t.storySeeker}</div>
      </div>

      <div style={styles.content}>

        <div style={styles.statRow}>
          <div style={styles.statCard}>
            <div style={styles.statNum}>0</div>
            <div style={styles.statLabel}>Listened</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNum}>0</div>
            <div style={styles.statLabel}>Elders followed</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNum}>0</div>
            <div style={styles.statLabel}>Collections</div>
          </div>
        </div>

        <p style={styles.sectionLabel}>Your features</p>
        <div style={styles.featureGrid}>
          {[
            'Story discovery',
            'Ask an Elder',
            'Save collections',
            'Share clips',
            'EN / RW toggle',
            'Invite grandparent',
          ].map(f => (
            <div key={f} style={styles.featureChip}>
              <div style={styles.chipDot} />{f}
            </div>
          ))}
        </div>

        <button style={styles.exploreBtn} onClick={() => navigate('/community')}>
          🌍 Explore stories
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
    background: '#3B6D11', padding: '28px 20px 24px',
    textAlign: 'center',
  },
  avatar: {
    width: 68, height: 68, borderRadius: '50%',
    background: '#C0DD97', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    fontSize: 28, fontWeight: 700, color: '#27500A',
    margin: '0 auto 12px', border: '2px solid #639922',
  },
  name: { color: '#EAF3DE', fontSize: 20, fontWeight: 600 },
  email: { color: '#C0DD97', fontSize: 12, marginTop: 3 },
  role: { color: '#C0DD97', fontSize: 13, marginTop: 4 },
  badge: {
    display: 'inline-block', marginTop: 10,
    background: '#639922', color: '#EAF3DE',
    padding: '3px 16px', borderRadius: 12, fontSize: 12, fontWeight: 500,
  },
  content: { padding: 16 },
  statRow: { display: 'flex', gap: 10, marginBottom: 20, marginTop: 4 },
  statCard: {
    flex: 1, background: '#FFF8F0', border: '0.5px solid #E8D5C0',
    borderRadius: 10, padding: '12px 8px', textAlign: 'center',
  },
  statNum: { fontSize: 22, fontWeight: 700, color: '#3B6D11' },
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
    background: '#639922', flexShrink: 0,
  },
  exploreBtn: {
    width: '100%', padding: 13, background: '#3B6D11',
    color: '#EAF3DE', border: 'none', borderRadius: 10,
    fontSize: 14, fontWeight: 600, cursor: 'pointer', marginBottom: 10,
  },
  logoutBtn: {
    width: '100%', padding: 12, background: 'transparent',
    border: '1px solid #E8D5C0', borderRadius: 10,
    color: '#9C7A5A', fontSize: 14, cursor: 'pointer',
  },
}
