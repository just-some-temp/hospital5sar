import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StepIndicator } from '@/components/appointment/StepIndicator';
import { DoctorSelect } from '@/components/appointment/DoctorSelect';
import { DateTimeSelect } from '@/components/appointment/DateTimeSelect';
import { PatientForm, type PatientFormData } from '@/components/appointment/PatientForm';
import { ConfirmationStep } from '@/components/appointment/ConfirmationStep';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, ArrowLeft, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { doctors } from '@/data/doctors';
import { format } from 'date-fns';

const steps = [
  { id: 1, title: 'Врач' },
  { id: 2, title: 'Дата и время' },
  { id: 3, title: 'Данные' },
  { id: 4, title: 'Подтверждение' },
];

const Appointment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { user, profile } = useAuth();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState('');
  const [patientData, setPatientData] = useState<PatientFormData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Handle doctorId from URL
  useEffect(() => {
    const doctorId = searchParams.get('doctorId');
    if (doctorId) {
      const doctor = doctors.find((d) => d.id === doctorId);
      if (doctor) {
        setSelectedSpecialty(doctor.specialty);
        setSelectedDoctorId(doctor.id);
      }
    }
  }, [searchParams]);

  // Auto-fill patient data from profile
  useEffect(() => {
    if (profile && !patientData) {
      const nameParts = profile.full_name?.split(' ') || [];
      setPatientData({
        lastName: nameParts[0] || '',
        firstName: nameParts[1] || '',
        middleName: nameParts[2] || '',
        phone: profile.phone || '',
        policyNumber: profile.oms_policy || '',
        birthDate: profile.birth_date || '',
        complaints: '',
      });
    }
  }, [profile, patientData]);

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handlePatientSubmit = (data: PatientFormData) => {
    setPatientData(data);
    handleNext();
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    
    try {
      // If user is logged in, save to database
      if (user && selectedDate) {
        const dateStr = format(selectedDate, 'yyyy-MM-dd');

        // Race condition check: verify the slot is still free before inserting
        const { data: bookedSlots, error: checkError } = await supabase.rpc('get_booked_slots', {
          p_doctor_id: selectedDoctorId,
          p_date: dateStr,
        });

        if (checkError) {
          console.error('Error checking slot availability:', checkError);
        }

        if (bookedSlots && bookedSlots.includes(selectedTime)) {
          toast({
            title: 'Время уже занято',
            description: 'К сожалению, это время было забронировано другим пациентом. Пожалуйста, выберите другое время.',
            variant: 'destructive',
          });
          setIsSubmitting(false);
          return;
        }

        const { error } = await supabase.from('appointments').insert({
          patient_id: user.id,
          doctor_id: selectedDoctorId,
          appointment_date: dateStr,
          appointment_time: selectedTime,
          status: 'pending',
        });

        if (error) {
          console.error('Error saving appointment:', error);
          toast({
            title: 'Ошибка',
            description: 'Не удалось сохранить запись. Попробуйте ещё раз.',
            variant: 'destructive',
          });
          setIsSubmitting(false);
          return;
        }
      }
      
      // Simulate API call for SMS/email notification
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setIsComplete(true);
      
      toast({
        title: 'Запись подтверждена!',
        description: user 
          ? 'Информация сохранена в вашем личном кабинете.'
          : 'Информация о записи отправлена на ваш телефон.',
      });
    } catch (error) {
      console.error('Error confirming appointment:', error);
      toast({
        title: 'Ошибка',
        description: 'Произошла ошибка. Попробуйте ещё раз.',
        variant: 'destructive',
      });
    }
    
    setIsSubmitting(false);
  };

  const canProceedStep1 = selectedSpecialty && selectedDoctorId;
  const canProceedStep2 = selectedDate && selectedTime;

  if (isComplete) {
    return (
      <Layout>
        <div className="container py-12">
          <Card className="max-w-lg mx-auto text-center">
            <CardContent className="py-12">
              <div className="w-16 h-16 rounded-full bg-accent/20 text-accent flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Вы успешно записаны!</h2>
              <p className="text-muted-foreground mb-6">
                {user 
                  ? 'Запись сохранена в вашем личном кабинете. Приходите за 10-15 минут до назначенного времени.'
                  : `Информация о записи отправлена на номер ${patientData?.phone}. Пожалуйста, приходите за 10-15 минут до назначенного времени.`
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {user ? (
                  <Button asChild>
                    <Link to="/dashboard">Перейти в личный кабинет</Link>
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" onClick={() => navigate('/')}>
                      На главную
                    </Button>
                    <Button asChild>
                      <Link to="/register">
                        <LogIn className="w-4 h-4 mr-2" />
                        Создать аккаунт
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-muted py-6">
        <div className="container">
          <Breadcrumbs />
        </div>
      </div>
      
      <div className="container py-8 md:py-12">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад
        </Button>

        {/* Login suggestion for guests */}
        {!user && (
          <Card className="max-w-3xl mx-auto mb-6 border-primary/20 bg-primary/5">
            <CardContent className="py-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground">
                  <strong>Совет:</strong> Войдите в аккаунт для сохранения записи в личном кабинете
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/login">Войти</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Запись на приём</CardTitle>
          </CardHeader>
          <CardContent>
            <StepIndicator steps={steps} currentStep={currentStep} />

            {currentStep === 1 && (
              <div className="space-y-6">
                <DoctorSelect
                  selectedSpecialty={selectedSpecialty}
                  selectedDoctorId={selectedDoctorId}
                  onSpecialtyChange={(specialty) => {
                    setSelectedSpecialty(specialty);
                    setSelectedDoctorId('');
                  }}
                  onDoctorChange={setSelectedDoctorId}
                />
                <div className="flex justify-end">
                  <Button onClick={handleNext} disabled={!canProceedStep1}>
                    Далее
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <DateTimeSelect
                  selectedDoctorId={selectedDoctorId}
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  onDateChange={setSelectedDate}
                  onTimeChange={setSelectedTime}
                />
                <div className="flex justify-between">
                  <Button variant="outline" onClick={handleBack}>
                    Назад
                  </Button>
                  <Button onClick={handleNext} disabled={!canProceedStep2}>
                    Далее
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <PatientForm
                  onSubmit={handlePatientSubmit}
                  defaultValues={patientData || undefined}
                />
                <Button variant="outline" onClick={handleBack}>
                  Назад
                </Button>
              </div>
            )}

            {currentStep === 4 && patientData && selectedDate && (
              <ConfirmationStep
                doctorId={selectedDoctorId}
                date={selectedDate}
                time={selectedTime}
                patientData={patientData}
                onConfirm={handleConfirm}
                onBack={handleBack}
                isSubmitting={isSubmitting}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Appointment;
