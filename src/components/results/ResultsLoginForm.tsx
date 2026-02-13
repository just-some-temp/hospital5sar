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
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const resultsLoginSchema = z.object({
  directionNumber: z
    .string()
    .min(1, 'Введите номер направления')
    .regex(/^\d{8,12}$/, 'Номер направления должен содержать 8-12 цифр'),
  birthDate: z.string().min(1, 'Введите дату рождения'),
});

export type ResultsLoginFormData = z.infer<typeof resultsLoginSchema>;

interface ResultsLoginFormProps {
  onSubmit: (data: ResultsLoginFormData) => void;
  isSubmitting?: boolean;
}

export function ResultsLoginForm({ onSubmit, isSubmitting }: ResultsLoginFormProps) {
  const form = useForm<ResultsLoginFormData>({
    resolver: zodResolver(resultsLoginSchema),
    defaultValues: {
      directionNumber: '',
      birthDate: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="directionNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Номер направления</FormLabel>
              <FormControl>
                <Input placeholder="12345678" maxLength={12} {...field} />
              </FormControl>
              <FormDescription>
                Указан в бланке направления на анализы
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="birthDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Дата рождения</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormDescription>
                Для подтверждения личности
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Проверка...' : 'Получить результаты'}
        </Button>
      </form>
    </Form>
  );
}
