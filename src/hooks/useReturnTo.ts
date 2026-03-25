import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Hook para redirección post-login controlada
 */
export const useReturnTo = (isAuthenticated: boolean, isLoading: boolean) => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // 🚨 CLAVE: no hacer nada mientras carga o no está autenticado
        if (!isAuthenticated || isLoading) return;

        const params = new URLSearchParams(location.search);
        const returnTo = params.get('returnTo');

        if (returnTo) {
            console.log(`[useReturnTo] Redirecting to: ${returnTo}`);
            navigate(returnTo, { replace: true });
        } else {
            console.log('[useReturnTo] No returnTo, redirecting to /home');
            navigate('/home', { replace: true });
        }

    }, [isAuthenticated, isLoading, location.search, navigate]);
};