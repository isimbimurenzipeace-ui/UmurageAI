import { useState, useRef, useEffect } from 'react'
import Header from '../components/Header'
import BottomNav from '../components/BottomNav'
import { useLang } from '../context/LangContext'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

export default function Record() {
  const { t } = useLang()
  const { user } = useAuth()
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState(null)
  const [audioUrl, setAudioUrl] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [visibility, setVisibility] = useState('public')
  const [title, setTitle] = useState('')
  const [duration, setDuration] = useState(0)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [bars, setBars] = useState(Array(20).fill(4))

  const mediaRecorder = useRef(null)
  const audioRef = useRef(null)
  const chunksRef = useRef([])
  const timerRef = useRef(null)
  const animRef = useRef(null)
  const analyserRef = useRef(null)
  const streamRef = useRef(null)

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current)
      cancelAnimationFrame(animRef.current)
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop())
      }
    }
  }, [])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const AudioContext = window.AudioContext || window.webkitAudioContext
      const audioCtx = new AudioContext()
      const source = audioCtx.createMediaStreamSource(stream)
      const analyser = audioCtx.createAnalyser()
      analyser.fftSize = 64
      source.connect(analyser)
      analyserRef.current = analyser

      const animateWave = () => {
        const dataArray = new Uint8Array(analyser.frequencyBinCount)
        analyser.getByteFrequencyData(dataArray)
        const newBars = Array.from({ length: 20 }, (_, i) => {
          const val = dataArray[i % dataArray.length]
          return Math.max(4, (val / 255) * 48)
        })
        setBars(newBars)
        animRef.current = requestAnimationFrame(animateWave)
      }
      animateWave()

      const recorder = new MediaRecorder(stream)
      chunksRef.current = []
      recorder.ondataavailable = e => chunksRef.current.push(e.data)
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        setAudioBlob(blob)
        setAudioUrl(URL.createObjectURL(blob))
        cancelAnimationFrame(animRef.current)
        setBars(Array(20).fill(4))
      }

      recorder.start()
      mediaRecorder.current = recorder
      setIsRecording(true)
      setDuration(0)
      setSaved(false)
      setAudioBlob(null)
      setAudioUrl(null)

      timerRef.current = setInterval(() => {
        setDuration(d => d + 1)
      }, 1000)

    } catch (err) {
      setError('Microphone access denied. Please allow microphone access.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop()
      streamRef.current.getTracks().forEach(t => t.stop())
    }
    clearInterval(timerRef.current)
    setIsRecording(false)
  }

  const toggleRecording = () => {
    if (isRecording) stopRecording()
    else startRecording()
  }

  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0')
    const s = (secs % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  const saveStory = async () => {
    if (!audioBlob || !title) {
      setError('Please add a title for your story')
      return
    }
    setSaving(true)
    setError('')
    try {
      const fileName = `${user.id}-${Date.now()}.webm`
      const { error: uploadError } = await supabase.storage
        .from('stories')
        .upload(fileName, audioBlob)

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage
        .from('stories')
        .getPublicUrl(fileName)

      await supabase.from('stories').insert({
        user_id: user.id,
        title,
        audio_url: urlData.publicUrl,
        duration: formatTime(duration),
        is_private: visibility === 'private',
        preview: title,
      })

      await supabase.from('notifications').insert({
        user_id: user.id,
        title: 'Story saved! 🎙️',
        message: `Your story "${title}" has been saved successfully.`,
        type: 'story',
      })

      setSaved(true)
      setTitle('')
      setAudioBlob(null)
      setAudioUrl(null)
      setDuration(0)
    } catch (err) {
      setError('Failed to save story. Please try again.')
    }
    setSaving(false)
  }

  return (
    <div style={styles.page}>
      <Header title={t.record} />
      <div style={styles.content}>

        <div style={styles.waveBox}>
          <div style={styles.waveRow}>
            {bars.map((h, i) => (
              <div key={i} style={{
                ...styles.bar,
                height: h,
                background: isRecording ? '#C28048' : '#E8D5C0',
                transition: 'height 0.1s ease',
              }} />
            ))}
          </div>
          {isRecording && (
            <div style={styles.timer}>{formatTime(duration)}</div>
          )}
        </div>

        <button
          style={{
            ...styles.recBtn,
            background: isRecording ? '#c0392b' : '#7F4F24'
          }}
          onClick={toggleRecording}
        >
          <div style={styles.recDot} />
          <span>{isRecording ? t.tapStop : t.tapRecord}</span>
        </button>

        {audioUrl && (
          <div style={styles.playbackBox}>
            <audio ref={audioRef} src={audioUrl}
              onEnded={() => setIsPlaying(false)} />
            <button style={styles.playBtn} onClick={togglePlay}>
              <span style={styles.playIcon}>{isPlaying ? '⏸' : '▶'}</span>
            </button>
            <div style={styles.playInfo}>
              <div style={styles.playLabel}>Recording ready</div>
              <div style={styles.playDur}>{formatTime(duration)}</div>
            </div>
          </div>
        )}

        {audioUrl && (
          <>
            <p style={styles.sectionLabel}>Story title</p>
            <input
              style={styles.input}
              placeholder="Give your story a title..."
              value={title}
              onChange={e => setTitle(e.target.value)}
            />

            <p style={styles.sectionLabel}>{t.visibility}</p>
            <div style={styles.visRow}>
              <button
                style={{
                  ...styles.visBtn,
                  borderColor: visibility === 'public' ? '#C28048' : '#E8D5C0',
                  background: visibility === 'public' ? '#FDF6EF' : '#fff'
                }}
                onClick={() => setVisibility('public')}
              >
                <span style={styles.visIcon}>🌍</span>
                <div style={styles.visTitle}>{t.publicLabel}</div>
                <div style={styles.visSub}>{t.sharedAll}</div>
              </button>
              <button
                style={{
                  ...styles.visBtn,
                  borderColor: visibility === 'private' ? '#C28048' : '#E8D5C0',
                  background: visibility === 'private' ? '#FDF6EF' : '#fff'
                }}
                onClick={() => setVisibility('private')}
              >
                <span style={styles.visIcon}>🔒</span>
                <div style={styles.visTitle}>{t.privateLabel}</div>
                <div style={styles.visSub}>{t.familyOnly}</div>
              </button>
            </div>

            <p style={styles.sectionLabel}>{t.aiOptions}</p>
            <div style={styles.optionList}>
              {[t.autoTranscribe, t.autoTranslate, t.generateSummary].map((opt, i) => (
                <label key={i} style={styles.optionRow}>
                  <input type="checkbox" defaultChecked={i < 2}
                    style={{ accentColor: '#7F4F24' }} />
                  <span>{opt}</span>
                </label>
              ))}
            </div>

            {error && <div style={styles.error}>{error}</div>}
            {saved && <div style={styles.success}>✅ Story saved successfully!</div>}

            <button
              style={{ ...styles.saveBtn, opacity: saving ? 0.7 : 1 }}
              onClick={saveStory}
              disabled={saving}
            >
              {saving ? 'Saving...' : '💾 Save Story'}
            </button>
          </>
        )}

      </div>
      <BottomNav />
    </div>
  )
}

