import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { ServiceCard } from '@/components/services/ServiceCard';
import { PriceTable } from '@/components/services/PriceTable';
import { services, priceList, serviceCategories } from '@/data/services';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, Clock, CreditCard, Shield } from 'lucide-react';

export default function Services() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'oms' | 'paid'>('all');

  const filteredServices = selectedCategory === 'all'
    ? services
    : services.filter(s => s.category === selectedCategory);

  return (
    <Layout>
      {/* Hero section */}
      <section className="bg-primary py-12 text-primary-foreground">
        <div className="container">
          <h1 className="text-3xl font-bold md:text-4xl">Услуги</h1>
          <p className="mt-2 text-lg text-primary-foreground/80">
            Медицинские услуги по ОМС и на платной основе
          </p>
        </div>
      </section>

      {/* Info cards */}
      <section className="py-8">
        <div className="container">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <Shield className="h-8 w-8 text-primary shrink-0" />
                <div>
                  <p className="font-medium">Услуги по ОМС</p>
                  <p className="text-sm text-muted-foreground">Бесплатно по полису</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <CreditCard className="h-8 w-8 text-primary shrink-0" />
                <div>
                  <p className="font-medium">Платные услуги</p>
                  <p className="text-sm text-muted-foreground">Наличный и безналичный расчёт</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <Phone className="h-8 w-8 text-primary shrink-0" />
                <div>
                  <p className="font-medium">Запись на приём</p>
                  <p className="text-sm text-muted-foreground">+7 (8412) 99-91-11</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <Clock className="h-8 w-8 text-primary shrink-0" />
                <div>
                  <p className="font-medium">Время работы</p>
                  <p className="text-sm text-muted-foreground">Пн-Пт: 8:00-20:00</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services tabs */}
      <section className="py-8">
        <div className="container">
          <Tabs defaultValue="services" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="services">Перечень услуг</TabsTrigger>
              <TabsTrigger value="prices">Прайс-лист</TabsTrigger>
            </TabsList>
            
            <TabsContent value="services">
              {/* Category filter */}
              <div className="mb-6 flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory('all')}
                >
                  Все услуги
                </Button>
                {serviceCategories.map((cat) => (
                  <Button
                    key={cat.id}
                    variant={selectedCategory === cat.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(cat.id as 'oms' | 'paid')}
                  >
                    {cat.name}
                  </Button>
                ))}
              </div>
              
              {/* Services grid */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredServices.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="prices">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Прайс-лист на платные медицинские услуги</h2>
                <p className="text-muted-foreground">
                  Цены указаны в рублях. Актуальность прайс-листа — январь 2025 года.
                </p>
              </div>
              
              <PriceTable items={priceList} />
              
              <div className="mt-8 rounded-lg bg-secondary/50 p-4">
                <h3 className="font-medium mb-2">Важная информация</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Оплата производится в кассе учреждения или по безналичному расчёту</li>
                  <li>• При необходимости выдаётся справка для налогового вычета</li>
                  <li>• Действует система скидок для пенсионеров и многодетных семей</li>
                  <li>• Предварительная запись обязательна</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA section */}
      <section className="bg-secondary/30 py-12">
        <div className="container text-center">
          <h2 className="text-2xl font-bold mb-4">Запишитесь на приём</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Для записи к специалисту позвоните по телефону регистратуры или воспользуйтесь онлайн-записью через портал госуслуг.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <a href="tel:+78412999111">
                <Phone className="mr-2 h-4 w-4" />
                +7 (8412) 99-91-11
              </a>
            </Button>
            <Button size="lg" variant="outline">
              Онлайн-запись
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
