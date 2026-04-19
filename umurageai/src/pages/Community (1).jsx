import { useState, useEffect, useRef } from 'react'
import Header from '../components/Header'
import BottomNav from '../components/BottomNav'
import { useLang } from '../context/LangContext'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

// ── AI helper ────────────────────────────────────────────────────────────────
async function callAI(prompt) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    }),
  })
  const data = await res.json()
  return data.content?.[0]?.text || ''
}

// ── AI Panel shown below a story card ────────────────────────────────────────
function AIPanel({ story, lang, onClose }) {
  const [mode, setMode] = useState(null)       // 'summary' | 'translate'
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const run = async (type) => {
    setMode(type)
    setResult('')
    setError('')
    setLoading(true)
    try {
      let prompt = ''
      if (type === 'summary') {
        prompt = `You are a cultural storytelling assistant for UmurageAI, an app preserving Rwandan/African elder stories.
Summarize this story in 2-3 warm, respectful sentences that capture its essence.
Story title: "${story.title}"
Story preview: "${story.preview || story.title}"
Keep the summary in ${lang === 'rw' ? 'Kinyarwanda' : 'English'}.`
      } else {
        const from = lang === 'rw' ? 'English' : 'Kinyarwanda'
        const to = lang === 'rw' ? 'Kinyarwanda' : 'English'
        prompt = `You are a cultural translation assistant for UmurageAI.
Translate this story title and preview from ${from} to ${to}. 
Preserve cultural nuance and warmth.
Title: "${story.title}"
Preview: "${story.preview || story.title}"
Format your response as:
Title: [translated title]
Summary: [translated preview/summary in 2-3 sentences]`
      }
      const text = await callAI(prompt)
      setResult(text)
    } catch {
      setError('AI is unavailable. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div style={aiStyles.panel}>
      <div style={aiStyles.btnRow}>
        <button
          style={{ ...aiStyles.aiBtn, background: mode === 'summary' ? '#5C3D2E' : '#FFF0E0', color: mode === 'summary' ? '#fff' : '#5C3D2E' }}
          onClick={() => run('summary')}
        >
          ✨ Summarize
        </button>
        <button
          style={{ ...aiStyles.aiBtn, background: mode === 'translate' ? '#5C3D2E' : '#FFF0E0', color: mode === 'translate' ? '#fff' : '#5C3D2E' }}
          onClick={() => run('translate')}
        >
          🌍 Translate
        </button>
        <button style={aiStyles.closeBtn} onClick={onClose}>✕</button>
      </div>

      {loading && (
        <div style={aiStyles.loading}>
          <span style={aiStyles.spinner}>⏳</span> AI is thinking...
        </div>
      )}
      {error && <div style={aiStyles.error}>{error}</div>}
      {result && !loading && (
        <div style={aiStyles.result}>{result}</div>
      )}
    </div>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function Community() {
  const { t } = useLang()
  const { profileType, user } = useAuth()
  const navigate = useNavigate()
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchStories() }, [])

  const fetchStories = async () => {
    const { data } = await supabase
      .from('stories')
      .select('*, profiles(name, profile_type)')
      .eq('is_private', false)
      .order('created_at', { ascending: false })
    setStories(data || [])
    setLoading(false)
  }

  if (profileType === 'elder') {
    return <ElderCommunity t={t} navigate={navigate}
      stories={stories} loading={loading} user={user} />
  }

  return <YouthCommunity t={t} navigate={navigate}
    stories={stories} loading={loading} />
}

// ── Elder view ────────────────────────────────────────────────────────────────
function ElderCommunity({ t, navigate, stories, loading }) {
  return (
    <div style={styles.page}>
      <Header title={t.community} />
      <div style={styles.content}>
        <div style={elderStyles.welcomeBox}>
          <div style={elderStyles.welcomeIcon}>🌳</div>
          <div style={elderStyles.welcomeTitle}>Share your wisdom</div>
          <div style={elderStyles.welcomeDesc}>
            Your stories matter. Record and preserve them for the next generation.
          </div>
          <button style={elderStyles.recordBtn} onClick={() => navigate('/record')}>
            🎙️ Record a story
          </button>
        </div>

        <p style={elderStyles.sectionLabel}>Community stories</p>

        {loading ? (
          <div style={styles.loading}>Loading...</div>
        ) : stories.length === 0 ? (
          <div style={styles.emptyBox}>
            <div style={styles.emptyIcon}>🌳</div>
            <div style={styles.emptyTitle}>No stories yet</div>
            <div style={styles.emptyDesc}>Be the first to share a story!</div>
          </div>
        ) : (
          stories.map(story => <ElderStoryCard key={story.id} story={story} />)
        )}
      </div>
      <BottomNav />
    </div>
  )
}

// ── Youth view ────────────────────────────────────────────────────────────────
function YouthCommunity({ t, navigate, stories, loading }) {
  const { lang } = useLang()
  const [search, setSearch] = useState('')
  const filtered = stories.filter(s =>
    s.title?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={styles.page}>
      <Header title={t.community} />
      <div style={styles.content}>
        <div style={youthStyles.searchBox}>
          <span style={youthStyles.searchIcon}>🔍</span>
          <input
            style={youthStyles.searchInput}
            placeholder="Search stories..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div style={youthStyles.quickActions}>
          <button style={youthStyles.actionChip} onClick={() => navigate('/ask')}>
            🎤 Ask an Elder
          </button>
          <button style={youthStyles.actionChip}>⭐ Saved</button>
          <button style={youthStyles.actionChip}>👥 Following</button>
        </div>

        <p style={youthStyles.sectionLabel}>🌍 Recent stories</p>

        {loading ? (
          <div style={styles.loading}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={styles.emptyBox}>
            <div style={styles.emptyIcon}>🌳</div>
            <div style={styles.emptyTitle}>No stories yet</div>
            <div style={styles.emptyDesc}>Invite an elder to share their first story!</div>
            <button style={youthStyles.inviteBtn} onClick={() => navigate('/family')}>
              + Invite an Elder
            </button>
          </div>
        ) : (
          filtered.map(story => <YouthStoryCard key={story.id} story={story} lang={lang} />)
        )}
      </div>
      <BottomNav />
    </div>
  )
}

// ── Elder story card ──────────────────────────────────────────────────────────
function ElderStoryCard({ story }) {
  const { lang } = useLang()
  const [playing, setPlaying] = useState(false)
  const [showAI, setShowAI] = useState(false)
  const audioRef = useRef(null)

  return (
    <div style={elderStyles.card}>
      <div style={elderStyles.cardTop}>
        <div style={elderStyles.avatar}>
          {story.profiles?.name?.[0]?.toUpperCase() || 'E'}
        </div>
        <div>
          <div style={elderStyles.cardName}>{story.profiles?.name || 'Elder'}</div>
          <div style={elderStyles.cardDate}>
            {new Date(story.created_at).toLocaleDateString()}
          </div>
        </div>
      </div>

      <div style={elderStyles.cardTitle}>{story.title}</div>

      {story.audio_url && (
        <audio ref={audioRef} src={story.audio_url} onEnded={() => setPlaying(false)} />
      )}

      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <button style={elderStyles.playBtn} onClick={() => {
          if (!audioRef.current) return
          if (playing) { audioRef.current.pause(); setPlaying(false) }
          else { audioRef.current.play(); setPlaying(true) }
        }}>
          {playing ? '⏸ Pause' : '▶ Listen'} · {story.duration || '0:00'}
        </button>
        <button
          style={{ ...elderStyles.aiTagBtn, background: showAI ? '#5C3D2E' : '#FFF0E0', color: showAI ? '#fff' : '#5C3D2E' }}
          onClick={() => setShowAI(v => !v)}
        >
          ✨ AI
        </button>
      </div>

      {showAI && (
        <AIPanel story={story} lang={lang} onClose={() => setShowAI(false)} />
      )}
    </div>
  )
}

// ── Youth story card ──────────────────────────────────────────────────────────
function YouthStoryCard({ story, lang }) {
  const [playing, setPlaying] = useState(false)
  const [liked, setLiked] = useState(false)
  const [showAI, setShowAI] = useState(false)
  const audioRef = useRef(null)

  return (
    <div style={youthStyles.card}>
      <div style={youthStyles.cardHeader}>
        <div style={youthStyles.avatar}>
          {story.profiles?.name?.[0]?.toUpperCase() || 'E'}
        </div>
        <div style={youthStyles.cardInfo}>
          <div style={youthStyles.cardName}>{story.profiles?.name || 'Elder'}</div>
          <div style={youthStyles.cardDate}>
            {new Date(story.created_at).toLocaleDateString()}
          </div>
        </div>
        <button
          style={{ ...youthStyles.likeBtn, color: liked ? '#c0392b' : '#9C7A5A' }}
          onClick={() => setLiked(!liked)}
        >
          {liked ? '❤️' : '🤍'}
        </button>
      </div>

      <div style={youthStyles.cardTitle}>{story.title}</div>

      {story.audio_url && (
        <audio ref={audioRef} src={story.audio_url} onEnded={() => setPlaying(false)} />
      )}

      <div style={youthStyles.cardFooter}>
        <button style={youthStyles.playBtn} onClick={() => {
          if (!audioRef.current) return
          if (playing) { audioRef.current.pause(); setPlaying(false) }
          else { audioRef.current.play(); setPlaying(true) }
        }}>
          {playing ? '⏸' : '▶'} {story.duration || '0:00'}
        </button>
        <button style={youthStyles.saveBtn}>🔖 Save</button>
        <button style={youthStyles.shareBtn}>↗ Share</button>
        <button
          style={{ ...youthStyles.saveBtn, background: showAI ? '#5C3D2E' : '#FFF0E0', color: showAI ? '#fff' : '#5C3D2E' }}
          onClick={() => setShowAI(v => !v)}
        >
          ✨ AI
        </button>
      </div>

      {showAI && (
        <AIPanel story={story} lang={lang} onClose={() => setShowAI(false)} />
      )}
    </div>
  )
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = {
  page: { minHeight: '100vh', background: '#FDF6EF', paddingBottom: 80 },
  content: { padding: 16 },
  loading: { textAlign: 'center', color: '#9C7A5A', padding: 40 },
  emptyBox: {
    background: '#FFF8F0', border: '1px dashed #E8D5C0',
    borderRadius: 16, padding: '40px 24px', textAlign: 'center', marginTop: 12,
  },
  emptyIcon: { fontSize: 48, marginBottom: 14 },
  emptyTitle: { fontSize: 17, fontWeight: '600', color: '#5C3D2E', marginBottom: 6 },
  emptyDesc: { fontSize: 14, color: '#9C7A5A' },
}

const elderStyles = {
  welcomeBox: {
    background: 'linear-gradient(135deg, #5C3D2E, #9C7A5A)',
    borderRadius: 16, padding: '24px 20px', textAlign: 'center',
    color: '#fff', marginBottom: 20,
  },
  welcomeIcon: { fontSize: 40, marginBottom: 10 },
  welcomeTitle: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
  welcomeDesc: { fontSize: 14, opacity: 0.85, marginBottom: 16 },
  recordBtn: {
    background: '#fff', color: '#5C3D2E', border: 'none',
    borderRadius: 24, padding: '10px 24px', fontSize: 15,
    fontWeight: '600', cursor: 'pointer',
  },
  sectionLabel: { fontSize: 15, fontWeight: '600', color: '#5C3D2E', marginBottom: 10 },
  card: {
    background: '#fff', borderRadius: 14, padding: 16,
    marginBottom: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  cardTop: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 },
  avatar: {
    width: 40, height: 40, borderRadius: '50%',
    background: '#9C7A5A', color: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: '700', fontSize: 16,
  },
  cardName: { fontWeight: '600', color: '#5C3D2E', fontSize: 15 },
  cardDate: { fontSize: 12, color: '#B0956E' },
  cardTitle: { fontSize: 16, color: '#3D2B1F', marginBottom: 12, fontWeight: '500' },
  playBtn: {
    background: '#5C3D2E', color: '#fff', border: 'none',
    borderRadius: 20, padding: '8px 18px', fontSize: 14,
    fontWeight: '600', cursor: 'pointer',
  },
  aiTagBtn: {
    border: '1px solid #E8D5C0', borderRadius: 20,
    padding: '8px 14px', fontSize: 13, fontWeight: '600', cursor: 'pointer',
  },
}

const youthStyles = {
  searchBox: {
    display: 'flex', alignItems: 'center', background: '#fff',
    borderRadius: 24, padding: '10px 16px', marginBottom: 14,
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: {
    border: 'none', outline: 'none', flex: 1,
    fontSize: 15, background: 'transparent', color: '#3D2B1F',
  },
  quickActions: { display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' },
  actionChip: {
    background: '#FFF0E0', border: '1px solid #E8D5C0',
    borderRadius: 20, padding: '7px 14px', fontSize: 13,
    fontWeight: '500', color: '#5C3D2E', cursor: 'pointer',
  },
  sectionLabel: { fontSize: 15, fontWeight: '600', color: '#5C3D2E', marginBottom: 10 },
  card: {
    background: '#fff', borderRadius: 14, padding: 16,
    marginBottom: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  cardHeader: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 },
  avatar: {
    width: 38, height: 38, borderRadius: '50%',
    background: '#9C7A5A', color: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: '700', fontSize: 15,
  },
  cardInfo: { flex: 1 },
  cardName: { fontWeight: '600', color: '#5C3D2E', fontSize: 14 },
  cardDate: { fontSize: 12, color: '#B0956E' },
  cardTitle: { fontSize: 15, color: '#3D2B1F', marginBottom: 12, fontWeight: '500' },
  cardFooter: { display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' },
  playBtn: {
    background: '#5C3D2E', color: '#fff', border: 'none',
    borderRadius: 20, padding: '7px 16px', fontSize: 13,
    fontWeight: '600', cursor: 'pointer',
  },
  likeBtn: {
    background: 'none', border: 'none', fontSize: 20,
    cursor: 'pointer', padding: 4,
  },
  saveBtn: {
    background: '#FFF0E0', color: '#5C3D2E', border: '1px solid #E8D5C0',
    borderRadius: 20, padding: '7px 14px', fontSize: 13,
    fontWeight: '500', cursor: 'pointer',
  },
  shareBtn: {
    background: '#FFF0E0', color: '#5C3D2E', border: '1px solid #E8D5C0',
    borderRadius: 20, padding: '7px 14px', fontSize: 13,
    fontWeight: '500', cursor: 'pointer',
  },
  inviteBtn: {
    background: '#5C3D2E', color: '#fff', border: 'none',
    borderRadius: 24, padding: '10px 24px', fontSize: 14,
    fontWeight: '600', cursor: 'pointer', marginTop: 12,
  },
}

const aiStyles = {
  panel: {
    marginTop: 12, background: '#F9F3EC',
    border: '1px solid #E8D5C0', borderRadius: 12, padding: 14,
  },
  btnRow: { display: 'flex', gap: 8, marginBottom: 10, alignItems: 'center' },
  aiBtn: {
    border: '1px solid #E8D5C0', borderRadius: 20,
    padding: '7px 14px', fontSize: 13, fontWeight: '600',
    cursor: 'pointer', flex: 1,
  },
  closeBtn: {
    background: 'none', border: 'none', color: '#9C7A5A',
    fontSize: 16, cursor: 'pointer', padding: '4px 8px',
  },
  loading: {
    fontSize: 13, color: '#9C7A5A', textAlign: 'center', padding: '10px 0',
  },
  spinner: { marginRight: 4 },
  result: {
    fontSize: 14, color: '#3D2B1F', lineHeight: 1.6,
    background: '#fff', borderRadius: 8, padding: 12,
    border: '1px solid #E8D5C0', whiteSpace: 'pre-wrap',
  },
  error: {
    fontSize: 13, color: '#A32D2D', background: '#FCEBEB',
    borderRadius: 8, padding: '8px 12px',
  },
}
