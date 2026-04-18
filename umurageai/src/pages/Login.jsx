import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { t, lang, setLang } = useLang()
  const { login, signup } = useAuth()
  const navigate = useNavigate()
  const [isSignup, setIsSignup] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [profileType, setProfileType] = useState(null)
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleContinue = () => {
    if (profileType) setStep(2)
  }

  const handleSubmit = async () => {
    if (!email || !password) return
    setLoading(true)
    setError('')
    try {
      if (isSignup) {
        if (!name) { setError('Please enter your name'); setLoading(false); return }
        await signup(email, password, name, profileType)
        navigate(profileType === 'elder' ? '/profile/elder' : '/profile/youth')
      } else {
        await login(email, password)
        navigate('/community')
      }
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  return (
    <div style={styles.page}>
      <div style={styles.topBar}>
        <button onClick={() => setLang('en')}
          style={{ ...styles.langBtn, ...(lang === 'en' ? styles.langActive : {}) }}>EN</button>
        <button onClick={() => setLang('rw')}
          style={{ ...styles.langBtn, ...(lang === 'rw' ? styles.langActive : {}) }}>RW</button>
      </div>

      <div style={styles.hero}>
        <div style={styles.logo}>🌳</div>
        <h1 style={styles.appName}>{t.appName}</h1>
        <p style={styles.tagline}>{t.tagline}</p>
      </div>

      <div style={styles.card}>
        {step === 1 ? (
          <>
            <p style={styles.chooseLabel}>{t.chooseProfile}</p>
            <button
              style={{
                ...styles.typeBtn,
                borderColor: profileType === 'elder' ? '#C28048' : '#E8D5C0',
                background: profileType === 'elder' ? '#FDF6EF' : '#fff'
              }}
              onClick={() => setProfileType('elder')}
            >
              <span style={styles.btnIcon}>🧓</span>
              <div>
                <div style={styles.btnTitle}>{t.iAmElder}</div>
                <div style={styles.btnDesc}>{t.elderDesc}</div>
              </div>
            </button>

            <button
              style={{
                ...styles.typeBtn,
                borderColor: profileType === 'youth' ? '#639922' : '#E8D5C0',
                background: profileType === 'youth' ? '#F0F7E8' : '#fff'
              }}
              onClick={() => setProfileType('youth')}
            >
              <span style={styles.btnIcon}>🧑</span>
              <div>
                <div style={styles.btnTitle}>{t.iAmYouth}</div>
                <div style={styles.btnDesc}>{t.youthDesc}</div>
              </div>
            </button>

            <button
              style={{ ...styles.continueBtn, opacity: profileType ? 1 : 0.5 }}
              onClick={handleContinue}
            >Continue →</button>
          </>
        ) : (
          <>
            <div style={styles.tabs}>
              <button
                style={{
                  ...styles.tabBtn,
                  borderBottom: !isSignup ? '2px solid #7F4F24' : 'none',
                  color: !isSignup ? '#7F4F24' : '#9C7A5A'
                }}
                onClick={() => setIsSignup(false)}>{t.login}</button>
              <button
                style={{
                  ...styles.tabBtn,
                  borderBottom: isSignup ? '2px solid #7F4F24' : 'none',
                  color: isSignup ? '#7F4F24' : '#9C7A5A'
                }}
                onClick={() => setIsSignup(true)}>{t.signup}</button>
            </div>

            {isSignup && (
              <input style={styles.input} placeholder={t.name}
                value={name} onChange={e => setName(e.target.value)} />
            )}

            <input style={styles.input} placeholder={t.email}
              type="email" value={email}
              onChange={e => setEmail(e.target.value)} />

            <input style={styles.input} placeholder={t.password}
              type="password" value={password}
              onChange={e => setPassword(e.target.value)} />

            {error && <div style={styles.error}>{error}</div>}

            <button
              style={{ ...styles.continueBtn, opacity: loading ? 0.7 : 1 }}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Please wait...' : (isSignup ? t.signup : t.login)}
            </button>

            <button style={styles.backBtn} onClick={() => setStep(1)}>← Back</button>
          </>
        )}
      </div>
      <p style={styles.footer}>UmurageAI — Rwanda © 2025</p>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh', background: '#7F4F24',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center', padding: '24px 20px',
  },
  topBar: {
    position: 'absolute', top: 20, right: 20,
    display: 'flex', background: 'rgba(255,255,255,0.15)',
    borderRadius: 20, padding: 3, gap: 2,
  },
  langBtn: {
    border: 'none', background: 'transparent',
    color: 'rgba(255,255,255,0.7)', borderRadius: 16,
    padding: '4px 12px', fontSize: 12, fontWeight: 500, cursor: 'pointer',
  },
  langActive: { background: '#fff', color: '#7F4F24' },
  hero: { textAlign: 'center', marginBottom: 28 },
  logo: { fontSize: 56, marginBottom: 10 },
  appName: { color: '#FFF8F0', fontSize: 30, fontWeight: 700, marginBottom: 6 },
  tagline: {
    color: '#D4A57A', fontSize: 14, lineHeight: 1.5,
    maxWidth: 260, margin: '0 auto',
  },
  card: {
    background: '#FFF8F0', borderRadius: 20,
    padding: '24px 20px', width: '100%', maxWidth: 400,
  },
  chooseLabel: {
    fontSize: 12, color: '#9C7A5A', textAlign: 'center',
    marginBottom: 16, fontWeight: 500,
    textTransform: 'uppercase', letterSpacing: 0.8,
  },
  typeBtn: {
    width: '100%', display: 'flex', alignItems: 'center', gap: 14,
    border: '1.5px solid', borderRadius: 14, padding: '14px 16px',
    marginBottom: 12, textAlign: 'left', cursor: 'pointer',
  },
  btnIcon: { fontSize: 30, flexShrink: 0 },
  btnTitle: { fontSize: 15, fontWeight: 600, color: '#2C1A0E', marginBottom: 3 },
  btnDesc: { fontSize: 12, color: '#6B4226', lineHeight: 1.4 },
  continueBtn: {
    width: '100%', padding: 12, background: '#7F4F24',
    color: '#FFF8F0', border: 'none', borderRadius: 10,
    fontSize: 15, fontWeight: 600, cursor: 'pointer', marginTop: 8,
  },
  tabs: {
    display: 'flex', marginBottom: 16,
    borderBottom: '1px solid #E8D5C0',
  },
  tabBtn: {
    flex: 1, padding: '10px', border: 'none',
    background: 'transparent', fontSize: 14,
    fontWeight: 500, cursor: 'pointer',
  },
  input: {
    width: '100%', padding: '12px 14px', marginBottom: 10,
    border: '1px solid #E8D5C0', borderRadius: 10,
    fontSize: 14, background: '#fff', color: '#2C1A0E', outline: 'none',
  },
  error: {
    background: '#FCEBEB', color: '#A32D2D',
    padding: '10px 14px', borderRadius: 8,
    fontSize: 13, marginBottom: 10,
  },
  backBtn: {
    width: '100%', padding: '10px', background: 'transparent',
    color: '#9C7A5A', border: 'none', fontSize: 13,
    cursor: 'pointer', marginTop: 6,
  },
  footer: { color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 24 },
}