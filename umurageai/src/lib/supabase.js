import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://aivhcvrlzggizdiysvay.supabase.co'
const supabaseKey = 'sb_publishable_JLLwyp59iFBkQf_21TQMHA_SKcI7p34'

export const supabase = createClient(supabaseUrl, supabaseKey)