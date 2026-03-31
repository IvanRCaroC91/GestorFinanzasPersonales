// Importaciones de configuración axios y tipos de datos financieros
import axiosInstance, { ApiResponse } from './axiosConfig';
import { Categoria, Movimiento, Presupuesto, EjecucionPresupuesto } from '../types/finance';

// Interfaz para datos de categoría
export interface CategoriaRequest {
    nombre: string;
    tipo: 'INGRESO' | 'GASTO' | 'EGRESO';
    tipoGasto?: 'NECESARIO' | 'NO_NECESARIO' | 'OCASIONAL';
    categoriaPadreId?: string | null;
}

// Interfaz para datos de movimiento
export interface MovimientoRequest {
    valor: number;
    descripcion: string;
    categoriaId: string;
    fecha: string;
    tipo: 'INGRESO' | 'EGRESO';
}

// Interfaz para datos de presupuesto
export interface PresupuestoRequest {
    categoriaId: string;
    montoLimite: number;
    anio: number;
    mes: number;
}

// Clase principal para manejo de servicios financieros
class FinanceService {
    // Obtiene todas las categorías financieras desde el backend.
  // Retorna lista de categorías para usar en formularios y filtros.
  async getCategorias(): Promise<ApiResponse<Categoria[]>> {
        try {
            const response = await axiosInstance.get<ApiResponse<Categoria[]>>('/finance/categorias');
            return response.data;
        } catch (error: any) {
            console.error('[FinanceService] Error getCategorias:', error);
            return { success: false, message: 'Error al obtener categorías', data: [] };
        }
    }

    // Crea una nueva categoría en el backend con los datos proporcionados.
  // Retorna la categoría creada con su ID asignado por el servidor.
  async createCategoria(data: CategoriaRequest): Promise<ApiResponse<Categoria>> {
        try {
            const response = await axiosInstance.post<ApiResponse<Categoria>>('/finance/categorias', data);
            return response.data;
        } catch (error: any) {
            console.error('[FinanceService] Error createCategoria:', error);
            return { success: false, message: error.response?.data?.message || 'Error al crear categoría', data: null as any };
        }
    }

    async updateCategoria(id: string, data: CategoriaRequest): Promise<ApiResponse<Categoria>> {
        try {
            const response = await axiosInstance.put<ApiResponse<Categoria>>(`/finance/categorias/${id}`, data);
            return response.data;
        } catch (error: any) {
            console.error('[FinanceService] Error updateCategoria:', error);
            return { success: false, message: error.response?.data?.message || 'Error al actualizar categoría', data: null as any };
        }
    }

    async deleteCategoria(id: string): Promise<ApiResponse<null>> {
        try {
            const response = await axiosInstance.delete<ApiResponse<null>>(`/finance/categorias/${id}`);
            return response.data;
        } catch (error: any) {
            console.error('[FinanceService] Error deleteCategoria:', error);
            return { success: false, message: error.response?.data?.message || 'Error al eliminar categoría', data: null };
        }
    }

    // Obtiene todos los movimientos financieros del usuario desde el backend.
    // Retorna lista completa de transacciones para mostrar en dashboard y listados.
    async getMovimientos(): Promise<ApiResponse<Movimiento[]>> {
        try {
            const response = await axiosInstance.get<ApiResponse<Movimiento[]>>('/finance/movimientos');
            return response.data;
        } catch (error: any) {
            console.error('[FinanceService] Error getMovimientos:', error);
            return { success: false, message: 'Error al obtener movimientos', data: [] };
        }
    }

    // Crea un nuevo movimiento financiero en el backend con los datos proporcionados.
    // Registra la transacción y la asocia al usuario autenticado.
    async createMovimiento(data: MovimientoRequest): Promise<ApiResponse<Movimiento>> {
        try {
            console.log('[FinanceService] Creating movimiento with data:', data);
            console.time('movimiento-request');
            
            const response = await axiosInstance.post<ApiResponse<Movimiento>>('/finance/movimientos', data);
            
            console.timeEnd('movimiento-request');
            return response.data;
        } catch (error: any) {
            console.timeEnd('movimiento-request');
            console.error('[FinanceService] Error createMovimiento:', error);
            console.error('[FinanceService] Error response data:', error.response?.data);
            console.error('[FinanceService] Error code:', error.code);
            console.error('[FinanceService] Error message:', error.message);
            return { success: false, message: error.response?.data?.message || 'Error al crear movimiento', data: null as any };
        }
    }

