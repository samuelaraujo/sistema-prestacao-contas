// Tipos e interfaces para o Sistema de Prestação de Contas

export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'school_manager' | 'analyst' | 'auditor' | 'support' | 'observer'
  school?: string
  regional?: string
  permissions: string[]
  createdAt: string
  updatedAt: string
  lastLogin?: string
  status: 'active' | 'inactive' | 'blocked'
}

export interface School {
  id: string
  inep: string // Máscara: 99999999
  cnpj: string // Máscara: 99.999.999/9999-99
  name: string
  address: string
  phone: string // Máscara: (99) 99999-9999
  email: string
  manager: string
  regional: string
  bankAccount: string
  status: 'active' | 'inactive'
  educationLevels: string[]
  coordinates?: {
    lat: number
    lng: number
  }
  createdAt: string
  updatedAt: string
}

export interface Program {
  id: string
  code: string // Ex: PDDE-2024, PNAE-2024
  name: string
  description: string
  startDate: string
  endDate: string
  totalAmount: number
  status: 'active' | 'inactive' | 'completed'
  rules: ProgramRules
  requiredDocuments: DocumentRequirement[]
  approvalFlow: ApprovalLevel[]
  expenseLimits: ExpenseLimit[]
  createdAt: string
  updatedAt: string
}

export interface ProgramRules {
  maxExpenseValue?: number
  allowedNatures: string[]
  documentationRequired: boolean
  approvalLevels: number
  deadlines: {
    submission: number // dias
    analysis: number // dias
    complementation: number // dias
  }
}

export interface DocumentRequirement {
  type: string
  name: string
  required: boolean
  conditions?: {
    minValue?: number
    maxValue?: number
    natures?: string[]
    actions?: string[]
  }
  validations: DocumentValidation[]
}

export interface DocumentValidation {
  type: 'ocr' | 'antivirus' | 'format' | 'size' | 'date_coherence' | 'key_fields'
  parameters: Record<string, any>
  errorMessage: string
}

export interface ApprovalLevel {
  level: number
  role: string
  required: boolean
  conditions?: Record<string, any>
}

export interface ExpenseLimit {
  nature: string
  maxValue: number
  maxPercentage?: number
  period: 'monthly' | 'quarterly' | 'annual'
}

export interface Action {
  id: string
  programId: string
  code: string
  name: string
  description: string
  eligibleNatures: string[]
  specificRules?: Record<string, any>
  createdAt: string
  updatedAt: string
}

export interface Expense {
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
  document: string
  paymentMethod: 'cash' | 'check' | 'transfer' | 'card'
  paymentDate?: string
  status: 'pending' | 'classified' | 'approved' | 'rejected'
  classification?: ExpenseClassification
  attachments: FileAttachment[]
  planApplicationId?: string
  createdBy: string
  createdAt: string
  updatedAt: string
  auditTrail: AuditEntry[]
}

export interface ExpenseClassification {
  category: string
  subcategory?: string
  budgetLine: string
  costCenter: string
  project?: string
  aiSuggestion?: {
    confidence: number
    reasons: string[]
    alternativeOptions: string[]
  }
  manualOverride?: boolean
  classifiedBy: string
  classifiedAt: string
}

export interface FileAttachment {
  id: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  url: string
  hash: string
  uploadedBy: string
  uploadedAt: string
  validations: ValidationResult[]
}

export interface ValidationResult {
  type: string
  status: 'passed' | 'failed' | 'warning'
  message: string
  details?: Record<string, any>
}

export interface Supplier {
  id: string
  document: string // CPF ou CNPJ
  documentType: 'cpf' | 'cnpj'
  name: string
  tradeName?: string
  address: string
  phone: string
  email: string
  status: 'regular' | 'irregular' | 'blocked'
  certifications: Certification[]
  history: SupplierHistory[]
  createdAt: string
  updatedAt: string
}

export interface Certification {
  type: 'cnd_federal' | 'cnd_estadual' | 'cnd_municipal' | 'fgts' | 'outros'
  number: string
  issueDate: string
  expiryDate: string
  status: 'valid' | 'expired' | 'pending'
  url?: string
}

