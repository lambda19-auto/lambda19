import { useEffect } from 'react';
import { motion } from 'motion/react';
import { Mail, Send, ArrowLeft, MapPin, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import ContactForm from '../components/ContactForm';
import ChatWidget from '../components/ChatWidget';
import { useLanguage } from '../context/LanguageContext';

const ContactMethod = ({ icon: Icon, label, value, href }: { icon: any, label: string, value: string, href: string }) => (
  <motion.a 
    href={href}
    target={href.startsWith('http') ? "_blank" : undefined}
    rel={href.startsWith('http') ? "noopener noreferrer" : undefined}
    whileHover={{ y: -5 }}
    className="glass-panel p-8 brushed-metal flex flex-col items-center text-center group hover:border-lambda-orange/30 transition-all duration-300"
  >
    <div className="w-14 h-14 rounded-xl bg-lambda-orange/10 flex items-center justify-center text-lambda-orange mb-6 group-hover:bg-lambda-orange/20 transition-colors">
      <Icon size={28} />
    </div>
    <span className="text-xs font-mono text-lambda-orange uppercase tracking-widest mb-2 opacity-70">{label}</span>
    <span className="text-xl font-bold text-white group-hover:text-lambda-orange transition-colors">{value}</span>
  </motion.a>
);

const ContactsPage = () => {
  const { t, language, setLanguage } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
            {language === 'ru' ? 'Свяжитесь с ' : 'Contact '}<span className="text-lambda-orange">{language === 'ru' ? 'нами' : 'Us'}</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl leading-relaxed">
            {t.contactsPage.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-20">
          <ContactMethod 
            icon={Mail} 
            label="E-mail" 
            value="consult@lambda19.org" 
            href="mailto:consult@lambda19.org" 
          />
          <ContactMethod 
            icon={Send} 
            label="Telegram" 
            value="@lambda19_main" 
            href="https://t.me/lambda19_main" 
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start mb-32">
          <div className="glass-panel p-10 brushed-metal h-full">
            <h2 className="text-3xl font-bold text-white mb-8">{t.contactsPage.officeTitle}</h2>
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-lambda-orange">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2 text-lg">{t.contactsPage.locationTitle}</h4>
                  <p className="text-slate-400 leading-relaxed">
                    {t.contactsPage.locationDesc}
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-lambda-orange">
                  <MessageSquare size={24} />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2 text-lg">{t.contactsPage.supportTitle}</h4>
                  <p className="text-slate-400 leading-relaxed">
                    {t.contactsPage.supportDesc}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-12 p-6 rounded-2xl bg-lambda-orange/5 border border-lambda-orange/20">
              <p className="text-sm text-slate-300 italic">
                "{t.contactsPage.quote}"
              </p>
            </div>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-white mb-6">{t.contactsPage.formTitle}</h2>
            <p className="text-slate-400 mb-10 text-lg">
              {t.contactsPage.formDesc}
            </p>
            <ContactForm />
          </div>
        </div>
      </div>
      <Footer />
      <ChatWidget />
    </div>
  );
};

export default ContactsPage;
