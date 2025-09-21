'use client'

import React, { useState, useEffect } from 'react'
import { 
  BarChart3, 
  FileText, 
  Users, 
  Building2, 
  CreditCard, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  TrendingUp,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Plus,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  DollarSign,
  Package,
  Truck,
  ClipboardCheck,
  BarChart,
  FileBarChart,
  Shield,
  HelpCircle,
  ChevronDown,
  Calendar,
  MapPin,
  Phone,
  Mail,
  User,
  Save,
  Trash2,
  Upload,
  FileDown,
  History,
  AlertTriangle
} from 'lucide-react'
import { useLocalStorage } from '@/hooks/useLocalStorage'

// Tipos e interfaces
interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'school_manager' | 'analyst' | 'auditor' | 'support' | 'observer'
  school?: string
  permissions: string[]
}

interface School {
  id: string
  inep: string
  cnpj: string
  name: string
  address: string
  phone: string
  email: string
  manager: string
  regional: string
  bankAccount: string
  status: 'active' | 'inactive'
}

interface Program {
  id: string
  code: string
  name: string
  description: string
  startDate: string
  endDate: string
  totalAmount: number
  status: 'active' | 'inactive' | 'completed'
}

interface Expense {
  id: string
  program: string
  action: string
  regional: string
  school: string
  issueDate: string
  nature: string
  amount: number
  supplier: string
  invoice: string
  document?: string
  documentUrl?: string
  status: 'pending' | 'classified' | 'approved' | 'rejected'
  classification?: string
  createdAt: string
  updatedAt: string
  createdBy: string
  isDeleted?: boolean
  deletedAt?: string
  deletedBy?: string
  history: ExpenseHistory[]
}

interface ExpenseHistory {
  id: string
  expenseId: string
  action: 'created' | 'updated' | 'deleted' | 'restored'
  changes: Record<string, { old: any, new: any }>
  timestamp: string
  userId: string
  userName: string
}

interface AccountingReport {
  id: string
  period: string
  school: string
  program: string
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'complementation'
  submissionDate?: string
  reviewDate?: string
  approvalDate?: string
  totalExpenses: number
  documentsCount: number
  pendingDocuments: number
  reviewer?: string
  comments?: string
}

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'error' | 'success'
  read: boolean
  priority: 'low' | 'medium' | 'high'
  createdAt: string
  userId: string
}

