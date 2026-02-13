import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Doctor } from '@/data/doctors';

export interface DbDoctorProfile {
  id: string;
  user_id: string;
  specialty: string;
  department: string;
  experience: number;
  category: string;
  education: string;
  description: string;
  is_published: boolean;
  full_name: string | null;
}

export function useDoctorProfiles() {
  const [dbDoctors, setDbDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPublishedDoctors();
  }, []);

  const fetchPublishedDoctors = async () => {
    setIsLoading(true);

    const { data: doctorProfiles, error } = await supabase
      .from('doctor_profiles')
      .select('*')
      .eq('is_published', true);

    if (error) {
      console.error('Error fetching doctor profiles:', error);
      setIsLoading(false);
      return;
    }

    if (!doctorProfiles || doctorProfiles.length === 0) {
      setDbDoctors([]);
      setIsLoading(false);
      return;
    }

    const mapped: Doctor[] = doctorProfiles.map((dp) => ({
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
    }));

    setDbDoctors(mapped);
    setIsLoading(false);
  };

  return { dbDoctors, isLoading, refetch: fetchPublishedDoctors };
}
