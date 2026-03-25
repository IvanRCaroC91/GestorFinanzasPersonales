import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Hook personalizado para manejar redirección después del login
 * Lee el parámetro returnTo de la URL y redirige al usuario
 */
export const useReturnTo = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const returnTo = params.get('returnTo');
    
    if (returnTo) {
      console.log(`[useReturnTo] Redirecting to: ${returnTo}`);
      navigate(returnTo, { replace: true });
    } else {
      console.log('[useReturnTo] No returnTo found, redirecting to /home');
      navigate('/home', { replace: true });
    }
  }, [navigate, location.search]);
};

/**
 * Hook para generar URL de redirección con returnTo
 */
export const useReturnToUrl = () => {
  const location = useLocation();
  
  const getReturnToUrl = (fallbackPath: string = '/home') => {
    const currentPath = location.pathname !== '/login' ? location.pathname : fallbackPath;
    return `/login?returnTo=${encodeURIComponent(currentPath)}`;
  };
  
  return { getReturnToUrl };
};
