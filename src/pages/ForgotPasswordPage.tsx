import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, AlertCircle, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import Logo from '@/components/Logo';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // محاكاة إرسال طلب استعادة كلمة المرور أو ربطه بسيرفر صاحبك لاحقاً
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSent(true);
    } catch (err: any) {
      setError('تعذر إرسال طلب الاستعادة، تأكد من البيانات.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cyber-bg cyber-grid-bg flex flex-col">
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-8">
            <Logo size="lg" />
          </div>

          <div className="cyber-card p-8 animate-slide-up">
            {sent ? (
              <div className="text-center py-4">
                <CheckCircle2 className="w-12 h-12 text-cyber-green mx-auto mb-4" />
                <h1 className="text-xl font-semibold text-white mb-2">Recovery Email Sent</h1>
                <p className="text-sm text-slate-400 mb-6">
                  Check your inbox at <span className="text-cyber-cyan font-mono">{email}</span> for
                  instructions to reset your password.
                </p>
                <Link
                  to="/sign-in"
                  className="inline-flex items-center gap-2 text-sm text-cyber-cyan hover:underline"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to sign in
                </Link>
              </div>
            ) : (
              <>
                <h1 className="text-xl font-semibold text-white mb-1">Reset Password</h1>
                <p className="text-sm text-slate-500 mb-6">
                  Enter your operator email and we'll send you a secure recovery link.
                </p>

                {error && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 mb-4">
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <span className="text-sm text-red-400">{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-500 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full pl-10 pr-4 py-3 bg-cyber-bg border border-cyber-border rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyber-cyan/50 focus:ring-1 focus:ring-cyber-cyan/30 transition-all"
                        placeholder="operator@aiops.io"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-gradient-to-r from-cyber-cyan to-cyber-teal text-cyber-bg font-semibold transition-all hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        Send Recovery Link
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-6 pt-6 border-t border-cyber-border text-center">
                  <Link to="/sign-in" className="text-sm text-cyber-cyan hover:underline">
                    Back to sign in
                  </Link>
                </div>
              </>
            )}
          </div>

          <div className="mt-6 text-center">
            <Link to="/" className="text-xs font-mono text-slate-600 hover:text-slate-400 transition-colors">
              ← Back to landing
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}