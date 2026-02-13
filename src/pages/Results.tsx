import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ResultsLoginForm, type ResultsLoginFormData } from '@/components/results/ResultsLoginForm';
import { ResultsFAQ } from '@/components/results/ResultsFAQ';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, FileText, Clock, Phone, Building2, CheckCircle, XCircle } from 'lucide-react';

const Results = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchResult, setSearchResult] = useState<'found' | 'not_found' | null>(null);

  const handleSubmit = async (data: ResultsLoginFormData) => {
    setIsSubmitting(true);
    setSearchResult(null);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Random result for demo
    const isFound = Math.random() > 0.5;
    
    setIsSubmitting(false);
    setSearchResult(isFound ? 'found' : 'not_found');
    
    if (isFound) {
      toast({
        title: 'Результаты готовы!',
        description: 'Ваши анализы готовы к просмотру.',
      });
    } else {
      toast({
        title: 'Результаты не найдены',
        description: 'Проверьте правильность введённых данных или позвоните в лабораторию.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Layout>
      <div className="container py-8 md:py-12">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад
        </Button>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Результаты анализов</h1>
          <p className="text-muted-foreground mb-8">
            Проверьте готовность результатов лабораторных исследований
          </p>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Проверка результатов</CardTitle>
                  <CardDescription>
                    Введите данные с бланка направления
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResultsLoginForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
                  
                  {searchResult === 'found' && (
                    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-green-900">Результаты готовы!</p>
                        <p className="text-sm text-green-700 mt-1">
                          В демо-версии просмотр результатов недоступен. В реальной системе здесь 
                          отобразятся ваши анализы или ссылка для скачивания PDF.
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {searchResult === 'not_found' && (
                    <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                      <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-red-900">Результаты не найдены</p>
                        <p className="text-sm text-red-700 mt-1">
                          Возможные причины: анализы ещё не готовы, неверный номер направления или 
                          дата рождения. Попробуйте ещё раз или позвоните в лабораторию.
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Часто задаваемые вопросы</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResultsFAQ />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Способы получения</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Онлайн</p>
                      <p className="text-sm text-muted-foreground">
                        Через эту страницу по номеру направления
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Building2 className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">В регистратуре</p>
                      <p className="text-sm text-muted-foreground">
                        Лично с паспортом в рабочее время
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Сроки готовности</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>Общий анализ крови: 1 день</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>Биохимия: 2-3 дня</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>Гормоны: 3-5 дней</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>Бак. посев: 5-7 дней</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Контакты лаборатории</CardTitle>
                </CardHeader>
                <CardContent>
                  <a
                    href="tel:+78412999115"
                    className="flex items-center gap-2 text-sm hover:text-primary"
                  >
                    <Phone className="w-4 h-4" />
                    <span>+7 (8412) 99-91-15</span>
                  </a>
                  <p className="text-xs text-muted-foreground mt-2">
                    Пн-Пт: 8:00-17:00, Сб: 9:00-13:00
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Results;