    async updateMovimiento(id: string, data: MovimientoRequest): Promise<ApiResponse<Movimiento>> {
        try {
            const response = await axiosInstance.put<ApiResponse<Movimiento>>(`/finance/movimientos/${id}`, data);
            return response.data;
        } catch (error: any) {
            console.error('[FinanceService] Error updateMovimiento:', error);
            return { success: false, message: error.response?.data?.message || 'Error al actualizar movimiento', data: null as any };
        }
    }

    async deleteMovimiento(id: string): Promise<ApiResponse<null>> {
        try {
            const response = await axiosInstance.delete<ApiResponse<null>>(`/finance/movimientos/${id}`);
            return response.data;
        } catch (error: any) {
            console.error('[FinanceService] Error deleteMovimiento:', error);
            return { success: false, message: error.response?.data?.message || 'Error al eliminar movimiento', data: null };
        }
    }

    // Métodos para Presupuestos
    async getPresupuestos(anio?: number, mes?: number): Promise<ApiResponse<Presupuesto[]>> {
        try {
            const params = new URLSearchParams();
            if (anio) params.append('anio', anio.toString());
            if (mes) params.append('mes', mes.toString());
            
            const url = params.toString() ? `/finance/presupuestos?${params}` : '/finance/presupuestos';
            const response = await axiosInstance.get<ApiResponse<Presupuesto[]>>(url);
            return response.data;
        } catch (error: any) {
            console.error('[FinanceService] Error getPresupuestos:', error);
            return { success: false, message: 'Error al obtener presupuestos', data: [] };
        }
    }

    async createPresupuesto(data: PresupuestoRequest): Promise<ApiResponse<Presupuesto>> {
        try {
            console.log('[FinanceService] Creating presupuesto with data:', data);
            const response = await axiosInstance.post<ApiResponse<Presupuesto>>('/finance/presupuestos', data);
            return response.data;
        } catch (error: any) {
            console.error('[FinanceService] Error createPresupuesto:', error);
            return { success: false, message: error.response?.data?.message || 'Error al crear presupuesto', data: null as any };
        }
    }

    async updatePresupuesto(id: string, data: PresupuestoRequest): Promise<ApiResponse<Presupuesto>> {
        try {
            const response = await axiosInstance.put<ApiResponse<Presupuesto>>(`/finance/presupuestos/${id}`, data);
            return response.data;
        } catch (error: any) {
            console.error('[FinanceService] Error updatePresupuesto:', error);
            return { success: false, message: error.response?.data?.message || 'Error al actualizar presupuesto', data: null as any };
        }
    }

    async deletePresupuesto(id: string): Promise<ApiResponse<null>> {
        try {
            const response = await axiosInstance.delete<ApiResponse<null>>(`/finance/presupuestos/${id}`);
            return response.data;
        } catch (error: any) {
            console.error('[FinanceService] Error deletePresupuesto:', error);
            return { success: false, message: error.response?.data?.message || 'Error al eliminar presupuesto', data: null };
        }
    }

    async getEjecucionPresupuesto(anio: number, mes: number): Promise<ApiResponse<EjecucionPresupuesto[]>> {
        try {
            const response = await axiosInstance.get<ApiResponse<EjecucionPresupuesto[]>>(`/finance/presupuestos/ejecucion?anio=${anio}&mes=${mes}`);
            return response.data;
        } catch (error: any) {
            console.error('[FinanceService] Error getEjecucionPresupuesto:', error);
            return { success: false, message: 'Error al obtener ejecución de presupuestos', data: [] };
        }
    }
}

export default new FinanceService();
