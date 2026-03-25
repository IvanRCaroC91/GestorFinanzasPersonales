import axiosInstance, { ApiResponse } from '../api/axiosConfig';
import { Categoria } from '../types/finance';

export interface CategoriaRequest {
    nombre: string;
    tipo: 'INGRESO' | 'EGRESO';
    tipoGasto?: 'NECESARIO' | 'NO_NECESARIO' | 'OCASIONAL';
    categoriaPadreId?: string | null;
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
}

// ✅ CORRECCIÓN: export default correctamente escrito
export default new FinanceService();