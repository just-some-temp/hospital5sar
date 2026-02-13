import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { doctors } from '@/data/doctors';
import { Calendar, Clock, User, Phone, FileText, Stethoscope } from 'lucide-react';
import type { PatientFormData } from './PatientForm';

interface ConfirmationStepProps {
  doctorId: string;
  date: Date;
  time: string;
  patientData: PatientFormData;
  onConfirm: () => void;
  onBack: () => void;
  isSubmitting?: boolean;
}

export function ConfirmationStep({
  doctorId,
  date,
  time,
  patientData,
  onConfirm,
  onBack,
  isSubmitting,
}: ConfirmationStepProps) {
  const doctor = doctors.find((d) => d.id === doctorId);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Подтверждение записи</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground">Информация о приёме</h4>
              
              <div className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-primary" />
                <span className="text-sm">
                  <strong>Врач:</strong> {doctor?.name}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                <span className="text-sm">
                  <strong>Специальность:</strong> {doctor?.specialty}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="text-sm">
                  <strong>Дата:</strong> {format(date, 'd MMMM yyyy', { locale: ru })}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-sm">
                  <strong>Время:</strong> {time}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground">Данные пациента</h4>
              
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                <span className="text-sm">
                  <strong>ФИО:</strong> {patientData.lastName} {patientData.firstName} {patientData.middleName}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <span className="text-sm">
                  <strong>Телефон:</strong> {patientData.phone}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                <span className="text-sm">
                  <strong>Полис ОМС:</strong> {patientData.policyNumber}
                </span>
              </div>
            </div>
          </div>

          {patientData.complaints && (
            <div className="pt-4 border-t">
              <h4 className="font-medium text-sm text-muted-foreground mb-2">Жалобы</h4>
              <p className="text-sm">{patientData.complaints}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="bg-muted/50 rounded-lg p-4">
        <p className="text-sm text-muted-foreground">
          Нажимая кнопку «Подтвердить запись», вы соглашаетесь с условиями обработки персональных данных. 
          После подтверждения вам будет отправлено SMS-уведомление с деталями записи.
        </p>
      </div>

      <div className="flex flex-col-reverse sm:flex-row gap-3">
        <Button variant="outline" onClick={onBack} disabled={isSubmitting}>
          Назад
        </Button>
        <Button onClick={onConfirm} disabled={isSubmitting} className="flex-1 sm:flex-none">
          {isSubmitting ? 'Отправка...' : 'Подтвердить запись'}
        </Button>
      </div>
    </div>
  );
}
