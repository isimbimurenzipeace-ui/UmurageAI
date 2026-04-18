import { useState } from 'react'
import Header from '../components/Header'
import BottomNav from '../components/BottomNav'
import { useLang } from '../context/LangContext'

export default function Record() {
  const { t } = useLang()
  const [isRecording, setIsRecording] = useState(false)
  const [visibility, setVisibility] = useState('public')

  return (
    <div style={styles.page}>
      <Header title={t.record} />
      <div style={styles.content}>

        <div style={styles.waveBox}>
          {isRecording ? (
            <div style={styles.waveRow}>
              {[8, 20, 14, 24, 10, 18, 12, 22, 16].map((h, i) => (
                <div key={i} style={{
                  ...styles.waveBar,
                  height: h,
                  animationDelay: `${i * 0.1}s`
                }} />
              ))}
            </div>
          ) : (
            <div style={styles.waveIdle}>
              {[1,2,3,4,5,6,7].map(i => (
                <div key={i} style={styles.waveBarIdle} />
              ))}
            </div>
          )}
        </div>

        <button
          style={{
            ...styles.recordBtn,
            background: isRecording ? '#c0392b' : '#7F4F24',
          }}
          onClick={() => setIsRecording(!isRecording)}
        >
          <div style={styles.recDot} />
          {isRecording ? t.tapStop : t.tapRecord}
        </button>

        <p style={styles.sectionLabel}>{t.visibility}</p>
        <div style={styles.visRow}>
          <button
            style={{
              ...styles.visBtn,
              borderColor: visibility === 'public' ? '#C28048' : '#E8D5C0',
              background: visibility === 'public' ? '#FDF6EF' : '#fff',
            }}
            onClick={() => setVisibility('public')}
          >
            <div style={styles.visIcon}>🌍</div>
            <div style={styles.visTitle}>{t.publicLabel}</div>
            <div style={styles.visSub}>{t.sharedAll}</div>
          </button>
          <button
            style={{
              ...styles.visBtn,
              borderColor: visibility === 'private' ? '#C28048' : '#E8D5C0',
              background: visibility === 'private' ? '#FDF6EF' : '#fff',
            }}
            onClick={() => setVisibility('private')}
          >
            <div style={styles.visIcon}>🔒</div>
            <div style={styles.visTitle}>{t.privateLabel}</div>
            <div style={styles.visSub}>{t.familyOnly}</div>
          </button>
        </div>

        <p style={styles.sectionLabel}>{t.aiOptions}</p>
        <div style={styles.aiOptions}>
          {[t.autoTranscribe, t.autoTranslate, t.generateSummary].map((opt, i) => (
            <label key={i} style={styles.optionRow}>
              <input type="checkbox" defaultChecked={i < 2}
                style={{ accentColor: '#7F4F24' }} />
              <span style={styles.optionText}>{opt}</span>
            </label>
          ))}
        </div>

      </div>
      <BottomNav />
    </div>
  )
}

const styles = {
  page: { maxWidth: 480, margin: '0 auto', minHeight: '100vh', background: '#FDF6EF' },
  content: { padding: '16px 16px 100px' },
  waveBox: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    height: 60, marginBottom: 16,
  },
  waveRow: { display: 'flex', alignItems: 'center', gap: 4 },
  waveBar: {
    width: 4, borderRadius: 3, background: '#C28048',
    animation: 'wave 1.2s ease-in-out infinite',
  },
  waveIdle: { display: 'flex', alignItems: 'center', gap: 4 },
  waveBarIdle: { width: 4, height: 4, borderRadius: 3, background: '#E8D5C0' },
  recordBtn: {
    width: '100%', padding: 14, color: '#FFF8F0', border: 'none',
    borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: 8, marginBottom: 20,
  },
  recDot: { width: 10, height: 10, borderRadius: '50%', background: '#FFF8F0' },
  sectionLabel: {
    fontSize: 11, fontWeight: 600, color: '#9C7A5A',
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10,
  },
  visRow: { display: 'flex', gap: 10, marginBottom: 20 },
  visBtn: {
    flex: 1, border: '1.5px solid', borderRadius: 12,
    padding: '12px 10px', textAlign: 'center', cursor: 'pointer',
  },
  visIcon: { fontSize: 22, marginBottom: 4 },
  visTitle: { fontSize: 13, fontWeight: 600, color: '#2C1A0E' },
  visSub: { fontSize: 11, color: '#9C7A5A', marginTop: 2 },
  aiOptions: { display: 'flex', flexDirection: 'column', gap: 10 },
  optionRow: { display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' },
  optionText: { fontSize: 13, color: '#6B4226' },
}