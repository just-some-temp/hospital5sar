import { useParams, useNavigate, Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Layout } from '@/components/layout/Layout';
import { news } from '@/data/news';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Calendar, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

const NewsDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const newsItem = news.find((item) => item.id === id);

  if (!newsItem) {
    return (
      <Layout>
        <div className="container py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Новость не найдена</h1>
          <Button onClick={() => navigate('/news')}>Вернуться к новостям</Button>
        </div>
      </Layout>
    );
  }

  const otherNews = news
    .filter((item) => item.id !== id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: newsItem.title,
          text: newsItem.excerpt,
          url: window.location.href,
        });
      } catch {
        // User cancelled or error
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Ссылка скопирована',
        description: 'Ссылка на новость скопирована в буфер обмена',
      });
    }
  };

  return (
    <Layout>
      <div className="container py-8 md:py-12">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/news')}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Все новости
        </Button>

        <div className="max-w-4xl mx-auto">
          <article>
            <header className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="secondary" className={categoryColors[newsItem.category]}>
                  {categoryLabels[newsItem.category]}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <time dateTime={newsItem.date}>
                    {format(parseISO(newsItem.date), 'd MMMM yyyy', { locale: ru })}
                  </time>
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{newsItem.title}</h1>
              <p className="text-lg text-muted-foreground">{newsItem.excerpt}</p>
            </header>

            <div className="prose prose-lg max-w-none">
              {newsItem.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-4 whitespace-pre-line">
                  {paragraph}
                </p>
              ))}
            </div>

            <footer className="mt-8 pt-6 border-t flex items-center justify-between">
              <Button variant="outline" size="sm" onClick={handleShare} className="gap-2">
                <Share2 className="w-4 h-4" />
                Поделиться
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate('/news')}>
                Все новости
              </Button>
            </footer>
          </article>

          {otherNews.length > 0 && (
            <section className="mt-12">
              <h2 className="text-xl font-bold mb-6">Другие новости</h2>
              <div className="grid gap-4 sm:grid-cols-3">
                {otherNews.map((item) => (
                  <Card key={item.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                        <Calendar className="w-3 h-3" />
                        <span>{format(parseISO(item.date), 'd MMM', { locale: ru })}</span>
                      </div>
                      <Link
                        to={`/news/${item.id}`}
                        className="font-medium text-sm line-clamp-2 hover:text-primary"
                      >
                        {item.title}
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default NewsDetail;
