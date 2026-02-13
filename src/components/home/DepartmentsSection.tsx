import { Link } from 'react-router-dom';
import { 
  Heart, 
  Activity, 
  Stethoscope, 
  Brain, 
  Bone, 
  Eye,
  Baby,
  Syringe
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const departments = [
  {
    icon: Heart,
    name: 'Кардиология',
    description: 'Диагностика и лечение заболеваний сердца',
  },
  {
    icon: Activity,
    name: 'Терапия',
    description: 'Общетерапевтическая помощь и профилактика',
  },
  {
    icon: Stethoscope,
    name: 'Хирургия',
    description: 'Плановые и экстренные хирургические операции',
  },
  {
    icon: Brain,
    name: 'Неврология',
    description: 'Лечение заболеваний нервной системы',
  },
  {
    icon: Bone,
    name: 'Травматология',
    description: 'Помощь при травмах и заболеваниях костей',
  },
  {
    icon: Eye,
    name: 'Офтальмология',
    description: 'Диагностика и лечение заболеваний глаз',
  },
  {
    icon: Baby,
    name: 'Педиатрия',
    description: 'Медицинская помощь детям',
  },
  {
    icon: Syringe,
    name: 'Эндокринология',
    description: 'Лечение гормональных нарушений',
  },
];

export function DepartmentsSection() {
  return (
    <section className="py-16">
      <div className="container">
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-3xl font-bold text-foreground">Наши отделения</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            В нашей больнице работают специалисты различных направлений, 
            обеспечивая комплексную медицинскую помощь
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {departments.map((dept) => (
            <Card 
              key={dept.name} 
              className="group cursor-pointer transition-all hover:border-primary hover:shadow-md"
            >
              <CardContent className="flex items-start gap-4 p-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <dept.icon className="h-6 w-6 text-primary group-hover:text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{dept.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{dept.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link 
            to="/services" 
            className="text-primary hover:underline font-medium"
          >
            Смотреть все отделения →
          </Link>
        </div>
      </div>
    </section>
  );
}
