import { Layout } from '@/components/layout/Layout';
import { ContactForm } from '@/components/contacts/ContactForm';
import { MapEmbed } from '@/components/contacts/MapEmbed';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Mail, MapPin, Clock, Bus, Car } from 'lucide-react';

const contactInfo = [
  {
    icon: Phone,
    title: 'Регистратура',
    items: [
      { label: 'Call-центр поликлиники №1', value: '+7 (8452) 996-900' },
      { label: 'Поликлиника №2', value: '+7 (8452) 996-903' },
      { label: 'Приёмное отделение', value: '+7 (8452) 996-901' },
    ],
  },
  {
    icon: Mail,
    title: 'Электронная почта',
    items: [
      { label: 'Общие вопросы', value: 'info@sgkb5.ru' },
      { label: 'Канцелярия', value: 'docs@sgkb5.ru' },
    ],
  },
  {
    icon: Clock,
    title: 'Режим работы',
    items: [
      { label: 'Поликлиника', value: 'Пн-Пт: 8:00-20:00' },
      { label: 'Суббота', value: '9:00-15:00' },
      { label: 'Воскресенье', value: '9:00-14:00' },
      { label: 'Стационар', value: 'Круглосуточно' },
    ],
  },
];

const departments = [
  { name: 'Терапевтическое отделение', phone: '+7 (8452) 996-900', hours: '8:00-18:00' },
  { name: 'Гастроэнтерологическое отделение', phone: '+7 (8452) 996-900', hours: 'Круглосуточно' },
  { name: 'Хирургическое отделение', phone: '+7 (8452) 996-901', hours: 'Круглосуточно' },
  { name: 'Кардиологическое отделение', phone: '+7 (8452) 996-901', hours: 'Круглосуточно' },
  { name: 'Неврологическое отделение', phone: '+7 (8452) 996-901', hours: 'Круглосуточно' },
  { name: 'Лаборатория', phone: '+7 (8452) 996-900', hours: '7:30-19:00' },
  { name: 'Поликлиника №2 (ул. Клочкова, 74)', phone: '+7 (8452) 996-903', hours: '8:00-20:00' },
];

export default function Contacts() {
  return (
    <Layout>
      {/* Hero section */}
      <section className="bg-primary py-12 text-primary-foreground">
        <div className="container">
          <h1 className="text-3xl font-bold md:text-4xl">Контакты</h1>
          <p className="mt-2 text-lg text-primary-foreground/80">
            Свяжитесь с нами любым удобным способом
          </p>
        </div>
      </section>

      {/* Address and map */}
      <section className="py-8">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Map */}
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Наш адрес
              </h2>
              <p className="text-muted-foreground mb-4">
                410071, г. Саратов, 4 Рабочий проезд, здание 3
              </p>
              <MapEmbed className="h-[400px]" />
            </div>

            {/* Contact info cards */}
            <div className="space-y-4">
              {contactInfo.map((info, index) => (
                <Card key={index}>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <info.icon className="h-5 w-5 text-primary" />
                      {info.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2">
                      {info.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between gap-2">
                          <dt className="text-muted-foreground">{item.label}:</dt>
                          <dd className="font-medium">{item.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How to reach us */}
      <section className="bg-secondary/30 py-8">
        <div className="container">
          <h2 className="text-xl font-semibold mb-6">Как добраться</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Bus className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Общественным транспортом</h3>
                    <p className="text-sm text-muted-foreground">
                      Остановка «Больница №5»<br />
                      Автобусы: 11, 25, 33, 90<br />
                      Троллейбусы: 2, 9<br />
                      Маршрутные такси: 42, 54, 93
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Car className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">На автомобиле</h3>
                    <p className="text-sm text-muted-foreground">
                      Въезд на территорию с 4-го Рабочего проезда.<br />
                      Бесплатная парковка для посетителей на 50 мест.<br />
                      Парковка для инвалидов у главного входа.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Department contacts */}
      <section className="py-8">
        <div className="container">
          <h2 className="text-xl font-semibold mb-6">Контакты отделений</h2>
          <div className="rounded-lg border overflow-hidden">
            <table className="w-full">
              <thead className="bg-secondary">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">Отделение</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Телефон</th>
                  <th className="px-4 py-3 text-left text-sm font-medium hidden sm:table-cell">Часы работы</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {departments.map((dept, index) => (
                  <tr key={index} className="hover:bg-muted/50">
                    <td className="px-4 py-3 text-sm">{dept.name}</td>
                    <td className="px-4 py-3 text-sm">
                      <a href={`tel:${dept.phone.replace(/\D/g, '')}`} className="text-primary hover:underline">
                        {dept.phone}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground hidden sm:table-cell">{dept.hours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Contact form */}
      <section className="bg-secondary/30 py-12">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-2">Форма обратной связи</h2>
            <p className="text-center text-muted-foreground mb-8">
              Задайте вопрос или оставьте отзыв о работе больницы
            </p>
            <Card>
              <CardContent className="p-6">
                <ContactForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
}
