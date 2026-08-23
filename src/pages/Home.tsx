import { useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Cpu, 
  Shield, 
  BarChart3, 
  ArrowRight, 
  Layers, 
  Workflow, 
  Database,
  Terminal,
  ChevronLeft,
  ChevronRight,
  Search,
  BrainCircuit,
  Blocks,
  RefreshCcw
} from 'lucide-react';
import ChatWidget from '../components/ChatWidget';
import { useLanguage } from '../context/LanguageContext';

import Footer from '../components/Footer';
import ContactForm from '../components/ContactForm';

const FeatureCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="glass-panel p-8 brushed-metal group hover:border-lambda-orange/30 transition-all duration-300"
  >
    <div className="w-12 h-12 rounded-lg bg-lambda-orange/10 flex items-center justify-center mb-6 group-hover:bg-lambda-orange/20 transition-colors">
      <Icon className="text-lambda-orange" size={24} />
    </div>
    <h3 className="text-xl font-semibold text-white mb-3 font-sans">{title}</h3>
    <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
  </motion.div>
);

const Step = ({ number, title, text }: { number: string, title: string, text: string }) => (
  <div className="flex gap-6 items-start">
    <div className="shrink-0 w-10 h-10 rounded-full border border-lambda-orange/30 flex items-center justify-center text-lambda-orange font-mono text-sm">
      {number}
    </div>
    <div>
      <h4 className="text-white font-semibold mb-1">{title}</h4>
      <p className="text-slate-400 text-sm">{text}</p>
    </div>
  </div>
);

