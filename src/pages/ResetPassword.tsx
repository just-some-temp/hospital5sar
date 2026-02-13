import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

const ResetPassword = () => {
  return (
    <Layout>
      <div className="bg-muted py-6">
        <div className="container">
          <Breadcrumbs />
        </div>
      </div>

      <div className="container py-12">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle>Установка нового пароля</CardTitle>
            <CardDescription>
              Введите и подтвердите новый пароль
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResetPasswordForm />

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Вспомнили пароль? </span>
              <Link to="/login" className="text-primary hover:underline">
                Войти
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ResetPassword;
