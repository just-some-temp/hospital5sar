import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Calendar, Clock, User, Users, Loader2, Stethoscope, CheckCircle2 } from 'lucide-react';
import { format, isToday, isThisWeek } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { ProfileForm } from './ProfileForm';
import { DoctorProfileForm } from './DoctorProfileForm';

interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  appointment_time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes: string | null;
}

interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
}

export function DoctorDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Map<string, Profile>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [completingId, setCompletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchAppointments();
  }, [user]);

  const fetchAppointments = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('doctor_id', `db-${user.id}`)
      .order('appointment_date', { ascending: true })
      .order('appointment_time', { ascending: true });

    if (error) {
      console.error('Error fetching appointments:', error);
    } else {
      setAppointments(data as Appointment[]);
      
      const patientIds = [...new Set(data.map((a) => a.patient_id))];
      if (patientIds.length > 0) {
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, full_name, phone')
          .in('id', patientIds);

        if (profilesData) {
          const profileMap = new Map();
          profilesData.forEach((p) => profileMap.set(p.id, p));
          setPatients(profileMap);
        }
      }
    }
    setIsLoading(false);
  };

  const canCompleteAppointment = (appointment: Appointment) => {
    return appointment.status === 'confirmed' && isToday(new Date(appointment.appointment_date));
  };

  const handleCompleteAppointment = async (appointmentId: string) => {
    setCompletingId(appointmentId);

    const { error } = await supabase
      .from('appointments')
      .update({ status: 'completed' as const })
      .eq('id', appointmentId);

    if (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось завершить приём. Попробуйте позже.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Приём завершён',
        description: 'Запись отмечена как завершённая.',
      });
      setAppointments((prev) =>
        prev.map((a) => (a.id === appointmentId ? { ...a, status: 'completed' as const } : a))
      );
    }

    setCompletingId(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-accent text-accent-foreground">Подтверждено</Badge>;
      case 'pending':
        return <Badge variant="outline">Ожидает</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Отменено</Badge>;
      case 'completed':
        return <Badge variant="secondary">Завершено</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPatientName = (patientId: string) => {
    const patient = patients.get(patientId);
    return patient?.full_name || 'Пациент';
  };

  const todayAppointments = appointments.filter(
    (a) => isToday(new Date(a.appointment_date)) && a.status !== 'cancelled'
  );

  const weekAppointments = appointments.filter(
    (a) =>
      isThisWeek(new Date(a.appointment_date)) &&
      !isToday(new Date(a.appointment_date)) &&
      a.status !== 'cancelled'
  );

  const uniquePatients = new Set(
    appointments
      .filter((a) => a.status !== 'cancelled')
      .map((a) => a.patient_id)
  );

  const renderAppointmentCard = (appointment: Appointment, showDate = false) => (
    <Card key={appointment.id}>
      <CardContent className="py-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-4">
            {showDate && (
              <div className="text-sm text-muted-foreground">
                {format(new Date(appointment.appointment_date), showDate ? 'd MMMM yyyy' : 'EEEE, d MMM', {
                  locale: ru,
                })}
              </div>
            )}
            <div className="flex items-center gap-2 font-medium">
              <Clock className="w-4 h-4 text-primary" />
              {appointment.appointment_time}
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              {getPatientName(appointment.patient_id)}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {canCompleteAppointment(appointment) && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-blue-700 border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950"
                    disabled={completingId === appointment.id}
                  >
                    {completingId === appointment.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        Завершить
                      </>
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Завершить приём?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Отметить приём пациента{' '}
                      <strong>{getPatientName(appointment.patient_id)}</strong> как завершённый?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Отмена</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleCompleteAppointment(appointment.id)}>
                      Да, завершить
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            {getStatusBadge(appointment.status)}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Сегодня приёмов</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayAppointments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">На этой неделе</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {todayAppointments.length + weekAppointments.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего пациентов</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniquePatients.size}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="today" className="space-y-6">
        <TabsList>
          <TabsTrigger value="today">Сегодня ({todayAppointments.length})</TabsTrigger>
          <TabsTrigger value="week">Эта неделя</TabsTrigger>
          <TabsTrigger value="all">Все записи</TabsTrigger>
          <TabsTrigger value="profile" className="gap-1">
            <Stethoscope className="h-4 w-4" />
            Мой профиль
          </TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : todayAppointments.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Нет приёмов на сегодня</h3>
                <p className="text-muted-foreground">Записей на сегодняшний день нет</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {todayAppointments.map((a) => renderAppointmentCard(a))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="week" className="space-y-4">
          {weekAppointments.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Нет записей на эту неделю</h3>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {weekAppointments.map((a) => renderAppointmentCard(a, true))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {appointments.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Нет записей</h3>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {appointments.map((a) => renderAppointmentCard(a, true))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Профессиональный профиль</CardTitle>
              <CardDescription>
                Заполните информацию о себе — она будет отображаться на странице врачей
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DoctorProfileForm />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Личные данные</CardTitle>
              <CardDescription>
                Основная информация вашего аккаунта
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
