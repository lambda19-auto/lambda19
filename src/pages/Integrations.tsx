import { useEffect } from 'react';
import { motion } from 'motion/react';
import { Globe, MessageSquare, Layout, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import ContactForm from '../components/ContactForm';
import ChatWidget from '../components/ChatWidget';

import { useLanguage } from '../context/LanguageContext';

const IntegrationCard = ({ icon: Icon, title, description, features }: { icon: any, title: string, description: string, features: string[] }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="glass-panel p-8 brushed-metal relative overflow-hidden group"
  >
    <div className="w-14 h-14 bg-lambda-orange/10 rounded-xl flex items-center justify-center text-lambda-orange mb-8 group-hover:bg-lambda-orange/20 transition-colors">
      <Icon size={28} />
    </div>
    <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
    <p className="text-slate-400 mb-8 leading-relaxed">{description}</p>
    <ul className="space-y-3">
      {features.map((feature, i) => (
        <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
          <div className="w-1.5 h-1.5 rounded-full bg-lambda-orange" />
          {feature}
        </li>
      ))}
    </ul>
  </motion.div>
);

const IntegrationsPage = () => {
  const { t, language, setLanguage } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const integrations = [
    { icon: Globe, ...t.integrationsPage.list[0] },
    { icon: Layout, ...t.integrationsPage.list[1] },
    { icon: MessageSquare, ...t.integrationsPage.list[2] }
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
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tighter">
            {language === 'ru' ? 'Решения по ' : 'Integration '}<span className="text-lambda-orange">{language === 'ru' ? 'интеграции' : 'Solutions'}</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl leading-relaxed">
            {t.integrationsPage.subtitle}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-32">
          {integrations.map((item, index) => (
            <IntegrationCard key={index} {...item} />
          ))}
        </div>

        <div className="mt-20 glass-panel p-12 text-center mb-32">
          <h2 className="text-4xl font-bold text-white mb-6">{t.integrationsPage.ctaTitle}</h2>
          <p className="text-slate-400 mb-12 max-w-2xl mx-auto text-lg">
            {t.integrationsPage.ctaDesc}
          </p>
          <div className="max-w-3xl mx-auto">
            <ContactForm />
          </div>
        </div>
      </div>
      <Footer />
      <ChatWidget />
    </div>
  );
};

export default IntegrationsPage;
