import { AuthProvider } from '../shared/hooks/AuthContext';
import { ThemeProvider } from '../shared/hooks/ThemeContext';

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThemeProvider>
  );
};