export interface SupplierHistory {
  expenseId: string
  date: string
  amount: number
  program: string
  evaluation?: number // 1-5
  comments?: string
}

export interface AccountingReport {
  id: string
  period: string
  school: string
  program: string
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'complementation'
  version: number
  submissionDate?: string
  reviewDate?: string
  approvalDate?: string
  totalExpenses: number
  totalRevenues: number
  documentsCount: number
  pendingDocuments: number
  reviewer?: string
  comments?: string
  expenseIds: string[]
  documentsChecklist: DocumentChecklistItem[]
  reconciliations: BankReconciliation[]
  createdBy: string
  createdAt: string
  updatedAt: string
  auditTrail: AuditEntry[]
}

export interface DocumentChecklistItem {
  type: string
  name: string
  required: boolean
  status: 'pending' | 'uploaded' | 'validated' | 'rejected'
  fileId?: string
  rejectionReason?: string
  uploadedAt?: string
  validatedAt?: string
}

export interface BankReconciliation {
  id: string
  accountId: string
  period: string
  bankBalance: number
  systemBalance: number
  difference: number
  status: 'pending' | 'reconciled' | 'discrepancy'
  transactions: BankTransaction[]
  adjustments: ReconciliationAdjustment[]
  reconciledBy?: string
  reconciledAt?: string
}

export interface BankTransaction {
  id: string
  date: string
  description: string
  amount: number
  type: 'credit' | 'debit'
  matched: boolean
  expenseId?: string
  revenueId?: string
}

export interface ReconciliationAdjustment {
  type: 'expense' | 'revenue' | 'correction'
  amount: number
  description: string
  justification: string
  approvedBy: string
  approvedAt: string
}

export interface Decision {
  id: string
  reportId: string
  reviewerId: string
  status: 'approved' | 'rejected' | 'complementation_required'
  justification: string
  technicalReport?: string
  recommendations?: string
  deadline?: string
  attachments: FileAttachment[]
  createdAt: string
}

export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'error' | 'success'
  read: boolean
  priority: 'low' | 'medium' | 'high' | 'critical'
  createdAt: string
  userId: string
  channel: 'in_app' | 'email' | 'sms' | 'push'
  triggerEvent?: string
  relatedEntityType?: string
  relatedEntityId?: string
  scheduledFor?: string
  sentAt?: string
}

export interface AuditEntry {
  id: string
  tableName: string
  recordId: string
  operation: 'create' | 'update' | 'delete' | 'read'
  oldValues?: Record<string, any>
  newValues?: Record<string, any>
  userId: string
  ipAddress: string
  userAgent: string
  timestamp: string
  hash: string // SHA-256 para integridade
}

export interface BankAccount {
  id: string
  schoolId: string
  bankCode: string // Código FEBRABAN
  bankName: string
  agency: string
  account: string
  accountType: 'checking' | 'savings'
  holderName: string
  holderDocument: string
  status: 'active' | 'inactive' | 'blocked'
  balance?: number
  lastSync?: string
  createdAt: string
  updatedAt: string
}

