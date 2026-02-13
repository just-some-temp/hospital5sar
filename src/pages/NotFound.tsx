import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, Search, Phone, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <Layout>
      <div className="container py-16">
        <Card className="mx-auto max-w-lg">
          <CardContent className="py-12 text-center">
            {/* 404 Icon */}
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
              <Search className="h-12 w-12 text-muted-foreground" />
            </div>

            {/* Title */}
            <h1 className="mb-2 text-6xl font-bold text-primary">404</h1>
            <h2 className="mb-4 text-2xl font-semibold text-foreground">
              Страница не найдена
            </h2>

            {/* Description */}
            <p className="mb-8 text-muted-foreground">
              К сожалению, запрашиваемая страница не существует или была перемещена.
              Возможно, вы перешли по устаревшей ссылке или ошиблись в адресе.
            </p>

            {/* Actions */}
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button asChild>
                <Link to="/">
                  <Home className="mr-2 h-4 w-4" />
                  На главную
                </Link>
              </Button>
              <Button variant="outline" onClick={() => window.history.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Назад
              </Button>
            </div>

            {/* Help section */}
            <div className="mt-8 border-t pt-6">
              <p className="mb-3 text-sm text-muted-foreground">
                Полезные ссылки:
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <Link to="/doctors" className="text-primary hover:underline">
                  Врачи
                </Link>
                <Link to="/services" className="text-primary hover:underline">
                  Услуги
                </Link>
                <Link to="/appointment" className="text-primary hover:underline">
                  Запись на приём
                </Link>
                <Link to="/contacts" className="text-primary hover:underline">
                  Контакты
                </Link>
              </div>

              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>Справочная:</span>
                <a href="tel:+78412999111" className="text-primary hover:underline">
                  +7 (8412) 99-91-11
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default NotFound;
