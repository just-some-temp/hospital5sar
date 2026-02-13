import { useMemo, useEffect } from 'react';
import { format, addDays, getDay } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { doctors } from '@/data/doctors';
import { cn } from '@/lib/utils';
import { useDoctorSchedule } from '@/hooks/useDoctorSchedule';
import { useBookedSlots } from '@/hooks/useBookedSlots';
import { Loader2 } from 'lucide-react';

interface DateTimeSelectProps {
  selectedDoctorId: string;
  selectedDate: Date | undefined;
  selectedTime: string;
  onDateChange: (date: Date | undefined) => void;
  onTimeChange: (time: string) => void;
}

export function DateTimeSelect({
  selectedDoctorId,
  selectedDate,
  selectedTime,
  onDateChange,
  onTimeChange,
}: DateTimeSelectProps) {
  const doctor = doctors.find((d) => d.id === selectedDoctorId);
  const { workingDays, getTimeSlotsForDay, isLoading: isScheduleLoading } = useDoctorSchedule(selectedDoctorId);
  const { bookedSlots, isLoading: isSlotsLoading } = useBookedSlots(selectedDoctorId, selectedDate);

  // Auto-deselect if the currently selected time became booked
  useEffect(() => {
    if (selectedTime && bookedSlots.has(selectedTime)) {
      onTimeChange('');
    }
  }, [bookedSlots, selectedTime, onTimeChange]);

  const disabledDays = useMemo(() => {
    return (date: Date) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (date < today) return true;
      if (date > addDays(today, 30)) return true;
      if (workingDays.length > 0) {
        const dayOfWeek = getDay(date);
        if (!workingDays.includes(dayOfWeek)) return true;
      }
      return false;
    };
  }, [workingDays]);

  const freeSlots = useMemo(() => {
    if (!selectedDate) return [];
    const dayOfWeek = getDay(selectedDate);
    return getTimeSlotsForDay(dayOfWeek);
  }, [selectedDate, getTimeSlotsForDay]);

  return (
    <div className="space-y-6">
      {doctor && (
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">Запись к врачу:</p>
          <p className="font-medium">{doctor.name} — {doctor.specialty}</p>
        </div>
      )}

      {isScheduleLoading ? (
        <div className="flex items-center justify-center gap-2 py-8 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          Загрузка расписания...
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Выберите дату</Label>
            {workingDays.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">
                Расписание для этого врача ещё не задано. Уточните по телефону.
              </p>
            ) : (
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={onDateChange}
                disabled={disabledDays}
                locale={ru}
                className="rounded-md border p-3 pointer-events-auto"
              />
            )}
          </div>

          {selectedDate && (
            <div className="space-y-2">
              <Label>
                Доступное время на {format(selectedDate, 'd MMMM', { locale: ru })}
              </Label>
              {isSlotsLoading ? (
                <div className="flex items-center justify-center gap-2 py-4 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Проверка доступности...
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {freeSlots.length > 0 ? (
                    freeSlots.map((time) => {
                      const isBooked = bookedSlots.has(time);
                      return (
                        <Button
                          key={time}
                          variant={selectedTime === time ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => !isBooked && onTimeChange(time)}
                          disabled={isBooked}
                          className={cn(
                            'text-sm relative',
                            selectedTime === time && 'ring-2 ring-primary/20',
                            isBooked && 'opacity-50 line-through cursor-not-allowed'
                          )}
                          title={isBooked ? 'Это время уже занято' : undefined}
                        >
                          {time}
                          {isBooked && (
                            <span className="absolute -top-2 -right-2 text-[10px] bg-destructive text-destructive-foreground rounded px-1">
                              Занято
                            </span>
                          )}
                        </Button>
                      );
                    })
                  ) : (
                    <p className="col-span-3 text-sm text-muted-foreground text-center py-4">
                      Нет свободных слотов на выбранную дату
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