export default function Home() {
  const { t, language, setLanguage } = useLanguage();
  const scrollContainer = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainer.current) {
      const cardWidth = scrollContainer.current.firstElementChild?.clientWidth || 300;
      const scrollAmount = direction === 'left' ? -(cardWidth + 32) : (cardWidth + 32);
      scrollContainer.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div id="home" className="min-h-screen page-shell selection:bg-lambda-orange/30">
      {/* Navigation */}
      <nav className="site-nav fixed top-0 w-full z-40 border-b backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/lambda19-mark.svg" alt="" className="w-11 h-11 object-contain gold-logo-glow" />
            <span className="text-xl font-bold tracking-tight text-white">lambda<span className="text-lambda-orange">19</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#home" className="hover:text-lambda-orange transition-colors">{t.nav.about}</a>
            <a href="#plus" className="hover:text-lambda-orange transition-colors">{t.nav.benefits}</a>
            <a href="#pipeline" className="hover:text-lambda-orange transition-colors">{t.nav.process}</a>
            <a href="#demos" className="hover:text-lambda-orange transition-colors">{t.nav.demo}</a>
            
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
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative pt-40 pb-20 px-6 overflow-hidden">
          <div className="absolute inset-0 circuit-pattern opacity-30 pointer-events-none" />
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 xl:gap-32 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative z-20 max-w-lg"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lambda-orange/10 border border-lambda-orange/20 text-lambda-orange text-xs font-mono mb-6 uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-lambda-orange animate-pulse" />
                {t.hero.badge}
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold text-white leading-[1.1] tracking-tighter mb-8">
                {t.hero.title1} <br className="hidden sm:block" />
                <span className="gold-text">
                  {t.hero.title2}
                </span>
              </h1>
              <p className="text-base md:text-lg text-slate-400 mb-10 leading-relaxed">
                {t.hero.description}
              </p>
              <div className="flex flex-wrap gap-4">
                <a 
                  href="#contact"
                  className="molten-button px-8 py-4 rounded-xl font-semibold flex items-center gap-2 transition-all"
                >
                  {t.hero.ctaPrimary} <ArrowRight size={20} />
                </a>
                <a 
                  href="#demos"
                  className="bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-xl font-semibold border border-white/10 transition-all inline-flex items-center justify-center"
                >
                  {t.hero.ctaSecondary}
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10 glass-panel p-4 brushed-metal orange-glow">
                <div className="hero-emblem-frame rounded-xl overflow-hidden border border-lambda-orange/15 p-8 flex flex-col items-center justify-center min-h-[400px]">
                  <div className="relative w-56 h-56 flex items-center justify-center">
                    <div className="absolute inset-0 bg-lambda-orange/20 blur-[80px] rounded-full animate-pulse-slow" />
                    <img
                      src="/lambda19-mark.svg"
                      alt="lambda19"
                      className="w-56 h-56 object-contain relative z-10 gold-logo-glow"
                    />
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute top-1/4 left-0 w-12 h-[1px] bg-lambda-orange" />
                      <div className="absolute top-1/2 right-0 w-16 h-[1px] bg-lambda-orange" />
                      <div className="absolute bottom-1/4 left-1/4 w-[1px] h-12 bg-lambda-orange" />
                    </div>
                  </div>
                  <div className="mt-8 text-center">
                    <div className="text-2xl font-bold tracking-[0.2em] text-white uppercase">lambda<span className="text-lambda-orange">19</span></div>
                    <div className="text-[10px] font-mono text-lambda-orange uppercase tracking-[0.5em] mt-2">Neural Automation Systems</div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-lambda-orange/10 blur-[100px] rounded-full" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-lambda-orange/10 blur-[100px] rounded-full" />
            </motion.div>
          </div>
        </section>

        {/* Benefits Bar */}
        <section className="border-y border-lambda-orange/10 bg-[#0b0805]/70 backdrop-blur-sm">
          <div className="gold-rule" />
          <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: t.stats.work, value: "24/7" },
              { label: t.stats.scale, value: "∞" },
              { label: t.stats.accuracy, value: "95%" },
              { label: t.stats.roi, value: "ROI+" },
            ].map((stat, i) => (
              <div key={i} className="text-center group">
                <div className="text-4xl font-bold text-white mb-1 group-hover:text-lambda-orange transition-colors duration-300">{stat.value}</div>
                <div className="text-[10px] font-mono text-lambda-orange uppercase tracking-[0.2em] opacity-80">{stat.label}</div>
              </div>
            ))}
          </div>
          <div className="gold-rule" />
        </section>

        {/* Plus Section */}
        <section id="plus" className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl font-bold text-white mb-4">{t.benefits.title}</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                {t.benefits.subtitle}
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard 
                icon={Cpu}
                title={t.benefits.cards[0].title}
                description={t.benefits.cards[0].description}
              />
              <FeatureCard 
                icon={Database}
                title={t.benefits.cards[1].title}
                description={t.benefits.cards[1].description}
              />
              <FeatureCard 
                icon={Shield}
                title={t.benefits.cards[2].title}
                description={t.benefits.cards[2].description}
              />
              <FeatureCard 
                icon={Workflow}
                title={t.benefits.cards[3].title}
                description={t.benefits.cards[3].description}
              />
              <FeatureCard 
                icon={Terminal}
                title={t.benefits.cards[4].title}
                description={t.benefits.cards[4].description}
              />
              <FeatureCard 
                icon={BarChart3}
                title={t.benefits.cards[5].title}
                description={t.benefits.cards[5].description}
              />
            </div>
          </div>
        </section>

        {/* Pipeline Visualization */}
        <section id="pipeline" className="py-32 px-6 bg-black/20">
          <div className="max-w-7xl mx-auto">
            <div className="glass-panel p-12 brushed-metal relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Layers size={200} className="text-lambda-orange" />
              </div>
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div>
                  <h2 className="text-4xl font-bold text-white mb-8">{t.process.title}</h2>
                  <div className="space-y-8">
                    <Step 
                      number={t.process.steps[0].number}
                      title={t.process.steps[0].title}
                      text={t.process.steps[0].text}
                    />
                    <Step 
                      number={t.process.steps[1].number}
                      title={t.process.steps[1].title}
                      text={t.process.steps[1].text}
                    />
                    <Step 
                      number={t.process.steps[2].number}
                      title={t.process.steps[2].title}
                      text={t.process.steps[2].text}
                    />
                    <Step 
                      number={t.process.steps[3].number}
                      title={t.process.steps[3].title}
                      text={t.process.steps[3].text}
                    />
                  </div>
                </div>
                <div className="bg-black/40 rounded-2xl border border-white/10 p-8 min-h-[480px] flex items-center justify-center relative overflow-hidden">
                  {/* Background grid and gradients */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-lambda-orange/10 via-transparent to-transparent opacity-50" />
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]" />

                  <div className="relative z-10 grid grid-cols-2 gap-x-16 gap-y-20 py-8 max-w-[280px] sm:max-w-[320px] mx-auto justify-items-center w-full">
                    {/* SVG Connector Lines */}
                    <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#ffad00" stopOpacity="0.9" />
                          <stop offset="100%" stopColor="#ffc400" stopOpacity="0.9" />
                        </linearGradient>
                        <linearGradient id="grad2" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#ffc400" stopOpacity="0.9" />
                          <stop offset="100%" stopColor="#ffe34d" stopOpacity="0.9" />
                        </linearGradient>
                        <linearGradient id="grad3" x1="100%" y1="0%" x2="0%" y2="0%">
                          <stop offset="0%" stopColor="#ffe34d" stopOpacity="0.9" />
                          <stop offset="100%" stopColor="#d88900" stopOpacity="0.9" />
                        </linearGradient>
                      </defs>
                      {/* Path 01 -> 02 (glow + sharp line) */}
                      <path d="M 25,25 L 75,25" stroke="url(#grad1)" strokeWidth="6" strokeLinecap="round" opacity="0.2" fill="none" />
                      <path d="M 25,25 L 75,25" stroke="url(#grad1)" strokeWidth="2" strokeLinecap="round" opacity="0.9" fill="none" />

                      {/* Path 02 -> 03 (glow + sharp line) */}
                      <path d="M 75,25 L 75,75" stroke="url(#grad2)" strokeWidth="6" strokeLinecap="round" opacity="0.2" fill="none" />
                      <path d="M 75,25 L 75,75" stroke="url(#grad2)" strokeWidth="2" strokeLinecap="round" opacity="0.9" fill="none" />

                      {/* Path 03 -> 04 (glow + sharp line) */}
                      <path d="M 75,75 L 25,75" stroke="url(#grad3)" strokeWidth="6" strokeLinecap="round" opacity="0.2" fill="none" />
                      <path d="M 75,75 L 25,75" stroke="url(#grad3)" strokeWidth="2" strokeLinecap="round" opacity="0.9" fill="none" />
                    </svg>

                    {/* Step 1: Left Top */}
                    <div className="flex flex-col items-center relative z-10 group">
                       <div className="w-20 h-20 rounded-2xl bg-black border border-lambda-orange/40 flex items-center justify-center text-lambda-orange shadow-[0_0_25px_rgba(255,196,0,0.15)] group-hover:shadow-[0_0_35px_rgba(255,196,0,0.4)] group-hover:border-lambda-orange/60 transition-all duration-300 relative">
                         <Search size={36} />
                         {/* Number tag as caption */}
                         <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-black border border-lambda-orange/40 text-lambda-orange text-xs font-mono px-3 py-0.5 rounded-full tracking-wider shadow-[0_2px_10px_rgba(255,196,0,0.2)]">
                           {t.process.steps[0].number}
                         </div>
                       </div>
                    </div>
                    
                    {/* Step 2: Right Top */}
                    <div className="flex flex-col items-center relative z-10 group">
                       <div className="w-20 h-20 rounded-2xl bg-black border border-lambda-orange/40 flex items-center justify-center text-lambda-gold shadow-[0_0_25px_rgba(255,196,0,0.15)] group-hover:shadow-[0_0_35px_rgba(255,196,0,0.4)] group-hover:border-lambda-orange/60 transition-all duration-300 relative">
                         <BrainCircuit size={36} />
                         {/* Number tag as caption */}
                         <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-black border border-lambda-orange/40 text-lambda-gold text-xs font-mono px-3 py-0.5 rounded-full tracking-wider shadow-[0_2px_10px_rgba(255,196,0,0.2)]">
                           {t.process.steps[1].number}
                         </div>
                       </div>
                    </div>

                    {/* Step 4: Left Bottom */}
                    <div className="flex flex-col items-center relative z-10 group">
                       <div className="w-20 h-20 rounded-2xl bg-black border border-lambda-orange/40 flex items-center justify-center text-lambda-orange shadow-[0_0_25px_rgba(255,196,0,0.15)] group-hover:shadow-[0_0_35px_rgba(255,196,0,0.4)] group-hover:border-lambda-orange/60 transition-all duration-300 relative">
                         <RefreshCcw size={36} />
                         {/* Number tag as caption */}
                         <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-black border border-lambda-orange/40 text-lambda-orange text-xs font-mono px-3 py-0.5 rounded-full tracking-wider shadow-[0_2px_10px_rgba(255,196,0,0.2)]">
                           {t.process.steps[3].number}
                         </div>
                       </div>
                    </div>

                    {/* Step 3: Right Bottom */}
                    <div className="flex flex-col items-center relative z-10 group">
                       <div className="w-20 h-20 rounded-2xl bg-black border border-lambda-orange/40 flex items-center justify-center text-lambda-gold shadow-[0_0_25px_rgba(255,196,0,0.15)] group-hover:shadow-[0_0_35px_rgba(255,196,0,0.4)] group-hover:border-lambda-orange/60 transition-all duration-300 relative">
                         <Blocks size={36} />
                         {/* Number tag as caption */}
                         <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-black border border-lambda-orange/40 text-lambda-gold text-xs font-mono px-3 py-0.5 rounded-full tracking-wider shadow-[0_2px_10px_rgba(255,196,0,0.2)]">
                           {t.process.steps[2].number}
                         </div>
                       </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Demo Projects Section */}
        <section id="demos" className="py-32 px-6 border-t border-white/5 relative overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold text-white mb-4">{t.demos.title}</h2>
                <p className="text-slate-400">
                  {t.demos.subtitle}
                </p>
              </div>
              <div className="flex gap-4 hidden md:flex">
                <button 
                  onClick={() => scroll('left')}
                  className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/5 hover:border-lambda-orange/50 transition-all group"
                >
                  <ChevronLeft className="group-hover:text-lambda-orange transition-colors" />
                </button>
                <button 
                  onClick={() => scroll('right')}
                  className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/5 hover:border-lambda-orange/50 transition-all group"
                >
                  <ChevronRight className="group-hover:text-lambda-orange transition-colors" />
                </button>
              </div>
            </div>

            <div 
              ref={scrollContainer}
              className="flex gap-8 overflow-x-auto snap-x snap-mandatory pb-8 -mx-6 px-6 md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {[
                {
                  title: t.demos.projects[0].title,
                  description: t.demos.projects[0].description,
                  category: "Travel & Lifestyle",
                  image: "/travelai.webp",
                  href: "https://travelai.top/",
                  tags: ["AI Recommendations", "Real-time Insights"]
                },
                {
                  title: t.demos.projects[1].title,
                  description: t.demos.projects[1].description,
                  category: "AI Assistant",
                  image: "/atomy.webp",
                  href: "https://t.me/AI_consult_Atomy_bot",
                  tags: ["Telegram Bot", "Knowledge Base"]
                },
                {
                  title: t.demos.projects[2].title,
                  description: t.demos.projects[2].description,
                  category: "Fintech & Video AI",
                  image: "/choa.webp",
                  href: "https://t.me/Choa_fintech_bot",
                  tags: ["Fintech", "Video Avatars"]
                },
              ].map((project, i) => (
                <div key={i} className="min-w-[85vw] md:min-w-[calc(50%-1rem)] lg:min-w-[calc(33.333%-1.333rem)] snap-start">
                  <motion.div 
                    whileHover={{ y: -10 }}
                    className="glass-panel overflow-hidden brushed-metal group flex flex-col h-full"
                  >
                    <div className="aspect-video relative overflow-hidden">
                      <img 
                        src={project.image} 
                        alt={project.title}
                        className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-100"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#07090D] to-transparent opacity-60" />
                      <div className="absolute bottom-4 left-4">
                        <span className="text-[10px] font-mono text-lambda-orange bg-black/50 px-2 py-1 rounded border border-lambda-orange/30 uppercase tracking-widest">
                          {project.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 flex-grow flex flex-col">
                      <a 
                        href={project.href} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xl font-bold text-white mb-3 hover:text-lambda-orange transition-colors inline-block"
                      >
                        {project.title}
                      </a>
                      <p className="text-sm text-slate-400 mb-6">
                        {project.description}
                      </p>
                      <div className="mt-auto flex flex-wrap gap-2">
                        {project.tags.map(tag => (
                          <span key={tag} className="text-[10px] text-slate-500 font-mono border border-white/10 px-2 py-0.5 rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>

            <div className="flex gap-4 mt-8 justify-center md:hidden">
              <button 
                onClick={() => scroll('left')}
                className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/5 hover:border-lambda-orange/50 transition-all group"
              >
                <ChevronLeft className="group-hover:text-lambda-orange transition-colors" />
              </button>
              <button 
                onClick={() => scroll('right')}
                className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/5 hover:border-lambda-orange/50 transition-all group"
              >
                <ChevronRight className="group-hover:text-lambda-orange transition-colors" />
              </button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="contact" className="py-32 px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-5xl font-bold text-white mb-8">{t.cta.title}</h2>
            <p className="text-slate-400 mb-12 text-lg">
              {t.cta.subtitle}
            </p>
            
            <ContactForm />
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
}
