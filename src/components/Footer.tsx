import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-white/5 py-20 px-6 bg-[#07090D]">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
        <div className="col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <img src="/lambda19-mark.svg" alt="" className="w-8 h-8 gold-logo-glow" />
            <span className="text-xl font-bold tracking-tighter text-white">lambda19</span>
          </div>
          <p className="text-slate-500 text-sm max-w-sm leading-relaxed">
            {t.footer.desc}
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-6">{t.footer.product}</h4>
          <ul className="space-y-4 text-sm text-slate-500">
            <li><Link to="/agents" className="hover:text-lambda-orange transition-colors">{t.footer.agents}</Link></li>
            <li><Link to="/integrations" className="hover:text-lambda-orange transition-colors">{t.footer.integrations}</Link></li>
            <li><Link to="/security" className="hover:text-lambda-orange transition-colors">{t.footer.security}</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-6">{t.footer.company}</h4>
          <ul className="space-y-4 text-sm text-slate-500">
            <li><Link to="/#home" className="hover:text-lambda-orange transition-colors">{t.footer.about}</Link></li>
            <li><Link to="/privacy" className="hover:text-lambda-orange transition-colors">{t.footer.privacy}</Link></li>
            <li><Link to="/contacts" className="hover:text-lambda-orange transition-colors">{t.footer.contacts}</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-600 font-mono uppercase tracking-widest">
        <div>© 2026 lambda19 Systems Inc. {t.footer.rights}</div>
        <div className="flex gap-8">
          <a 
            href="https://github.com/lambda19-auto" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-white transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
