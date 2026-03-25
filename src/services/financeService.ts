import axiosInstance, { ApiResponse } from '../api/axiosConfig';
import { Categoria, Movimiento, Presupuesto, EjecucionPresupuesto } from '../types/finance';

export interface CategoriaRequest {
    nombre: string;
    tipo: 'INGRESO' | 'EGRESO';
    tipoGasto?: 'NECESARIO' | 'NO_NECESARIO' | 'OCASIONAL';
    categoriaPadreId?: string | null;
}

export interface MovimientoRequest {
    monto: number;
    descripcion: string;
    categoriaId: string;
    fecha: string;
    tipo: 'INGRESO' | 'GASTO';
}

export interface PresupuestoRequest {
    categoriaId: string;
    montoMaximo: number;
    periodo: 'MENSUAL' | 'ANUAL';
    fechaInicio: string;
    fechaFin: string;
}

class FinanceService {
    async getCategorias(): Promise<ApiResponse<Categoria[]>> {
        try {
            const response = await axiosInstance.get<ApiResponse<Categoria[]>>('/finance/categorias');
            return response.data;
        } catch (error: any) {
            console.error('[FinanceService] Error getCategorias:', error);
            return { success: false, message: 'Error al obtener categorías', data: [] };
        }
    }

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

    // Métodos para Movimientos
    async getMovimientos(): Promise<ApiResponse<Movimiento[]>> {
        try {
            const response = await axiosInstance.get<ApiResponse<Movimiento[]>>('/finance/movimientos');
            return response.data;
        } catch (error: any) {
            console.error('[FinanceService] Error getMovimientos:', error);
            return { success: false, message: 'Error al obtener movimientos', data: [] };
        }
    }

    async createMovimiento(data: MovimientoRequest): Promise<ApiResponse<Movimiento>> {
        try {
            const response = await axiosInstance.post<ApiResponse<Movimiento>>('/finance/movimientos', data);
            return response.data;
        } catch (error: any) {
            console.error('[FinanceService] Error createMovimiento:', error);
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
    async getPresupuestos(): Promise<ApiResponse<Presupuesto[]>> {
        try {
            const response = await axiosInstance.get<ApiResponse<Presupuesto[]>>('/finance/presupuestos');
            return response.data;
        } catch (error: any) {
            console.error('[FinanceService] Error getPresupuestos:', error);
            return { success: false, message: 'Error al obtener presupuestos', data: [] };
        }
    }

    async createPresupuesto(data: PresupuestoRequest): Promise<ApiResponse<Presupuesto>> {
        try {
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

    async getEjecucionPresupuesto(id: string): Promise<ApiResponse<EjecucionPresupuesto>> {
        try {
            const response = await axiosInstance.get<ApiResponse<EjecucionPresupuesto>>(`/finance/presupuestos/${id}/ejecucion`);
            return response.data;
        } catch (error: any) {
            console.error('[FinanceService] Error getEjecucionPresupuesto:', error);
            return { success: false, message: 'Error al obtener ejecución de presupuesto', data: null as any };
        }
    }
}

// ✅ CORRECCIÓN: export default correctamente escrito
export default new FinanceService();
