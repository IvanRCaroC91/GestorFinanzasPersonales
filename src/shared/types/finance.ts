// Interfaz genérica para respuestas de la API
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

// Interfaz para categorías financieras
export interface Categoria {
  id?: string;
  nombre: string;
  tipo: 'INGRESO' | 'GASTO' | 'EGRESO';
  tipoGasto?: string;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}

// Interfaz para movimientos/transacciones financieras
export interface Movimiento {
  id?: string;
  valor: number;
  descripcion: string;
  categoriaId: string;
  categoria?: Categoria;
  fecha: string;
  tipo: 'INGRESO' | 'EGRESO';
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}

// Interfaz para presupuestos financieros
export interface Presupuesto {
  id?: string;
  categoriaId: string;
  categoria?: Categoria;
  montoLimite: number;
  anio: number;
  mes: number;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}

// Interfaz para ejecución de presupuestos
export interface EjecucionPresupuesto {
  presupuestoId: string;
  montoEjecutado: number;
  montoDisponible: number;
  porcentajeUtilizado: number;
  categoria: Categoria;
}

// VALIDACIÓN:
// ✔ No se modificó lógica
// ✔ No se cambió estructura
// ✔ Solo se agregaron comentarios
