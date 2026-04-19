import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../context/LangContext'

const slides = [
  {
    icon: '🌳',
    bg: 'linear-gradient(160deg, #7F4F24 0%, #5C3D2E 100%)',
    titleEn: 'Welcome to UmurageAI',
    titleRw: 'Murakaza neza kuri UmurageAI',
    descEn: 'Bridging generations, one story at a time.',
    descRw: 'Guhuza ibihe, inkuru imwe ku nkuru.',
    visual: 'intro',
  },
  {
    icon: '🎙️',
    bg: 'linear-gradient(160deg, #9C5B2E 0%, #7F4F24 100%)',
    titleEn: 'Elders Share Wisdom',
    titleRw: 'Abasaza basangira ubwenge',
    descEn: 'Record and preserve precious stories so they are never forgotten.',
    descRw: 'Fata urabike inkuru z\'agaciro kugira ngo ntizibagirwe.',
    visual: 'elder',
  },
  {
    icon: '🤖',
    bg: 'linear-gradient(160deg, #6B4226 0%, #4A2C1A 100%)',
    titleEn: 'AI Brings It Alive',
    titleRw: 'AI irakangura inkuru',
    descEn: 'Summarize, translate, and chat with elder wisdom — powered by AI.',
    descRw: 'Sobanura, hindura, ukavugana n\'ubwenge bw\'abasaza — binyuze muri AI.',
    visual: 'ai',
  },
  {
    icon: '👨‍👩‍👧‍👦',
    bg: 'linear-gradient(160deg, #8B5E3C 0%, #5C3D2E 100%)',
    titleEn: 'Connect Your Family',
    titleRw: 'Huza umuryango wawe',
    descEn: 'Invite elders and youth to share and listen together.',
    descRw: 'Zaprania abasaza n\'urubyiruko gusangira no kumvana.',
    visual: 'family',
  },
]

function SlideVisual({ type }) {
  if (type === 'intro') return (
    <div style={vis.wrap}>
      <div style={vis.bigIcon}>🌍</div>
      <div style={vis.row}>
        <div style={{ ...vis.chip, animationDelay: '0s' }}>🌳 Stories</div>
        <div style={{ ...vis.chip, animationDelay: '0.2s' }}>🎙️ Record</div>
      </div>
      <div style={vis.row}>
        <div style={{ ...vis.chip, animationDelay: '0.4s' }}>🤖 AI</div>
        <div style={{ ...vis.chip, animationDelay: '0.6s' }}>👨‍👩‍👧 Family</div>
      </div>
    </div>
  )

  if (type === 'elder') return (
    <div style={vis.wrap}>
      <div style={vis.scene}>
        <div style={vis.elderFigure}>👴</div>
        <div style={vis.speechBubble}>
          <div style={vis.speechText}>"Let me tell you about our ancestors..."</div>
        </div>
        <div style={vis.listenerRow}>
          <span style={vis.listenerFig}>👧</span>
          <span style={vis.listenerFig}>👦</span>
        </div>
      </div>
    </div>
  )

  if (type === 'ai') return (
    <div style={vis.wrap}>
      <div style={vis.aiBox}>
        <div style={vis.aiHeader}>
          <span>🌳</span>
          <span style={vis.aiLabel}>Elder AI</span>
        </div>
        <div style={vis.aiMsg}>What did elders say about respect?</div>
        <div style={vis.aiReply}>
          In our culture, respect begins with listening. As one elder shared — greet every person you meet...
        </div>
        <div style={vis.aiTags}>
          <span style={vis.aiTag}>✨ Summarize</span>
          <span style={vis.aiTag}>🌍 Translate</span>
        </div>
      </div>
    </div>
  )

  if (type === 'family') return (
    <div style={vis.wrap}>
      <div style={vis.familyCircle}>
        <div style={vis.centerTree}>🌳</div>
        <div style={{ ...vis.member, top: 0, left: '50%', transform: 'translate(-50%, -10px)' }}>👴</div>
        <div style={{ ...vis.member, top: '50%', left: 0, transform: 'translate(-10px, -50%)' }}>👩</div>
        <div style={{ ...vis.member, top: '50%', right: 0, transform: 'translate(10px, -50%)' }}>👨</div>
        <div style={{ ...vis.member, bottom: 0, left: '30%', transform: 'translate(-50%, 10px)' }}>👧</div>
        <div style={{ ...vis.member, bottom: 0, right: '30%', transform: 'translate(50%, 10px)' }}>👦</div>
      </div>
    </div>
  )
}

export default function Welcome() {
  const navigate = useNavigate()
  const { lang, setLang } = useLang()
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      goNext()
    }, 3500)
    return () => clearInterval(timer)
  }, [current])

  const goNext = () => {
    if (animating) return
    setAnimating(true)
    setTimeout(() => {
      setCurrent(c => (c + 1) % slides.length)
      setAnimating(false)
    }, 300)
  }

  const goTo = (i) => {
    if (animating || i === current) return
    setAnimating(true)
    setTimeout(() => {
      setCurrent(i)
      setAnimating(false)
    }, 300)
  }

  const slide = slides[current]

  return (
    <div style={{ ...styles.page, background: slide.bg, transition: 'background 0.6s ease' }}>

      {/* Language toggle */}
      <div style={styles.langRow}>
        <button
          style={{ ...styles.langBtn, ...(lang === 'en' ? styles.langActive : {}) }}
          onClick={() => setLang('en')}
        >EN</button>
        <button
          style={{ ...styles.langBtn, ...(lang === 'rw' ? styles.langActive : {}) }}
          onClick={() => setLang('rw')}
        >RW</button>
      </div>

      {/* Slide content */}
      <div style={{ ...styles.slideContent, opacity: animating ? 0 : 1, transition: 'opacity 0.3s ease' }}>

        <SlideVisual type={slide.visual} />

        <div style={styles.textBox}>
          <div style={styles.slideIcon}>{slide.icon}</div>
          <h1 style={styles.title}>
            {lang === 'rw' ? slide.titleRw : slide.titleEn}
          </h1>
          <p style={styles.desc}>
            {lang === 'rw' ? slide.descRw : slide.descEn}
          </p>
        </div>
      </div>

      {/* Dots */}
      <div style={styles.dotsRow}>
        {slides.map((_, i) => (
          <button
            key={i}
            style={{ ...styles.dot, width: i === current ? 24 : 8, opacity: i === current ? 1 : 0.4 }}
            onClick={() => goTo(i)}
          />
        ))}
      </div>

      {/* Buttons */}
      <div style={styles.btnArea}>
        <button style={styles.primaryBtn} onClick={() => navigate('/login')}>
          {lang === 'rw' ? 'Tangira' : 'Get Started'} →
        </button>
        <button style={styles.secondaryBtn} onClick={() => navigate('/login')}>
          {lang === 'rw' ? 'Injira' : 'Sign In'}
        </button>
      </div>

    </div>
  )
}

