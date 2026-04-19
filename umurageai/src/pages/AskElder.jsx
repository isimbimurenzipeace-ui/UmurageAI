import { useState, useEffect, useRef } from 'react'
import Header from '../components/Header'
import BottomNav from '../components/BottomNav'
import { useLang } from '../context/LangContext'
import { supabase } from '../lib/supabase'

// ── AI helper ─────────────────────────────────────────────────────────────────
async function callAI(messages) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages,
    }),
  })
  const data = await res.json()
  return data.content?.[0]?.text || ''
}

// ── Suggested questions ───────────────────────────────────────────────────────
const SUGGESTED = [
  'What did elders say about respect in our culture?',
  'How did our ancestors solve family conflicts?',
  'What traditions should I know about marriage?',
  'What wisdom do elders share about hard times?',
  'How were children raised in our culture?',
]

export default function AskElder() {
  const { t, lang } = useLang()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [stories, setStories] = useState([])
  const bottomRef = useRef(null)

  // Fetch elder stories to give AI context
  useEffect(() => {
    fetchStories()
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const fetchStories = async () => {
    const { data } = await supabase
      .from('stories')
      .select('title, preview')
      .eq('is_private', false)
      .order('created_at', { ascending: false })
      .limit(20)
    setStories(data || [])
  }

  const buildSystemContext = () => {
    const storyContext = stories.length > 0
      ? `Here are real stories shared by elders in this community:\n` +
        stories.map((s, i) => `${i + 1}. "${s.title}"${s.preview ? ` — ${s.preview}` : ''}`).join('\n')
      : 'No stories have been shared yet in this community.'

    return `You are a wise, warm cultural guide for UmurageAI — an app that preserves African/Rwandan elder wisdom for the next generation.

Your role: Answer questions from young people by drawing on the elder stories shared in this community, combined with general Rwandan and African cultural wisdom.

${storyContext}

Guidelines:
- Speak warmly, like a respected elder or cultural guide
- Reference specific story titles when relevant (e.g. "As one elder shared in '...'")
- If no stories match the question, draw on general Rwandan/African cultural values
- Keep answers focused, respectful, and practical
- Respond in ${lang === 'rw' ? 'Kinyarwanda' : 'English'}
- Never make up specific story details that weren't provided`
  }

  const sendMessage = async (text) => {
    const userText = text || input.trim()
    if (!userText || loading) return

    setInput('')
    const userMsg = { role: 'user', content: userText, display: 'user' }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setLoading(true)

    try {
      // Build API message history (only role + content for API)
      const apiMessages = [
        { role: 'user', content: buildSystemContext() + '\n\nUser question: ' + newMessages[0].content },
        ...newMessages.slice(1).map(m => ({ role: m.role, content: m.content })),
      ]

      // For multi-turn: send proper history
      const apiHistory = newMessages.map(m => ({ role: m.role, content: m.content }))
      // Prepend system as first user message if fresh
      const finalMessages = newMessages.length === 1
        ? [{ role: 'user', content: buildSystemContext() + '\n\nUser question: ' + userText }]
        : [
            { role: 'user', content: buildSystemContext() + '\n\nUser question: ' + newMessages[0].content },
            ...newMessages.slice(1).map(m => ({ role: m.role, content: m.content })),
          ]

      const reply = await callAI(finalMessages)
      setMessages(prev => [...prev, { role: 'assistant', content: reply, display: 'assistant' }])
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I could not reach the elder wisdom right now. Please try again.',
        display: 'error'
      }])
    }
    setLoading(false)
  }

  const clearChat = () => setMessages([])

  return (
    <div style={styles.page}>
      <Header title="Ask an Elder" />

      <div style={styles.chatArea}>

        {/* Welcome state */}
        {messages.length === 0 && (
          <div style={styles.welcome}>
            <div style={styles.welcomeIcon}>🌳</div>
            <div style={styles.welcomeTitle}>Ask the Elders</div>
            <div style={styles.welcomeDesc}>
              Ask any question about culture, traditions, or life wisdom.
              Our AI draws from elder stories shared in this community.
            </div>

            <div style={styles.suggestLabel}>Try asking:</div>
            <div style={styles.suggestList}>
              {SUGGESTED.map((q, i) => (
                <button key={i} style={styles.suggestBtn} onClick={() => sendMessage(q)}>
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map((msg, i) => (
          <div key={i} style={{
            ...styles.msgRow,
            justifyContent: msg.display === 'user' ? 'flex-end' : 'flex-start',
          }}>
            {msg.display !== 'user' && (
              <div style={styles.avatar}>🌳</div>
            )}
            <div style={{
              ...styles.bubble,
              ...(msg.display === 'user' ? styles.userBubble : styles.aiBubble),
              ...(msg.display === 'error' ? styles.errorBubble : {}),
            }}>
              {msg.content}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div style={{ ...styles.msgRow, justifyContent: 'flex-start' }}>
            <div style={styles.avatar}>🌳</div>
            <div style={{ ...styles.bubble, ...styles.aiBubble }}>
              <span style={styles.dots}>
                <span>·</span><span>·</span><span>·</span>
              </span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Clear chat button */}
      {messages.length > 0 && (
        <button style={styles.clearBtn} onClick={clearChat}>
          🗑 Clear chat
        </button>
      )}

      {/* Input bar */}
      <div style={styles.inputBar}>
        <input
          style={styles.input}
          placeholder="Ask about culture, traditions, wisdom..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          disabled={loading}
        />
        <button
          style={{ ...styles.sendBtn, opacity: (!input.trim() || loading) ? 0.5 : 1 }}
          onClick={() => sendMessage()}
          disabled={!input.trim() || loading}
        >
          ↑
        </button>
      </div>

      <BottomNav />
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh', background: '#FDF6EF',
    display: 'flex', flexDirection: 'column', paddingBottom: 130,
  },
  chatArea: {
    flex: 1, padding: '16px 16px 8px', overflowY: 'auto',
  },

  // Welcome screen
  welcome: {
    textAlign: 'center', padding: '24px 8px',
  },
  welcomeIcon: { fontSize: 52, marginBottom: 12 },
  welcomeTitle: {
    fontSize: 22, fontWeight: '700', color: '#5C3D2E', marginBottom: 8,
  },
  welcomeDesc: {
    fontSize: 14, color: '#9C7A5A', lineHeight: 1.6,
    maxWidth: 300, margin: '0 auto 24px',
  },
  suggestLabel: {
    fontSize: 12, fontWeight: '600', color: '#B0956E',
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10,
  },
  suggestList: {
    display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'stretch',
  },
  suggestBtn: {
    background: '#FFF8F0', border: '1px solid #E8D5C0',
    borderRadius: 12, padding: '11px 14px', fontSize: 13,
    color: '#5C3D2E', cursor: 'pointer', textAlign: 'left',
    fontWeight: '500', lineHeight: 1.4,
  },

  // Messages
  msgRow: {
    display: 'flex', alignItems: 'flex-end', gap: 8, marginBottom: 12,
  },
  avatar: {
    width: 32, height: 32, borderRadius: '50%',
    background: '#7F4F24', fontSize: 16,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  bubble: {
    maxWidth: '78%', padding: '11px 14px',
    borderRadius: 16, fontSize: 14, lineHeight: 1.6,
    whiteSpace: 'pre-wrap',
  },
  userBubble: {
    background: '#7F4F24', color: '#FFF8F0',
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    background: '#fff', color: '#3D2B1F',
    border: '1px solid #E8D5C0',
    borderBottomLeftRadius: 4,
  },
  errorBubble: {
    background: '#FCEBEB', color: '#A32D2D',
    border: '1px solid #f5c6c6',
  },

  // Typing dots
  dots: {
    display: 'flex', gap: 3, fontSize: 24, color: '#9C7A5A',
    alignItems: 'center', letterSpacing: 2,
  },

  // Clear button
  clearBtn: {
    background: 'none', border: 'none', color: '#B0956E',
    fontSize: 12, cursor: 'pointer', padding: '4px 16px',
    textAlign: 'right', display: 'block', marginLeft: 'auto',
    marginRight: 16, marginBottom: 4,
  },

  // Input bar
  inputBar: {
    position: 'fixed', bottom: 65, left: '50%',
    transform: 'translateX(-50%)',
    width: '100%', maxWidth: 480,
    padding: '10px 16px',
    background: '#FDF6EF',
    borderTop: '1px solid #E8D5C0',
    display: 'flex', gap: 8, alignItems: 'center',
  },
  input: {
    flex: 1, padding: '11px 16px',
    border: '1.5px solid #E8D5C0', borderRadius: 24,
    fontSize: 14, background: '#fff', color: '#3D2B1F',
    outline: 'none',
  },
  sendBtn: {
    width: 40, height: 40, borderRadius: '50%',
    background: '#7F4F24', color: '#fff',
    border: 'none', fontSize: 18, fontWeight: '700',
    cursor: 'pointer', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
}
