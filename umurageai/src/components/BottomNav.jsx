import { useNavigate, useLocation } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { useAuth } from '../context/AuthContext'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function BottomNav() {
  const { t } = useLang()
  const { profileType, user } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [unread, setUnread] = useState(0)

  useEffect(() => {
    if (user) fetchUnread()
  }, [user])

  const fetchUnread = async () => {
    const { count } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_read', false)
    setUnread(count || 0)
  }

  const navItems = [
    { path: '/community', label: t.community, icon: '🌍' },
    { path: '/record', label: t.record, icon: '🎤' },
    { path: '/family', label: t.family, icon: '🏡' },
    { path: '/notifications', label: 'Alerts', icon: '🔔', badge: unread },
    {
      path: profileType === 'elder' ? '/profile/elder' : '/profile/youth',
      label: t.profile, icon: '👤'
    },
  ]

  return (
    <nav style={styles.nav}>
      {navItems.map(({ path, label, icon, badge }) => {
        const active = pathname === path
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            style={{ ...styles.btn, color: active ? '#7F4F24' : '#9C7A5A' }}
          >
            <div style={styles.iconWrap}>
              <span style={styles.icon}>{icon}</span>
              {badge > 0 && (
                <div style={styles.badge}>{badge}</div>
              )}
            </div>
            <span style={{
              ...styles.label,
              fontWeight: active ? 600 : 400
            }}>{label}</span>
            {active && <div style={styles.dot} />}
          </button>
        )
      })}
    </nav>
  )
}

const styles = {
  nav: {
    position: 'fixed', bottom: 0,
    left: '50%', transform: 'translateX(-50%)',
    width: '100%', maxWidth: 480,
    background: '#FFF8F0', borderTop: '1px solid #E8D5C0',
    display: 'flex', justifyContent: 'space-around',
    padding: '10px 0 18px', zIndex: 100,
  },
  btn: {
    background: 'none', border: 'none',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', gap: 3,
    padding: '4px 8px', position: 'relative', cursor: 'pointer',
  },
  iconWrap: { position: 'relative' },
  icon: { fontSize: 20 },
  badge: {
    position: 'absolute', top: -4, right: -6,
    background: '#c0392b', color: '#fff',
    borderRadius: '50%', width: 16, height: 16,
    fontSize: 10, fontWeight: 700,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  label: { fontSize: 10 },
  dot: {
    position: 'absolute', top: 0, left: '50%',
    transform: 'translateX(-50%)',
    width: 4, height: 4, borderRadius: '50%', background: '#7F4F24',
  }
}
