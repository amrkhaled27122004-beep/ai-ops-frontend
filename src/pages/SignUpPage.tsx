import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import Logo from '@/components/Logo';
import { useAuth } from '@/context/AuthContext';

export default function SignUpPage() {
  const { signUp, demoSignIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const { error: signUpError } = await signUp(email, password);
    setLoading(false);

    if (signUpError) {
      setError(signUpError);
    } else {
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 1500);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-cyber-bg cyber-grid-bg flex items-center justify-center px-6">
        <div className="cyber-card p-8 max-w-md text-center animate-slide-up">
          <CheckCircle2 className="w-12 h-12 text-cyber-green mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-white mb-2">Account Created</h1>
          <p className="text-sm text-slate-400 mb-4">
            Your operator account is ready. Redirecting to the Operations Center...
          </p>
          <Loader2 className="w-5 h-5 text-cyber-cyan animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cyber-bg cyber-grid-bg flex flex-col">
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-8">
            <Logo size="lg" />
          </div>

          <div className="cyber-card p-8 animate-slide-up">
            <h1 className="text-xl font-semibold text-white mb-1">Create Operator Account</h1>
            <p className="text-sm text-slate-500 mb-6">Deploy AI Ops across your infrastructure.</p>

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

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-500 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-cyber-bg border border-cyber-border rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyber-cyan/50 focus:ring-1 focus:ring-cyber-cyan/30 transition-all"
                    placeholder="At least 6 characters"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-500 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-cyber-bg border border-cyber-border rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyber-cyan/50 focus:ring-1 focus:ring-cyber-cyan/30 transition-all"
                    placeholder="••••••••"
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
                    Create Account
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-cyber-border text-center">
              <span className="text-sm text-slate-500">Already an operator? </span>
              <Link to="/sign-in" className="text-sm text-cyber-cyan hover:underline">
                Sign in
              </Link>
            </div>

            <button
              onClick={demoSignIn}
              className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-cyber-border text-slate-400 text-sm font-medium hover:text-cyber-cyan hover:border-cyber-cyan/30 transition-all"
            >
              Explore Demo Mode — No Account Needed
            </button>
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
