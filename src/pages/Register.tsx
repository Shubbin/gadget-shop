import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  User, Mail, Phone, Lock, Eye, EyeOff, ArrowRight, Gift
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/account';

  const { register, isAuthenticated } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('Ikeja');
  const [state, setState] = useState('Lagos');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectPath]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Password should be at least 6 characters long.');
      return;
    }
    setIsLoading(true);
    const res = await register({ name, email, phone, password, city, state, address: `${city}, ${state}` });
    if (res.success) {
      navigate(redirectPath, { replace: true });
    } else {
      setError(res.message || 'Registration failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-50/50">
      <div className="w-full max-w-md bg-white rounded-3xl border border-purple-100 p-8 sm:p-10 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold">
            <Gift className="w-3.5 h-3.5 text-purple-600" />
            ₦15,000 Welcome Wallet Credit
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Create Customer Account
          </h1>
          <p className="text-xs text-gray-500 max-w-xs mx-auto">
            Quick sign up in under 30 seconds. Track orders live, swap devices, and request repairs.
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3.5 rounded-2xl font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Full Name *</label>
            <div className="relative">
              <input type="text" required placeholder="e.g. Babatunde Lawal" value={name} onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition-all font-medium" />
              <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Email Address *</label>
            <div className="relative">
              <input type="email" required placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition-all font-medium" />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Phone / WhatsApp Number *</label>
            <div className="relative">
              <input type="tel" required placeholder="+234 800 000 0000" value={phone} onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition-all font-medium" />
              <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">City</label>
              <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Ikeja"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-3 text-xs sm:text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-600" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">State</label>
              <select value={state} onChange={(e) => setState(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-3 text-xs sm:text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-600 font-medium">
                <option>Lagos</option>
                <option>Abuja</option>
                <option>Rivers</option>
                <option>Oyo</option>
                <option>Ogun</option>
                <option>Kano</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Create Password *</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} required placeholder="At least 6 characters" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-10 text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition-all font-medium" />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={isLoading}
            className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-sm shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-60">
            {isLoading ? 'Creating Account...' : 'Complete Registration'}
            {!isLoading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="pt-3 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-500">
            Already have an account?{' '}
            <Link to={`/login?redirect=${encodeURIComponent(redirectPath)}`} className="text-purple-600 hover:text-purple-700 font-bold underline">
              Sign In Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
