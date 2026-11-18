// تم إلغاء الاعتماد على Supabase واستخدام سيرفر الـ API الخاص بالفريق
export const supabase = {
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signInWithPassword: async () => ({ error: { message: 'Use custom API' } }),
    signUp: async () => ({ error: { message: 'Use custom API' } }),
    signOut: async () => ({}),
  },
};