import { useLang } from '../context/LangContext'

export default function StoryCard({ story }) {
  const { t } = useLang()

  return (
    <div style={styles.card}>
      <div style={styles.meta}>
        <div style={styles.avatar}>{story.initials}</div>
        <div style={styles.info}>
          <div style={styles.name}>{story.author}</div>
          <div style={styles.date}>{story.date}</div>
        </div>
        <span style={{
          ...styles.badge,
          background: story.isPrivate ? '#EAF3DE' : '#F5E6D6',
          color: story.isPrivate ? '#3B6D11' : '#7F4F24',
        }}>
          {story.isPrivate ? t.privateLabel : t.publicLabel}
        </span>
      </div>
      <div style={styles.title}>{story.title}</div>
      <div style={styles.preview}>{story.preview}</div>
      <div style={styles.playRow}>
        <button style={styles.playBtn}>
          <div style={styles.playIcon} />
        </button>
        <div style={styles.waveform}>
          <div style={{ ...styles.waveformFill, width: story.progress || '30%' }} />
        </div>
        <span style={styles.duration}>{story.duration}</span>
      </div>
      <div style={styles.aiChip}>
        <div style={styles.aiDot} />
        <span>{t.aiTranscript}</span>
      </div>
    </div>
  )
}

const styles = {
  card: {
    background: '#FFF8F0',
    border: '0.5px solid #E8D5C0',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    cursor: 'pointer',
  },
  meta: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    background: '#E8A87C',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    fontWeight: 600,
    color: '#7F4F24',
    flexShrink: 0,
  },
  info: { flex: 1 },
  name: { fontSize: 13, fontWeight: 500, color: '#2C1A0E' },
  date: { fontSize: 11, color: '#9C7A5A' },
  badge: {
    fontSize: 10,
    padding: '2px 8px',
    borderRadius: 10,
    fontWeight: 500,
  },
  title: {
    fontSize: 14,
    fontWeight: 600,
    color: '#2C1A0E',
    marginBottom: 4,
  },
  preview: {
    fontSize: 13,
    color: '#6B4226',
    lineHeight: 1.5,
    marginBottom: 10,
  },
  playRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  playBtn: {
    width: 28,
    height: 28,
    borderRadius: '50%',
    background: '#7F4F24',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  playIcon: {
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderWidth: '5px 0 5px 9px',
    borderColor: 'transparent transparent transparent #fff',
    marginLeft: 2,
  },
  waveform: {
    flex: 1,
    height: 3,
    background: '#E8D5C0',
    borderRadius: 2,
  },
  waveformFill: {
    height: '100%',
    background: '#C28048',
    borderRadius: 2,
  },
  duration: { fontSize: 11, color: '#9C7A5A' },
  aiChip: {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    fontSize: 11,
    color: '#9C7A5A',
  },
  aiDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: '#C28048',
  },
}