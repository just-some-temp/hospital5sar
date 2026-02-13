import { Layout } from '@/components/layout/Layout';
import { LeadershipCard } from '@/components/about/LeadershipCard';
import { Timeline } from '@/components/about/Timeline';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, Award, Target } from 'lucide-react';

const historyItems = [
  {
    year: '1965',
    title: 'Основание больницы',
    description: 'Городская клиническая больница №5 была основана для обеспечения медицинской помощью жителей Саратова.',
  },
  {
    year: '1980',
    title: 'Расширение отделений',
    description: 'Открыты новые специализированные отделения: кардиология, неврология, эндоскопия.',
  },
  {
    year: '1995',
    title: 'Модернизация оборудования',
    description: 'Проведено масштабное обновление медицинского оборудования и внедрение новых технологий.',
  },
  {
    year: '2010',
    title: 'Капитальный ремонт',
    description: 'Завершён капитальный ремонт основного корпуса, улучшены условия для пациентов.',
  },
  {
    year: '2020',
    title: 'Цифровизация',
    description: 'Внедрена электронная медицинская карта и система онлайн-записи к специалистам.',
  },
  {
    year: '2024',
    title: 'Новые горизонты',
    description: 'Открыт центр высокотехнологичной медицинской помощи, расширен спектр диагностических услуг.',
  },
];

const leadership = [
  {
    name: 'Шамьюнов Марат Равильевич',
    position: 'Главный врач',
    description: 'Доктор медицинских наук, заслуженный врач РФ. Стаж работы более 30 лет. Приём граждан: Вт, Чт 10:00–12:00, Ср 14:00–16:00.',
  },
  {
    name: 'Сидорова Елена Михайловна',
    position: 'Заместитель главного врача по медицинской части',
    description: 'Кандидат медицинских наук, врач высшей категории. Стаж работы 25 лет.',
  },
  {
    name: 'Козлов Дмитрий Сергеевич',
    position: 'Заместитель главного врача по хирургии',
    description: 'Врач высшей категории, хирург. Стаж работы более 20 лет.',
  },
  {
    name: 'Новикова Ольга Петровна',
    position: 'Заместитель главного врача по поликлинической работе',
    description: 'Кандидат медицинских наук. Стаж работы 18 лет.',
  },
];

const departments = [
  'Гастроэнтерологическое отделение (Гастроэнтерологический центр)',
  'Терапевтическое отделение',
  'Кардиологическое отделение',
  'Хирургическое отделение',
  'Неврологическое отделение',
  'Отделение анестезиологии и реанимации',
  'Приёмное отделение',
  'Диагностическое отделение',
  'Лаборатория',
  'Физиотерапевтическое отделение',
  'Поликлиническое отделение №1',
  'Поликлиническое отделение №2 (ул. Клочкова, 74)',
];

export default function About() {
  return (
    <Layout>
      {/* Hero section */}
      <section className="bg-primary py-12 text-primary-foreground">
        <div className="container">
          <h1 className="text-3xl font-bold md:text-4xl">О больнице</h1>
          <p className="mt-2 text-lg text-primary-foreground/80">
            ГУЗ «Саратовская городская клиническая больница №5»
          </p>
        </div>
      </section>

      {/* Mission and values */}
      <section className="py-12">
        <div className="container">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-3">
                <Target className="h-8 w-8 text-primary" />
                <CardTitle className="text-lg">Миссия</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Оказание качественной и доступной медицинской помощи жителям Саратова и области.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <Users className="h-8 w-8 text-primary" />
                <CardTitle className="text-lg">Пациенты</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Ежегодно мы оказываем помощь более чем 50 000 пациентам стационара и поликлиники.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <Building2 className="h-8 w-8 text-primary" />
                <CardTitle className="text-lg">Инфраструктура</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Современное оборудование и комфортные условия пребывания для пациентов.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <Award className="h-8 w-8 text-primary" />
                <CardTitle className="text-lg">Качество</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Высокие стандарты лечения и постоянное повышение квалификации персонала.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* History */}
      <section className="bg-secondary/30 py-12">
        <div className="container">
          <h2 className="mb-8 text-center text-2xl font-bold">История больницы</h2>
          <Timeline items={historyItems} />
        </div>
      </section>

      {/* Departments */}
      <section className="py-12">
        <div className="container">
          <h2 className="mb-8 text-2xl font-bold">Структура и отделения</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {departments.map((dept, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                    {index + 1}
                  </div>
                  <span className="text-sm font-medium">{dept}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="bg-secondary/30 py-12">
        <div className="container">
          <h2 className="mb-8 text-2xl font-bold">Руководство</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {leadership.map((person, index) => (
              <LeadershipCard key={index} {...person} />
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-12">
        <div className="container">
          <h2 className="mb-8 text-2xl font-bold">Достижения и награды</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-l-4 border-l-primary">
              <CardContent className="p-4">
                <Award className="h-6 w-6 text-primary mb-2" />
                <h3 className="font-semibold">Лучшая больница года</h3>
                <p className="text-sm text-muted-foreground">
                  Победитель регионального конкурса «Лучшее учреждение здравоохранения» 2023 г.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-accent">
              <CardContent className="p-4">
                <Award className="h-6 w-6 text-accent mb-2" />
                <h3 className="font-semibold">Знак качества</h3>
                <p className="text-sm text-muted-foreground">
                  Сертификат соответствия стандартам качества медицинской помощи.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-primary">
              <CardContent className="p-4">
                <Award className="h-6 w-6 text-primary mb-2" />
                <h3 className="font-semibold">Благодарность Минздрава</h3>
                <p className="text-sm text-muted-foreground">
                  Благодарственное письмо за вклад в развитие здравоохранения региона.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
}
