import { useMemo } from 'react';
import { doctors as staticDoctors, departments } from '@/data/doctors';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { User, Stethoscope, Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDoctorProfiles } from '@/hooks/useDoctorProfiles';

interface DoctorSelectProps {
  selectedSpecialty: string;
  selectedDoctorId: string;
  onSpecialtyChange: (specialty: string) => void;
  onDoctorChange: (doctorId: string) => void;
}

export function DoctorSelect({
  selectedSpecialty,
  selectedDoctorId,
  onSpecialtyChange,
  onDoctorChange,
}: DoctorSelectProps) {
  const { dbDoctors } = useDoctorProfiles();

  const allDoctors = useMemo(() => [...staticDoctors, ...dbDoctors], [dbDoctors]);

  const specialties = useMemo(
    () => [...new Set(allDoctors.map((d) => d.specialty))],
    [allDoctors]
  );

  const filteredDoctors = selectedSpecialty
    ? allDoctors.filter((d) => d.specialty === selectedSpecialty)
    : allDoctors;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="specialty">Специальность врача</Label>
        <Select value={selectedSpecialty} onValueChange={onSpecialtyChange}>
          <SelectTrigger id="specialty">
            <SelectValue placeholder="Выберите специальность" />
          </SelectTrigger>
          <SelectContent>
            {specialties.map((specialty) => (
              <SelectItem key={specialty} value={specialty}>
                {specialty}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedSpecialty && (
        <div className="space-y-3">
          <Label>Выберите врача</Label>
          <div className="grid gap-3 sm:grid-cols-2">
            {filteredDoctors.map((doctor) => (
              <Card
                key={doctor.id}
                className={cn(
                  'cursor-pointer transition-all hover:border-primary',
                  selectedDoctorId === doctor.id && 'border-primary ring-2 ring-primary/20'
                )}
                onClick={() => onDoctorChange(doctor.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <User className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-medium text-sm truncate">{doctor.name}</h4>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <Stethoscope className="w-3 h-3" />
                        <span>{doctor.specialty}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                        <Award className="w-3 h-3" />
                        <span>Стаж {doctor.experience} лет • {doctor.category} категория</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
