import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HomeVisitForm, type HomeVisitFormData } from '@/components/home-visit/HomeVisitForm';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Phone, Clock, MapPin, AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const HomeVisit = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleSubmit = async (data: HomeVisitFormData) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsComplete(true);
    
    toast({
      title: 'Заявка отправлена!',
      description: 'Оператор свяжется с вами для подтверждения.',
    });
  };

  if (isComplete) {
    return (
      <Layout>
        <div className="container py-12">
          <Card className="max-w-lg mx-auto text-center">
            <CardContent className="py-12">
              <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Заявка принята!</h2>
              <p className="text-muted-foreground mb-6">
                Оператор свяжется с вами в течение 30 минут для подтверждения вызова. 
                Пожалуйста, держите телефон в зоне доступа.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="outline" onClick={() => navigate('/')}>
                  На главную
                </Button>
                <Button onClick={() => setIsComplete(false)}>
                  Новая заявка
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

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
          <h1 className="text-3xl font-bold mb-2">Вызов врача на дом</h1>
          <p className="text-muted-foreground mb-8">
            Оформите заявку на вызов участкового терапевта или педиатра
          </p>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Заявка на вызов</CardTitle>
                  <CardDescription>
                    Заполните форму, и мы свяжемся с вами для подтверждения
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <HomeVisitForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Условия вызова</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Время работы</p>
                      <p className="text-sm text-muted-foreground">
                        Пн-Пт: 8:00-18:00<br />
                        Сб: 9:00-14:00
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Территория обслуживания</p>
                      <p className="text-sm text-muted-foreground">
                        Фрунзенский и Октябрьский районы г. Саратова
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Экстренные случаи</AlertTitle>
                <AlertDescription>
                  При угрозе жизни или неотложных состояниях звоните в скорую помощь: <strong>103</strong>
                </AlertDescription>
              </Alert>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Телефоны</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <a
                    href="tel:+78452996900"
                    className="flex items-center gap-2 text-sm hover:text-primary"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Регистратура: +7 (8452) 996-900</span>
                  </a>
                  <a
                    href="tel:+78452996903"
                    className="flex items-center gap-2 text-sm hover:text-primary"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Поликлиника №2: +7 (8452) 996-903</span>
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomeVisit;
