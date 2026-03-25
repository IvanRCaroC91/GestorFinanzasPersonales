import React from 'react';
import { useFinancialColors } from '../contexts/ThemeContext';

interface FinancialCardProps {
  title: string;
  amount: number;
  type: 'income' | 'expense' | 'balance';
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export const FinancialCard: React.FC<FinancialCardProps> = ({
  title,
  amount,
  type,
  subtitle,
  trend,
  className = '',
}) => {
  const colors = useFinancialColors();

  const getAmountColor = () => {
    switch (type) {
      case 'income':
        return colors.income;
      case 'expense':
        return colors.expense;
      case 'balance':
        return amount >= 0 ? colors.income : colors.expense;
      default:
        return colors.textPrimary;
    }
  };

  const getCardBackground = () => {
    switch (type) {
      case 'income':
        return 'rgba(0, 200, 83, 0.05)';
      case 'expense':
        return 'rgba(211, 47, 47, 0.05)';
      case 'balance':
        return amount >= 0 ? 'rgba(0, 200, 83, 0.05)' : 'rgba(211, 47, 47, 0.05)';
      default:
        return 'transparent';
    }
  };

  const formatAmount = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(value));
  };

  return (
    <div 
      className={`financial-card transition-financial ${className}`}
      style={{
        backgroundColor: getCardBackground(),
        borderLeft: `4px solid ${getAmountColor()}`,
      }}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400">
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-500">
              {subtitle}
            </p>
          )}
        </div>
        
        {trend && (
          <div className={`flex items-center gap-1 text-sm ${
            trend.isPositive ? 'text-income' : 'text-expense'
          }`}>
            <span>
              {trend.isPositive ? '↑' : '↓'}
            </span>
            <span>
              {Math.abs(trend.value)}%
            </span>
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <p 
          className="text-2xl font-bold"
          style={{ color: getAmountColor() }}
        >
          {type === 'expense' && '-'}
          {formatAmount(amount)}
        </p>
        
        {type === 'balance' && (
          <p className="text-sm text-gray-500 dark:text-gray-500">
            {amount >= 0 ? 'Saldo positivo' : 'Saldo negativo'}
          </p>
        )}
      </div>
    </div>
  );
};

interface TransactionItemProps {
  description: string;
  amount: number;
  category: string;
  date: string;
  type: 'income' | 'expense';
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
  description,
  amount,
  category,
  date,
  type,
}) => {
  const colors = useFinancialColors();

  const formatAmount = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(value));
  };

  return (
    <div className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-financial">
      <div className="flex-1">
        <p className="font-medium text-gray-900 dark:text-white">
          {description}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className={`badge-${type === 'income' ? 'income' : 'expense'}`}>
            {category}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-500">
            {date}
          </span>
        </div>
      </div>
      
      <p 
        className={`text-lg font-semibold ${
          type === 'income' ? 'text-income' : 'text-expense'
        }`}
      >
        {type === 'income' ? '+' : '-'}
        {formatAmount(amount)}
      </p>
    </div>
  );
};

interface BudgetProgressProps {
  category: string;
  spent: number;
  budget: number;
  className?: string;
}

export const BudgetProgress: React.FC<BudgetProgressProps> = ({
  category,
  spent,
  budget,
  className = '',
}) => {
  const colors = useFinancialColors();
  
  const percentage = Math.min((spent / budget) * 100, 100);
  const remaining = budget - spent;
  const isOverBudget = spent > budget;
  const isNearLimit = percentage >= 80 && percentage < 100;

  const getProgressColor = () => {
    if (isOverBudget) return colors.expense;
    if (isNearLimit) return colors.warning;
    return colors.income;
  };

  const getStatusColor = () => {
    if (isOverBudget) return 'text-expense';
    if (isNearLimit) return 'text-warning';
    return 'text-income';
  };

  const formatAmount = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className={`financial-card ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          {category}
        </h3>
        <span className={`text-sm font-medium ${getStatusColor()}`}>
          {percentage.toFixed(1)}%
        </span>
      </div>
      
      <div className="space-y-3">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="h-2 rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${percentage}%`,
              backgroundColor: getProgressColor(),
            }}
          />
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            Gastado: {formatAmount(spent)}
          </span>
          <span className={`font-medium ${getStatusColor()}`}>
            {isOverBudget 
              ? `Excedido: ${formatAmount(Math.abs(remaining))}`
              : `Disponible: ${formatAmount(remaining)}`
            }
          </span>
        </div>
      </div>
    </div>
  );
};
