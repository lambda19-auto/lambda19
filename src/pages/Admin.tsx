import { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  Inbox, 
  Bot, 
  Settings, 
  Search, 
  Trash2, 
  Plus, 
  AlertTriangle, 
  X, 
  Terminal,
  ArrowLeft,
  ShieldCheck,
  UserCheck,
  MessageSquare,
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

interface DialogMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  thoughtChain?: string[];
}

interface ClientDialog {
  id: string;
  clientName: string;
  platform: 'Telegram' | 'Email' | 'Widget' | 'WhatsApp';
  status: 'ONLINE' | 'ACTIVE' | 'RESOLVED';
  messages: DialogMessage[];
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
  const [activeTab, setActiveTab] = useState<'overview' | 'leads' | 'logs' | 'agents' | 'settings'>('overview');
  
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

  // Client dialogs monitoring states
  const [selectedDialogId, setSelectedDialogId] = useState<string>('dialog_1');
  const [dialogs, setDialogs] = useState<ClientDialog[]>([]);
  const [expandedThoughts, setExpandedThoughts] = useState<{ [key: string]: boolean }>({});

  // Daily interactive chart data states
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const dailyData = useMemo(() => {
    const result = [];
    const baseInquiries = [310, 420, 380, 640, 510, 780, 890];
    const baseQuestions = [120, 190, 140, 280, 210, 430, 510];
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = String(d.getFullYear()).slice(-2);
      
      const idx = 6 - i;
      result.push({
        date: `${day}.${month}.${year}`,
        inquiries: baseInquiries[idx],
        questions: baseQuestions[idx],
      });
    }
    return result;
  }, []);

  useEffect(() => {
    const getInitialDialogs = (lang: 'ru' | 'en'): ClientDialog[] => [
      {
        id: 'dialog_1',
        clientName: lang === 'ru' ? 'Алексей Смирнов' : 'Alexey Smirnov',
        platform: 'Telegram',
        status: 'ACTIVE',
        messages: [
          {
            role: 'user',
            content: lang === 'ru' 
              ? 'Здравствуйте! Подскажите, как ваш ИИ интегрируется с Bitrix24?' 
              : 'Hello! Can you tell me how your AI integrates with Bitrix24?',
            timestamp: '15:24',
          },
          {
            role: 'assistant',
            content: lang === 'ru'
              ? 'Приветствую! Агент интегрируется через наш шлюз и стандартный REST API Bitrix24. Он умеет распознавать намерения, автоматически квалифицировать лиды и заносить их в CRM со всеми заполненными полями.'
              : 'Welcome! The agent integrates via our gateway and Bitrix24 standard REST API. It recognizes intents, automatically qualifies leads, and enters them into the CRM with all fields populated.',
            timestamp: '15:25',
            thoughtChain: lang === 'ru' ? [
              'АНАЛИЗ НАМЕРЕНИЯ: Запрос об интеграции с Bitrix24.',
              'ПОИСК В БАЗЕ ЗНАНИЙ: Раздел "Интеграции CRM -> Bitrix24". Способ подключения: Webhooks / REST API.',
              'ФОРМИРОВАНИЕ ОТВЕТА: Описать пошаговый процесс квалификации и создания лида в CRM.'
            ] : [
              'INTENT ANALYSIS: CRM Integration query for Bitrix24.',
              'KNOWLEDGE RETRIEVAL: Section "CRM Integrations -> Bitrix24". Connection method: Webhooks / REST API.',
              'RESPONSE GENERATION: Describe lead qualification process & automated CRM entry.'
            ]
          },
          {
            role: 'user',
            content: lang === 'ru'
              ? 'Отлично, а сколько времени занимает развертывание?'
              : 'Excellent, and how long does the deployment take?',
            timestamp: '15:42'
          },
          {
            role: 'assistant',
            content: lang === 'ru'
              ? 'Обычно первичная настройка занимает от 1 до 3 рабочих дней. Это включает обучение модели на ваших регламентах продаж и тестирование сценариев интеграции.'
              : 'Typically, initial setup takes between 1 to 3 business days. This includes training the model on your sales playbooks and testing the integration pipelines.',
            timestamp: '15:43',
            thoughtChain: lang === 'ru' ? [
              'АНАЛИЗ НАМЕРЕНИЯ: Сроки запуска проекта.',
              'ОЦЕНКА СЛОЖНОСТИ: Базовая интеграция ИИ на готовых скриптах.',
              'ФОРМИРОВАНИЕ ОТВЕТА: Указать реалистичный срок в 1-3 дня.'
            ] : [
              'INTENT ANALYSIS: Project launch timeline.',
              'ESTIMATING COMPLEXITY: Standard AI integration over existing scripts.',
              'RESPONSE GENERATION: State a realistic 1-3 day window.'
            ]
          }
        ]
      },
      {
        id: 'dialog_2',
        clientName: lang === 'ru' ? 'Мария Петрова' : 'Maria Petrova',
        platform: 'Email',
        status: 'ACTIVE',
        messages: [
          {
            role: 'user',
            content: lang === 'ru'
              ? 'Добрый день. Интересует ИИ-парсер инвойсов из PDF-файлов для автоматического сопоставления счетов в 1С. Делаете такое?'
              : 'Good afternoon. Interested in an AI parser for invoices from PDF files to automatically match accounts in 1C. Do you do this?',
            timestamp: 'Вчера'
          },
          {
            role: 'assistant',
            content: lang === 'ru'
              ? 'Здравствуйте, Мария! Да, мы разрабатываем такие решения. Агент считывает PDF (даже сканы) при помощи OCR и мультимодальной нейросети, извлекает реквизиты, позиции, суммы и передает в 1С через API. Какая версия 1С у вас установлена?'
              : 'Hello, Maria! Yes, we develop such solutions. The agent reads PDFs (even scans) using OCR and a multimodal neural network, extracts credentials, positions, and totals, then sends them to 1C via API. What version of 1C do you have installed?',
            timestamp: 'Вчера',
            thoughtChain: lang === 'ru' ? [
              'АНАЛИЗ НАМЕРЕНИЯ: Извлечение структурированных данных из PDF документов.',
              'ПОИСК РЕШЕНИЯ: Использование мультимодальной модели для OCR и извлечения структурированных данных.',
              'СБОР КОНТЕКСТА: Запросить конфигурацию 1С клиента для интеграции.'
            ] : [
              'INTENT ANALYSIS: Structured data extraction from PDF documents.',
              'SOLUTION SELECTION: Using a multimodal model for OCR and structured data extraction.',
              'CONTEXT GATHERING: Request client\'s 1C configuration details for integration.'
            ]
          }
        ]
      },
      {
        id: 'dialog_3',
        clientName: lang === 'ru' ? 'John Davidson' : 'John Davidson',
        platform: 'Widget',
        status: 'RESOLVED',
        messages: [
          {
            role: 'user',
            content: 'Hello, do your agents support multi-lingual routing?',
            timestamp: '26 Июня'
          },
          {
            role: 'assistant',
            content: 'Hi John! Yes, our agents dynamically detect the language of the incoming request from over 30 supported languages and reply in the same language with natural fluency. No manual configuration needed.',
            timestamp: '26 Июня',
            thoughtChain: [
              'INTENT DETECTED: Multi-language capabilities and routing rules.',
              'RESOLVING FACT: Native multilingual model support without separate translation layers.',
              'DRAFTING: Assure the user of seamless dynamic language matching.'
            ]
          }
        ]
      }
    ];

    const initial = getInitialDialogs(language);
    setDialogs(initial);
  }, [language]);

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

  // Chart coordinates mapping helpers
  const getChartX = (index: number) => 55 + index * (425 / 6);
  const getChartY = (value: number) => 160 - (value / 1000) * 145;

  const inquiriesLinePath = dailyData.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getChartX(i)} ${getChartY(d.inquiries)}`).join(' ');
  const inquiriesAreaPath = `${inquiriesLinePath} L ${getChartX(dailyData.length - 1)} ${getChartY(0)} L ${getChartX(0)} ${getChartY(0)} Z`;

  const questionsLinePath = dailyData.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getChartX(i)} ${getChartY(d.questions)}`).join(' ');
  const questionsAreaPath = `${questionsLinePath} L ${getChartX(dailyData.length - 1)} ${getChartY(0)} L ${getChartX(0)} ${getChartY(0)} Z`;

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#0F1113] flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-lambda-orange/30 border-t-lambda-orange rounded-full animate-spin mb-4" />
        <p className="text-sm font-mono tracking-widest text-slate-400 uppercase">
          {language === 'ru' ? 'Проверка авторизации...' : 'Verifying authorization...'}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F1113] text-slate-200">
      {/* Admin Navbar */}
      <nav className="border-b border-white/5 bg-[#0F1113]/95 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="w-10 h-10 bg-lambda-orange/10 border border-lambda-orange/20 rounded flex items-center justify-center text-lambda-orange hover:bg-lambda-orange hover:text-white transition-colors">
              <ArrowLeft size={18} />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-lambda-orange rounded flex items-center justify-center font-bold text-white text-xl">
                λ
              </div>
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
                className={`px-3 py-1 rounded-full transition-all ${language === 'ru' ? 'bg-lambda-orange text-white' : 'text-slate-400 hover:text-white'}`}
              >
                RU
              </button>
              <button 
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded-full transition-all ${language === 'en' ? 'bg-lambda-orange text-white' : 'text-slate-400 hover:text-white'}`}
              >
                EN
              </button>
            </div>
            
            <div className="h-8 w-[1px] bg-white/10 hidden sm:block" />
            
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg text-emerald-400 text-xs font-mono hidden sm:flex">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              SYSTEM SECURE
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
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${activeTab === 'overview' ? 'bg-lambda-orange text-white orange-glow' : 'hover:bg-white/5 text-slate-400 hover:text-white'}`}
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
            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${activeTab === 'leads' ? 'bg-lambda-orange text-white orange-glow' : 'hover:bg-white/5 text-slate-400 hover:text-white'}`}
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
            onClick={() => setActiveTab('agents')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${activeTab === 'agents' ? 'bg-lambda-orange text-white orange-glow' : 'hover:bg-white/5 text-slate-400 hover:text-white'}`}
          >
            <Bot size={18} />
            {language === 'ru' ? 'Мониторинг агента' : 'Agent Monitoring'}
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${activeTab === 'logs' ? 'bg-lambda-orange text-white orange-glow' : 'hover:bg-white/5 text-slate-400 hover:text-white'}`}
          >
            <Database size={18} />
            {language === 'ru' ? 'Управление логами' : 'Log Management'}
          </button>
          
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${activeTab === 'settings' ? 'bg-lambda-orange text-white orange-glow' : 'hover:bg-white/5 text-slate-400 hover:text-white'}`}
          >
            <Settings size={18} />
            {language === 'ru' ? 'Конфигурация API' : 'API Integrations'}
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

          <div className="pt-8 mt-8 border-t border-white/5">
            <div className="glass-panel p-4 text-xs space-y-3">
              <div className="text-slate-500 font-mono uppercase tracking-wider">{language === 'ru' ? 'Версия ПО' : 'Software Version'}</div>
              <div className="font-mono text-white flex items-center justify-between">
                <span>v1.0.1</span>
                <span className="text-emerald-500">LIVE</span>
              </div>
              <div className="text-slate-500 font-mono uppercase tracking-wider">{language === 'ru' ? 'База данных' : 'Database Status'}</div>
              <div className="font-mono text-white">
                PostgreSQL
              </div>
            </div>
          </div>
        </aside>

        {/* Dashboard Main Content Area */}
        <main className="space-y-8">
          
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Header */}
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">
                  {language === 'ru' ? 'Командный пульт lambda19' : 'lambda19 Orchestrator Panel'}
                </h1>
                <p className="text-slate-400 mt-1">
                  {language === 'ru' ? 'Реал-тайм аналитика, статус входящих заявок и контроль когнитивных агентов.' : 'Real-time analytics, inbound pipeline and cognitive agents diagnostics.'}
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

              {/* Main row */}
              <div className="w-full">
                
                {/* Visual SVG Stats Sparklines & Recent Activity */}
                <div className="glass-panel p-6 brushed-metal space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white">{language === 'ru' ? 'Кол-во заявок и вопросов по дням' : 'Daily Inquiries and Questions'}</h3>
                    <span className="text-xs text-slate-500 font-mono">Real-time simulation</span>
                  </div>
                  
                  {/* Legend */}
                  <div className="flex items-center gap-4 px-4 text-xs font-mono mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-1 bg-lambda-orange rounded-full inline-block" />
                      <span className="text-slate-400">{language === 'ru' ? 'Кол-во заявок' : 'Total Inquiries'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-1 bg-sky-400 rounded-full inline-block" />
                      <span className="text-slate-400">{language === 'ru' ? 'Кол-во вопросов консультанту' : 'Consultant Questions'}</span>
                    </div>
                  </div>
                  
                  {/* Daily Interactive High-Tech SVG Graph */}
                  <div 
                    className="w-full bg-black/40 rounded-xl p-4 border border-white/5 relative flex flex-col justify-between"
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
                    
                    <div className="w-full h-[340px] relative z-10 mt-2">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 500 200" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="areaGradOrange" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#F27D26" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#F27D26" stopOpacity="0.0" />
                          </linearGradient>
                          <linearGradient id="areaGradSky" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.15" />
                            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        
                        {/* Horizontal Grid Lines */}
                        <g stroke="rgba(255, 255, 255, 0.04)" strokeDasharray="2 2" strokeWidth="1">
                          <line x1="55" y1="15" x2="480" y2="15" />
                          <line x1="55" y1="44" x2="480" y2="44" />
                          <line x1="55" y1="73" x2="480" y2="73" />
                          <line x1="55" y1="102" x2="480" y2="102" />
                          <line x1="55" y1="131" x2="480" y2="131" />
                          <line x1="55" y1="160" x2="480" y2="160" stroke="rgba(255, 255, 255, 0.12)" strokeDasharray="none" />
                        </g>

                        {/* Y-Axis Labels */}
                        <g className="select-none font-mono text-[9px] fill-slate-500">
                          <text x="42" y="19" textAnchor="end">1000</text>
                          <text x="42" y="48" textAnchor="end">800</text>
                          <text x="42" y="77" textAnchor="end">600</text>
                          <text x="42" y="106" textAnchor="end">400</text>
                          <text x="42" y="135" textAnchor="end">200</text>
                          <text x="42" y="164" textAnchor="end">1</text>
                        </g>

                        {/* X-Axis Labels (Dates) */}
                        <g className="select-none font-mono text-[9px] fill-slate-500">
                          {dailyData.map((d, i) => (
                            <text key={i} x={getChartX(i)} y="185" textAnchor="middle">
                              {d.date}
                            </text>
                          ))}
                        </g>

                        {/* Interactive Vertical Dashed Hover Guideline */}
                        {hoveredIndex !== null && (
                          <line 
                            x1={getChartX(hoveredIndex)} 
                            y1="15" 
                            x2={getChartX(hoveredIndex)} 
                            y2="160" 
                            stroke="rgba(255, 255, 255, 0.15)" 
                            strokeDasharray="3 3" 
                            strokeWidth="1.5" 
                          />
                        )}

                        {/* Area Paths */}
                        <path d={inquiriesAreaPath} fill="url(#areaGradOrange)" className="pointer-events-none" />
                        <path d={questionsAreaPath} fill="url(#areaGradSky)" className="pointer-events-none" />
                        
                        {/* Line Paths */}
                        <path 
                          d={inquiriesLinePath} 
                          fill="none" 
                          stroke="#F27D26" 
                          strokeWidth="2.5" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          className="pointer-events-none"
                        />
                        <path 
                          d={questionsLinePath} 
                          fill="none" 
                          stroke="#38bdf8" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          className="pointer-events-none"
                        />
                        
                        {/* Interactive Circles / Dots */}
                        {dailyData.map((d, i) => (
                          <g key={i} className="pointer-events-none">
                            {/* Orange dots for Inquiries */}
                            <circle 
                              cx={getChartX(i)} 
                              cy={getChartY(d.inquiries)} 
                              r={hoveredIndex === i ? "5.5" : "3.5"} 
                              fill="#F27D26" 
                              stroke="#0F1113" 
                              strokeWidth={hoveredIndex === i ? "2" : "1"}
                              className="transition-all duration-150" 
                            />
                            {/* Sky dots for Questions */}
                            <circle 
                              cx={getChartX(i)} 
                              cy={getChartY(d.questions)} 
                              r={hoveredIndex === i ? "5.5" : "3.5"} 
                              fill="#38bdf8" 
                              stroke="#0F1113" 
                              strokeWidth={hoveredIndex === i ? "2" : "1"}
                              className="transition-all duration-150" 
                            />
                          </g>
                        ))}

                        {/* Transparent Hover Target Blocks */}
                        {dailyData.map((_, i) => {
                          const width = 425 / 6;
                          const xStart = getChartX(i) - width / 2;
                          return (
                            <rect
                              key={i}
                              x={xStart}
                              y="10"
                              width={width}
                              height="170"
                              fill="transparent"
                              className="cursor-pointer"
                              onMouseEnter={() => setHoveredIndex(i)}
                            />
                          );
                        })}
                      </svg>
                    </div>

                    {/* Absolutely Positioned Rich Tooltip */}
                    {hoveredIndex !== null && (
                      <div 
                        className="absolute bg-slate-950/95 border border-white/10 p-2.5 rounded-lg shadow-2xl z-20 pointer-events-none text-xs transition-all duration-150 min-w-[150px]"
                        style={{
                          left: `${((getChartX(hoveredIndex) - 10) / 500) * 100}%`,
                          top: '15px',
                          transform: 'translateX(-50%)',
                        }}
                      >
                        <div className="font-bold text-slate-300 mb-1 border-b border-white/5 pb-1">
                          {dailyData[hoveredIndex].date}
                        </div>
                        <div className="space-y-1 font-mono text-[11px]">
                          <div className="flex justify-between items-center gap-4 text-slate-300">
                            <span className="flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-lambda-orange" />
                              {language === 'ru' ? 'Заявки' : 'Inquiries'}:
                            </span>
                            <span className="font-bold text-white">{dailyData[hoveredIndex].inquiries}</span>
                          </div>
                          <div className="flex justify-between items-center gap-4 text-slate-300">
                            <span className="flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                              {language === 'ru' ? 'Кол-во вопросов' : 'Questions'}:
                            </span>
                            <span className="font-bold text-white">{dailyData[hoveredIndex].questions}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex flex-col justify-center min-h-[82px]">
                      <div className="text-slate-400 text-xs font-mono leading-tight">{language === 'ru' ? 'Кол-во заявок' : 'Total Inquiries'}</div>
                      <div className="text-xl font-bold text-white mt-1">128</div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex flex-col justify-center min-h-[82px]">
                      <div className="text-slate-400 text-xs font-mono leading-tight">{language === 'ru' ? 'Кол-во новых вопросов консультанту' : 'New Consultant Questions'}</div>
                      <div className="text-xl font-bold text-white mt-1">56</div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex flex-col justify-center min-h-[82px]">
                      <div className="text-slate-400 text-xs font-mono leading-tight">{language === 'ru' ? 'Ошибки API' : 'Gateway Errors'}</div>
                      <div className="text-xl font-bold text-white mt-1">0.02%</div>
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
                    {language === 'ru' ? 'Анализируйте и управляйте входящими заказами на разработку AI-агентов.' : 'Process, tag, delete or append test contact leads.'}
                  </p>
                </div>
                
                <button 
                  onClick={() => setShowAddLead(!showAddLead)}
                  className="bg-lambda-orange hover:bg-orange-600 text-white px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg"
                >
                  <Plus size={16} />
                  {language === 'ru' ? 'Добавить тест-лид' : 'Add Test Lead'}
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
                    <h3 className="font-bold text-white">{language === 'ru' ? 'Добавление демонстрационной заявки' : 'Insert Mock Client Request'}</h3>
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
                          placeholder="e.g. Константин"
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
                          placeholder="e.g. @konstantin"
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
                        placeholder="Опишите задачу..."
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-lambda-orange resize-none"
                      />
                    </div>
                    <button className="bg-lambda-orange hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm cursor-pointer">
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
                        {language === 'ru' ? 'Выберите заявку для просмотра деталей' : 'Select a lead to view telemetry'}
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
                    className="px-4 py-3 rounded-xl bg-lambda-orange hover:brightness-110 text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
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

          {activeTab === 'agents' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">
                  {language === 'ru' ? 'Мониторинг агента' : 'Agent Monitoring'}
                </h1>
                <p className="text-slate-400 mt-1">
                  {language === 'ru' ? 'Просмотр диалогов AI-ассистента с клиентами в реальном времени.' : 'View real-time conversations between the AI agent and clients.'}
                </p>
              </div>

              {/* Layout for Dialogues: List on left, Chat window on right */}
              <div className="grid lg:grid-cols-[340px_1fr] gap-6 text-left">
                
                {/* Conversations Sidebar List */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center pl-2">
                    <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                      {language === 'ru' ? 'Активные диалоги' : 'Active Dialogues'}
                    </span>
                    <span className="bg-lambda-orange/10 text-lambda-orange text-xs px-2 py-0.5 rounded-full font-bold">
                      {dialogs.length}
                    </span>
                  </div>

                  <div className="space-y-2.5 h-[750px] overflow-y-auto pr-1">
                    {dialogs.length === 0 ? (
                      <div className="glass-panel p-6 text-center text-slate-500 text-sm">
                        {language === 'ru' ? 'Нет активных диалогов' : 'No active dialogues'}
                      </div>
                    ) : (
                      dialogs.map(dialog => {
                        const lastMsg = dialog.messages[dialog.messages.length - 1];
                        const isSelected = selectedDialogId === dialog.id;
                        
                        return (
                          <div
                            key={dialog.id}
                            onClick={() => setSelectedDialogId(dialog.id)}
                            className={`glass-panel p-4 cursor-pointer transition-all border text-left ${
                              isSelected
                                ? 'border-lambda-orange bg-lambda-orange/5 shadow-[0_0_15px_rgba(242,125,38,0.15)]'
                                : 'border-white/5 hover:border-white/15 hover:bg-white/[0.01]'
                            }`}
                          >
                            <div className="flex justify-between items-start gap-2">
                              <div className="flex items-center gap-2">
                                <div className="p-1.5 rounded-lg bg-lambda-orange/10 text-lambda-orange">
                                  <MessageSquare size={14} />
                                </div>
                                <span className="font-bold text-white text-sm truncate max-w-[140px]">
                                  {dialog.clientName}
                                </span>
                              </div>
                              <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                                dialog.status === 'ONLINE' ? 'bg-emerald-500/15 text-emerald-400 font-semibold animate-pulse' :
                                dialog.status === 'ACTIVE' ? 'bg-blue-500/15 text-blue-400' :
                                'bg-slate-500/15 text-slate-400'
                              }`}>
                                {dialog.status}
                              </span>
                            </div>

                            <p className="text-xs text-slate-400 mt-2 line-clamp-2 font-sans">
                              {lastMsg ? lastMsg.content : (language === 'ru' ? 'Начало диалога' : 'Conversation started')}
                            </p>

                            <div className="flex justify-end items-center mt-3 pt-2.5 border-t border-white/5 text-[10px] font-mono text-slate-500">
                              <span>{lastMsg ? lastMsg.timestamp : ''}</span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Main Selected Chat View */}
                <div className="glass-panel p-5 bg-[#0B0C0E] border-white/5 flex flex-col h-[750px]">
                  {/* Selected Chat Header */}
                  {(() => {
                    const activeDialog = dialogs.find(d => d.id === selectedDialogId);
                    if (!activeDialog) {
                      return (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
                          <MessageSquare size={36} className="text-slate-600 mb-2" />
                          <p className="text-sm font-mono">
                            {language === 'ru' ? 'Выберите диалог для мониторинга' : 'Select a conversation to monitor'}
                          </p>
                        </div>
                      );
                    }

                    return (
                      <>
                        <div className="flex justify-between items-center border-b border-white/5 pb-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-lambda-orange/10 text-lambda-orange">
                              <MessageSquare size={18} />
                            </div>
                            <div>
                              <h3 className="font-bold text-white text-base leading-tight">
                                {activeDialog.clientName}
                              </h3>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="bg-white/5 text-[10px] font-mono px-2 py-1 rounded text-slate-400">
                              ENGINE: GPT-5.4-NANO
                            </span>
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold">
                              {activeDialog.status === 'ONLINE' ? 'LIVE' : 'MONITORING'}
                            </span>
                          </div>
                        </div>

                        {/* Chat Messages Thread */}
                        <div className="flex-1 my-4 overflow-y-auto space-y-4 pr-1 select-text scrollbar-thin">
                          {activeDialog.messages.map((msg, index) => {
                            const isUser = msg.role === 'user';
                            const msgId = `${activeDialog.id}_${index}`;
                            const hasThoughts = msg.thoughtChain && msg.thoughtChain.length > 0;
                            const isThoughtsExpanded = expandedThoughts[msgId];

                            return (
                              <div key={index} className="space-y-1.5">
                                <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                                    isUser
                                      ? 'bg-white/5 border border-white/10 text-slate-200'
                                      : 'bg-lambda-orange/5 border border-lambda-orange/20 text-white'
                                  }`}>
                                    <div className="font-sans whitespace-pre-line leading-relaxed">
                                      {msg.content}
                                    </div>
                                    <div className="flex justify-between items-center mt-2 pt-1 border-t border-white/5 text-[9px] font-mono text-slate-500">
                                      <span>
                                        {isUser 
                                          ? (language === 'ru' ? 'Клиент' : 'Customer') 
                                          : (language === 'ru' ? 'ИИ Агент' : 'AI Agent')
                                        }
                                      </span>
                                      <span>{msg.timestamp}</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Thought chain panel under AI response */}
                                {!isUser && hasThoughts && (
                                  <div className="pl-2 text-left">
                                    <button
                                      onClick={() => setExpandedThoughts(prev => ({ ...prev, [msgId]: !isThoughtsExpanded }))}
                                      className="flex items-center gap-1.5 text-[10px] font-mono text-lambda-orange hover:text-orange-400 transition-colors uppercase font-bold"
                                    >
                                      <Terminal size={12} />
                                      {isThoughtsExpanded 
                                        ? (language === 'ru' ? 'Скрыть когнитивный след' : 'Hide reasoning path') 
                                        : (language === 'ru' ? 'Показать когнитивный след ИИ' : 'View AI reasoning path')
                                      }
                                    </button>

                                    {isThoughtsExpanded && (
                                      <div className="mt-1.5 bg-black/60 rounded-xl p-3 border border-white/5 font-mono text-[10px] text-slate-400 space-y-1 text-left">
                                        {msg.thoughtChain!.map((thought, tidx) => (
                                          <div key={tidx} className="flex gap-2">
                                            <span className="text-lambda-orange select-none">{`>`}</span>
                                            <span>{thought}</span>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}

                          {/* Simulated response indicator removed */}
                        </div>
                      </>
                    );
                  })()}
                </div>

              </div>
            </div>
          )}

          {/* CONFIGURATION & INTEGRATIONS TAB */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">
                  {language === 'ru' ? 'Системные интеграции и API' : 'System Integrations & API Config'}
                </h1>
                <p className="text-slate-400 mt-1">
                  {language === 'ru' ? 'Настройка провайдеров больших языковых моделей, токенов безопасности и CORS.' : 'Configure LLM model providers, environment secret variables, webhooks, and telemetry rules.'}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 text-left">
                
                {/* AI Providers Section */}
                <div className="glass-panel p-6 brushed-metal space-y-4">
                  <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                    <ShieldCheck className="text-lambda-orange" size={20} />
                    <h3 className="font-bold text-white">{language === 'ru' ? 'Провайдеры ИИ-моделей' : 'LLM Engines Orchestrator'}</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs text-slate-400 block font-mono">{language === 'ru' ? 'ОСНОВНАЯ LLM' : 'PRIMARY LLM GATEWAY'}</label>
                      <select className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-lambda-orange">
                        <option>GPT-5.4 Nano (OpenAI API)</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs text-slate-400 block font-mono">{language === 'ru' ? 'ВЕКТОРНАЯ БД СВЯЗЕЙ' : 'VECTOR DATABASE EMBEDDINGS'}</label>
                      <select className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-lambda-orange">
                        <option>Pinecone Serverless (us-east-1)</option>
                        <option>ChromaDB Local Cluster</option>
                        <option>Qdrant Cloud Managed</option>
                      </select>
                    </div>

                    <div className="pt-2">
                      <label className="flex items-center gap-3 cursor-pointer text-sm text-slate-300">
                        <input type="checkbox" defaultChecked className="rounded border-white/10 bg-black text-lambda-orange focus:ring-0 focus:ring-offset-0" />
                        <span>{language === 'ru' ? 'Включить кеширование ответов' : 'Enable response caching (Reduces costs)'}</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* API Gateways */}
                <div className="glass-panel p-6 brushed-metal space-y-4">
                  <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                    <UserCheck className="text-lambda-orange" size={20} />
                    <h3 className="font-bold text-white">{language === 'ru' ? 'Шлюзы интеграций & CORS' : 'API Endpoints & Gateways'}</h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <span className="text-xs text-slate-400 block font-mono mb-1">{language === 'ru' ? 'ВЕБХУК ДЛЯ ЛИДОВ (CRM)' : 'INBOUND CRM WEBHOOK'}</span>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          readOnly 
                          value="https://api.lambda19.systems/v1/leads/webhook" 
                          className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-400 select-all font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <span className="text-xs text-slate-400 block font-mono mb-1">{language === 'ru' ? 'КЛЮЧ ТЕЛЕМЕТРИИ' : 'TELEMETRY ACCESS TOKEN'}</span>
                      <div className="flex gap-2">
                        <input 
                          type="password" 
                          readOnly 
                          value="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" 
                          className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-400 select-all font-mono"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <label className="flex items-center gap-3 cursor-pointer text-sm text-slate-300">
                        <input type="checkbox" defaultChecked className="rounded border-white/10 bg-black text-lambda-orange focus:ring-0 focus:ring-offset-0" />
                        <span>{language === 'ru' ? 'Дублировать лиды на email' : 'Mirror new leads to system email'}</span>
                      </label>
                    </div>
                  </div>
                </div>

              </div>

              {/* System Warnings Panel */}
              <div className="glass-panel p-6 border-yellow-500/10 bg-yellow-500/[0.01] flex gap-4 items-start text-left">
                <AlertTriangle className="text-yellow-500 shrink-0" size={24} />
                <div>
                  <h4 className="font-bold text-yellow-500 text-sm font-mono">{language === 'ru' ? 'ПРЕДУПРЕЖДЕНИЕ БЕЗОПАСНОСТИ' : 'CYBERSECURITY COMPLIANCE NOTIFICATION'}</h4>
                  <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                    {language === 'ru' ? 'Заявки сохраняются централизованно в PostgreSQL. Просмотр, изменение статуса, заметок и удаление доступны только после авторизации администратора.' : 'Leads are stored centrally in PostgreSQL. Viewing, changing statuses or notes, and deletion require administrator authentication.'}
                  </p>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
