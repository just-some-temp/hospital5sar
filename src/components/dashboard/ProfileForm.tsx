import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const profileSchema = z.object({
  full_name: z.string().min(2, 'ФИО должно содержать минимум 2 символа').max(100),
  phone: z
    .string()
    .regex(/^\+?[0-9]{10,15}$/, 'Введите корректный номер телефона')
    .optional()
    .or(z.literal('')),
  birth_date: z.string().optional(),
  oms_policy: z
    .string()
    .regex(/^[0-9]{16}$/, 'Полис ОМС должен содержать 16 цифр')
    .optional()
    .or(z.literal('')),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function ProfileForm() {
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: '',
      phone: '',
      birth_date: '',
      oms_policy: '',
    },
  });

  useEffect(() => {
    if (profile) {
      reset({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        birth_date: profile.birth_date || '',
        oms_policy: profile.oms_policy || '',
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;

    setIsLoading(true);

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: data.full_name,
        phone: data.phone || null,
        birth_date: data.birth_date || null,
        oms_policy: data.oms_policy || null,
      })
      .eq('id', user.id);

    if (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить изменения',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Сохранено',
        description: 'Профиль успешно обновлён',
      });
      await refreshProfile();
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={user?.email || ''}
          disabled
          className="bg-muted"
        />
        <p className="text-xs text-muted-foreground">Email нельзя изменить</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="full_name">ФИО *</Label>
        <Input
          id="full_name"
          placeholder="Иванов Иван Иванович"
          {...register('full_name')}
          disabled={isLoading}
        />
        {errors.full_name && (
          <p className="text-sm text-destructive">{errors.full_name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Телефон</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+79001234567"
          {...register('phone')}
          disabled={isLoading}
        />
        {errors.phone && (
          <p className="text-sm text-destructive">{errors.phone.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="birth_date">Дата рождения</Label>
        <Input
          id="birth_date"
          type="date"
          {...register('birth_date')}
          disabled={isLoading}
        />
        {errors.birth_date && (
          <p className="text-sm text-destructive">{errors.birth_date.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="oms_policy">Номер полиса ОМС</Label>
        <Input
          id="oms_policy"
          placeholder="1234567890123456"
          {...register('oms_policy')}
          disabled={isLoading}
        />
        {errors.oms_policy && (
          <p className="text-sm text-destructive">{errors.oms_policy.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isLoading || !isDirty}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Сохранение...
          </>
        ) : (
          'Сохранить изменения'
        )}
      </Button>
    </form>
  );
}
