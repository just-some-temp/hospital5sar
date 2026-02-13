import { Users, Building2, Award, Clock } from 'lucide-react';

const stats = [
  {
    icon: Users,
    value: '150+',
    label: 'Врачей',
    description: 'высшей и первой категории',
  },
  {
    icon: Building2,
    value: '15',
    label: 'Отделений',
    description: 'различных направлений',
  },
  {
    icon: Award,
    value: '50+',
    label: 'Лет опыта',
    description: 'в сфере здравоохранения',
  },
  {
    icon: Clock,
    value: '24/7',
    label: 'Стационар',
    description: 'круглосуточная помощь',
  },
];

export function StatsSection() {
  return (
    <section className="border-b bg-card py-12">
      <div className="container">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <stat.icon className="h-7 w-7 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="font-medium text-foreground">{stat.label}</div>
                <div className="text-sm text-muted-foreground">{stat.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
