import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { doctors as staticDoctors } from '@/data/doctors';
import { useDoctorSchedule, getDayName, type ScheduleEntry } from '@/hooks/useDoctorSchedule';
import { Plus, Trash2, Clock, Loader2 } from 'lucide-react';

interface DoctorOption {
  id: string;
  name: string;
  specialty: string;
}

const DAYS = [
  { value: 1, label: 'Понедельник' },
  { value: 2, label: 'Вторник' },
  { value: 3, label: 'Среда' },
  { value: 4, label: 'Четверг' },
  { value: 5, label: 'Пятница' },
  { value: 6, label: 'Суббота' },
  { value: 0, label: 'Воскресенье' },
];

const TIME_OPTIONS = Array.from({ length: 27 }, (_, i) => {
  const h = Math.floor((i + 14) / 2); // starts at 07:00
  const m = (i + 14) % 2 === 0 ? '00' : '30';
  return `${String(h).padStart(2, '0')}:${m}`;
}).filter((t) => {
  const h = parseInt(t.split(':')[0]);
  return h >= 7 && h <= 20;
});

export function ScheduleManager() {
  const { toast } = useToast();
  const [allDoctors, setAllDoctors] = useState<DoctorOption[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const { schedule, isLoading: isLoadingSchedule, refetch } = useDoctorSchedule(
    selectedDoctorId || undefined
  );

  // New slot state
  const [newDay, setNewDay] = useState<string>('');
  const [newStart, setNewStart] = useState<string>('09:00');
  const [newEnd, setNewEnd] = useState<string>('15:00');

  useEffect(() => {
    fetchAllDoctors();
  }, []);

  const fetchAllDoctors = async () => {
    setIsLoadingDoctors(true);

    // Static doctors
    const staticOptions: DoctorOption[] = staticDoctors.map((d) => ({
      id: d.id,
      name: d.name,
      specialty: d.specialty,
    }));

    // DB doctors
    const { data: dbProfiles } = await supabase
      .from('doctor_profiles')
      .select('user_id, specialty');

    let dbOptions: DoctorOption[] = [];
    if (dbProfiles && dbProfiles.length > 0) {
      const userIds = dbProfiles.map((dp) => dp.user_id);
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', userIds);

      const nameMap = new Map<string, string>();
      profiles?.forEach((p) => nameMap.set(p.id, p.full_name || 'Врач'));

      dbOptions = dbProfiles.map((dp) => ({
        id: `db-${dp.user_id}`,
        name: nameMap.get(dp.user_id) || 'Врач',
        specialty: dp.specialty,
      }));
    }

    setAllDoctors([...staticOptions, ...dbOptions]);
    setIsLoadingDoctors(false);
  };

  const handleAddSlot = async () => {
    if (!selectedDoctorId || !newDay) {
      toast({ title: 'Выберите день', variant: 'destructive' });
      return;
    }

    if (newStart >= newEnd) {
      toast({ title: 'Время начала должно быть раньше окончания', variant: 'destructive' });
      return;
    }

    setIsSaving(true);
    const { error } = await supabase.from('doctor_schedules').insert({
      doctor_id: selectedDoctorId,
      day_of_week: parseInt(newDay),
      start_time: newStart,
      end_time: newEnd,
    });

    if (error) {
      toast({ title: 'Ошибка при добавлении', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Слот добавлен' });
      setNewDay('');
      refetch();
    }
    setIsSaving(false);
  };

  const handleDeleteSlot = async (slotId: string) => {
    const { error } = await supabase.from('doctor_schedules').delete().eq('id', slotId);

    if (error) {
      toast({ title: 'Ошибка при удалении', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Слот удалён' });
      refetch();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Управление расписанием
        </CardTitle>
        <CardDescription>
          Настройте рабочие часы для каждого врача по дням недели
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Doctor selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Выберите врача</label>
          {isLoadingDoctors ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Загрузка...
            </div>
          ) : (
            <Select value={selectedDoctorId} onValueChange={setSelectedDoctorId}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите врача..." />
              </SelectTrigger>
              <SelectContent>
                {allDoctors.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.name} — {d.specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Schedule display */}
        {selectedDoctorId && (
          <>
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Текущее расписание</h4>
              {isLoadingSchedule ? (
                <div className="flex items-center gap-2 text-muted-foreground py-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Загрузка...
                </div>
              ) : schedule.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4">
                  Расписание не задано. Добавьте рабочие часы ниже.
                </p>
              ) : (
                <div className="space-y-2">
                  {schedule.map((slot) => (
                    <div
                      key={slot.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <span className="font-medium min-w-[120px]">
                          {getDayName(slot.day_of_week)}
                        </span>
                        <span className="text-muted-foreground">
                          {slot.start_time} — {slot.end_time}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteSlot(slot.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add new slot */}
            <div className="space-y-3 border-t pt-4">
              <h4 className="text-sm font-medium">Добавить рабочий день</h4>
              <div className="flex flex-col sm:flex-row gap-3 items-end">
                <div className="space-y-1 flex-1">
                  <label className="text-xs text-muted-foreground">День недели</label>
                  <Select value={newDay} onValueChange={setNewDay}>
                    <SelectTrigger>
                      <SelectValue placeholder="День..." />
                    </SelectTrigger>
                    <SelectContent>
                      {DAYS.map((d) => (
                        <SelectItem key={d.value} value={String(d.value)}>
                          {d.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Начало</label>
                  <Select value={newStart} onValueChange={setNewStart}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_OPTIONS.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Конец</label>
                  <Select value={newEnd} onValueChange={setNewEnd}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_OPTIONS.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddSlot} disabled={isSaving} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Добавить
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
