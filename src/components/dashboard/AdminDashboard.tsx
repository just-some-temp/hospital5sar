import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
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
import { Calendar, Users, UserCog, BarChart3, Loader2, ShieldCheck, ShieldOff, Clock, XCircle, CheckCircle, CheckCircle2 } from 'lucide-react';
import { ScheduleManager } from '@/components/dashboard/ScheduleManager';
import { doctors } from '@/data/doctors';
import { useDoctorProfiles } from '@/hooks/useDoctorProfiles';
import { format, isToday } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

type AppRole = 'patient' | 'doctor' | 'admin';

interface UserWithRole {
  id: string;
  email: string;
  full_name: string | null;
  role: AppRole;
  created_at: string;
  is_active: boolean;
}

interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'confirmed':
      return 'Подтверждено';
    case 'pending':
      return 'Ожидает подтверждения';
    case 'cancelled':
      return 'Отменено';
    case 'completed':
      return 'Завершено';
    default:
      return status;
  }
};

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'confirmed':
      return 'default' as const;
    case 'pending':
      return 'outline' as const;
    case 'cancelled':
      return 'destructive' as const;
    case 'completed':
      return 'secondary' as const;
    default:
      return 'outline' as const;
  }
};

export function AdminDashboard() {
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  const { dbDoctors } = useDoctorProfiles();
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patientNames, setPatientNames] = useState<Map<string, string>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [updatingRole, setUpdatingRole] = useState<string | null>(null);
  const [togglingActive, setTogglingActive] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [completingId, setCompletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // Fetch users with roles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email, full_name, created_at, is_active');

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
      return;
    }

    // Fetch roles
    const { data: roles, error: rolesError } = await supabase
      .from('user_roles')
      .select('user_id, role');

    if (rolesError) {
      console.error('Error fetching roles:', rolesError);
      return;
    }

    const roleMap = new Map(roles.map((r) => [r.user_id, r.role]));
    const usersWithRoles = profiles.map((p) => ({
      ...p,
      role: (roleMap.get(p.id) as AppRole) || 'patient',
      is_active: p.is_active ?? true,
    }));

    setUsers(usersWithRoles);

    // Build patient name map from profiles
    const nameMap = new Map<string, string>();
    profiles.forEach((p) => {
      nameMap.set(p.id, p.full_name || p.email);
    });
    setPatientNames(nameMap);

    // Fetch all appointments
    const { data: appointmentsData } = await supabase
      .from('appointments')
      .select('*')
      .order('appointment_date', { ascending: false });

    if (appointmentsData) {
      setAppointments(appointmentsData as Appointment[]);
    }

    setIsLoading(false);
  };

  const getDoctorName = (doctorId: string) => {
    const staticDoctor = doctors.find((d) => d.id === doctorId);
    if (staticDoctor) return staticDoctor.name;
    const dbDoctor = dbDoctors.find((d) => d.id === doctorId);
    return dbDoctor?.name || `Врач #${doctorId}`;
  };

  const getPatientName = (patientId: string) => {
    return patientNames.get(patientId) || 'Неизвестный пациент';
  };

  const canCancelAppointment = (status: string) => {
    return status === 'pending' || status === 'confirmed';
  };

  const canCompleteAppointment = (appointment: Appointment) => {
    return appointment.status === 'confirmed' && isToday(new Date(appointment.appointment_date));
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
        description: 'Запись на приём успешно отменена.',
      });
      setAppointments((prev) =>
        prev.map((a) => (a.id === appointmentId ? { ...a, status: 'cancelled' } : a))
      );
    }

    setCancellingId(null);
  };

  const handleConfirmAppointment = async (appointmentId: string) => {
    setConfirmingId(appointmentId);

    const { error } = await supabase
      .from('appointments')
      .update({ status: 'confirmed' as const })
      .eq('id', appointmentId);

    if (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось подтвердить запись. Попробуйте позже.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Запись подтверждена',
        description: 'Запись на приём успешно подтверждена.',
      });
      setAppointments((prev) =>
        prev.map((a) => (a.id === appointmentId ? { ...a, status: 'confirmed' } : a))
      );
    }

    setConfirmingId(null);
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
        description: 'Не удалось завершить запись. Попробуйте позже.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Приём завершён',
        description: 'Запись на приём отмечена как завершённая.',
      });
      setAppointments((prev) =>
        prev.map((a) => (a.id === appointmentId ? { ...a, status: 'completed' } : a))
      );
    }

    setCompletingId(null);
  };

  const handleRoleChange = async (userId: string, newRole: AppRole) => {
    if (newRole !== 'admin') {
      const targetUser = users.find((u) => u.id === userId);
      if (targetUser?.role === 'admin') {
        const adminCount = users.filter((u) => u.role === 'admin').length;
        if (adminCount <= 1) {
          toast({
            title: 'Ошибка',
            description: 'Нельзя убрать последнего администратора',
            variant: 'destructive',
          });
          return;
        }
      }
    }

    setUpdatingRole(userId);

    await supabase.from('user_roles').delete().eq('user_id', userId);

    const { error } = await supabase.from('user_roles').insert({
      user_id: userId,
      role: newRole,
    });

    if (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось изменить роль пользователя',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Роль изменена',
        description: 'Роль пользователя успешно обновлена',
      });
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
    }

    setUpdatingRole(null);
  };

  const handleToggleActive = async (userId: string, currentActive: boolean) => {
    if (userId === currentUser?.id) {
      toast({
        title: 'Ошибка',
        description: 'Нельзя деактивировать свой аккаунт',
        variant: 'destructive',
      });
      return;
    }

    const targetUser = users.find((u) => u.id === userId);
    if (targetUser?.role === 'admin' && currentActive) {
      const activeAdminCount = users.filter((u) => u.role === 'admin' && u.is_active).length;
      if (activeAdminCount <= 1) {
        toast({
          title: 'Ошибка',
          description: 'Нельзя деактивировать последнего активного администратора',
          variant: 'destructive',
        });
        return;
      }
    }

    setTogglingActive(userId);

    const { error } = await supabase
      .from('profiles')
      .update({ is_active: !currentActive })
      .eq('id', userId);

    if (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось изменить статус пользователя',
        variant: 'destructive',
      });
    } else {
      toast({
        title: currentActive ? 'Пользователь деактивирован' : 'Пользователь активирован',
        description: currentActive
          ? 'Пользователь больше не сможет войти в систему'
          : 'Пользователь снова может войти в систему',
      });
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, is_active: !currentActive } : u))
      );
    }

    setTogglingActive(null);
  };

  const getRoleBadge = (role: AppRole) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-primary">Администратор</Badge>;
      case 'doctor':
        return <Badge className="bg-accent text-accent-foreground">Врач</Badge>;
      case 'patient':
      default:
        return <Badge variant="secondary">Пациент</Badge>;
    }
  };

  const stats = {
    totalUsers: users.length,
    totalPatients: users.filter((u) => u.role === 'patient').length,
    totalDoctors: users.filter((u) => u.role === 'doctor').length,
    totalAppointments: appointments.length,
    pendingAppointments: appointments.filter((a) => a.status === 'pending').length,
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего пользователей</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalPatients} пациентов, {stats.totalDoctors} врачей
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего записей</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAppointments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ожидают подтверждения</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingAppointments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Врачи</CardTitle>
            <UserCog className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDoctors}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users">Пользователи</TabsTrigger>
          <TabsTrigger value="appointments">Записи</TabsTrigger>
          <TabsTrigger value="schedule" className="gap-1">
            <Clock className="h-4 w-4" />
            Расписание
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Управление пользователями</CardTitle>
              <CardDescription>
                Назначайте роли пользователям для управления доступом
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border rounded-lg ${
                      !user.is_active ? 'opacity-60 bg-muted/50' : ''
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{user.full_name || 'Без имени'}</p>
                        {user.is_active ? (
                          <ShieldCheck className="h-4 w-4 text-green-600" />
                        ) : (
                          <ShieldOff className="h-4 w-4 text-destructive" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <p className="text-xs text-muted-foreground">
                        Зарегистрирован:{' '}
                        {format(new Date(user.created_at), 'd MMMM yyyy', { locale: ru })}
                      </p>
                      {!user.is_active && (
                        <Badge variant="destructive" className="text-xs">
                          Деактивирован
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Активен</span>
                        <Switch
                          checked={user.is_active}
                          onCheckedChange={() => handleToggleActive(user.id, user.is_active)}
                          disabled={togglingActive === user.id || user.id === currentUser?.id}
                        />
                      </div>
                      {getRoleBadge(user.role)}
                      <Select
                        value={user.role}
                        onValueChange={(value) =>
                          handleRoleChange(user.id, value as AppRole)
                        }
                        disabled={updatingRole === user.id}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="patient">Пациент</SelectItem>
                          <SelectItem value="doctor">Врач</SelectItem>
                          <SelectItem value="admin">Администратор</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Все записи</CardTitle>
              <CardDescription>
                Просмотр и управление всеми записями на приём
              </CardDescription>
            </CardHeader>
            <CardContent>
              {appointments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Записей пока нет
                </div>
              ) : (
                <div className="space-y-4">
                  {appointments.slice(0, 20).map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border rounded-lg"
                    >
                      <div className="space-y-1">
                        <p className="font-medium">
                          {format(new Date(appointment.appointment_date), 'd MMMM yyyy', {
                            locale: ru,
                          })}{' '}
                          в {appointment.appointment_time}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Врач: {getDoctorName(appointment.doctor_id)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Пациент: {getPatientName(appointment.patient_id)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <Badge variant={getStatusBadgeVariant(appointment.status)}>
                          {getStatusLabel(appointment.status)}
                        </Badge>
                        {appointment.status === 'pending' && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-green-700 border-green-600 hover:bg-green-50 dark:hover:bg-green-950"
                                disabled={confirmingId === appointment.id}
                              >
                                {confirmingId === appointment.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <>
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    Подтвердить
                                  </>
                                )}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Подтвердить запись?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Подтвердить запись пациента{' '}
                                  <strong>{getPatientName(appointment.patient_id)}</strong> к{' '}
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
                                <AlertDialogCancel>Отмена</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleConfirmAppointment(appointment.id)}
                                  className="bg-green-600 text-white hover:bg-green-700"
                                >
                                  Да, подтвердить
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
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
                                  <strong>{getPatientName(appointment.patient_id)}</strong> у{' '}
                                  <strong>{getDoctorName(appointment.doctor_id)}</strong> как завершённый?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Отмена</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleCompleteAppointment(appointment.id)}
                                >
                                  Да, завершить
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                        {canCancelAppointment(appointment.status) && (
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
                                  Вы уверены, что хотите отменить запись пациента{' '}
                                  <strong>{getPatientName(appointment.patient_id)}</strong> к{' '}
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
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <ScheduleManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
