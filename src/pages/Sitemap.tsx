import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Home,
  Users,
  Stethoscope,
  Newspaper,
  Building2,
  FileText,
  Phone,
  Calendar,
  Truck,
  ClipboardList,
  HelpCircle,
} from 'lucide-react';

const siteStructure = [
  {
    title: 'Главная',
    icon: Home,
    path: '/',
    description: 'Главная страница сайта больницы',
  },
  {
    title: 'Врачи',
    icon: Users,
    path: '/doctors',
    description: 'Информация о специалистах больницы',
  },
  {
    title: 'Услуги',
    icon: Stethoscope,
    path: '/services',
    description: 'Перечень медицинских услуг и прейскурант',
  },
  {
    title: 'Новости',
    icon: Newspaper,
    path: '/news',
    description: 'Новости и объявления больницы',
  },
  {
    title: 'О больнице',
    icon: Building2,
    path: '/about',
    description: 'История, руководство, достижения',
  },
  {
    title: 'Документы',
    icon: FileText,
    path: '/documents',
    description: 'Лицензии, сертификаты, нормативные документы',
  },
  {
    title: 'Контакты',
    icon: Phone,
    path: '/contacts',
    description: 'Адрес, телефоны, схема проезда',
  },
];

const quickActions = [
  {
    title: 'Запись на приём',
    icon: Calendar,
    path: '/appointment',
    description: 'Онлайн-запись к врачу',
  },
  {
    title: 'Вызов врача на дом',
    icon: Truck,
    path: '/home-visit',
    description: 'Оформление вызова врача',
  },
  {
    title: 'Результаты анализов',
    icon: ClipboardList,
    path: '/results',
    description: 'Получение результатов исследований',
  },
  {
    title: 'Вопросы и ответы',
    icon: HelpCircle,
    path: '/faq',
    description: 'Часто задаваемые вопросы',
  },
];

const Sitemap = () => {
  return (
    <Layout>
      {/* Header */}
      <div className="bg-muted py-8">
        <div className="container">
          <Breadcrumbs />
          <h1 className="mt-4 text-3xl font-bold text-foreground md:text-4xl">
            Карта сайта
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Полная структура сайта для удобной навигации
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container py-8">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Main sections */}
          <Card>
            <CardHeader>
              <CardTitle>Основные разделы</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {siteStructure.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className="group flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-muted"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="font-medium text-foreground group-hover:text-primary">
                          {item.title}
                        </span>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Quick actions */}
          <Card>
            <CardHeader>
              <CardTitle>Быстрые действия</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {quickActions.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className="group flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-muted"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="font-medium text-foreground group-hover:text-accent">
                          {item.title}
                        </span>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Sitemap;
