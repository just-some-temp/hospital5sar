import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const homeVisitSchema = z.object({
  patientName: z.string().min(5, 'Введите ФИО полностью').max(100, 'Слишком длинное имя'),
  phone: z
    .string()
    .min(1, 'Введите телефон')
    .regex(/^\+7\s?\(?\d{3}\)?\s?\d{3}[-\s]?\d{2}[-\s]?\d{2}$/, 'Формат: +7 (XXX) XXX-XX-XX'),
  address: z.string().min(10, 'Укажите полный адрес').max(200, 'Слишком длинный адрес'),
  apartment: z.string().max(10, 'Слишком длинный номер квартиры').optional(),
  intercom: z.string().max(20, 'Слишком длинный код').optional(),
  symptoms: z.string().min(10, 'Опишите симптомы подробнее').max(500, 'Слишком длинное описание'),
  preferredTime: z.string().min(1, 'Выберите время'),
  birthDate: z.string().min(1, 'Введите дату рождения'),
});

export type HomeVisitFormData = z.infer<typeof homeVisitSchema>;

interface HomeVisitFormProps {
  onSubmit: (data: HomeVisitFormData) => void;
  isSubmitting?: boolean;
}

const timeSlots = [
  { value: 'morning', label: 'Утро (9:00 - 12:00)' },
  { value: 'afternoon', label: 'День (12:00 - 15:00)' },
  { value: 'evening', label: 'Вечер (15:00 - 18:00)' },
];

export function HomeVisitForm({ onSubmit, isSubmitting }: HomeVisitFormProps) {
  const form = useForm<HomeVisitFormData>({
    resolver: zodResolver(homeVisitSchema),
    defaultValues: {
      patientName: '',
      phone: '',
      address: '',
      apartment: '',
      intercom: '',
      symptoms: '',
      preferredTime: '',
      birthDate: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="patientName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ФИО пациента *</FormLabel>
              <FormControl>
                <Input placeholder="Иванов Иван Иванович" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="birthDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Дата рождения *</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Телефон для связи *</FormLabel>
                <FormControl>
                  <Input placeholder="+7 (XXX) XXX-XX-XX" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Адрес вызова *</FormLabel>
              <FormControl>
                <Input placeholder="4 Рабочий проезд, д. 3" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="apartment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Квартира</FormLabel>
                <FormControl>
                  <Input placeholder="12" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="intercom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Код домофона</FormLabel>
                <FormControl>
                  <Input placeholder="1234" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="symptoms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Симптомы / Причина вызова *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Опишите симптомы: температура, боль, другие жалобы..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="preferredTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Предпочтительное время *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите время" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot.value} value={slot.value}>
                      {slot.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Отправка заявки...' : 'Отправить заявку'}
        </Button>
      </form>
    </Form>
  );
}
