import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { doctors } from '@/data/doctors';
import { news } from '@/data/news';

const routeLabels: Record<string, string> = {
  doctors: 'Врачи',
  services: 'Услуги',
  news: 'Новости',
  about: 'О больнице',
  documents: 'Документы',
  contacts: 'Контакты',
  appointment: 'Запись на приём',
  'home-visit': 'Вызов врача',
  results: 'Результаты анализов',
  faq: 'Вопросы и ответы',
  sitemap: 'Карта сайта',
  login: 'Вход',
  register: 'Регистрация',
  dashboard: 'Личный кабинет',
};

interface BreadcrumbItem {
  label: string;
  path: string;
}

export function Breadcrumbs() {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  // Don't show breadcrumbs on home page
  if (pathSegments.length === 0) {
    return null;
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Главная', path: '/' },
  ];

  let currentPath = '';

  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // Check if it's a dynamic segment (like doctor id or news id)
    const isLastSegment = index === pathSegments.length - 1;
    const parentSegment = pathSegments[index - 1];

    let label = routeLabels[segment];

    if (!label && isLastSegment) {
      // Try to get dynamic label based on parent route
      if (parentSegment === 'doctors') {
        const doctor = doctors.find((d) => d.id === segment);
        label = doctor?.name || 'Врач';
      } else if (parentSegment === 'news') {
        const newsItem = news.find((n) => n.id === segment);
        label = newsItem?.title || 'Новость';
      }
    }

    if (label) {
      breadcrumbs.push({ label, path: currentPath });
    }
  });

  return (
    <nav aria-label="Навигация по разделам" className="no-print">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          
          return (
            <li key={crumb.path} className="flex items-center gap-1">
              {index === 0 && (
                <Home className="h-4 w-4 shrink-0" />
              )}
              
              {index > 0 && (
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/50" />
              )}
              
              {isLast ? (
                <span className="font-medium text-foreground" aria-current="page">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  to={crumb.path}
                  className="hover:text-primary transition-colors"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
