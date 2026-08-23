import { useEffect } from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Eye, Server, CheckCircle, ArrowLeft, ShieldCheck, Database } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import ChatWidget from '../components/ChatWidget';

import { useLanguage } from '../context/LanguageContext';

const SecurityCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="glass-panel p-8 brushed-metal group hover:border-lambda-orange/30 transition-all duration-300"
  >
    <div className="w-12 h-12 rounded-lg bg-lambda-orange/10 flex items-center justify-center mb-6 group-hover:bg-lambda-orange/20 transition-colors">
      <Icon className="text-lambda-orange" size={24} />
    </div>
    <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
    <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
  </motion.div>
);

const SecurityPage = () => {
  const { t, language, setLanguage } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const standards = [
    { icon: Lock, ...t.securityPage.list[0] },
    { icon: Server, ...t.securityPage.list[1] },
    { icon: Database, ...t.securityPage.list[2] },
    { icon: Eye, ...t.securityPage.list[3] },
    { icon: ShieldCheck, ...t.securityPage.list[4] },
    { icon: CheckCircle, ...t.securityPage.list[5] }
  ];

  return (
    <div className="min-h-screen page-shell selection:bg-lambda-orange/30 py-20 px-6">
      <div className="max-w-7xl mx-auto">
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

        <div className="mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lambda-orange/10 border border-lambda-orange/20 text-lambda-orange text-xs font-mono mb-6 uppercase tracking-widest">
            <Shield size={14} />
            {t.securityPage.badge}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tighter">
            {language === 'ru' ? 'Безопасность ' : 'lambda19 '}<span className="text-lambda-orange">{language === 'ru' ? 'lambda19' : 'Security'}</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl leading-relaxed">
            {t.securityPage.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-32">
          {standards.map((item, index) => (
            <SecurityCard key={index} {...item} />
          ))}
        </div>

        <div className="glass-panel p-12 brushed-metal text-center mb-32 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Shield size={200} className="text-lambda-orange" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-6">{t.securityPage.bottomTitle}</h2>
          <p className="text-slate-400 mb-8 max-w-2xl mx-auto text-lg">
            {t.securityPage.bottomDesc}
          </p>
        </div>
      </div>
      <Footer />
      <ChatWidget />
    </div>
  );
};

export default SecurityPage;
