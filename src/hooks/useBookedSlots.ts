import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

export function useBookedSlots(doctorId: string, selectedDate: Date | undefined) {
  const dateStr = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null;

  const { data: bookedSlots = new Set<string>(), isLoading } = useQuery({
    queryKey: ['booked-slots', doctorId, dateStr],
    queryFn: async () => {
      if (!doctorId || !dateStr) return new Set<string>();

      const { data, error } = await supabase.rpc('get_booked_slots', {
        p_doctor_id: doctorId,
        p_date: dateStr,
      });

      if (error) {
        console.error('Error fetching booked slots:', error);
        return new Set<string>();
      }

      return new Set<string>(data || []);
    },
    enabled: !!doctorId && !!dateStr,
    // Refetch frequently to catch slots booked by others
    refetchInterval: 30000,
  });

  return { bookedSlots, isLoading };
}
