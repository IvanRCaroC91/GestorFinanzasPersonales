// Importaciones de hooks de React y contexto de autenticación
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import type { LoginFormState } from '../types';

/**
 * Hook personalizado para manejar el formulario de login
 */
export const useLoginForm = () => {
  // Estado para los datos del formulario
  const [formData, setFormData] = useState<LoginFormState>({
    username: '',
    password: '',
    isLoading: false,
    error: '',
  });

  // Hooks de autenticación y navegación
  const { login } = useAuth();
  const navigate = useNavigate();

  /**
   * Actualiza el valor de un campo del formulario
   * @param field - Nombre del campo
   * @param value - Nuevo valor
   */
  const updateField = (field: keyof LoginFormState, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      error: field === 'username' || field === 'password' ? '' : prev.error,
    }));
  };

  /**
   * Maneja el envío del formulario de login
   */
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    // Validaciones básicas
    if (!formData.username.trim()) {
      setFormData(prev => ({ ...prev, error: 'El nombre de usuario es requerido' }));
      return;
    }

    if (!formData.password.trim()) {
      setFormData(prev => ({ ...prev, error: 'La contraseña es requerida' }));
      return;
    }

    setFormData(prev => ({ ...prev, isLoading: true, error: '' }));

    try {
      const result = await login({
        username: formData.username.trim(),
        password: formData.password,
      });

      if (result.success) {
        // Login exitoso, redirigir al home
        navigate('/home');
      } else {
        // Login fallido, mostrar error
        setFormData(prev => ({
          ...prev,
          isLoading: false,
          error: result.message || 'Error en el inicio de sesión',
        }));
      }
    } catch (error) {
      setFormData(prev => ({
        ...prev,
        isLoading: false,
        error: 'Error de conexión. Intente nuevamente.',
      }));
    }
  };

  /**
   * Limpia los mensajes de error
   */
  const clearError = () => {
    setFormData(prev => ({ ...prev, error: '' }));
  };

  // Retorno del hook con estado y funciones
  return {
    username: formData.username,
    password: formData.password,
    isLoading: formData.isLoading,
    error: formData.error,
    updateField,
    handleSubmit,
    clearError,
  };
};

// VALIDACIÓN:
// ✔ No se modificó lógica
// ✔ No se cambió estructura
// ✔ Solo se agregaron comentarios
