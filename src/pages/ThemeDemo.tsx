import React from 'react';
import { ThemeToggle } from '../components/ThemeToggle';
import { FinancialCard, TransactionItem, BudgetProgress } from '../components/FinancialCard';
import { useFinancialColors } from '../contexts/ThemeContext';

const ThemeDemo: React.FC = () => {
  const colors = useFinancialColors();

  const transactions = [
    {
      description: 'Salario mensual',
      amount: 5000000,
      category: 'Ingresos',
      date: '01/03/2026',
      type: 'income' as const,
    },
    {
      description: 'Supermercado Éxito',
      amount: 450000,
      category: 'Alimentación',
      date: '24/03/2026',
      type: 'expense' as const,
    },
    {
      description: 'Factura de energía',
      amount: 120000,
      category: 'Servicios',
      date: '23/03/2026',
      type: 'expense' as const,
    },
    {
      description: 'Freelance proyecto',
      amount: 1500000,
      category: 'Ingresos',
      date: '20/03/2026',
      type: 'income' as const,
    },
  ];

  return (
    <div className="min-h-screen bg-background dark:bg-dark-background p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Demo del Sistema de Temas
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Visualización de la paleta de colores financieros y componentes temáticos
            </p>
          </div>
          <ThemeToggle />
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Color Palette Showcase */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Paleta de Colores
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="financial-card">
              <div className="flex items-center gap-3 mb-3">
                <div 
                  className="w-8 h-8 rounded"
                  style={{ backgroundColor: colors.brand }}
                />
                <div>
                  <h3 className="font-semibold">Marca Primaria</h3>
                  <p className="text-sm text-gray-500">{colors.brand}</p>
                </div>
              </div>
            </div>

            <div className="financial-card">
              <div className="flex items-center gap-3 mb-3">
                <div 
                  className="w-8 h-8 rounded"
                  style={{ backgroundColor: colors.income }}
                />
                <div>
                  <h3 className="font-semibold">Ingresos</h3>
                  <p className="text-sm text-gray-500">{colors.income}</p>
                </div>
              </div>
            </div>

            <div className="financial-card">
              <div className="flex items-center gap-3 mb-3">
                <div 
                  className="w-8 h-8 rounded"
                  style={{ backgroundColor: colors.expense }}
                />
                <div>
                  <h3 className="font-semibold">Gastos</h3>
                  <p className="text-sm text-gray-500">{colors.expense}</p>
                </div>
              </div>
            </div>

            <div className="financial-card">
              <div className="flex items-center gap-3 mb-3">
                <div 
                  className="w-8 h-8 rounded"
                  style={{ backgroundColor: colors.warning }}
                />
                <div>
                  <h3 className="font-semibold">Advertencia</h3>
                  <p className="text-sm text-gray-500">{colors.warning}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Financial Cards */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Tarjetas Financieras
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FinancialCard
              title="Ingresos del Mes"
              amount={6500000}
              type="income"
              trend={{ value: 12.5, isPositive: true }}
            />
            
            <FinancialCard
              title="Gastos del Mes"
              amount={4200000}
              type="expense"
              trend={{ value: 8.2, isPositive: false }}
            />
            
            <FinancialCard
              title="Balance Mensual"
              amount={2300000}
              type="balance"
              subtitle="Ahorro neto"
            />
          </div>
        </section>

        {/* Budget Progress */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Progreso de Presupuestos
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <BudgetProgress
              category="Alimentación"
              spent={850000}
              budget={1000000}
            />
            
            <BudgetProgress
              category="Transporte"
              spent={450000}
              budget={500000}
            />
            
            <BudgetProgress
              category="Entretenimiento"
              spent={650000}
              budget={400000}
            />
          </div>
        </section>

        {/* Transactions */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Transacciones Recientes
          </h2>
          
          <div className="financial-card space-y-2">
            {transactions.map((transaction, index) => (
              <TransactionItem
                key={index}
                {...transaction}
              />
            ))}
          </div>
        </section>

        {/* Button Showcase */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Botones Temáticos
          </h2>
          
          <div className="flex flex-wrap gap-4">
            <button className="btn-primary">
              Botón Primario
            </button>
            
            <button className="btn-secondary">
              Botón Secundario
            </button>
            
            <button className="btn-success">
              Botón de Éxito
            </button>
            
            <button className="btn-danger">
              Botón de Peligro
            </button>
          </div>
        </section>

        {/* Badge Showcase */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Badges Semánticos
          </h2>
          
          <div className="flex flex-wrap gap-4">
            <span className="badge-income">Ingresos</span>
            <span className="badge-expense">Gastos</span>
            <span className="badge-warning">Advertencia</span>
          </div>
        </section>

        {/* Typography Examples */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Tipografía con Colores Semánticos
          </h2>
          
          <div className="financial-card space-y-4">
            <p className="text-income text-lg font-semibold">
              +$5,000,000 - Texto de ingresos
            </p>
            
            <p className="text-expense text-lg font-semibold">
              -$2,500,000 - Texto de gastos
            </p>
            
            <p className="text-warning text-lg font-semibold">
              ⚠️ Presupuesto al 85% - Texto de advertencia
            </p>
            
            <div className="bg-income-soft p-4 rounded-lg">
              <p className="text-income font-medium">Fondo suave de ingresos</p>
            </div>
            
            <div className="bg-expense-soft p-4 rounded-lg">
              <p className="text-expense font-medium">Fondo suave de gastos</p>
            </div>
            
            <div className="bg-warning-soft p-4 rounded-lg">
              <p className="text-warning font-medium">Fondo suave de advertencia</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ThemeDemo;
