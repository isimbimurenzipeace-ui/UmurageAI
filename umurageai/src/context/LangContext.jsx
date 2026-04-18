import { createContext, useContext, useState } from 'react'

export const translations = {
  en: {
    appName: 'UmurageAI',
    tagline: 'Bridging generations, one story at a time',
    community: 'Community',
    record: 'Record',
    family: 'Family',
    profile: 'Profile',
    recentStories: 'Recent stories',
    tapRecord: 'Tap to record',
    tapStop: 'Tap to stop',
    publicLabel: 'Public',
    privateLabel: 'Private',
    familyOnly: 'Family only',
    sharedAll: 'Shared with all',
    members: 'Members',
    familyStories: 'Family stories',
    storyKeeper: 'Story Keeper',
    storySeeker: 'Story Seeker',
    elder: 'Elder',
    youth: 'Youth',
    chooseProfile: 'Who are you?',
    iAmElder: 'I am an Elder',
    iAmYouth: 'I am Youth',
    elderDesc: 'I have stories to share with the next generation',
    youthDesc: 'I want to learn from the wisdom of my elders',
    login: 'Sign In',
    signup: 'Create Account',
    email: 'Email address',
    password: 'Password',
    name: 'Full name',
    noAccount: 'No account yet?',
    hasAccount: 'Already have an account?',
    welcome: 'Welcome back',
    invite: '+ Invite member',
    askElder: 'Ask an Elder',
    listenStory: 'Listen',
    aiTranscript: 'AI transcript available in EN & RW',
    autoTranscribe: 'Auto-transcribe (EN + RW)',
    autoTranslate: 'Auto-translate',
    generateSummary: 'Generate story summary',
    visibility: 'Visibility',
    aiOptions: 'AI options',
  },
  rw: {
    appName: 'UmurageAI',
    tagline: 'Guhuza ibihe, inkuru imwe ku nkuru',
    community: 'Iteraniro',
    record: 'Fata',
    family: 'Umuryango',
    profile: 'Umwirondoro',
    recentStories: 'Inkuru za vuba',
    tapRecord: 'Kanda wifatire',
    tapStop: 'Kanda uhagarike',
    publicLabel: 'Rusange',
    privateLabel: 'Ibanga',
    familyOnly: 'Umuryango gusa',
    sharedAll: 'Basangiye bose',
    members: 'Abanyamuryango',
    familyStories: 'Inkuru z\'umuryango',
    storyKeeper: 'Umubitsi w\'Inkuru',
    storySeeker: 'Ushaka Inkuru',
    elder: 'Umukuru',
    youth: 'Urubyiruko',
    chooseProfile: 'Ni nde uriwe?',
    iAmElder: 'Ndi Umukuru',
    iAmYouth: 'Ndi Urubyiruko',
    elderDesc: 'Mfite inkuru zo gusangira n\'ikiremwa k\'ejo',
    youthDesc: 'Ndashaka kwiga ubwenge bw\'abasaza banjye',
    login: 'Injira',
    signup: 'Fungura Konti',
    email: 'Imeyili',
    password: 'Ijambo ry\'ibanga',
    name: 'Amazina yose',
    noAccount: 'Nta konti ufite?',
    hasAccount: 'Usanzwe ufite konti?',
    welcome: 'Murakaza neza',
    invite: '+ Zaprania umunyamuryango',
    askElder: 'Baza Umukuru',
    listenStory: 'Umva',
    aiTranscript: 'Inyandiko ya AI iri muri EN na RW',
    autoTranscribe: 'Andika vuba (EN + RW)',
    autoTranslate: 'Hindura ururimi',
    generateSummary: 'Kora incamake y\'inkuru',
    visibility: 'Ibirerekwa',
    aiOptions: 'Ibishoboka bya AI',
  }
}

const LangContext = createContext()

export function LangProvider({ children }) {
  const [lang, setLang] = useState('en')
  const t = translations[lang]
  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}