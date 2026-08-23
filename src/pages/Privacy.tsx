import { useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ShieldCheck, Lock, Eye, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import ChatWidget from '../components/ChatWidget';
import { useLanguage } from '../context/LanguageContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const PrivacyPage = () => {
  const { t, language, setLanguage } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen page-shell selection:bg-lambda-orange/30 py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-slate-400 hover:text-lambda-orange transition-colors group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            {t.agentsPage.back}
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-8 md:p-12 brushed-metal"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-lambda-orange/10 flex items-center justify-center text-lambda-orange">
              <FileText size={24} />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tighter">
              {language === 'ru' ? 'Политика ' : 'Privacy '}<span className="text-lambda-orange">{language === 'ru' ? 'конфиденциальности' : 'Policy'}</span>
            </h1>
          </div>

          <div className="space-y-8 text-slate-300 leading-relaxed">
            {t.privacyPage.sections.map((section, idx) => (
              <section key={idx}>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  {idx === 0 && <ShieldCheck size={20} className="text-lambda-orange" />}
                  {idx === 1 && <Lock size={20} className="text-lambda-orange" />}
                  {idx === 2 && <Eye size={20} className="text-lambda-orange" />}
                  {section.title}
                </h2>
                <div className={cn(
                  idx === 2 && "p-4 bg-lambda-orange/5 border border-lambda-orange/20 rounded-xl text-slate-200 italic"
                )}>
                  <p>{section.content}</p>
                </div>
                {section.list && (
                  <ul className="list-disc pl-6 mt-4 space-y-2">
                    {section.list.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}

            <div className="pt-8 border-t border-white/10 text-xs text-slate-500 font-mono uppercase tracking-widest">
              {t.privacyPage.update}
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
      <ChatWidget />
    </div>
  );
};

export default PrivacyPage;
