import { createContext, useContext, useState, type ReactNode } from 'react';

interface User {
  email: string;
  name?: string;
}

interface AuthContextValue {
  user: User | null;
  session: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  demoSignIn: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// رابط الباك إند الخاص بسيرفر صاحبك
const BASE_URL = 'https://ziad360-001-site1.ktempurl.com/api';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [session, setSession] = useState<any | null>(() => {
    const token = localStorage.getItem('token');
    return token ? { token } : null;
  });
  
  const [loading, setLoading] = useState<boolean>(false);

  // دالة تسجيل الدخول الحقيقية
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.message || data.error || 'فشل تسجيل الدخول، تأكد من البيانات.' };
      }

      // لو السيرفر رجع توكن بنجاح بنحفظه
      if (data.token || data.access_token) {
        const token = data.token || data.access_token;
        localStorage.setItem('token', token);
        setSession({ token });
      }

      const userData = { email, name: data.name || email.split('@')[0] };
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);

      return { error: null };
    } catch (err) {
      console.error(err);
      return { error: 'تعذر الاتصال بالسيرفر، تأكد من الإنترنت أو حالة السيرفر.' };
    } finally {
      setLoading(false);
    }
  };

  // دالة إنشاء حساب حقيقية
  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.message || data.error || 'فشل إنشاء الحساب.' };
      }

      return { error: null };
    } catch (err) {
      console.error(err);
      return { error: 'تعذر الاتصال بالسيرفر، تأكد من الإنترنت أو حالة السيرفر.' };
    } finally {
      setLoading(false);
    }
  };

  // تسجيل الخروج
  const signOut = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setSession(null);
  };

  const demoSignIn = () => {
    const demo = { email: 'operator@aiops.io' };
    setUser(demo);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut, demoSignIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}