import { useLang } from '../context/LangContext'

export default function Header({ title }) {
  const { lang, setLang, t } = useLang()

  return (
    <header style={styles.header}>
      <div style={styles.left}>
        <span style={styles.tree}>🌳</span>
        <div>
          <div style={styles.appName}>{t.appName}</div>
          {title && <div style={styles.pageTitle}>{title}</div>}
        </div>
      </div>
      <div style={styles.toggle}>
        <button
          onClick={() => setLang('en')}
          style={{ ...styles.langBtn, ...(lang === 'en' ? styles.langActive : {}) }}
        >EN</button>
        <button
          onClick={() => setLang('rw')}
          style={{ ...styles.langBtn, ...(lang === 'rw' ? styles.langActive : {}) }}
        >RW</button>
      </div>
    </header>
  )
}

const styles = {
  header: {
    background: '#7F4F24',
    padding: '14px 18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 0,
    zIndex: 99,
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  tree: { fontSize: 24 },
  appName: {
    color: '#FFF8F0',
    fontSize: 17,
    fontWeight: 600,
  },
  pageTitle: {
    color: '#D4A57A',
    fontSize: 12,
    marginTop: 1,
  },
  toggle: {
    display: 'flex',
    background: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    padding: 3,
    gap: 2,
  },
  langBtn: {
    border: 'none',
    background: 'transparent',
    color: 'rgba(255,255,255,0.7)',
    borderRadius: 16,
    padding: '4px 12px',
    fontSize: 12,
    fontWeight: 500,
    cursor: 'pointer',
  },
  langActive: {
    background: '#fff',
    color: '#7F4F24',
  },
}