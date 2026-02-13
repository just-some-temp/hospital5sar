import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { User, GraduationCap, Award, Calendar, ArrowLeft, Phone, Printer, Info, Loader2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { doctors as staticDoctors, type Doctor } from '@/data/doctors';
import { supabase } from '@/integrations/supabase/client';
import { useDoctorSchedule } from '@/hooks/useDoctorSchedule';

const DoctorDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [doctor, setDoctor] = useState<Doctor | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!id) {
      setDoctor(null);
      return;
    }

    // Check static doctors first
    const staticDoctor = staticDoctors.find((d) => d.id === id);
    if (staticDoctor) {
      setDoctor(staticDoctor);
      return;
    }

    // Check if this is a database doctor (db-{uuid})
    if (id.startsWith('db-')) {
      const userId = id.replace('db-', '');
      fetchDbDoctor(userId);
    } else {
      setDoctor(null);
    }
  }, [id]);

  const fetchDbDoctor = async (userId: string) => {
    setIsLoading(true);

    const { data: dp, error } = await supabase
      .from('doctor_profiles')
      .select('*')
      .eq('user_id', userId)
      .eq('is_published', true)
      .maybeSingle();

    if (error || !dp) {
      setDoctor(null);
      setIsLoading(false);
      return;
    }

    const dbDoctor: Doctor = {
      id: `db-${dp.user_id}`,
      name: (dp as any).full_name || 'Врач',
      specialty: dp.specialty,
      department: dp.department,
      experience: dp.experience,
      category: dp.category as Doctor['category'],
      education: dp.education,
      description: dp.description,
      schedule: [],
      photo: (dp as any).photo_url || undefined,
    };

    setDoctor(dbDoctor);
    setIsLoading(false);
  };

  const { scheduleForDisplay, isLoading: isScheduleLoading } = useDoctorSchedule(doctor?.id);

  const handlePrint = () => {
    window.print();
  };

  if (isLoading || doctor === undefined) {
    return (
      <Layout>
        <div className="container flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!doctor) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="mb-4 text-2xl font-bold text-foreground">Врач не найден</h1>
          <Button asChild>
            <Link to="/doctors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Вернуться к списку врачей
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <div className="bg-muted py-8">
        <div className="container">
          <Breadcrumbs />

          <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-start">
            <div className="flex h-48 w-48 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-card shadow-sm print:hidden">
              {doctor.photo ? (
                <img
                  src={doctor.photo}
                  alt={doctor.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-24 w-24 text-muted-foreground/30" />
              )}
            </div>

            <div className="flex-1">
              <Badge variant="secondary" className="mb-2 no-print">
                {doctor.specialty}
              </Badge>
              <h1 className="mb-2 text-3xl font-bold text-foreground">{doctor.name}</h1>
              <p className="print-only mb-2 text-lg">{doctor.specialty}</p>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Award className="h-4 w-4 no-print" />
                  Категория: {doctor.category}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 no-print" />
                  Стаж: {doctor.experience} лет
                </span>
              </div>
              <p className="mt-4 text-muted-foreground">{doctor.description}</p>

              <div className="mt-6 flex flex-wrap gap-3 no-print">
                <Button asChild size="lg" className="gap-2">
                  <Link to={`/appointment?doctorId=${doctor.id}`}>
                    <Phone className="h-4 w-4" />
                    Записаться на приём
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="gap-2" onClick={handlePrint}>
                  <Printer className="h-4 w-4" />
                  Распечатать
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container py-8">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Education */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary no-print" />
                Образование
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{doctor.education}</p>
            </CardContent>
          </Card>

          {/* Schedule */}
          <Card className="print-schedule">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary no-print" />
                Расписание приёма
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isScheduleLoading ? (
                <div className="flex items-center gap-2 text-muted-foreground py-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Загрузка расписания...
                </div>
              ) : scheduleForDisplay.length > 0 ? (
                <ul className="space-y-2">
                  {scheduleForDisplay.map((item, index) => (
                    <li key={index} className="flex justify-between text-muted-foreground">
                      <span>{item.day}</span>
                      <span className="font-medium text-foreground">{item.hours}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Расписание уточняйте по телефону: +7 (8452) 996-900
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Print footer */}
        <div className="print-only mt-8 border-t pt-4 text-center text-sm text-muted-foreground">
          <p>ГУЗ «СГКБ №5» | г. Саратов, 4 Рабочий проезд, здание 3 | +7 (8452) 996-900</p>
        </div>
      </div>
    </Layout>
  );
};

export default DoctorDetail;
