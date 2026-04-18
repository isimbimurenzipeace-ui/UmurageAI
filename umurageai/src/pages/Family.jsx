import Header from '../components/Header'
import BottomNav from '../components/BottomNav'
import { useLang } from '../context/LangContext'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

export default function Family() {
  const { t } = useLang()
  const { user } = useAuth()
  const [familyName, setFamilyName] = useState('')
  const [created, setCreated] = useState(false)

  return (
    <div style={styles.page}>
      <Header title={t.family} />
      <div style={styles.content}>

        {!created ? (
          <div style={styles.setupBox}>
            <div style={styles.setupIcon}>🏡</div>
            <div style={styles.setupTitle}>Create your family space</div>
            <div style={styles.setupDesc}>
              Give your family a name and start sharing private stories together
            </div>
            <input
              style={styles.input}
              placeholder="e.g. Inzu ya Mugenzi"
              value={familyName}
              onChange={e => setFamilyName(e.target.value)}
            />
            <button
              style={{ ...styles.createBtn, opacity: familyName ? 1 : 0.5 }}
              onClick={() => { if (familyName) setCreated(true) }}
            >
              Create family space
            </button>
          </div>
        ) : (
          <>
            <div style={styles.familyHeader}>
              <div style={styles.familyName}>{familyName}</div>
              <div style={styles.lockBadge}>🔒 {t.privateLabel}</div>
            </div>

            <p style={styles.sectionLabel}>{t.members}</p>
            <div style={styles.memberBox}>
              <div style={styles.ownerChip}>
                <div style={styles.memberAvatar}>{user?.name?.[0] || 'U'}</div>
                <span style={styles.memberName}>{user?.name || 'You'} (admin)</span>
              </div>
              <button style={styles.inviteBtn}>{t.invite}</button>
            </div>

            <div style={styles.divider} />

            <p style={styles.sectionLabel}>{t.familyStories}</p>
            <div style={styles.emptyBox}>
              <div style={styles.emptyIcon}>🎙️</div>
              <div style={styles.emptyTitle}>No family stories yet</div>
              <div style={styles.emptyDesc}>
                Record a private story only your family can hear
              </div>
            </div>
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
  setupBox: {
    background: '#FFF8F0', border: '1px dashed #E8D5C0',
    borderRadius: 16, padding: '40px 24px', textAlign: 'center', marginTop: 20,
  },
  setupIcon: { fontSize: 48, marginBottom: 14 },
  setupTitle: { fontSize: 17, fontWeight: 600, color: '#2C1A0E', marginBottom: 8 },
  setupDesc: {
    fontSize: 13, color: '#9C7A5A', lineHeight: 1.6,
    marginBottom: 20, maxWidth: 260, margin: '0 auto 20px',
  },
  input: {
    width: '100%', padding: '12px 14px', marginBottom: 12,
    border: '1px solid #E8D5C0', borderRadius: 10,
    fontSize: 14, background: '#fff', color: '#2C1A0E',
    outline: 'none', textAlign: 'center',
  },
  createBtn: {
    width: '100%', padding: 12, background: '#7F4F24',
    color: '#FFF8F0', border: 'none', borderRadius: 10,
    fontSize: 14, fontWeight: 600, cursor: 'pointer',
  },
  familyHeader: {
    display: 'flex', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 16,
  },
  familyName: { fontSize: 18, fontWeight: 600, color: '#2C1A0E' },
  lockBadge: { fontSize: 12, color: '#9C7A5A' },
  sectionLabel: {
    fontSize: 11, fontWeight: 600, color: '#9C7A5A',
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10,
  },
  memberBox: {
    display: 'flex', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 16,
  },
  ownerChip: {
    display: 'flex', alignItems: 'center', gap: 8,
  },
  memberAvatar: {
    width: 32, height: 32, borderRadius: '50%',
    background: '#E8A87C', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    fontSize: 13, fontWeight: 600, color: '#7F4F24',
  },
  memberName: { fontSize: 13, color: '#2C1A0E' },
  inviteBtn: {
    padding: '6px 14px', border: '0.5px solid #C28048',
    borderRadius: 20, background: 'transparent',
    color: '#7F4F24', fontSize: 12, cursor: 'pointer',
  },
  divider: { height: 1, background: '#E8D5C0', margin: '16px 0' },
  emptyBox: {
    background: '#FFF8F0', border: '1px dashed #E8D5C0',
    borderRadius: 16, padding: '32px 24px', textAlign: 'center',
  },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyTitle: { fontSize: 15, fontWeight: 600, color: '#2C1A0E', marginBottom: 6 },
  emptyDesc: {
    fontSize: 13, color: '#9C7A5A', lineHeight: 1.6,
    maxWidth: 220, margin: '0 auto',
  },
}