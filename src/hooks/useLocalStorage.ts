'use client';

import { useState, useEffect } from 'react';
import { Institution, User, Expense, Notification, ExpenseCategory } from '@/lib/types';

// Hook genérico para Local Storage
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
    }
  }, [key]);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}

// Hook para gerenciar instituições
export function useInstitutions() {
  const [institutions, setInstitutions] = useLocalStorage<Institution[]>('institutions', []);

  const addInstitution = (institution: Omit<Institution, 'id' | 'createdAt'>) => {
    const newInstitution: Institution = {
      ...institution,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    setInstitutions(prev => [...prev, newInstitution]);
    return newInstitution;
  };

  const updateInstitution = (id: string, updates: Partial<Institution>) => {
    setInstitutions(prev => 
      prev.map(inst => inst.id === id ? { ...inst, ...updates } : inst)
    );
  };

  const getInstitution = (id: string) => {
    return institutions.find(inst => inst.id === id);
  };

  return {
    institutions,
    addInstitution,
    updateInstitution,
    getInstitution,
  };
}

// Hook para gerenciar usuários
export function useUsers() {
  const [users, setUsers] = useLocalStorage<User[]>('users', []);

  const addUser = (user: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...user,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    setUsers(prev => [...prev, newUser]);
    return newUser;
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(prev => 
      prev.map(user => user.id === id ? { ...user, ...updates } : user)
    );
  };

  const getUser = (id: string) => {
    return users.find(user => user.id === id);
  };

  const getUsersByInstitution = (institutionId: string) => {
    return users.filter(user => user.institutionId === institutionId);
  };

  return {
    users,
    addUser,
    updateUser,
    getUser,
    getUsersByInstitution,
  };
}

// Hook para gerenciar despesas
export function useExpenses() {
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('expenses', []);

  const addExpense = (expense: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense: Expense = {
      ...expense,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    setExpenses(prev => [...prev, newExpense]);
    return newExpense;
  };

  const updateExpense = (id: string, updates: Partial<Expense>) => {
    setExpenses(prev => 
      prev.map(expense => expense.id === id ? { ...expense, ...updates } : expense)
    );
  };

  const getExpense = (id: string) => {
    return expenses.find(expense => expense.id === id);
  };

  const getExpensesByInstitution = (institutionId: string) => {
    return expenses.filter(expense => expense.institutionId === institutionId);
  };

  const getExpensesByUser = (userId: string) => {
    return expenses.filter(expense => expense.userId === userId);
  };

  const submitExpense = (id: string) => {
    updateExpense(id, {
      status: 'submitted',
      submittedAt: new Date(),
    });
  };

  const reviewExpense = (id: string, status: 'approved' | 'rejected', notes?: string, reviewedBy?: string) => {
    updateExpense(id, {
      status,
      reviewedAt: new Date(),
      reviewedBy,
      reviewNotes: notes,
    });
  };

  return {
    expenses,
    addExpense,
    updateExpense,
    getExpense,
    getExpensesByInstitution,
    getExpensesByUser,
    submitExpense,
    reviewExpense,
  };
}

// Hook para gerenciar notificações
export function useNotifications() {
  const [notifications, setNotifications] = useLocalStorage<Notification[]>('notifications', []);

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'read' | 'priority'>) => {
    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      read: false,
      priority: 'medium',
    };
    setNotifications(prev => [newNotification, ...prev]);
    return newNotification;
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => notif.id === id ? { ...notif, read: true } : notif)
    );
  };

  const getUnreadCount = (userId: string) => {
    return notifications.filter(notif => notif.userId === userId && !notif.read).length;
  };

  const getUserNotifications = (userId: string) => {
    return notifications.filter(notif => notif.userId === userId);
  };

  return {
    notifications,
    addNotification,
    markAsRead,
    getUnreadCount,
    getUserNotifications,
  };
}

// Hook para categorias de despesas (dados estáticos)
export function useExpenseCategories() {
  const categories: ExpenseCategory[] = [
    {
      id: '1',
      name: 'Material Escolar',
      description: 'Materiais pedagógicos e de escritório',
      code: 'MAT_ESC',
      requiresInvoice: true,
      maxAmount: 5000,
      allowedDocuments: ['invoice', 'receipt'],
      validationRules: [],
    },
    {
      id: '2',
      name: 'Alimentação',
      description: 'Merenda escolar e alimentação',
      code: 'ALIM',
      requiresInvoice: true,
      maxAmount: 10000,
      allowedDocuments: ['invoice', 'receipt'],
      validationRules: [],
    },
    {
      id: '3',
      name: 'Transporte',
      description: 'Transporte escolar e combustível',
      code: 'TRANSP',
      requiresInvoice: true,
      maxAmount: 8000,
      allowedDocuments: ['invoice', 'receipt'],
      validationRules: [],
    },
    {
      id: '4',
      name: 'Manutenção',
      description: 'Manutenção predial e equipamentos',
      code: 'MANUT',
      requiresInvoice: true,
      maxAmount: 15000,
      allowedDocuments: ['invoice', 'receipt'],
      validationRules: [],
    },
    {
      id: '5',
      name: 'Serviços',
      description: 'Serviços terceirizados',
      code: 'SERV',
      requiresInvoice: true,
      maxAmount: 12000,
      allowedDocuments: ['invoice', 'receipt'],
      validationRules: [],
    },
    {
      id: '6',
      name: 'Outros',
      description: 'Outras despesas não categorizadas',
      code: 'OUTROS',
      requiresInvoice: true,
      maxAmount: 3000,
      allowedDocuments: ['invoice', 'receipt'],
      validationRules: [],
    },
  ];

  return { categories };
}