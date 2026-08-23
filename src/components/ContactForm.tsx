import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { CheckCircle } from 'lucide-react';

const ContactForm = () => {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [task, setTask] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim() || submitting) return;

    setSubmitting(true);
    setSubmitError('');
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          name,
          contact,
          task,
          sessionId: localStorage.getItem('lambda19_widget_session') || undefined,
        }),
      });
      if (!response.ok) throw new Error('Unable to save lead');

      setSubmitted(true);
      setName('');
      setContact('');
      setTask('');
      setTimeout(() => setSubmitted(false), 5000);
    } catch {
      setSubmitError(
        t.contact.submitError || 'Не удалось отправить заявку. Пожалуйста, попробуйте ещё раз.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="glass-panel p-8 md:p-12 text-left">
      {submitted ? (
        <div className="flex flex-col items-center justify-center text-center py-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle size={32} />
          </div>
          <h3 className="text-2xl font-bold text-white font-sans">
            {t.contact.submitSuccessTitle || "Заявка успешно отправлена!"}
          </h3>
          <p className="text-slate-400 max-w-md text-sm leading-relaxed">
            {t.contact.submitSuccessDesc || "Спасибо! Наши инженеры уже анализируют ваш запрос и свяжутся с вами в ближайшее время."}
          </p>
        </div>
      ) : (
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-mono text-lambda-orange uppercase tracking-widest">{t.contact.name}</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.contact.namePlaceholder}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-lambda-orange/50 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono text-lambda-orange uppercase tracking-widest">{t.contact.contact}</label>
              <input 
                type="text" 
                required
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder={t.contact.contactPlaceholder}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-lambda-orange/50 transition-colors"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-mono text-lambda-orange uppercase tracking-widest">{t.contact.task}</label>
            <textarea 
              rows={4}
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder={t.contact.taskPlaceholder}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-lambda-orange/50 transition-colors resize-none"
            ></textarea>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              disabled={submitting}
              className="flex-1 molten-button disabled:opacity-60 disabled:cursor-not-allowed py-4 rounded-xl font-bold text-lg transition-all cursor-pointer"
            >
              {submitting ? (t.contact.submitting || 'Отправка...') : t.contact.submit}
            </button>
            <button 
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('toggle-chat'))}
              className="flex-1 bg-white/5 hover:bg-white/10 text-white py-4 rounded-xl font-bold text-lg border border-white/10 transition-all cursor-pointer"
            >
              {t.contact.askAI}
            </button>
          </div>
          {submitError && (
            <p role="alert" className="text-sm text-rose-400 text-center">{submitError}</p>
          )}
        </form>
      )}
    </div>
  );
};

export default ContactForm;