export interface Revenue {
  id: string
  programId: string
  schoolId: string
  amount: number
  date: string
  type: 'transfer' | 'deposit' | 'adjustment'
  source: string
  description: string
  bankTransactionId?: string
  status: 'pending' | 'confirmed' | 'cancelled'
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface PlanApplication {
  id: string
  programId: string
  schoolId: string
  category: string
  item: string
  description: string
  unit: string
  quantity: number
  unitPrice: number
  plannedAmount: number
  executedAmount: number
  goals: Goal[]
  indicators: Indicator[]
  schedule: ScheduleItem[]
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled'
  createdAt: string
  updatedAt: string
}

export interface Goal {
  id: string
  description: string
  type: 'quantitative' | 'qualitative'
  target: number | string
  achieved?: number | string
  unit?: string
  deadline: string
}

export interface Indicator {
  id: string
  name: string
  description: string
  formula: string
  target: number
  current?: number
  unit: string
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual'
}

export interface ScheduleItem {
  id: string
  milestone: string
  description: string
  plannedDate: string
  actualDate?: string
  status: 'pending' | 'in_progress' | 'completed' | 'delayed'
  dependencies?: string[]
}

export interface ExpenseCategory {
  id: string
  code: string
  name: string
  description: string
  parentId?: string
  level: number
  allowsExpenses: boolean
  rules?: CategoryRules
  createdAt: string
  updatedAt: string
}

export interface CategoryRules {
  maxValue?: number
  requiredDocuments: string[]
  approvalRequired: boolean
  restrictedSuppliers?: string[]
  allowedPaymentMethods?: string[]
}

export interface Regional {
  id: string
  code: string
  name: string
  description: string
  coordinator: string
  schools: string[]
  analysts: string[]
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

export interface SystemConfiguration {
  id: string
  key: string
  value: any
  type: 'string' | 'number' | 'boolean' | 'json'
  description: string
  category: string
  editable: boolean
  updatedBy: string
  updatedAt: string
}

export interface Report {
  id: string
  name: string
  description: string
  type: 'financial' | 'compliance' | 'audit' | 'transparency'
  parameters: ReportParameter[]
  query: string
  template?: string
  schedule?: ReportSchedule
  recipients: string[]
  status: 'active' | 'inactive'
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface ReportParameter {
  name: string
  type: 'string' | 'number' | 'date' | 'select' | 'multiselect'
  required: boolean
  defaultValue?: any
  options?: { value: any; label: string }[]
  validation?: string
}

export interface ReportSchedule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual'
  dayOfWeek?: number
  dayOfMonth?: number
  time: string
  timezone: string
  enabled: boolean
}

export interface Dashboard {
  id: string
  name: string
  description: string
  layout: DashboardLayout
  widgets: DashboardWidget[]
  permissions: string[]
  isDefault: boolean
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface DashboardLayout {
  columns: number
  rows: number
  responsive: boolean
}

export interface DashboardWidget {
  id: string
  type: 'kpi' | 'chart' | 'table' | 'alert' | 'text'
  title: string
  position: { x: number; y: number; w: number; h: number }
  config: Record<string, any>
  dataSource: string
  refreshInterval?: number
}

// Tipos para APIs e integrações
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp: string
  requestId: string
}

export interface PaginatedResponse<T = any> {
  data: T[]
  total: number
  page: number
  limit: number
  hasNext: boolean
  hasPrev: boolean
}

export interface FilterOptions {
  field: string
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'in' | 'between'
  value: any
}

export interface SortOptions {
  field: string
  direction: 'asc' | 'desc'
}

export interface QueryOptions {
  page?: number
  limit?: number
  filters?: FilterOptions[]
  sort?: SortOptions[]
  include?: string[]
}

// Tipos para validação de formulários
export interface ValidationError {
  field: string
  message: string
  code: string
}

export interface FormState<T = any> {
  data: T
  errors: ValidationError[]
  isValid: boolean
  isDirty: boolean
  isSubmitting: boolean
}

// Tipos para máscaras de input
export type MaskType = 
  | 'cpf'           // 999.999.999-99
  | 'cnpj'          // 99.999.999/9999-99
  | 'phone'         // (99) 99999-9999
  | 'cep'           // 99999-999
  | 'currency'      // R$ 9.999,99
  | 'percentage'    // 99,99%
  | 'date'          // 99/99/9999
  | 'time'          // 99:99
  | 'inep'          // 99999999
  | 'bank_account'  // 9999-9
  | 'invoice'       // Livre

// Constantes para o sistema
export const USER_ROLES = {
  ADMIN: 'admin',
  SCHOOL_MANAGER: 'school_manager',
  ANALYST: 'analyst',
  AUDITOR: 'auditor',
  SUPPORT: 'support',
  OBSERVER: 'observer'
} as const

export const EXPENSE_STATUS = {
  PENDING: 'pending',
  CLASSIFIED: 'classified',
  APPROVED: 'approved',
  REJECTED: 'rejected'
} as const

export const REPORT_STATUS = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  UNDER_REVIEW: 'under_review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  COMPLEMENTATION: 'complementation'
} as const

export const NOTIFICATION_TYPES = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  SUCCESS: 'success'
} as const

export const NOTIFICATION_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
} as const