import Header from '../components/Header'
import BottomNav from '../components/BottomNav'
import { useLang } from '../context/LangContext'
import { useNavigate } from 'react-router-dom'

export default function Community() {
  const { t } = useLang()
  const navigate = useNavigate()

  return (
    <div style={styles.page}>
      <Header title={t.community} />
      <div style={styles.content}>

        <p style={styles.sectionLabel}>{t.recentStories}</p>

        <div style={styles.emptyBox}>
          <div style={styles.emptyIcon}>🌳</div>
          <div style={styles.emptyTitle}>No stories yet</div>
          <div style={styles.emptyDesc}>
            Be the first to record and share a story with the community
          </div>
          <button style={styles.recordBtn} onClick={() => navigate('/record')}>
            + Record a story
          </button>
        </div>

      </div>
      <BottomNav />
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#FDF6EF',
    paddingBottom: 80,
  },
  content: { padding: '16px' },
  sectionLabel: {
    fontSize: 11, fontWeight: 600, color: '#9C7A5A',
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 16,
  },
  emptyBox: {
    background: '#FFF8F0',
    border: '1px dashed #E8D5C0',
    borderRadius: 16,
    padding: '40px 24px',
    textAlign: 'center',
    marginTop: 20,
  },
  emptyIcon: { fontSize: 48, marginBottom: 14 },
  emptyTitle: {
    fontSize: 17, fontWeight: 600,
    color: '#2C1A0E', marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 13, color: '#9C7A5A',
    lineHeight: 1.6, marginBottom: 20,
    maxWidth: 240, margin: '0 auto 20px',
  },
  recordBtn: {
    padding: '11px 24px',
    background: '#7F4F24', color: '#FFF8F0',
    border: 'none', borderRadius: 10,
    fontSize: 14, fontWeight: 600, cursor: 'pointer',
  },
}