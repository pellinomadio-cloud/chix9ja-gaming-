
import React, { useState } from 'react';
import { Icons } from './Icons';

interface RegisterProps {
  onRegister: (name: string, email: string, pin: string) => Promise<void>;
  onSwitchToLogin: () => void;
  onGoogleSignIn?: () => void;
}

const Register: React.FC<RegisterProps> = ({ onRegister, onSwitchToLogin, onGoogleSignIn }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and max 4 digits
    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
    setPassword(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length !== 4) {
      setError('Password must be exactly 4 digits');
      return;
    }

    setIsLoading(true);
    try {
      await onRegister(name, email, password);
      setIsLoading(false);
    } catch (err: any) {
      setError(err?.message || 'Registration failed.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 transition-colors duration-200">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
           <div className="mx-auto h-16 w-16 bg-green-glow rounded-full flex items-center justify-center mb-4 shadow-lg">
            <span className="text-black font-bold text-2xl italic">Cx</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white">Create Account</h2>
          <p className="mt-2 text-sm text-gray-400">
            Join chix9ja and get <span className="text-green-glow font-bold">₦10,000</span> bonus instantly!
          </p>
        </div>

        {onGoogleSignIn && (
          <div className="mt-6">
            <button
              type="button"
              onClick={onGoogleSignIn}
              className="w-full flex justify-center items-center py-3 px-4 border border-gray-800 text-sm font-bold rounded-full text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-glow shadow-lg transition-all cursor-pointer"
            >
              <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5.04c1.65 0 3.13.57 4.3 1.69l3.22-3.22c-2.1-1.95-4.82-3.14-7.52-3.14-4.57 0-8.49 2.59-10.42 6.37l3.96 3.07c.91-2.73 3.47-4.77 6.46-4.77z"
                />
                <path
                  fill="#4285F4"
                  d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.4 3.58l3.76 2.91c2.19-2.03 3.47-5.01 3.47-8.64z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.58 14.54c-.23-.69-.36-1.42-.36-2.18s.13-1.49.36-2.18L1.62 7.11C.59 9.17 0 11.47 0 13.82s.59 4.65 1.62 6.71l3.96-3.07c-.12-.29-.22-.59-.32-.91l.32.91z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.24 0 5.95-1.07 7.93-2.91l-3.76-2.91c-1.12.75-2.55 1.2-4.17 1.2-2.99 0-5.55-2.04-6.46-4.77l-3.96 3.07C3.51 20.41 7.43 23 12 23z"
                />
              </svg>
              Sign Up with Google
            </button>
            <div className="relative my-6 flex items-center justify-center">
              <div className="absolute inset-x-0 h-px bg-gray-800"></div>
              <span className="relative bg-black px-4 text-xs uppercase tracking-widest text-gray-500">Or with secure PIN</span>
            </div>
          </div>
        )}

        <form className="mt-4 space-y-5" onSubmit={handleSubmit}>
            
            {error && (
              <div className="bg-red-900/20 text-red-400 text-sm p-3 rounded-lg text-center border border-red-800">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="name" className="sr-only">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icons.User className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-3 border border-gray-800 placeholder-gray-500 text-white bg-gray-900 focus:outline-none focus:ring-green-glow focus:border-green-glow sm:text-sm transition-all"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icons.Mail className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-3 border border-gray-800 placeholder-gray-500 text-white bg-gray-900 focus:outline-none focus:ring-green-glow focus:border-green-glow sm:text-sm transition-all"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="sr-only">4-digit PIN</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icons.Lock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={4}
                  required
                  className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-3 border border-gray-800 placeholder-gray-500 text-white bg-gray-900 focus:outline-none focus:ring-green-glow focus:border-green-glow sm:text-sm transition-all tracking-widest"
                  placeholder="Create 4-digit PIN"
                  value={password}
                  onChange={handlePasswordChange}
                />
              </div>
            </div>

            <div className="flex items-center">
                <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    className="h-4 w-4 text-green-glow focus:ring-green-glow border-gray-800 rounded bg-gray-900"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-400">
                    I agree to the <a href="#" className="text-green-glow hover:text-green-light font-bold">Terms</a> and <a href="#" className="text-green-glow hover:text-green-light font-bold">Privacy Policy</a>
                </label>
            </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-full text-black bg-green-glow hover:bg-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-glow shadow-lg transition-all disabled:opacity-70"
            >
              {isLoading ? 'Creating Account...' : 'Get Started'}
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
            <p className="text-sm text-gray-400">
                Already have an account?{' '}
                <button onClick={onSwitchToLogin} className="font-bold text-green-glow hover:text-green-light">
                    Login here
                </button>
            </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
