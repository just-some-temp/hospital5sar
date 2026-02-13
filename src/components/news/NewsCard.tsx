import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, ArrowRight } from 'lucide-react';
import type { NewsItem } from '@/data/news';

interface NewsCardProps {
  news: NewsItem;
}

const categoryLabels = {
  news: 'Новости',
  announcement: 'Объявление',
  event: 'Мероприятие',
};

const categoryColors = {
  news: 'bg-blue-100 text-blue-800',
  announcement: 'bg-amber-100 text-amber-800',
  event: 'bg-green-100 text-green-800',
};

export function NewsCard({ news }: NewsCardProps) {
  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2 mb-2">
          <Badge variant="secondary" className={categoryColors[news.category]}>
            {categoryLabels[news.category]}
          </Badge>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span>{format(parseISO(news.date), 'd MMMM yyyy', { locale: ru })}</span>
          </div>
        </div>
        <Link to={`/news/${news.id}`} className="hover:text-primary transition-colors">
          <h3 className="font-semibold leading-tight line-clamp-2">
            {news.title}
          </h3>
        </Link>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
          {news.excerpt}
        </p>
        <Link
          to={`/news/${news.id}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          Читать далее
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </CardContent>
    </Card>
  );
}
