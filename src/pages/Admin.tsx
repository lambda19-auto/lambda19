import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  Inbox, 
  Search, 
  Trash2, 
  Plus, 
  X, 
  ArrowLeft,
  LogOut,
  FileDown,
  Database,
  RefreshCw
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

interface Lead {
  id: string;
  leadId: string;
  userId: string | null;
  sessionId: string | null;
  name: string;
  contact: string;
  task: string;
  status: 'New' | 'In Progress' | 'Completed' | 'Rejected';
  createdAt: string;
  notes?: string;
}

type LogType = 'http_success' | 'application_error' | 'ai_error' | 'lead_audit' | 'security_audit';

interface LogSummary {
  type: LogType;
  retentionDays: number;
  count: number;
  oldestAt: string | null;
  newestAt: string | null;
}

export default function Admin() {
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('/api/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (response.ok && data.success) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('admin_token');
          navigate('/login');
        }
      } catch {
        localStorage.removeItem('admin_token');
        navigate('/login');
      }
    };

    verifyToken();
  }, [navigate]);
  const [activeTab, setActiveTab] = useState<'overview' | 'leads' | 'logs'>('overview');
  
  // Leads states
  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [leadsError, setLeadsError] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Editing lead state
  const [editingNotes, setEditingNotes] = useState('');
  
  // Custom manual lead form
  const [showAddLead, setShowAddLead] = useState(false);
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadContact, setNewLeadContact] = useState('');
  const [newLeadTask, setNewLeadTask] = useState('');

  // Log retention and administration states
  const [logSummary, setLogSummary] = useState<LogSummary[]>([]);
  const [selectedLogType, setSelectedLogType] = useState<LogType>('http_success');
  const [logsLoading, setLogsLoading] = useState(false);
  const [logsMessage, setLogsMessage] = useState('');

  // Load leads from PostgreSQL through the authenticated API.
  useEffect(() => {
    if (!isAuthenticated) return;
    const loadLeads = async () => {
      setLeadsLoading(true);
      setLeadsError('');
      try {
        const token = localStorage.getItem('admin_token');
        const response = await fetch('/api/leads', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (!response.ok || !Array.isArray(data.leads)) throw new Error('Unable to load leads');
        setLeads(data.leads);
      } catch {
        setLeadsError(language === 'ru' ? 'Не удалось загрузить заявки.' : 'Unable to load leads.');
      } finally {
        setLeadsLoading(false);
      }
    };
    void loadLeads();
  }, [isAuthenticated, language]);

  const loadLogSummary = async () => {
    setLogsLoading(true);
    setLogsMessage('');
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/logs/summary', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok || !Array.isArray(data.logs)) throw new Error('Unable to load logs');
      setLogSummary(data.logs);
    } catch {
      setLogsMessage(language === 'ru' ? 'Не удалось загрузить информацию о логах.' : 'Unable to load log information.');
    } finally {
      setLogsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && activeTab === 'logs') void loadLogSummary();
  }, [activeTab, isAuthenticated]);

  const handleExportLogs = async () => {
    const reason = window.prompt(language === 'ru' ? 'Укажите причину выгрузки логов:' : 'Enter the reason for exporting logs:');
    if (!reason?.trim()) return;
    setLogsLoading(true);
    setLogsMessage('');
    try {
      const token = localStorage.getItem('admin_token');
      const query = new URLSearchParams({ type: selectedLogType, reason: reason.trim() });
      const response = await fetch(`/api/logs/export?${query.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Unable to export logs');
      const blob = await response.blob();
      const disposition = response.headers.get('Content-Disposition');
      const filename = disposition?.match(/filename="([^"]+)"/)?.[1] || `lambda19-${selectedLogType}.csv`;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setLogsMessage(language === 'ru' ? 'Выгрузка подготовлена.' : 'Export prepared.');
      await loadLogSummary();
    } catch {
      setLogsMessage(language === 'ru' ? 'Не удалось выгрузить логи.' : 'Unable to export logs.');
    } finally {
      setLogsLoading(false);
    }
  };

  const handleDeleteLogs = async () => {
    const confirmed = window.confirm(language === 'ru'
      ? 'Удалить все логи выбранного типа? Это действие нельзя отменить.'
      : 'Delete all logs of the selected type? This action cannot be undone.');
    if (!confirmed) return;
    const reason = window.prompt(language === 'ru' ? 'Укажите причину удаления логов:' : 'Enter the reason for deleting logs:');
    if (!reason?.trim()) return;
    setLogsLoading(true);
    setLogsMessage('');
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/logs', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ type: selectedLogType, reason: reason.trim() }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error('Unable to delete logs');
      setLogsMessage(language === 'ru'
        ? `Удалено записей: ${data.deletedCount}`
        : `Deleted entries: ${data.deletedCount}`);
      await loadLogSummary();
    } catch {
      setLogsMessage(language === 'ru' ? 'Не удалось удалить логи.' : 'Unable to delete logs.');
    } finally {
      setLogsLoading(false);
    }
  };

  const replaceLead = (updatedLead: Lead) => {
    setLeads((current) => current.map((lead) => lead.id === updatedLead.id ? updatedLead : lead));
    if (selectedLead?.id === updatedLead.id) setSelectedLead(updatedLead);
  };

  const updateLead = async (leadId: string, changes: { status?: Lead['status']; notes?: string }) => {
    const token = localStorage.getItem('admin_token');
    const response = await fetch(`/api/leads/${leadId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(changes),
    });
    const data = await response.json();
    if (!response.ok || !data.lead) throw new Error('Unable to update lead');
    replaceLead(data.lead);
  };

  // Lead status updater
  const handleUpdateStatus = async (leadId: string, newStatus: Lead['status']) => {
    try {
      await updateLead(leadId, { status: newStatus });
    } catch {
      setLeadsError(language === 'ru' ? 'Не удалось изменить статус.' : 'Unable to update status.');
    }
  };

  // Save notes
  const handleSaveNotes = async () => {
    if (!selectedLead) return;
    try {
      await updateLead(selectedLead.id, { notes: editingNotes });
    } catch {
      setLeadsError(language === 'ru' ? 'Не удалось сохранить заметку.' : 'Unable to save notes.');
    }
  };

  // Delete lead
  const handleDeleteLead = async (leadId: string) => {
    if (window.confirm('Вы уверены, что хотите удалить эту заявку?')) {
      try {
        const token = localStorage.getItem('admin_token');
        const response = await fetch(`/api/leads/${leadId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Unable to delete lead');
        setLeads((current) => current.filter((lead) => lead.id !== leadId));
        if (selectedLead?.id === leadId) setSelectedLead(null);
      } catch {
        setLeadsError(language === 'ru' ? 'Не удалось удалить заявку.' : 'Unable to delete lead.');
      }
    }
  };

  // Add manual lead
  const handleAddManualLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName || !newLeadContact) return;

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newLeadName, contact: newLeadContact, task: newLeadTask }),
      });
      const data = await response.json();
      if (!response.ok || !data.lead) throw new Error('Unable to create lead');
      setLeads((current) => [data.lead, ...current]);
      setNewLeadName('');
      setNewLeadContact('');
      setNewLeadTask('');
      setShowAddLead(false);
    } catch {
      setLeadsError(language === 'ru' ? 'Не удалось создать заявку.' : 'Unable to create lead.');
    }
  };

  // Filters leads
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.task.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.notes || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Aggregated Stats
  const totalLeads = leads.length;
  const newLeads = leads.filter(l => l.status === 'New').length;
  const inProgressLeads = leads.filter(l => l.status === 'In Progress').length;
  const completedLeads = leads.filter(l => l.status === 'Completed').length;

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#07090D] flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-lambda-orange/30 border-t-lambda-orange rounded-full animate-spin mb-4" />
        <p className="text-sm font-mono tracking-widest text-slate-400 uppercase">
          {language === 'ru' ? 'Проверка авторизации...' : 'Verifying authorization...'}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07090D] text-slate-200">
      {/* Admin Navbar */}
      <nav className="border-b border-white/5 bg-[#07090D]/95 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="w-10 h-10 bg-lambda-orange/10 border border-lambda-orange/20 rounded flex items-center justify-center text-lambda-orange hover:bg-lambda-orange hover:text-[#090B0F] transition-colors">
              <ArrowLeft size={18} />
            </Link>
            <div className="flex items-center gap-3">
              <img src="/lambda19-mark.svg" alt="" className="w-10 h-10 gold-logo-glow" />
              <div>
                <span className="text-xl font-bold tracking-tighter text-white block">lambda19</span>
                <span className="text-[10px] font-mono text-lambda-orange tracking-widest uppercase block -mt-1">Admin Command Center</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Language switch */}
            <div className="flex items-center gap-2 bg-white/5 rounded-full p-1 border border-white/10 text-xs">
              <button 
                onClick={() => setLanguage('ru')}
                className={`px-3 py-1 rounded-full transition-all ${language === 'ru' ? 'bg-lambda-orange text-[#090B0F]' : 'text-slate-400 hover:text-white'}`}
              >
                RU
              </button>
              <button 
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded-full transition-all ${language === 'en' ? 'bg-lambda-orange text-[#090B0F]' : 'text-slate-400 hover:text-white'}`}
              >
                EN
              </button>
            </div>
            
          </div>
        </div>
      </nav>

      {/* Admin Panel Layout */}
      <div className="max-w-7xl mx-auto px-6 py-10 grid lg:grid-cols-[260px_1fr] gap-8">
        
        {/* Navigation Sidebar */}
        <aside className="space-y-2">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${activeTab === 'overview' ? 'bg-lambda-orange text-[#090B0F] orange-glow' : 'hover:bg-white/5 text-slate-400 hover:text-white'}`}
          >
            <LayoutDashboard size={18} />
            {language === 'ru' ? 'Панель управления' : 'Dashboard Overview'}
          </button>
          
          <button 
            onClick={() => {
              setActiveTab('leads');
              // Auto-select first lead if available
              if (leads.length > 0 && !selectedLead) {
                setSelectedLead(leads[0]);
                setEditingNotes(leads[0].notes || '');
              }
            }}
            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${activeTab === 'leads' ? 'bg-lambda-orange text-[#090B0F] orange-glow' : 'hover:bg-white/5 text-slate-400 hover:text-white'}`}
          >
            <div className="flex items-center gap-3">
              <Inbox size={18} />
              <span>{language === 'ru' ? 'Заявки от клиентов' : 'Customer Leads'}</span>
            </div>
            {newLeads > 0 && (
              <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                {newLeads}
              </span>
            )}
          </button>
          
          <button
            onClick={() => setActiveTab('logs')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${activeTab === 'logs' ? 'bg-lambda-orange text-[#090B0F] orange-glow' : 'hover:bg-white/5 text-slate-400 hover:text-white'}`}
          >
            <Database size={18} />
            {language === 'ru' ? 'Управление логами' : 'Log Management'}
          </button>
          
          <button 
            onClick={() => {
              const token = localStorage.getItem('admin_token');
              if (token) {
                void fetch('/api/logout', {
                  method: 'POST',
                  headers: { Authorization: `Bearer ${token}` },
                });
              }
              localStorage.removeItem('admin_token');
              navigate('/login');
            }}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all hover:bg-red-500/10 text-red-400 hover:text-red-300 mt-2"
          >
            <LogOut size={18} />
            {language === 'ru' ? 'Выйти из системы' : 'Log Out'}
          </button>

        </aside>

        {/* Dashboard Main Content Area */}
        <main className="space-y-8">
          
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Header */}
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">
                  {language === 'ru' ? 'Панель управления' : 'Dashboard'}
                </h1>
                <p className="text-slate-400 mt-1">
                  {language === 'ru' ? 'Сводка по заявкам, сохранённым в PostgreSQL.' : 'Summary of leads stored in PostgreSQL.'}
                </p>
              </div>

              {/* Aggregated Cards */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Total Leads Card */}
                <div className="glass-panel p-6 brushed-metal relative overflow-hidden group flex flex-col justify-between min-h-[160px]">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10">
                    <Inbox size={48} className="text-lambda-orange" />
                  </div>
                  <div>
                    <div className="text-slate-400 text-xs font-mono uppercase tracking-wider">{language === 'ru' ? 'Всего заявок' : 'Total Leads'}</div>
                    <div className="text-4xl font-bold text-white mt-2 font-sans">{totalLeads}</div>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-3 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-lambda-orange" />
                    {newLeads} {language === 'ru' ? 'новых в очереди' : 'new waiting in line'}
                  </div>
                </div>

                {/* Status distribution overview */}
                <div className="glass-panel p-6 brushed-metal flex flex-col justify-center min-h-[160px]">
                  <div className="space-y-3 w-full">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-orange-500" />
                          {language === 'ru' ? 'Новые заявки' : 'New Leads'}
                        </span>
                        <span className="font-mono text-white font-bold text-xs">{newLeads} ({totalLeads ? Math.round((newLeads/totalLeads)*100) : 0}%)</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500" style={{ width: `${totalLeads ? (newLeads/totalLeads)*100 : 0}%` }} />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-blue-500" />
                          {language === 'ru' ? 'В работе' : 'In Progress'}
                        </span>
                        <span className="font-mono text-white font-bold text-xs">{inProgressLeads} ({totalLeads ? Math.round((inProgressLeads/totalLeads)*100) : 0}%)</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: `${totalLeads ? (inProgressLeads/totalLeads)*100 : 0}%` }} />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          {language === 'ru' ? 'Завершенные' : 'Completed'}
                        </span>
                        <span className="font-mono text-white font-bold text-xs">{completedLeads} ({totalLeads ? Math.round((completedLeads/totalLeads)*100) : 0}%)</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: `${totalLeads ? (completedLeads/totalLeads)*100 : 0}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>


            </div>
          )}

          {/* LEADS TAB */}
          {activeTab === 'leads' && (
            <div className="space-y-6">
              
              {/* Header and Add Lead buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-white tracking-tight">
                    {language === 'ru' ? 'Реестр заявок' : 'Leads Backlog'}
                  </h1>
                  <p className="text-slate-400 mt-1">
                    {language === 'ru' ? 'Анализируйте и управляйте входящими заказами на разработку AI-агентов.' : 'Review and manage incoming AI agent development requests.'}
                  </p>
                </div>
                
                <button 
                  onClick={() => setShowAddLead(!showAddLead)}
                  className="bg-lambda-orange hover:bg-lambda-gold text-[#090B0F] px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg"
                >
                  <Plus size={16} />
                  {language === 'ru' ? 'Добавить заявку' : 'Add Lead'}
                </button>
              </div>

              {/* Add Lead Form Toggle */}
              {showAddLead && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-panel p-6 border-lambda-orange/20"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-white">{language === 'ru' ? 'Добавление заявки' : 'Add Client Request'}</h3>
                    <button onClick={() => setShowAddLead(false)} className="text-slate-400 hover:text-white">
                      <X size={18} />
                    </button>
                  </div>
                  <form onSubmit={handleAddManualLead} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-slate-400 block mb-1 font-mono uppercase">{language === 'ru' ? 'Имя клиента' : 'Client Name'}</label>
                        <input 
                          type="text" 
                          required
                          value={newLeadName}
                          onChange={(e) => setNewLeadName(e.target.value)}
                          placeholder={language === 'ru' ? 'Например, Константин' : 'For example, Alex'}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-lambda-orange"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 block mb-1 font-mono uppercase">{language === 'ru' ? 'Контакт' : 'Contact (TG / Email)'}</label>
                        <input 
                          type="text" 
                          required
                          value={newLeadContact}
                          onChange={(e) => setNewLeadContact(e.target.value)}
                          placeholder={language === 'ru' ? '@telegram или email' : '@telegram or email'}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-lambda-orange"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1 font-mono uppercase">{language === 'ru' ? 'Суть автоматизации' : 'Automation Task Description'}</label>
                      <textarea 
                        rows={3}
                        required
                        value={newLeadTask}
                        onChange={(e) => setNewLeadTask(e.target.value)}
                        placeholder={language === 'ru' ? 'Опишите задачу...' : 'Describe the task...'}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-lambda-orange resize-none"
                      />
                    </div>
                    <button className="bg-lambda-orange hover:bg-lambda-gold text-[#090B0F] px-5 py-2.5 rounded-xl font-semibold text-sm cursor-pointer">
                      {language === 'ru' ? 'Сохранить заявку' : 'Save Lead'}
                    </button>
                  </form>
                </motion.div>
              )}

              {/* Filters Panel */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={language === 'ru' ? 'Поиск по имени, контактам, описанию...' : 'Search leads by text...'}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-lambda-orange/50 transition-colors"
                  />
                </div>
                <div className="flex gap-2">
                  {['all', 'New', 'In Progress', 'Completed', 'Rejected'].map(status => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-mono border transition-all cursor-pointer uppercase ${
                        statusFilter === status 
                          ? 'bg-lambda-orange/20 text-lambda-orange border-lambda-orange/40 font-bold' 
                          : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
                      }`}
                    >
                      {status === 'all' ? (language === 'ru' ? 'Все' : 'ALL') : status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Master-Detail Split Screen */}
              <div className="grid lg:grid-cols-[1fr_360px] gap-6">
                
                {/* List Container */}
                <div className="glass-panel overflow-hidden h-[550px] flex flex-col">
                  <div className="p-4 border-b border-white/5 text-xs text-slate-500 font-mono flex justify-between">
                    <span>{language === 'ru' ? 'НАЙДЕНО:' : 'RESULTS:'} {filteredLeads.length}</span>
                    <span>POSTGRESQL</span>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto divide-y divide-white/5">
                    {leadsLoading && (
                      <div className="p-12 text-center text-slate-500 font-mono">
                        {language === 'ru' ? 'Загрузка заявок...' : 'Loading leads...'}
                      </div>
                    )}
                    {leadsError && !leadsLoading && (
                      <div role="alert" className="p-4 text-center text-rose-400 text-sm">
                        {leadsError}
                      </div>
                    )}
                    {filteredLeads.map(lead => (
                      <div 
                        key={lead.id}
                        onClick={() => {
                          setSelectedLead(lead);
                          setEditingNotes(lead.notes || '');
                        }}
                        className={`p-4 text-left transition-all cursor-pointer block hover:bg-white/[0.02] ${
                          selectedLead && selectedLead.id === lead.id ? 'bg-white/[0.03] border-l-2 border-lambda-orange' : ''
                        }`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold text-white text-base">{lead.name}</h4>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase border ${
                            lead.status === 'New' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                            lead.status === 'In Progress' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                            lead.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                            'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          }`}>
                            {lead.status}
                          </span>
                        </div>
                        
                        <div className="text-xs text-slate-400 font-mono mb-2">{lead.contact}</div>
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-2">{lead.task}</p>
                        
                        <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
                          <span>{new Date(lead.createdAt).toLocaleString()}</span>
                          {lead.notes && (
                            <span className="text-lambda-orange flex items-center gap-1">
                              ● {language === 'ru' ? 'Есть заметка' : 'Has internal notes'}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}

                    {filteredLeads.length === 0 && (
                      <div className="p-12 text-center text-slate-500 font-mono">
                        {language === 'ru' ? 'Заявки не найдены' : 'No matching leads found.'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Lead Detail Panel */}
                <div className="glass-panel p-6 flex flex-col h-[550px] justify-between text-left">
                  {selectedLead ? (
                    <div className="space-y-6 flex flex-col justify-between h-full">
                      <div className="space-y-4 overflow-y-auto max-h-[400px]">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-mono text-lambda-orange tracking-widest uppercase block">{language === 'ru' ? 'КАРТОЧКА КЛИЕНТА' : 'LEAD DETAILS'}</span>
                            <h3 className="text-xl font-bold text-white mt-1">{selectedLead.name}</h3>
                          </div>
                          <button 
                            onClick={() => handleDeleteLead(selectedLead.id)}
                            className="text-slate-500 hover:text-rose-400 p-1 rounded hover:bg-white/5 transition-colors cursor-pointer"
                            title={language === 'ru' ? 'Удалить заявку' : 'Delete Lead'}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <span className="text-[10px] font-mono text-slate-500 uppercase block">{language === 'ru' ? 'СВЯЗЬ / КОНТАКТ' : 'CONTACT INFO'}</span>
                            <span className="text-sm font-mono text-white block select-all bg-white/5 p-2 rounded mt-1 border border-white/5">
                              {selectedLead.contact}
                            </span>
                          </div>

                          <div>
                            <span className="text-[10px] font-mono text-slate-500 uppercase block">
                              {language === 'ru' ? 'ИДЕНТИФИКАТОРЫ' : 'IDENTIFIERS'}
                            </span>
                            <div className="text-[11px] font-mono text-slate-300 select-all bg-white/5 p-2 rounded mt-1 border border-white/5 space-y-1 break-all">
                              <div>lead_id: {selectedLead.leadId}</div>
                              <div>user_id: {selectedLead.userId || '—'}</div>
                              <div>session_id: {selectedLead.sessionId || '—'}</div>
                            </div>
                          </div>

                          <div>
                            <span className="text-[10px] font-mono text-slate-500 uppercase block">{language === 'ru' ? 'ПОСТАВЛЕННАЯ ЗАДАЧА' : 'CUSTOMER INQUIRY'}</span>
                            <div className="text-sm text-slate-300 bg-white/5 p-3 rounded mt-1 border border-white/5 leading-relaxed max-h-40 overflow-y-auto">
                              {selectedLead.task}
                            </div>
                          </div>
                        </div>

                          <div className="border-t border-white/5 pt-3">
                            <span className="text-[10px] font-mono text-slate-500 uppercase block mb-2">{language === 'ru' ? 'СТАТУС ОБРАБОТКИ' : 'LEAD STATUS'}</span>
                            <div className="grid grid-cols-2 gap-2">
                              {(['New', 'In Progress', 'Completed', 'Rejected'] as Lead['status'][]).map(st => (
                                <button
                                  key={st}
                                  onClick={() => handleUpdateStatus(selectedLead.id, st)}
                                  className={`px-3 py-1.5 rounded text-xs font-mono border text-center transition-all cursor-pointer ${
                                    selectedLead.status === st
                                      ? st === 'New' ? 'bg-orange-500/15 text-orange-400 border-orange-500/30' :
                                        st === 'In Progress' ? 'bg-blue-500/15 text-blue-400 border-blue-500/30' :
                                        st === 'Completed' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' :
                                        'bg-rose-500/15 text-rose-400 border-rose-500/30'
                                      : 'bg-transparent text-slate-500 border-white/5 hover:text-slate-300 hover:border-white/10'
                                  }`}
                                >
                                  {st}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="border-t border-white/5 pt-3">
                            <span className="text-[10px] font-mono text-slate-500 uppercase block">{language === 'ru' ? 'ВНУТРЕННИЕ ЗАМЕТКИ' : 'INTERNAL TEAM NOTES'}</span>
                            <textarea
                              rows={3}
                              value={editingNotes}
                              onChange={(e) => setEditingNotes(e.target.value)}
                              placeholder={language === 'ru' ? 'Добавьте комментарий по клиенту...' : 'Write details for the team...'}
                              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-lambda-orange mt-1.5 resize-none"
                            />
                          </div>
                        </div>

                        <button
                          onClick={handleSaveNotes}
                          className="w-full bg-white/5 hover:bg-white/10 text-white font-mono text-xs py-2.5 rounded-lg border border-white/10 transition-all cursor-pointer font-bold"
                        >
                          {language === 'ru' ? '✓ Сохранить заметку' : '✓ Save Internal Notes'}
                        </button>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 font-mono text-xs">
                        <Inbox size={40} className="mb-3 text-slate-600 animate-pulse" />
                        {language === 'ru' ? 'Выберите заявку для просмотра деталей' : 'Select a lead to view details'}
                      </div>
                    )}
                  </div>

                </div>
              </div>
            )}
          {activeTab === 'logs' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">
                  {language === 'ru' ? 'Управление логами' : 'Log Management'}
                </h1>
                <p className="text-slate-400 mt-1">
                  {language === 'ru'
                    ? 'Сроки хранения применяются автоматически раз в сутки. Выгрузка и удаление фиксируются в журнале безопасности.'
                    : 'Retention runs automatically every day. Exports and deletions are recorded in the security audit log.'}
                </p>
              </div>

              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                {logSummary.map((item) => (
                  <button
                    key={item.type}
                    onClick={() => setSelectedLogType(item.type)}
                    className={`glass-panel p-5 text-left transition-all border ${selectedLogType === item.type ? 'border-lambda-orange bg-lambda-orange/5' : 'border-white/5 hover:border-white/15'}`}
                  >
                    <div className="text-xs font-mono text-lambda-orange uppercase break-all">{item.type}</div>
                    <div className="text-3xl font-bold text-white mt-2">{item.count}</div>
                    <div className="text-xs text-slate-400 mt-2">
                      {language === 'ru' ? 'Хранение' : 'Retention'}: {item.retentionDays} {language === 'ru' ? 'дней' : 'days'}
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 mt-2">
                      {item.oldestAt ? new Date(item.oldestAt).toLocaleString() : (language === 'ru' ? 'Записей нет' : 'No entries')}
                    </div>
                  </button>
                ))}
              </div>

              <div className="glass-panel p-6 brushed-metal space-y-5">
                <div className="flex flex-col md:flex-row md:items-end gap-4">
                  <div className="flex-1 space-y-2">
                    <label className="text-xs text-slate-400 block font-mono uppercase">
                      {language === 'ru' ? 'Тип логов' : 'Log type'}
                    </label>
                    <select
                      value={selectedLogType}
                      onChange={(event) => setSelectedLogType(event.target.value as LogType)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-3 text-sm text-white focus:outline-none focus:border-lambda-orange"
                    >
                      <option value="http_success">http_success — 30 days</option>
                      <option value="application_error">application_error — 90 days</option>
                      <option value="ai_error">ai_error — 90 days</option>
                      <option value="lead_audit">lead_audit — 365 days</option>
                      <option value="security_audit">security_audit — 365 days</option>
                    </select>
                  </div>

                  <button
                    onClick={() => void loadLogSummary()}
                    disabled={logsLoading}
                    className="px-4 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <RefreshCw size={17} className={logsLoading ? 'animate-spin' : ''} />
                    {language === 'ru' ? 'Обновить' : 'Refresh'}
                  </button>
                  <button
                    onClick={() => void handleExportLogs()}
                    disabled={logsLoading}
                    className="px-4 py-3 rounded-xl bg-lambda-orange hover:brightness-110 text-[#090B0F] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <FileDown size={17} />
                    {language === 'ru' ? 'Выгрузить CSV' : 'Export CSV'}
                  </button>
                  <button
                    onClick={() => void handleDeleteLogs()}
                    disabled={logsLoading}
                    className="px-4 py-3 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Trash2 size={17} />
                    {language === 'ru' ? 'Удалить тип' : 'Delete type'}
                  </button>
                </div>

                {logsMessage && (
                  <div className="text-sm text-slate-300 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                    {logsMessage}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
