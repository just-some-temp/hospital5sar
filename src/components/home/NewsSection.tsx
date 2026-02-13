import { Link } from 'react-router-dom';
import { Calendar, AlertCircle, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const news = [
  {
    id: 1,
    type: 'announcement',
    title: 'Изменение графика работы в праздничные дни',
    date: '2024-01-15',
    description: 'Уважаемые пациенты! В связи с праздничными днями изменяется режим работы поликлиники.',
  },
  {
    id: 2,
    type: 'news',
    title: 'Открыт новый кабинет УЗИ-диагностики',
    date: '2024-01-10',
    description: 'В нашей больнице начал работу новый кабинет ультразвуковой диагностики с современным оборудованием.',
  },
  {
    id: 3,
    type: 'info',
    title: 'Бесплатная диспансеризация для граждан',
    date: '2024-01-05',
    description: 'Приглашаем всех желающих пройти бесплатную диспансеризацию в рамках программы ОМС.',
  },
];

const typeConfig = {
  announcement: {
    icon: AlertCircle,
    badge: 'Объявление',
    variant: 'destructive' as const,
  },
  news: {
    icon: Calendar,
    badge: 'Новость',
    variant: 'default' as const,
  },
  info: {
    icon: Info,
    badge: 'Информация',
    variant: 'secondary' as const,
  },
};

export function NewsSection() {
  return (
    <section className="bg-muted py-16">
      <div className="container">
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-3xl font-bold text-foreground">Новости и объявления</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Актуальная информация о работе больницы и важные объявления для пациентов
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {news.map((item) => {
            const config = typeConfig[item.type as keyof typeof typeConfig];
            const Icon = config.icon;
            
            return (
              <Card key={item.id} className="transition-all hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <Badge variant={config.variant}>{config.badge}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {new Date(item.date).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                  <CardTitle className="mt-2 text-lg leading-snug">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Link 
            to="/news" 
            className="text-primary hover:underline font-medium"
          >
            Все новости →
          </Link>
        </div>
      </div>
    </section>
  );
}
