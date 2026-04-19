import Header from '../components/Header'
import BottomNav from '../components/BottomNav'
import { useLang } from '../context/LangContext'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function Community() {
  const { t } = useLang()
  const { profileType, user } = useAuth()
  const navigate = useNavigate()
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStories()
  }, [])

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
          stories.map(story => (
            <ElderStoryCard key={story.id} story={story} />
          ))
        )}

      </div>
      <BottomNav />
    </div>
  )
}

function YouthCommunity({ t, navigate, stories, loading }) {
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
          <button style={youthStyles.actionChip}
            onClick={() => navigate('/record')}>
            🎤 Ask an Elder
          </button>
          <button style={youthStyles.actionChip}>
            ⭐ Saved
          </button>
          <button style={youthStyles.actionChip}>
            👥 Following
          </button>
        </div>

        <p style={youthStyles.sectionLabel}>🌍 Recent stories</p>

        {loading ? (
          <div style={styles.loading}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={styles.emptyBox}>
            <div style={styles.emptyIcon}>🌳</div>
            <div style={styles.emptyTitle}>No stories yet</div>
            <div style={styles.emptyDesc}>
              Invite an elder to share their first story!
            </div>
            <button style={youthStyles.inviteBtn}
              onClick={() => navigate('/family')}>
              + Invite an Elder
            </button>
          </div>
        ) : (
          filtered.map(story => (
            <YouthStoryCard key={story.id} story={story} />
          ))
        )}

      </div>
      <BottomNav />
    </div>
  )
}

function ElderStoryCard({ story }) {
  const [playing, setPlaying] = useState(false)
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
        <audio ref={audioRef} src={story.audio_url}
          onEnded={() => setPlaying(false)} />
      )}
      <button style={elderStyles.playBtn} onClick={() => {
        if (!audioRef.current) return
        if (playing) { audioRef.current.pause(); setPlaying(false) }
        else { audioRef.current.play(); setPlaying(true) }
      }}>
        {playing ? '⏸ Pause' : '▶ Listen'} · {story.duration || '0:00'}
      </button>
    </div>
  )
}

function YouthStoryCard({ story }) {
  const [playing, setPlaying] = useState(false)
  const [liked, setLiked] = useState(false)
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
        <audio ref={audioRef} src={story.audio_url}
          onEnded={() => setPlaying(false)} />
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
      </div>
    </div>
  )
}

import { useRef } from 'react'

const styles = {
  page: { minHeight: '100vh', background: '#FDF6EF', paddingBottom: 80 },
  content: { padding: 16 },
  loading: { textAlign: 'center', color: '#9C7A5A', padding: 40 },
  emptyBox: {
    background: '#FFF8F0', border: '1px dashed #E8D5C0',
    borderRadius: 16, padding: '40px 24px', textAlign: 'center', marginTop: 12,
  },
  emptyIcon: { fontSize: 48, marginBottom: 14 },
  emptyTitle: { fontSize: 17, fontWeight: