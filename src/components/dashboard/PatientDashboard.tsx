import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { Calendar, Clock, User, FileText, Plus, Loader2, XCircle } from 'lucide-react';
import { doctors } from '@/data/doctors';
import { useDoctorProfiles } from '@/hooks/useDoctorProfiles';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { ProfileForm } from './ProfileForm';

interface Appointment {
  id: string;
  doctor_id: string;
  appointment_date: string;
  appointment_time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes: string | null;
  created_at: string;
}

export function PatientDashboard() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const { dbDoctors } = useDoctorProfiles();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    fetchAppointments();
  }, [user]);

  const fetchAppointments = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('patient_id', user.id)
      .order('appointment_date', { ascending: true });

    if (error) {
      console.error('Error fetching appointments:', error);
    } else {
      setAppointments(data as Appointment[]);
    }
    setIsLoading(false);
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    setCancellingId(appointmentId);

    const { error } = await supabase
      .from('appointments')
      .update({ status: 'cancelled' as const })
      .eq('id', appointmentId);

    if (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось отменить запись. Попробуйте позже.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Запись отменена',
        description: 'Ваша запись на приём успешно отменена.',
      });
      setAppointments((prev) =>
        prev.map((a) => (a.id === appointmentId ? { ...a, status: 'cancelled' as const } : a))
      );
    }

    setCancellingId(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-accent text-accent-foreground">Подтверждено</Badge>;
      case 'pending':
        return <Badge variant="outline">Ожидает подтверждения</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Отменено</Badge>;
      case 'completed':
        return <Badge variant="secondary">Завершено</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getDoctorName = (doctorId: string) => {
    const staticDoctor = doctors.find((d) => d.id === doctorId);
    if (staticDoctor) return staticDoctor.name;
    const dbDoctor = dbDoctors.find((d) => d.id === doctorId);
    return dbDoctor?.name || 'Неизвестный врач';
  };

  const getDoctorSpecialty = (doctorId: string) => {
    const staticDoctor = doctors.find((d) => d.id === doctorId);
    if (staticDoctor) return staticDoctor.specialty;
    const dbDoctor = dbDoctors.find((d) => d.id === doctorId);
    return dbDoctor?.specialty || '';
  };

  const canCancel = (appointment: Appointment) => {
    return (
      (appointment.status === 'pending' || appointment.status === 'confirmed') &&
      new Date(appointment.appointment_date) >= new Date()
    );
  };

  const upcomingAppointments = appointments.filter(
    (a) => new Date(a.appointment_date) >= new Date() && a.status !== 'cancelled'
  );

  const pastAppointments = appointments.filter(
    (a) => new Date(a.appointment_date) < new Date() || a.status === 'cancelled'
  );

  return (
    <Tabs defaultValue="appointments" className="space-y-6">
      <TabsList>
        <TabsTrigger value="appointments">Мои записи</TabsTrigger>
        <TabsTrigger value="history">История</TabsTrigger>
        <TabsTrigger value="profile">Профиль</TabsTrigger>
      </TabsList>

      <TabsContent value="appointments" className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Предстоящие записи</h2>
          <Button asChild>
            <Link to="/appointment">
              <Plus className="w-4 h-4 mr-2" />
              Записаться на приём
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : upcomingAppointments.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Нет предстоящих записей</h3>
              <p className="text-muted-foreground mb-4">
                Запишитесь на приём к врачу
              </p>
              <Button asChild>
                <Link to="/appointment">Записаться</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {upcomingAppointments.map((appointment) => (
              <Card key={appointment.id}>
                <CardContent className="py-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-primary" />
                        <span className="font-medium">
                          {getDoctorName(appointment.doctor_id)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {getDoctorSpecialty(appointment.doctor_id)}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        {format(new Date(appointment.appointment_date), 'd MMMM yyyy', {
                          locale: ru,
                        })}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        {appointment.appointment_time}
                      </div>
                      {getStatusBadge(appointment.status)}
                      {canCancel(appointment) && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                              disabled={cancellingId === appointment.id}
                            >
                              {cancellingId === appointment.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <>
                                  <XCircle className="w-4 h-4 mr-1" />
                                  Отменить
                                </>
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Отменить запись?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Вы уверены, что хотите отменить запись к{' '}
                                <strong>{getDoctorName(appointment.doctor_id)}</strong> на{' '}
                                <strong>
                                  {format(new Date(appointment.appointment_date), 'd MMMM yyyy', {
                                    locale: ru,
                                  })}
                                </strong>{' '}
                                в <strong>{appointment.appointment_time}</strong>?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Нет, оставить</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleCancelAppointment(appointment.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Да, отменить
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="history" className="space-y-6">
        <h2 className="text-xl font-semibold">История посещений</h2>

        {pastAppointments.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">История пуста</h3>
              <p className="text-muted-foreground">
                Здесь будут отображаться прошедшие приёмы
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {pastAppointments.map((appointment) => (
              <Card key={appointment.id} className="opacity-80">
                <CardContent className="py-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">
                          {getDoctorName(appointment.doctor_id)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {getDoctorSpecialty(appointment.doctor_id)}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(appointment.appointment_date), 'd MMMM yyyy', {
                          locale: ru,
                        })}
                      </div>
                      {getStatusBadge(appointment.status)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="profile">
        <Card>
          <CardHeader>
            <CardTitle>Мой профиль</CardTitle>
            <CardDescription>
              Управление личными данными и контактной информацией
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileForm />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
