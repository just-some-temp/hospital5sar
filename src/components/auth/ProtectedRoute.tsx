import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ShieldX } from 'lucide-react';
import { Link } from 'react-router-dom';

type AppRole = 'patient' | 'doctor' | 'admin';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: AppRole | AppRole[];
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, role, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-12 flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Загрузка...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role if required
  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!role || !roles.includes(role)) {
      return (
        <Layout>
          <div className="container py-12">
            <Card className="max-w-md mx-auto text-center">
              <CardContent className="py-12">
                <div className="w-16 h-16 rounded-full bg-destructive/20 text-destructive flex items-center justify-center mx-auto mb-6">
                  <ShieldX className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Доступ запрещён</h2>
                <p className="text-muted-foreground mb-6">
                  У вас недостаточно прав для просмотра этой страницы.
                </p>
                <Button asChild>
                  <Link to="/dashboard">Перейти в личный кабинет</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </Layout>
      );
    }
  }

  return <>{children}</>;
}
