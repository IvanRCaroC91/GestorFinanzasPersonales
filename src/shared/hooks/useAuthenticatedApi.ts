// Importaciones de hooks de React y configuración de axios
import { useState, useCallback } from 'react';
import axiosInstance from '../services/axiosConfig';
import { AxiosRequestConfig } from 'axios';

// Interfaz para estado de la API
export interface ApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

// Interfaz para retorno del hook de API autenticada
export interface UseAuthenticatedApiReturn<T> extends ApiState<T> {
  execute: (url: string, options?: AxiosRequestConfig) => Promise<void>;
  reset: () => void;
}

/**
 * Hook personalizado para realizar peticiones autenticadas al backend
 * Maneja estado de carga, errores y datos automáticamente
 */
export const useAuthenticatedApi = <T = any>(): UseAuthenticatedApiReturn<T> => {
  // Estado para manejar datos, carga y errores
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    isLoading: false,
    error: null,
  });

  // Función para ejecutar peticiones autenticadas
  const execute = useCallback(async (url: string, options: AxiosRequestConfig = {}) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await axiosInstance({
        url,
        ...options,
      });
      
      const data = response.data;
      setState({ data, isLoading: false, error: null });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Error desconocido';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, []);

  // Función para resetear el estado
  const reset = useCallback(() => {
    setState({
      data: null,
      isLoading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
};

/**
 * Hook para peticiones GET autenticadas
 */
export const useAuthenticatedGet = <T = any>(url?: string) => {
  const { execute, ...state } = useAuthenticatedApi<T>();

  const get = useCallback((requestUrl?: string) => {
    const finalUrl = requestUrl || url;
    if (!finalUrl) {
      throw new Error('Se requiere una URL para la petición GET');
    }
    return execute(finalUrl, { method: 'GET' });
  }, [execute, url]);

  return {
    ...state,
    get,
  };
};

/**
 * Hook para peticiones POST autenticadas
 */
export const useAuthenticatedPost = <T = any>() => {
  const { execute, ...state } = useAuthenticatedApi<T>();

  const post = useCallback((requestUrl: string, data?: any) => {
    return execute(requestUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    });
  }, [execute]);

  return {
    ...state,
    post,
  };
};

/**
 * Hook para peticiones PUT autenticadas
 */
export const useAuthenticatedPut = <T = any>() => {
  const { execute, ...state } = useAuthenticatedApi<T>();

  const put = useCallback((requestUrl: string, data?: any) => {
    return execute(requestUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    });
  }, [execute]);

  return {
    ...state,
    put,
  };
};

/**
 * Hook para peticiones DELETE autenticadas
 */
export const useAuthenticatedDelete = <T = any>() => {
  const { execute, ...state } = useAuthenticatedApi<T>();

  const del = useCallback((requestUrl: string) => {
    return execute(requestUrl, { method: 'DELETE' });
  }, [execute]);

  return {
    ...state,
    delete: del,
  };
};


