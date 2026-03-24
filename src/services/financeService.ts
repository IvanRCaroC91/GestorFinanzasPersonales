import axiosInstance from '../api/axiosConfig';
import { ApiResponse, Categoria, Movimiento, Presupuesto, EjecucionPresupuesto } from '../types/finance';

class FinanceService {
  private baseUrl = '/finance';

  // CATEGORIAS
  async getCategorias(): Promise<ApiResponse<Categoria[]>> {
    const response = await axiosInstance.get(`${this.baseUrl}/categorias`);
    return response.data;
  }

  async createCategoria(data: Omit<Categoria, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Categoria>> {
    const response = await axiosInstance.post(`${this.baseUrl}/categorias`, data);
    return response.data;
  }

  async updateCategoria(id: string, data: Partial<Categoria>): Promise<ApiResponse<Categoria>> {
    const response = await axiosInstance.put(`${this.baseUrl}/categorias/${id}`, data);
    return response.data;
  }

  async deleteCategoria(id: string): Promise<ApiResponse<void>> {
    const response = await axiosInstance.delete(`${this.baseUrl}/categorias/${id}`);
    return response.data;
  }

  // MOVIMIENTOS
  async getMovimientos(): Promise<ApiResponse<Movimiento[]>> {
    const response = await axiosInstance.get(`${this.baseUrl}/movimientos`);
    return response.data;
  }

  async createMovimiento(data: Omit<Movimiento, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Movimiento>> {
    const response = await axiosInstance.post(`${this.baseUrl}/movimientos`, data);
    return response.data;
  }

  async updateMovimiento(id: string, data: Partial<Movimiento>): Promise<ApiResponse<Movimiento>> {
    const response = await axiosInstance.put(`${this.baseUrl}/movimientos/${id}`, data);
    return response.data;
  }

  async deleteMovimiento(id: string): Promise<ApiResponse<void>> {
    const response = await axiosInstance.delete(`${this.baseUrl}/movimientos/${id}`);
    return response.data;
  }

  // PRESUPUESTOS
  async getPresupuestos(): Promise<ApiResponse<Presupuesto[]>> {
    const response = await axiosInstance.get(`${this.baseUrl}/presupuestos`);
    return response.data;
  }

  async createPresupuesto(data: Omit<Presupuesto, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Presupuesto>> {
    const response = await axiosInstance.post(`${this.baseUrl}/presupuestos`, data);
    return response.data;
  }

  async updatePresupuesto(id: string, data: Partial<Presupuesto>): Promise<ApiResponse<Presupuesto>> {
    const response = await axiosInstance.put(`${this.baseUrl}/presupuestos/${id}`, data);
    return response.data;
  }

  async deletePresupuesto(id: string): Promise<ApiResponse<void>> {
    const response = await axiosInstance.delete(`${this.baseUrl}/presupuestos/${id}`);
    return response.data;
  }

  async getEjecucionPresupuesto(id: string): Promise<ApiResponse<EjecucionPresupuesto>> {
    const response = await axiosInstance.get(`${this.baseUrl}/presupuestos/${id}/ejecucion`);
    return response.data;
  }
}

export default new FinanceService();
