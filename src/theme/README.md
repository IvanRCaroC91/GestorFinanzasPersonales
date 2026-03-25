# Sistema de Temas Financieros

Este documento describe el sistema de temas implementado para la aplicación de finanzas personales, siguiendo las mejores prácticas de diseño para aplicaciones financieras.

## 🎨 Paleta de Colores

### Colores de Marca
- **Primario (Indigo)**: `#3F51B5` - Transmite confianza y estructura
- **Secundario (Rosa)**: `#FF4081` - Para acentos y llamadas a la acción

### Colores Semánticos Financieros
- **Ingresos (Verde Esmeralda)**: `#00C853` - Crecimiento y abundancia
- **Gastos (Rojo Coral)**: `#D32F2F` - Pérdidas y alertas críticas
- **Advertencia (Ámbar)**: `#FFA000` - Presupuestos por agotarse
- **Información (Azul Claro)**: `#0288D1` - Tips e información neutral

### Colores de Superficie
- **Fondo Claro**: `#F4F7FE` - Descanso visual
- **Tarjetas**: `#FFFFFF` - Contenedores de datos
- **Fondo Oscuro**: `#121212` - Modo oscuro
- **Tarjetas Oscuras**: `#1E1E1E` - Contenedores en modo oscuro

## 🌓 Modo Oscuro

La aplicación incluye soporte completo para modo oscuro con colores optimizados:

- **Ingresos**: `#00E676` (Verde neón)
- **Gastos**: `#FF5252` (Rojo brillante)
- **Advertencia**: `#FF9100` (Naranja sunrise)
- **Información**: `#40C4FF` (Azul brillante)

## 🎯 Regla 60-30-10

La aplicación sigue la regla de diseño 60-30-10:
- **60%**: Colores neutros (fondos)
- **30%**: Color de marca (botones, navegación)
- **10%**: Colores de acento (datos críticos)

## ♿ Accesibilidad

### Contraste
Todos los colores cumplen con el ratio de contraste WCAG de 4.5:1 como mínimo.

### Uso de Color
El color nunca es el único indicador de información:
- Los estados de presupuesto incluyen iconos y texto
- Las transacciones usan badges con texto descriptivo
- Los indicadores de estado incluyen puntos de color + texto

### Aria Labels
Todos los elementos interactivos incluyen `aria-label` descriptivos.

## 🛠️ Implementación Técnica

### Estructura de Archivos
```
src/
├── theme/
│   ├── theme.ts          # Configuración de temas
│   └── README.md         # Este documento
├── contexts/
│   └── ThemeContext.tsx  # Contexto y provider
├── components/
│   ├── ThemeToggle.tsx   # Componente de cambio de tema
│   └── FinancialCard.tsx # Componentes financieros temáticos
└── index.css             # Estilos Tailwind + custom
```

### Uso del Contexto

```tsx
import { useTheme, useFinancialColors } from '../contexts/ThemeContext';

// Acceso al tema completo
const { theme, themeMode, toggleTheme, isDark } = useTheme();

// Acceso rápido a colores financieros
const { income, expense, warning, brand } = useFinancialColors();
```

### Clases CSS Disponibles

#### Botones
- `.btn-primary` - Botón principal (indigo)
- `.btn-secondary` - Botón secundario (rosa)
- `.btn-success` - Botón de éxito (verde ingresos)
- `.btn-danger` - Botón de peligro (rojo gastos)

#### Tarjetas
- `.financial-card` - Tarjeta financiera base
- `.chart-container` - Contenedor para gráficos

#### Badges
- `.badge-income` - Badge de ingresos
- `.badge-expense` - Badge de gastos
- `.badge-warning` - Badge de advertencia

#### Utilidades
- `.text-income` - Texto color ingresos
- `.text-expense` - Texto color gastos
- `.text-warning` - Texto color advertencia
- `.bg-income-soft` - Fondo suave ingresos
- `.bg-expense-soft` - Fondo suave gastos
- `.bg-warning-soft` - Fondo suave advertencia

## 📊 Componentes Financieros

### FinancialCard
Componente para mostrar montos financieros con colores semánticos:

```tsx
<FinancialCard
  title="Ingresos del Mes"
  amount={5000000}
  type="income"
  trend={{ value: 12.5, isPositive: true }}
/>
```

### TransactionItem
Componento para mostrar transacciones individuales:

```tsx
<TransactionItem
  description="Supermercado"
  amount={250000}
  category="Alimentación"
  date="24/03/2026"
  type="expense"
/>
```

### BudgetProgress
Componente para mostrar progreso de presupuestos:

```tsx
<BudgetProgress
  category="Transporte"
  spent={300000}
  budget={500000}
/>
```

## 🎨 Tailwind Configuration

Los colores están configurados en `tailwind.config.js`:

```javascript
colors: {
  'money-in': '#00C853',  // bg-money-in, text-money-in
  'money-out': '#D32F2F', // bg-money-out, text-money-out
  'brand': '#3F51B5',     // bg-brand, text-brand
  'surface': '#F4F7FE',   // bg-surface
}
```

## 🔄 Cambio de Tema

El tema persiste en localStorage y responde a las preferencias del sistema:

```tsx
import { ThemeToggle } from '../components/ThemeToggle';

// Botón de cambio de tema
<ThemeToggle variant="button" />

// Switch de cambio de tema
<ThemeToggle variant="switch" />
```

## 📱 Mejores Prácticas

### 1. Consistencia Semántica
- Siempre usar colores `income` para valores positivos
- Siempre usar colores `expense` para valores negativos
- Usar `warning` para estados límite (80-90%)

### 2. Jerarquía Visual
- Títulos más grandes y en color primario
- Montos financieros en colores semánticos
- Información secundaria en colores neutros

### 3. Estados Interactivos
- Hover con cambios sutiles de opacidad
- Focus con anillos de color primario
- Loading con skeletons grises neutros

### 4. Modo Oscuro
- Fondos oscuros (#121212)
- Texto blanco para legibilidad
- Colores más brillantes y saturados

## 🚀 Extensión del Sistema

Para agregar nuevos colores:

1. Actualizar `theme.ts` con nuevos colores
2. Agregar colores a `tailwind.config.js`
3. Crear clases CSS en `index.css`
4. Actualizar `useFinancialColors` si es semántico

## 🔍 Testing Visual

Verificar que los colores funcionen correctamente:
- En modo claro y oscuro
- Con diferentes tamaños de pantalla
- Con lectores de pantalla (aria-labels)
- Con usuarios daltónicos (no depender solo del color)
