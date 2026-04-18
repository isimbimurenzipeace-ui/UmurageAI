import { useNavigate } from 'react-router-dom'
import { useLang } from '../context/LangContext'

export default function Home() {
  const { t } = useLang()
  const navigate = useNavigate()

  return (
    <div style={styles.page}>
      <div style={styles.hero}>
        <div style={styles.logo}>🌳</div>
        <h1 style={styles.appName}>{t.appName}</h1>
        <p style={styles.tagline}>{t.tagline}</p>
      </div>
      <button style={styles.btn} onClick={() => navigate('/community')}>
        Enter UmurageAI →
      </button>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh', background: '#7F4F24',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center', padding: 24,
  },
  hero: { textAlign: 'center', marginBottom: 32 },
  logo: { fontSize: 60, marginBottom: 12 },
  appName: { color: '#FFF8F0', fontSize: 32, fontWeight: 700, marginBottom: 8 },
  tagline: { color: '#D4A57A', fontSize: 15, lineHeight: 1.5, maxWidth: 260, margin: '0 auto' },
  btn: {
    padding: '14px 32px', background: '#FFF8F0',
    color: '#7F4F24', border: 'none', borderRadius: 12,
    fontSize: 16, fontWeight: 600, cursor: 'pointer',
  },
}