import { useEffect } from 'react';
import { motion } from 'motion/react';
import { Bot, UserCheck, MessageSquare, ShieldCheck, GraduationCap, Users, Headset, TrendingUp, BookOpen, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import ContactForm from '../components/ContactForm';
import ChatWidget from '../components/ChatWidget';
import { useLanguage } from '../context/LanguageContext';

const AgentCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="glass-panel p-8 brushed-metal relative overflow-hidden group"
  >
    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
      <Icon size={80} className="text-lambda-orange" />
    </div>
    <div className="w-12 h-12 bg-lambda-orange/10 rounded-lg flex items-center justify-center text-lambda-orange mb-6">
      <Icon size={24} />
    </div>
    <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
    <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
  </motion.div>
);

const AgentsPage = () => {
  const { t, language, setLanguage } = useLanguage();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const agents = [
    { icon: Bot, ...t.agentsPage.list[0] },
    { icon: UserCheck, ...t.agentsPage.list[1] },
    { icon: MessageSquare, ...t.agentsPage.list[2] },
    { icon: ShieldCheck, ...t.agentsPage.list[3] },
    { icon: GraduationCap, ...t.agentsPage.list[4] },
    { icon: Users, ...t.agentsPage.list[5] },
    { icon: Headset, ...t.agentsPage.list[6] },
    { icon: TrendingUp, ...t.agentsPage.list[7] },
    { icon: BookOpen, ...t.agentsPage.list[8] }
  ];

  return (
    <div className="min-h-screen bg-[#07090D] selection:bg-lambda-orange/30 py-20 px-6">
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

        <div className="mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tighter">
            {t.agentsPage.title.split('AI-агентов')[0]} <span className="text-lambda-orange">AI Agents</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl leading-relaxed">
            {t.agentsPage.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent, index) => (
            <AgentCard key={index} {...agent} />
          ))}
        </div>

        <div className="mt-20 glass-panel p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">{t.agentsPage.notFoundTitle}</h2>
          <p className="text-slate-400 mb-12 max-w-2xl mx-auto">
            {t.agentsPage.notFoundDesc}
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

export default AgentsPage;
