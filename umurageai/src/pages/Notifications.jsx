import { useState, useEffect } from 'react'
import Header from '../components/Header'
import BottomNav from '../components/BottomNav'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function Notifications() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) fetchNotifications()
  }, [user])

  const fetchNotifications = async () => {
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    setNotifications(data || [])
    setLoading(false)

    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
  }

  const getIcon = (type) => {
    switch (type) {
      case 'welcome': return '🌳'
      case 'story': return '🎙️'
      case 'family': return '🏡'
      case 'follow': return '👤'
      default: return '🔔'
    }
  }

  const formatDate = (date) => {
    const d = new Date(date)
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <div style={styles.page}>
      <Header title="Notifications" />
      <div style={styles.content}>

        {loading ? (
          <div style={styles.loading}>Loading...</div>
        ) : notifications.length === 0 ? (
          <div style={styles.emptyBox}>
            <div style={styles.emptyIcon}>🔔</div>
            <div style={styles.emptyTitle}>No notifications yet</div>
            <div style={styles.emptyDesc}>
              You will be notified when someone shares a story or joins your family
            </div>
          </div>
        ) : (
          notifications.map(n => (
            <div key={n.id} style={{
              ...styles.card,
              background: n.is_read ? '#FFF8F0' : '#FDF0E0',
            }}>
              <div style={styles.cardLeft}>
                <div style={styles.icon}>{getIcon(n.type)}</div>
              </div>
              <div style={styles.cardRight}>
                <div style={styles.nTitle}>{n.title}</div>
                <div style={styles.nMessage}>{n.message}</div>
                <div style={styles.nDate}>{formatDate(n.created_at)}</div>
              </div>
              {!n.is_read && <div style={styles.unreadDot} />}
            </div>
          ))
        )}

      </div>
      <BottomNav />
    </div>
  )
}

const styles = {
  page: { minHeight: '100vh', background: '#FDF6EF', paddingBottom: 80 },
  content: { padding: 16 },
  loading: { textAlign: 'center', color: '#9C7A5A', padding: 40 },
  emptyBox: {
    background: '#FFF8F0', border: '1px dashed #E8D5C0',
    borderRadius: 16, padding: '40px 24px', textAlign: 'center', marginTop: 20,
  },
  emptyIcon: { fontSize: 48, marginBottom: 14 },
  emptyTitle: { fontSize: 17, fontWeight: 600, color: '#2C1A0E', marginBottom: 8 },
  emptyDesc: {
    fontSize: 13, color: '#9C7A5A', lineHeight: 1.6,
    maxWidth: 240, margin: '0 auto',
  },
  card: {
    borderRadius: 12, padding: '14px 12px',
    marginBottom: 10, display: 'flex',
    alignItems: 'flex-start', gap: 12,
    border: '0.5px solid #E8D5C0',
    position: 'relative',
  },
  cardLeft: { flexShrink: 0 },
  icon: { fontSize: 28 },
  cardRight: { flex: 1 },
  nTitle: { fontSize: 14, fontWeight: 600, color: '#2C1A0E', marginBottom: 3 },
  nMessage: { fontSize: 13, color: '#6B4226', lineHeight: 1.5, marginBottom: 4 },
  nDate: { fontSize: 11, color: '#9C7A5A' },
  unreadDot: {
    width: 8, height: 8, borderRadius: '50%',
    background: '#C28048', position: 'absolute',
    top: 14, right: 12,
  },
}