// Componente principal
export default function AccountingSystem() {
  const [currentUser, setCurrentUser] = useLocalStorage<User | null>('currentUser', null)
  const [activeModule, setActiveModule] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [notifications, setNotifications] = useLocalStorage<Notification[]>('notifications', [])
  const [schools, setSchools] = useLocalStorage<School[]>('schools', [])
  const [programs, setPrograms] = useLocalStorage<Program[]>('programs', [])
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('expenses', [])
  const [reports, setReports] = useLocalStorage<AccountingReport[]>('reports', [])

  // Estados para filtros
  const [selectedYear, setSelectedYear] = useState('2024')
  const [selectedSchool, setSelectedSchool] = useState('all')
  const [selectedProgram, setSelectedProgram] = useState('all')

  // Estados para modal de despesa
  const [showExpenseModal, setShowExpenseModal] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [showExpenseHistory, setShowExpenseHistory] = useState<string | null>(null)

  // Estados para filtros de despesas
  const [expenseFilters, setExpenseFilters] = useState({
    program: '',
    action: '',
    regional: '',
    school: '',
    nature: '',
    status: '',
    dateFrom: '',
    dateTo: '',
    minAmount: '',
    maxAmount: ''
  })

  // Login inicial
  useEffect(() => {
    if (!currentUser) {
      setCurrentUser({
        id: '1',
        name: 'Administrador Sistema',
        email: 'admin@sistema.gov.br',
        role: 'admin',
        permissions: ['all']
      })
    }
  }, [currentUser, setCurrentUser])

  // Dados mockados iniciais
  useEffect(() => {
    if (schools.length === 0) {
      setSchools([
        {
          id: '1',
          inep: '29123456',
          cnpj: '12.345.678/0001-90',
          name: 'Escola Municipal João Silva',
          address: 'Rua das Flores, 123 - Salvador/BA',
          phone: '(71) 3333-4444',
          email: 'joao.silva@edu.salvador.ba.gov.br',
          manager: 'Maria Santos',
          regional: 'Regional Centro',
          bankAccount: '001-12345-6',
          status: 'active'
        },
        {
          id: '2',
          inep: '29123457',
          cnpj: '12.345.678/0001-91',
          name: 'Escola Municipal Ana Costa',
          address: 'Av. Principal, 456 - Salvador/BA',
          phone: '(71) 3333-5555',
          email: 'ana.costa@edu.salvador.ba.gov.br',
          manager: 'João Oliveira',
          regional: 'Regional Norte',
          bankAccount: '001-12345-7',
          status: 'active'
        }
      ])
    }

    if (programs.length === 0) {
      setPrograms([
        {
          id: '1',
          code: 'PDDE-2024',
          name: 'Programa Dinheiro Direto na Escola',
          description: 'Recursos para manutenção e pequenos reparos',
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          totalAmount: 500000,
          status: 'active'
        },
        {
          id: '2',
          code: 'PNAE-2024',
          name: 'Programa Nacional de Alimentação Escolar',
          description: 'Recursos para alimentação escolar',
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          totalAmount: 1200000,
          status: 'active'
        }
      ])
    }

    if (expenses.length === 0) {
      const now = new Date().toISOString()
      setExpenses([
        {
          id: '1',
          program: 'PDDE-2024',
          action: 'Manutenção Predial',
          regional: 'Regional Centro',
          school: 'Escola Municipal João Silva',
          issueDate: '2024-03-15',
          nature: 'Material de Construção',
          amount: 2500.00,
          supplier: 'Construção & Cia Ltda',
          invoice: 'NF-001234',
          document: 'DOC-2024-001',
          status: 'pending',
          createdAt: now,
          updatedAt: now,
          createdBy: '1',
          history: []
        },
        {
          id: '2',
          program: 'PNAE-2024',
          action: 'Alimentação Escolar',
          regional: 'Regional Norte',
          school: 'Escola Municipal Ana Costa',
          issueDate: '2024-03-20',
          nature: 'Gêneros Alimentícios',
          amount: 3200.00,
          supplier: 'Alimentos Frescos S/A',
          invoice: 'NF-005678',
          document: 'DOC-2024-002',
          status: 'classified',
          createdAt: now,
          updatedAt: now,
          createdBy: '1',
          history: []
        }
      ])
    }

    if (reports.length === 0) {
      setReports([
        {
          id: '1',
          period: '2024-Q1',
          school: 'Escola Municipal João Silva',
          program: 'PDDE-2024',
          status: 'under_review',
          submissionDate: '2024-04-05',
          totalExpenses: 12500.00,
          documentsCount: 15,
          pendingDocuments: 2,
          reviewer: 'Ana Fiscal'
        },
        {
          id: '2',
          period: '2024-Q1',
          school: 'Escola Municipal Ana Costa',
          program: 'PNAE-2024',
          status: 'approved',
          submissionDate: '2024-04-03',
          reviewDate: '2024-04-10',
          approvalDate: '2024-04-12',
          totalExpenses: 28300.00,
          documentsCount: 22,
          pendingDocuments: 0,
          reviewer: 'Carlos Auditor'
        }
      ])
    }

    if (notifications.length === 0) {
      setNotifications([
        {
          id: '1',
          title: 'Prestação de Contas Pendente',
          message: 'Escola Municipal João Silva tem prestação pendente para Q1/2024',
          type: 'warning',
          read: false,
          priority: 'high',
          createdAt: '2024-04-15T10:30:00Z',
          userId: '1'
        },
        {
          id: '2',
          title: 'Documentos Aprovados',
          message: 'Prestação da Escola Ana Costa foi aprovada',
          type: 'success',
          read: false,
          priority: 'medium',
          createdAt: '2024-04-12T14:20:00Z',
          userId: '1'
        }
      ])
    }
  }, [schools, programs, expenses, reports, notifications, setSchools, setPrograms, setExpenses, setReports, setNotifications])

  // Funções CRUD para despesas
  const createExpense = (expenseData: Omit<Expense, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'history'>) => {
    const now = new Date().toISOString()
    const newExpense: Expense = {
      ...expenseData,
      id: Date.now().toString(),
      createdAt: now,
      updatedAt: now,
      createdBy: currentUser?.id || '1',
      history: [{
        id: Date.now().toString(),
        expenseId: '',
        action: 'created',
        changes: {},
        timestamp: now,
        userId: currentUser?.id || '1',
        userName: currentUser?.name || 'Sistema'
      }]
    }
    newExpense.history[0].expenseId = newExpense.id
    
    setExpenses(prev => [...prev, newExpense])
    return newExpense
  }

  const updateExpense = (id: string, updates: Partial<Expense>) => {
    setExpenses(prev => prev.map(expense => {
      if (expense.id === id) {
        const now = new Date().toISOString()
        const changes: Record<string, { old: any, new: any }> = {}
        
        // Registrar mudanças
        Object.keys(updates).forEach(key => {
          if (updates[key as keyof Expense] !== expense[key as keyof Expense]) {
            changes[key] = {
              old: expense[key as keyof Expense],
              new: updates[key as keyof Expense]
            }
          }
        })

        const historyEntry: ExpenseHistory = {
          id: Date.now().toString(),
          expenseId: id,
          action: 'updated',
          changes,
          timestamp: now,
          userId: currentUser?.id || '1',
          userName: currentUser?.name || 'Sistema'
        }

        return {
          ...expense,
          ...updates,
          updatedAt: now,
          history: [...expense.history, historyEntry]
        }
      }
      return expense
    }))
  }

  const deleteExpense = (id: string) => {
    const now = new Date().toISOString()
    setExpenses(prev => prev.map(expense => {
      if (expense.id === id) {
        const historyEntry: ExpenseHistory = {
          id: Date.now().toString(),
          expenseId: id,
          action: 'deleted',
          changes: { isDeleted: { old: false, new: true } },
          timestamp: now,
          userId: currentUser?.id || '1',
          userName: currentUser?.name || 'Sistema'
        }

        return {
          ...expense,
          isDeleted: true,
          deletedAt: now,
          deletedBy: currentUser?.id || '1',
          updatedAt: now,
          history: [...expense.history, historyEntry]
        }
      }
      return expense
    }))
  }

  const restoreExpense = (id: string) => {
    const now = new Date().toISOString()
    setExpenses(prev => prev.map(expense => {
      if (expense.id === id) {
        const historyEntry: ExpenseHistory = {
          id: Date.now().toString(),
          expenseId: id,
          action: 'restored',
          changes: { isDeleted: { old: true, new: false } },
          timestamp: now,
          userId: currentUser?.id || '1',
          userName: currentUser?.name || 'Sistema'
        }

        return {
          ...expense,
          isDeleted: false,
          deletedAt: undefined,
          deletedBy: undefined,
          updatedAt: now,
          history: [...expense.history, historyEntry]
        }
      }
      return expense
    }))
  }

  // Filtrar despesas
  const filteredExpenses = expenses.filter(expense => {
    if (expense.isDeleted) return false
    
    return (
      (!expenseFilters.program || expense.program.toLowerCase().includes(expenseFilters.program.toLowerCase())) &&
      (!expenseFilters.action || expense.action.toLowerCase().includes(expenseFilters.action.toLowerCase())) &&
      (!expenseFilters.regional || expense.regional.toLowerCase().includes(expenseFilters.regional.toLowerCase())) &&
      (!expenseFilters.school || expense.school.toLowerCase().includes(expenseFilters.school.toLowerCase())) &&
      (!expenseFilters.nature || expense.nature.toLowerCase().includes(expenseFilters.nature.toLowerCase())) &&
      (!expenseFilters.status || expense.status === expenseFilters.status) &&
      (!expenseFilters.dateFrom || expense.issueDate >= expenseFilters.dateFrom) &&
      (!expenseFilters.dateTo || expense.issueDate <= expenseFilters.dateTo) &&
      (!expenseFilters.minAmount || expense.amount >= parseFloat(expenseFilters.minAmount)) &&
      (!expenseFilters.maxAmount || expense.amount <= parseFloat(expenseFilters.maxAmount))
    )
  })

  // Exportar dados
  const exportToCSV = () => {
    const headers = ['Programa', 'Ação', 'Regional', 'Escola', 'Emissão', 'Natureza', 'Valor R$', 'Emitente', 'NF°', 'Status']
    const csvContent = [
      headers.join(','),
      ...filteredExpenses.map(expense => [
        expense.program,
        expense.action,
        expense.regional,
        expense.school,
        expense.issueDate,
        expense.nature,
        expense.amount.toFixed(2),
        expense.supplier,
        expense.invoice,
        expense.status
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `despesas_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportToXLSX = () => {
    // Simulação de exportação XLSX
    const data = filteredExpenses.map(expense => ({
      'Programa': expense.program,
      'Ação': expense.action,
      'Regional': expense.regional,
      'Escola': expense.school,
      'Emissão': expense.issueDate,
      'Natureza': expense.nature,
      'Valor R$': expense.amount,
      'Emitente': expense.supplier,
      'NF°': expense.invoice,
      'Status': expense.status
    }))
    
    console.log('Exportando para XLSX:', data)
    alert('Funcionalidade de exportação XLSX será implementada com biblioteca específica')
  }

  // Componente de Login
  const LoginScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Sistema de Prestação de Contas</h1>
          <p className="text-gray-600 mt-2">Secretaria Municipal da Educação</p>
        </div>
        
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="seu.email@gov.br"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Senha
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span className="ml-2 text-sm text-gray-600">Lembrar-me</span>
            </label>
            <a href="#" className="text-sm text-blue-600 hover:text-blue-500">
              Esqueceu a senha?
            </a>
          </div>
          
          <button
            type="button"
            onClick={() => setCurrentUser({
              id: '1',
              name: 'Administrador Sistema',
              email: 'admin@sistema.gov.br',
              role: 'admin',
              permissions: ['all']
            })}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Entrar no Sistema
          </button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">Perfis de Acesso:</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button className="p-2 bg-gray-100 rounded hover:bg-gray-200 transition-colors">
                👨‍💼 Administrador
              </button>
              <button className="p-2 bg-gray-100 rounded hover:bg-gray-200 transition-colors">
                🏫 Gestor Escolar
              </button>
              <button className="p-2 bg-gray-100 rounded hover:bg-gray-200 transition-colors">
                📊 Analista
              </button>
              <button className="p-2 bg-gray-100 rounded hover:bg-gray-200 transition-colors">
                🔍 Auditor
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // Modal de Despesa
  const ExpenseModal = () => {
    const [formData, setFormData] = useState<Partial<Expense>>({
      program: '',
      action: '',
      regional: '',
      school: '',
      issueDate: '',
      nature: '',
      amount: 0,
      supplier: '',
      invoice: '',
      document: '',
      status: 'pending'
    })

    const [documentFile, setDocumentFile] = useState<File | null>(null)
    const [errors, setErrors] = useState<Record<string, string>>({})

    useEffect(() => {
      if (editingExpense) {
        setFormData(editingExpense)
      } else {
        setFormData({
          program: '',
          action: '',
          regional: '',
          school: '',
          issueDate: '',
          nature: '',
          amount: 0,
          supplier: '',
          invoice: '',
          document: '',
          status: 'pending'
        })
      }
    }, [editingExpense])

    const validateForm = () => {
      const newErrors: Record<string, string> = {}

      if (!formData.program) newErrors.program = 'Programa é obrigatório'
      if (!formData.action) newErrors.action = 'Ação é obrigatória'
      if (!formData.regional) newErrors.regional = 'Regional é obrigatória'
      if (!formData.school) newErrors.school = 'Escola é obrigatória'
      if (!formData.issueDate) newErrors.issueDate = 'Data de emissão é obrigatória'
      if (!formData.nature) newErrors.nature = 'Natureza é obrigatória'
      if (!formData.amount || formData.amount <= 0) newErrors.amount = 'Valor deve ser maior que zero'
      if (!formData.supplier) newErrors.supplier = 'Emitente é obrigatório'
      if (!formData.invoice) newErrors.invoice = 'Número da NF é obrigatório'

      setErrors(newErrors)
      return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      
      if (!validateForm()) return

      if (editingExpense) {
        updateExpense(editingExpense.id, formData)
      } else {
        createExpense(formData as Omit<Expense, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'history'>)
      }

      setShowExpenseModal(false)
      setEditingExpense(null)
      setFormData({})
      setDocumentFile(null)
      setErrors({})
    }

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        setDocumentFile(file)
        setFormData(prev => ({ ...prev, document: file.name }))
      }
    }

    if (!showExpenseModal) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingExpense ? 'Editar Despesa' : 'Nova Despesa'}
              </h2>
              <button
                onClick={() => {
                  setShowExpenseModal(false)
                  setEditingExpense(null)
                  setFormData({})
                  setErrors({})
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Programa *
                </label>
                <select
                  value={formData.program || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, program: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.program ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Selecione um programa</option>
                  {programs.map(program => (
                    <option key={program.id} value={program.code}>{program.code} - {program.name}</option>
                  ))}
                </select>
                {errors.program && <p className="text-red-500 text-xs mt-1">{errors.program}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ação *
                </label>
                <input
                  type="text"
                  value={formData.action || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, action: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.action ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ex: Manutenção Predial"
                />
                {errors.action && <p className="text-red-500 text-xs mt-1">{errors.action}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Regional *
                </label>
                <select
                  value={formData.regional || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, regional: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.regional ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Selecione uma regional</option>
                  <option value="Regional Centro">Regional Centro</option>
                  <option value="Regional Norte">Regional Norte</option>
                  <option value="Regional Sul">Regional Sul</option>
                  <option value="Regional Leste">Regional Leste</option>
                  <option value="Regional Oeste">Regional Oeste</option>
                </select>
                {errors.regional && <p className="text-red-500 text-xs mt-1">{errors.regional}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Escola *
                </label>
                <select
                  value={formData.school || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, school: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.school ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Selecione uma escola</option>
                  {schools.map(school => (
                    <option key={school.id} value={school.name}>{school.name}</option>
                  ))}
                </select>
                {errors.school && <p className="text-red-500 text-xs mt-1">{errors.school}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Emissão *
                </label>
                <input
                  type="date"
                  value={formData.issueDate || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, issueDate: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.issueDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.issueDate && <p className="text-red-500 text-xs mt-1">{errors.issueDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Natureza *
                </label>
                <select
                  value={formData.nature || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, nature: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.nature ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Selecione a natureza</option>
                  <option value="Material de Construção">Material de Construção</option>
                  <option value="Material de Limpeza">Material de Limpeza</option>
                  <option value="Material de Expediente">Material de Expediente</option>
                  <option value="Gêneros Alimentícios">Gêneros Alimentícios</option>
                  <option value="Serviços de Manutenção">Serviços de Manutenção</option>
                  <option value="Serviços de Limpeza">Serviços de Limpeza</option>
                  <option value="Equipamentos">Equipamentos</option>
                  <option value="Outros">Outros</option>
                </select>
                {errors.nature && <p className="text-red-500 text-xs mt-1">{errors.nature}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valor R$ *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.amount ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0,00"
                />
                {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Emitente *
                </label>
                <input
                  type="text"
                  value={formData.supplier || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, supplier: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.supplier ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Nome do fornecedor"
                />
                {errors.supplier && <p className="text-red-500 text-xs mt-1">{errors.supplier}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  NF° (Número da Nota Fiscal) *
                </label>
                <input
                  type="text"
                  value={formData.invoice || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, invoice: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.invoice ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ex: NF-001234"
                />
                {errors.invoice && <p className="text-red-500 text-xs mt-1">{errors.invoice}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status || 'pending'}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="pending">Pendente</option>
                  <option value="classified">Classificado</option>
                  <option value="approved">Aprovado</option>
                  <option value="rejected">Rejeitado</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Anexar Documento
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  className="hidden"
                  id="document-upload"
                />
                <label htmlFor="document-upload" className="cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    Clique para selecionar ou arraste o arquivo aqui
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PDF, JPG, PNG, DOC, DOCX (máx. 10MB)
                  </p>
                </label>
                {documentFile && (
                  <div className="mt-3 p-2 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">{documentFile.name}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  setShowExpenseModal(false)
                  setEditingExpense(null)
                  setFormData({})
                  setErrors({})
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{editingExpense ? 'Atualizar' : 'Salvar'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  // Modal de Histórico
  const ExpenseHistoryModal = () => {
    const expense = expenses.find(e => e.id === showExpenseHistory)
    if (!expense || !showExpenseHistory) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Histórico da Despesa - {expense.invoice}
              </h2>
              <button
                onClick={() => setShowExpenseHistory(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              {expense.history.map((entry) => (
                <div key={entry.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${
                        entry.action === 'created' ? 'bg-green-500' :
                        entry.action === 'updated' ? 'bg-blue-500' :
                        entry.action === 'deleted' ? 'bg-red-500' : 'bg-yellow-500'
                      }`} />
                      <span className="font-medium text-gray-900">
                        {entry.action === 'created' ? 'Criado' :
                         entry.action === 'updated' ? 'Atualizado' :
                         entry.action === 'deleted' ? 'Excluído' : 'Restaurado'}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(entry.timestamp).toLocaleString('pt-BR')}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">
                    Por: {entry.userName}
                  </p>

                  {Object.keys(entry.changes).length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700 mb-2">Alterações:</p>
                      <div className="space-y-1">
                        {Object.entries(entry.changes).map(([field, change]) => (
                          <div key={field} className="text-xs bg-gray-50 p-2 rounded">
                            <span className="font-medium">{field}:</span>
                            <span className="text-red-600 ml-2">"{change.old}"</span>
                            <span className="mx-2">→</span>
                            <span className="text-green-600">"{change.new}"</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Componente de Sidebar
  const Sidebar = () => {
    const menuItems = [
      { id: 'dashboard', label: 'Painel Geral', icon: Home },
      { 
        id: 'financial', 
        label: 'Financeiro', 
        icon: DollarSign,
        submenu: [
          { id: 'programs', label: 'Programas' },
          { id: 'revenues', label: 'Receitas' },
          { id: 'expenses', label: 'Despesas' }
        ]
      },
      { id: 'products', label: 'Produtos', icon: Package },
      { id: 'suppliers', label: 'Fornecedores', icon: Truck },
      { id: 'reports', label: 'Prestações', icon: ClipboardCheck },
      { id: 'analytics', label: 'Relatórios', icon: BarChart },
      { id: 'declarations', label: 'Declarações', icon: FileBarChart },
      { id: 'transparency', label: 'Portal Transparência', icon: Eye },
      { id: 'audit', label: 'Auditoria', icon: Shield },
      { id: 'help', label: 'Ajuda', icon: HelpCircle }
    ]

    return (
      <div className={`bg-white shadow-lg transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-16'} min-h-screen`}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div>
                <h2 className="font-bold text-lg text-gray-900">Contedu</h2>
                <p className="text-xs text-gray-600">Sistema de Prestação de Contas</p>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveModule(item.id)}
                  className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors ${
                    activeModule === item.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {sidebarOpen && (
                    <>
                      <span className="ml-3 font-medium">{item.label}</span>
                      {item.submenu && <ChevronDown className="w-4 h-4 ml-auto" />}
                    </>
                  )}
                </button>
                {item.submenu && sidebarOpen && activeModule === item.id && (
                  <ul className="ml-8 mt-2 space-y-1">
                    {item.submenu.map((subitem) => (
                      <li key={subitem.id}>
                        <button
                          onClick={() => setActiveModule(subitem.id)}
                          className="w-full text-left px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded"
                        >
                          {subitem.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    )
  }

  // Componente de Header
  const Header = () => (
    <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-900">
            {getModuleTitle(activeModule)}
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </select>
            
            <select
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">TODAS ESCOLAS</option>
              {schools.map((school) => (
                <option key={school.id} value={school.id}>{school.name}</option>
              ))}
            </select>
          </div>
          
          <div className="relative">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
              <Bell className="w-5 h-5 text-gray-600" />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </button>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{currentUser?.name}</p>
              <p className="text-xs text-gray-600">{getRoleLabel(currentUser?.role)}</p>
            </div>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <button
              onClick={() => setCurrentUser(null)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <LogOut className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  // Dashboard
  const Dashboard = () => {
    const totalRevenues = 1700000
    const totalExpenses = expenses.filter(e => !e.isDeleted).reduce((sum, exp) => sum + exp.amount, 0)
    const pendingClassifications = expenses.filter(exp => exp.status === 'pending' && !exp.isDeleted).length
    const pendingReports = reports.filter(rep => rep.status === 'under_review').length

    return (
      <div className="p-6 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Notas a Classificar</p>
                <p className="text-2xl font-bold text-orange-600">{pendingClassifications}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Receitas</p>
                <p className="text-2xl font-bold text-green-600">
                  R$ {totalRevenues.toLocaleString('pt-BR')}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Despesas</p>
                <p className="text-2xl font-bold text-red-600">
                  R$ {totalExpenses.toLocaleString('pt-BR')}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Prestações Pendentes</p>
                <p className="text-2xl font-bold text-blue-600">{pendingReports}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Gráfico Receitas vs Despesas */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Receitas vs Despesas - 2024</h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'].map((month, index) => {
              const revenue = Math.random() * 300000 + 100000
              const expense = Math.random() * 250000 + 80000
              const maxHeight = 200
              
              return (
                <div key={month} className="flex-1 flex flex-col items-center space-y-2">
                  <div className="w-full flex justify-center space-x-1">
                    <div
                      className="bg-green-500 w-4 rounded-t"
                      style={{ height: `${(revenue / 400000) * maxHeight}px` }}
                    />
                    <div
                      className="bg-red-500 w-4 rounded-t"
                      style={{ height: `${(expense / 400000) * maxHeight}px` }}
                    />
                  </div>
                  <span className="text-xs text-gray-600">{month}</span>
                </div>
              )
            })}
          </div>
          <div className="flex justify-center space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-sm text-gray-600">Receitas</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span className="text-sm text-gray-600">Despesas</span>
            </div>
          </div>
        </div>

        {/* Alertas e Notificações */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Alertas Recentes</h3>
            <div className="space-y-3">
              {notifications.slice(0, 3).map((notification) => (
                <div key={notification.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    notification.type === 'warning' ? 'bg-orange-500' :
                    notification.type === 'error' ? 'bg-red-500' :
                    notification.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                    <p className="text-xs text-gray-600">{notification.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Prestações por Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Em Análise</span>
                <span className="text-sm font-medium text-orange-600">
                  {reports.filter(r => r.status === 'under_review').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Aprovadas</span>
                <span className="text-sm font-medium text-green-600">
                  {reports.filter(r => r.status === 'approved').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Rejeitadas</span>
                <span className="text-sm font-medium text-red-600">
                  {reports.filter(r => r.status === 'rejected').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Rascunho</span>
                <span className="text-sm font-medium text-gray-600">
                  {reports.filter(r => r.status === 'draft').length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Módulo de Despesas
  const ExpensesModule = () => (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Despesas - {selectedYear}</h2>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowExpenseModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Despesa</span>
          </button>
          <div className="flex items-center space-x-2">
            <button 
              onClick={exportToCSV}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <FileDown className="w-4 h-4" />
              <span>CSV</span>
            </button>
            <button 
              onClick={exportToXLSX}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <FileDown className="w-4 h-4" />
              <span>XLSX</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Programa</label>
            <input
              type="text"
              value={expenseFilters.program}
              onChange={(e) => setExpenseFilters(prev => ({ ...prev, program: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Filtrar por programa"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Ação</label>
            <input
              type="text"
              value={expenseFilters.action}
              onChange={(e) => setExpenseFilters(prev => ({ ...prev, action: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Filtrar por ação"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Regional</label>
            <select 
              value={expenseFilters.regional}
              onChange={(e) => setExpenseFilters(prev => ({ ...prev, regional: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todas</option>
              <option value="Regional Centro">Regional Centro</option>
              <option value="Regional Norte">Regional Norte</option>
              <option value="Regional Sul">Regional Sul</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
            <select 
              value={expenseFilters.status}
              onChange={(e) => setExpenseFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos</option>
              <option value="pending">Pendente</option>
              <option value="classified">Classificado</option>
              <option value="approved">Aprovado</option>
              <option value="rejected">Rejeitado</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Valor Mín.</label>
            <input
              type="number"
              step="0.01"
              value={expenseFilters.minAmount}
              onChange={(e) => setExpenseFilters(prev => ({ ...prev, minAmount: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0,00"
            />
          </div>
        </div>
      </div>

      {/* Tabela de Despesas */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Programa</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ação</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Emissão</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Natureza</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor R$</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Emitente</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NF°</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredExpenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{expense.program}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{expense.action}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(expense.issueDate).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{expense.nature}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    R$ {expense.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{expense.supplier}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{expense.invoice}</td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      expense.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                      expense.status === 'classified' ? 'bg-blue-100 text-blue-800' :
                      expense.status === 'approved' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {expense.status === 'pending' ? 'Pendente' :
                       expense.status === 'classified' ? 'Classificado' :
                       expense.status === 'approved' ? 'Aprovado' : 'Rejeitado'}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      {expense.document && (
                        <button 
                          className="p-1 text-blue-600 hover:text-blue-800"
                          title="Visualizar documento"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      <button 
                        onClick={() => {
                          setEditingExpense(expense)
                          setShowExpenseModal(true)
                        }}
                        className="p-1 text-gray-600 hover:text-gray-800"
                        title="Editar despesa"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setShowExpenseHistory(expense.id)}
                        className="p-1 text-gray-600 hover:text-gray-800"
                        title="Ver histórico"
                      >
                        <History className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => {
                          if (confirm('Tem certeza que deseja excluir esta despesa?')) {
                            deleteExpense(expense.id)
                          }
                        }}
                        className="p-1 text-red-600 hover:text-red-800"
                        title="Excluir despesa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-700">
              Mostrando {filteredExpenses.length} despesas • Total: R$ {filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100">
                Anterior
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100">
                Próximo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modais */}
      <ExpenseModal />
      <ExpenseHistoryModal />
    </div>
  )

  // Módulo de Prestações
  const ReportsModule = () => (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Prestações de Contas</h2>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Nova Prestação</span>
          </button>
        </div>
      </div>

      {/* Cards de Prestações */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {reports.map((report) => (
          <div key={report.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{report.school}</h3>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                report.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                report.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                report.status === 'under_review' ? 'bg-orange-100 text-orange-800' :
                report.status === 'approved' ? 'bg-green-100 text-green-800' :
                report.status === 'rejected' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {report.status === 'draft' ? 'Rascunho' :
                 report.status === 'submitted' ? 'Enviado' :
                 report.status === 'under_review' ? 'Em Análise' :
                 report.status === 'approved' ? 'Aprovado' :
                 report.status === 'rejected' ? 'Rejeitado' : 'Complementação'}
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Período:</span>
                <span className="font-medium">{report.period}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Programa:</span>
                <span className="font-medium">{report.program}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Total Despesas:</span>
                <span className="font-medium">R$ {report.totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Documentos:</span>
                <span className="font-medium">{report.documentsCount} total</span>
              </div>
              {report.pendingDocuments > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Pendentes:</span>
                  <span className="font-medium text-orange-600">{report.pendingDocuments}</span>
                </div>
              )}
              {report.submissionDate && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Enviado em:</span>
                  <span className="font-medium">{new Date(report.submissionDate).toLocaleDateString('pt-BR')}</span>
                </div>
              )}
              {report.reviewer && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Revisor:</span>
                  <span className="font-medium">{report.reviewer}</span>
                </div>
              )}
            </div>
            
            <div className="mt-6 flex items-center space-x-2">
              <button className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                Visualizar
              </button>
              {report.status === 'draft' && (
                <button className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors">
                  Editar
                </button>
              )}
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  // Função para obter título do módulo
  const getModuleTitle = (module: string) => {
    const titles: { [key: string]: string } = {
      dashboard: 'Painel Geral',
      financial: 'Financeiro',
      programs: 'Programas',
      revenues: 'Receitas',
      expenses: 'Despesas',
      products: 'Produtos',
      suppliers: 'Fornecedores',
      reports: 'Prestações de Contas',
      analytics: 'Relatórios',
      declarations: 'Declarações',
      transparency: 'Portal de Transparência',
      audit: 'Auditoria',
      help: 'Ajuda'
    }
    return titles[module] || 'Sistema'
  }

  // Função para obter label do papel
  const getRoleLabel = (role?: string) => {
    const labels: { [key: string]: string } = {
      admin: 'Administrador',
      school_manager: 'Gestor Escolar',
      analyst: 'Analista',
      auditor: 'Auditor',
      support: 'Suporte',
      observer: 'Observador'
    }
    return labels[role || ''] || 'Usuário'
  }

  // Renderizar conteúdo do módulo ativo
  const renderActiveModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <Dashboard />
      case 'expenses':
        return <ExpensesModule />
      case 'reports':
        return <ReportsModule />
      default:
        return (
          <div className="p-6">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Módulo em Desenvolvimento</h3>
              <p className="text-gray-600">Este módulo está sendo desenvolvido e estará disponível em breve.</p>
            </div>
          </div>
        )
    }
  }

  // Renderização principal
  if (!currentUser) {
    return <LoginScreen />
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto">
          {renderActiveModule()}
        </main>
      </div>
    </div>
  )
}