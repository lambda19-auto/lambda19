import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, ArrowLeft, Key, User, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function Login() {
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect to admin immediately
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      // Fast check
      fetch('/api/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          navigate('/admin');
        } else {
          localStorage.removeItem('admin_token');
        }
      })
      .catch(() => {
        // Fallback: stay on page
      });
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('admin_token', data.token);
        navigate('/admin');
      } else {
        setError(data.message || (language === 'ru' ? 'Неверный логин или пароль' : 'Invalid username or password'));
      }
    } catch {
      setError(language === 'ru' ? 'Ошибка связи с сервером. Попробуйте еще раз.' : 'Server connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loginText = (t as any).auth || {
    title: language === 'ru' ? "Вход в панель управления" : "Control Panel Login",
    subtitle: language === 'ru' ? "Авторизуйтесь для доступа к лидам и настройкам агентов" : "Authorize to access leads and agent configurations",
    username: language === 'ru' ? "Имя пользователя" : "Username",
    usernamePlaceholder: language === 'ru' ? "Введите логин" : "Enter login",
    password: language === 'ru' ? "Пароль" : "Password",
    passwordPlaceholder: language === 'ru' ? "Введите пароль" : "Enter password",
    submit: language === 'ru' ? "Войти в систему" : "Sign In",
    loading: language === 'ru' ? "Вход..." : "Signing in...",
    credentialsHint: language === 'ru' ? "Используйте учётные данные, заданные администратором." : "Use the credentials configured by your administrator.",
  };

  return (
    <div className="min-h-screen bg-[#07090D] text-white selection:bg-lambda-orange/30 flex flex-col justify-between py-12 px-6 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-lambda-orange/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header with back navigation and language toggle */}
      <div className="max-w-md w-full mx-auto flex justify-between items-center z-10 mb-8">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-slate-400 hover:text-lambda-orange transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          {language === 'ru' ? 'На главную' : 'Home'}
        </Link>
        
        <div className="flex items-center gap-2 bg-white/5 rounded-full p-1 border border-white/10">
          <button 
            onClick={() => setLanguage('ru')}
            className={`px-3 py-1 rounded-full text-xs transition-all ${language === 'ru' ? 'bg-lambda-orange text-[#090B0F]' : 'text-slate-400 hover:text-white'}`}
          >
            RU
          </button>
          <button 
            onClick={() => setLanguage('en')}
            className={`px-3 py-1 rounded-full text-xs transition-all ${language === 'en' ? 'bg-lambda-orange text-[#090B0F]' : 'text-slate-400 hover:text-white'}`}
          >
            EN
          </button>
        </div>
      </div>

      {/* Login Card */}
      <div className="flex-grow flex items-center justify-center z-10 my-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-panel brushed-metal p-10 rounded-2xl w-full max-w-md border border-white/10 hover:border-lambda-orange/20 transition-all duration-300 shadow-2xl"
        >
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-lambda-orange/10 border border-lambda-orange/25 flex items-center justify-center text-lambda-orange mb-4 shadow-inner">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
              {loginText.title}
            </h1>
            <p className="text-sm text-slate-400 max-w-xs">
              {loginText.subtitle}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl flex items-start gap-3 text-sm"
              >
                <AlertCircle className="shrink-0 mt-0.5" size={18} />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Username Input */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-widest text-slate-400 block font-medium">
                {loginText.username}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                  <User size={18} />
                </div>
                <input 
                  id="username_field"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={loginText.usernamePlaceholder}
                  className="w-full bg-white/5 border border-white/10 focus:border-lambda-orange/50 focus:ring-1 focus:ring-lambda-orange/50 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder-slate-500 outline-none transition-all text-sm"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-widest text-slate-400 block font-medium">
                {loginText.password}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                  <Key size={18} />
                </div>
                <input 
                  id="password_field"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={loginText.passwordPlaceholder}
                  className="w-full bg-white/5 border border-white/10 focus:border-lambda-orange/50 focus:ring-1 focus:ring-lambda-orange/50 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder-slate-500 outline-none transition-all text-sm"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="submit_login"
              type="submit"
              disabled={loading}
              className="w-full bg-lambda-orange hover:brightness-110 text-[#090B0F] font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-lambda-orange/20 transition-all duration-300 flex justify-center items-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? loginText.loading : loginText.submit}
            </button>
          </form>

          {/* Credentials hint */}
          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <span className="inline-block text-xs font-mono text-lambda-orange/80 bg-lambda-orange/5 border border-lambda-orange/10 px-3 py-1.5 rounded-lg">
              <Key size={12} className="inline mr-1" /> {loginText.credentialsHint}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Footer copyright section */}
      <div className="text-center text-xs text-slate-600 z-10 mt-8">
        &copy; {new Date().getFullYear()} lambda19. {language === 'ru' ? 'Все права защищены.' : 'All rights reserved.'}
      </div>
    </div>
  );
}