const vis = {
  wrap: {
    width: '100%', display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    padding: '12px 0', gap: 12,
  },
  bigIcon: { fontSize: 72, marginBottom: 8 },
  row: { display: 'flex', gap: 10 },
  chip: {
    background: 'rgba(255,255,255,0.15)', color: '#FFF8F0',
    borderRadius: 20, padding: '8px 16px', fontSize: 14, fontWeight: '600',
    border: '1px solid rgba(255,255,255,0.25)',
  },

  // Elder scene
  scene: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 },
  elderFigure: { fontSize: 56 },
  speechBubble: {
    background: 'rgba(255,255,255,0.15)', borderRadius: 16,
    padding: '10px 16px', maxWidth: 240, border: '1px solid rgba(255,255,255,0.25)',
  },
  speechText: { color: '#FFF8F0', fontSize: 13, fontStyle: 'italic', lineHeight: 1.4 },
  listenerRow: { display: 'flex', gap: 16, marginTop: 4 },
  listenerFig: { fontSize: 40 },

  // AI box
  aiBox: {
    background: 'rgba(255,255,255,0.12)', borderRadius: 16, padding: 16,
    width: '100%', maxWidth: 300, border: '1px solid rgba(255,255,255,0.2)',
  },
  aiHeader: { display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 },
  aiLabel: { color: '#FFF8F0', fontWeight: '700', fontSize: 14 },
  aiMsg: {
    background: 'rgba(255,255,255,0.2)', borderRadius: 10,
    padding: '8px 12px', color: '#FFF8F0', fontSize: 13, marginBottom: 8,
  },
  aiReply: {
    background: 'rgba(0,0,0,0.15)', borderRadius: 10,
    padding: '8px 12px', color: 'rgba(255,248,240,0.85)',
    fontSize: 12, lineHeight: 1.5, marginBottom: 10,
  },
  aiTags: { display: 'flex', gap: 6 },
  aiTag: {
    background: 'rgba(255,255,255,0.15)', color: '#FFF8F0',
    borderRadius: 20, padding: '5px 10px', fontSize: 11, fontWeight: '600',
  },

  // Family circle
  familyCircle: {
    width: 180, height: 180, borderRadius: '50%',
    border: '2px dashed rgba(255,255,255,0.3)',
    position: 'relative', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
  },
  centerTree: { fontSize: 40 },
  member: { position: 'absolute', fontSize: 32 },
}

const styles = {
  page: {
    minHeight: '100vh', display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'space-between',
    padding: '24px 24px 40px', maxWidth: 480, margin: '0 auto',
  },
  langRow: {
    display: 'flex', gap: 4, alignSelf: 'flex-end',
    background: 'rgba(255,255,255,0.15)', borderRadius: 20, padding: 3,
  },
  langBtn: {
    border: 'none', background: 'transparent',
    color: 'rgba(255,255,255,0.7)', borderRadius: 16,
    padding: '4px 14px', fontSize: 12, fontWeight: '500', cursor: 'pointer',
  },
  langActive: { background: '#fff', color: '#7F4F24' },

  slideContent: {
    flex: 1, display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center', width: '100%', gap: 20,
  },
  textBox: { textAlign: 'center', padding: '0 8px' },
  slideIcon: { fontSize: 36, marginBottom: 10 },
  title: {
    color: '#FFF8F0', fontSize: 26, fontWeight: '800',
    marginBottom: 12, lineHeight: 1.2,
  },
  desc: {
    color: 'rgba(255,248,240,0.8)', fontSize: 15,
    lineHeight: 1.6, maxWidth: 300, margin: '0 auto',
  },

  dotsRow: { display: 'flex', gap: 6, alignItems: 'center', marginBottom: 24 },
  dot: {
    height: 8, borderRadius: 4,
    background: '#FFF8F0', border: 'none', cursor: 'pointer',
    transition: 'width 0.3s ease, opacity 0.3s ease', padding: 0,
  },

  btnArea: { display: 'flex', flexDirection: 'column', gap: 12, width: '100%' },
  primaryBtn: {
    width: '100%', padding: '15px 0',
    background: '#FFF8F0', color: '#7F4F24',
    border: 'none', borderRadius: 14, fontSize: 16,
    fontWeight: '700', cursor: 'pointer',
  },
  secondaryBtn: {
    width: '100%', padding: '14px 0',
    background: 'rgba(255,255,255,0.15)', color: '#FFF8F0',
    border: '1.5px solid rgba(255,255,255,0.4)', borderRadius: 14,
    fontSize: 15, fontWeight: '600', cursor: 'pointer',
  },
}