const styles = {
  page: { minHeight: '100vh', background: '#FDF6EF', paddingBottom: 80 },
  content: { padding: 16 },
  waveBox: {
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    height: 80, marginBottom: 16,
  },
  waveRow: {
    display: 'flex', alignItems: 'center',
    gap: 3, height: 48,
  },
  bar: {
    width: 4, borderRadius: 3,
  },
  timer: {
    fontSize: 13, color: '#C28048',
    fontWeight: 600, marginTop: 8,
  },
  recBtn: {
    width: '100%', padding: 14, color: '#FFF8F0',
    border: 'none', borderRadius: 12, fontSize: 15,
    fontWeight: 600, cursor: 'pointer',
    display: 'flex', alignItems: 'center',
    justifyContent: 'center', gap: 8, marginBottom: 20,
  },
  recDot: {
    width: 10, height: 10,
    borderRadius: '50%', background: '#FFF8F0',
  },
  playbackBox: {
    display: 'flex', alignItems: 'center', gap: 12,
    background: '#FFF8F0', border: '1px solid #E8D5C0',
    borderRadius: 12, padding: '12px 16px', marginBottom: 16,
  },
  playBtn: {
    width: 40, height: 40, borderRadius: '50%',
    background: '#7F4F24', border: 'none',
    cursor: 'pointer', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  playIcon: { fontSize: 16, color: '#FFF8F0' },
  playInfo: { flex: 1 },
  playLabel: { fontSize: 13, fontWeight: 600, color: '#2C1A0E' },
  playDur: { fontSize: 11, color: '#9C7A5A', marginTop: 2 },
  sectionLabel: {
    fontSize: 11, fontWeight: 600, color: '#9C7A5A',
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10,
  },
  input: {
    width: '100%', padding: '12px 14px', marginBottom: 16,
    border: '1px solid #E8D5C0', borderRadius: 10,
    fontSize: 14, background: '#fff', color: '#2C1A0E', outline: 'none',
  },
  visRow: { display: 'flex', gap: 10, marginBottom: 16 },
  visBtn: {
    flex: 1, padding: '12px 8px',
    border: '1.5px solid', borderRadius: 12,
    textAlign: 'center', cursor: 'pointer',
  },
  visIcon: { fontSize: 20, display: 'block', marginBottom: 4 },
  visTitle: { fontSize: 13, fontWeight: 600, color: '#2C1A0E' },
  visSub: { fontSize: 11, color: '#9C7A5A', marginTop: 2 },
  optionList: { display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 },
  optionRow: {
    display: 'flex', alignItems: 'center', gap: 10,
    fontSize: 13, color: '#6B4226', cursor: 'pointer',
  },
  error: {
    background: '#FCEBEB', color: '#A32D2D',
    padding: '10px 14px', borderRadius: 8,
    fontSize: 13, marginBottom: 10,
  },
  success: {
    background: '#EAF3DE', color: '#3B6D11',
    padding: '10px 14px', borderRadius: 8,
    fontSize: 13, marginBottom: 10,
  },
  saveBtn: {
    width: '100%', padding: 13, background: '#7F4F24',
    color: '#FFF8F0', border: 'none', borderRadius: 10,
    fontSize: 14, fontWeight: 600, cursor: 'pointer',
  },
}