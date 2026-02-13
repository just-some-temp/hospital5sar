import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ScheduleEntry {
  id: string;
  doctor_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
}

const DAY_NAMES = [
  'Воскресенье',
  'Понедельник',
  'Вторник',
  'Среда',
  'Четверг',
  'Пятница',
  'Суббота',
];

export function getDayName(dayOfWeek: number): string {
  return DAY_NAMES[dayOfWeek] || '';
}

export function useDoctorSchedule(doctorId: string | undefined) {
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!doctorId) {
      setSchedule([]);
      return;
    }
    fetchSchedule(doctorId);
  }, [doctorId]);

  const fetchSchedule = async (id: string) => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('doctor_schedules')
      .select('*')
      .eq('doctor_id', id)
      .order('day_of_week', { ascending: true });

    if (error) {
      console.error('Error fetching schedule:', error);
    } else {
      setSchedule((data as ScheduleEntry[]) || []);
    }
    setIsLoading(false);
  };

  const refetch = () => {
    if (doctorId) fetchSchedule(doctorId);
  };

  // Convert schedule to the format used by Doctor type: { day: string; hours: string }[]
  const scheduleForDisplay = schedule.map((s) => ({
    day: getDayName(s.day_of_week),
    hours: `${s.start_time} - ${s.end_time}`,
  }));

  // Get working days as numbers (for calendar disabling)
  const workingDays = [...new Set(schedule.map((s) => s.day_of_week))];

  // Generate 30-min time slots for a given day of week
  const getTimeSlotsForDay = (dayOfWeek: number): string[] => {
    const dayEntries = schedule.filter((s) => s.day_of_week === dayOfWeek);
    if (dayEntries.length === 0) return [];

    const slots: string[] = [];
    for (const entry of dayEntries) {
      const [startH, startM] = entry.start_time.split(':').map(Number);
      const [endH, endM] = entry.end_time.split(':').map(Number);
      let currentMinutes = startH * 60 + startM;
      const endMinutes = endH * 60 + endM;

      while (currentMinutes < endMinutes) {
        const h = Math.floor(currentMinutes / 60);
        const m = currentMinutes % 60;
        slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
        currentMinutes += 30;
      }
    }

    return slots;
  };

  return {
    schedule,
    scheduleForDisplay,
    workingDays,
    getTimeSlotsForDay,
    isLoading,
    refetch,
  };
}
