export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

export interface Categoria {
  id?: string;
  nombre: string;
  tipo: 'INGRESO' | 'GASTO';
  tipoGasto?: string;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Movimiento {
  id?: string;
  monto: number;
  descripcion: string;
  categoriaId: string;
  categoria?: Categoria;
  fecha: string;
  tipo: 'INGRESO' | 'GASTO';
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Presupuesto {
  id?: string;
  categoriaId: string;
  categoria?: Categoria;
  montoMaximo: number;
  montoUsado?: number;
  periodo: 'MENSUAL' | 'ANUAL';
  fechaInicio: string;
  fechaFin: string;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface EjecucionPresupuesto {
  presupuestoId: string;
  montoEjecutado: number;
  montoDisponible: number;
  porcentajeUtilizado: number;
  categoria: Categoria;
}
