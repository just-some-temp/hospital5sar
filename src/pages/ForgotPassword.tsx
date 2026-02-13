import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

const ForgotPassword = () => {
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
            <CardTitle>Восстановление пароля</CardTitle>
            <CardDescription>
              Введите email для получения ссылки на сброс пароля
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ForgotPasswordForm />

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

export default ForgotPassword;
