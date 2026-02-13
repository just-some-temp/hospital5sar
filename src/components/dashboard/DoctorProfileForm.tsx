import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Eye, EyeOff, Camera, Trash2, User } from 'lucide-react';
import { departments } from '@/data/doctors';

const doctorProfileSchema = z.object({
  specialty: z.string().min(2, 'Укажите специальность'),
  department: z.string().min(2, 'Выберите отделение'),
  experience: z.coerce.number().min(0, 'Стаж не может быть отрицательным').max(70, 'Некорректный стаж'),
  category: z.string().min(1, 'Выберите категорию'),
  education: z.string().min(5, 'Укажите образование'),
  description: z.string().min(10, 'Добавьте описание (минимум 10 символов)'),
});

type DoctorProfileFormData = z.infer<typeof doctorProfileSchema>;

const CATEGORIES = ['высшая', 'первая', 'вторая', 'без категории'];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function DoctorProfileForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isPublished, setIsPublished] = useState(false);
  const [profileExists, setProfileExists] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter out "Все отделения" from the list
  const availableDepartments = departments.filter((d) => d !== 'Все отделения');

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<DoctorProfileFormData>({
    resolver: zodResolver(doctorProfileSchema),
    defaultValues: {
      specialty: '',
      department: '',
      experience: 0,
      category: 'без категории',
      education: '',
      description: '',
    },
  });

  useEffect(() => {
    if (user) fetchDoctorProfile();
  }, [user]);

  const fetchDoctorProfile = async () => {
    if (!user) return;
    setIsFetching(true);

    const { data, error } = await supabase
      .from('doctor_profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching doctor profile:', error);
    } else if (data) {
      setProfileExists(true);
      setIsPublished(data.is_published);
      setPhotoUrl((data as any).photo_url || '');
      reset({
        specialty: data.specialty || '',
        department: data.department || '',
        experience: data.experience || 0,
        category: data.category || 'без категории',
        education: data.education || '',
        description: data.description || '',
      });
    }

    setIsFetching(false);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast({
        title: 'Неверный формат',
        description: 'Поддерживаются только JPEG, PNG и WebP',
        variant: 'destructive',
      });
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: 'Файл слишком большой',
        description: 'Максимальный размер фото — 2 МБ',
        variant: 'destructive',
      });
      return;
    }

    setIsUploadingPhoto(true);

    const ext = file.name.split('.').pop() || 'jpg';
    const filePath = `${user.id}/avatar.${ext}`;

    // Remove old avatar files first (different extensions)
    const { data: existingFiles } = await supabase.storage
      .from('doctor-avatars')
      .list(user.id);

    if (existingFiles && existingFiles.length > 0) {
      const filesToRemove = existingFiles.map((f) => `${user.id}/${f.name}`);
      await supabase.storage.from('doctor-avatars').remove(filesToRemove);
    }

    const { error: uploadError } = await supabase.storage
      .from('doctor-avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      toast({
        title: 'Ошибка загрузки',
        description: 'Не удалось загрузить фото',
        variant: 'destructive',
      });
      setIsUploadingPhoto(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from('doctor-avatars')
      .getPublicUrl(filePath);

    const newPhotoUrl = publicUrlData.publicUrl;

    // Save to doctor_profiles
    if (profileExists) {
      const { error: updateError } = await supabase
        .from('doctor_profiles')
        .update({ photo_url: newPhotoUrl } as any)
        .eq('user_id', user.id);

      if (updateError) {
        console.error('Error saving photo URL:', updateError);
        toast({
          title: 'Ошибка',
          description: 'Фото загружено, но не удалось сохранить ссылку',
          variant: 'destructive',
        });
      }
    }

    setPhotoUrl(newPhotoUrl);
    setIsUploadingPhoto(false);
    toast({ title: 'Фото загружено', description: 'Ваше фото успешно обновлено' });

    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handlePhotoRemove = async () => {
    if (!user) return;
    setIsUploadingPhoto(true);

    const { data: existingFiles } = await supabase.storage
      .from('doctor-avatars')
      .list(user.id);

    if (existingFiles && existingFiles.length > 0) {
      const filesToRemove = existingFiles.map((f) => `${user.id}/${f.name}`);
      await supabase.storage.from('doctor-avatars').remove(filesToRemove);
    }

    if (profileExists) {
      await supabase
        .from('doctor_profiles')
        .update({ photo_url: '' } as any)
        .eq('user_id', user.id);
    }

    setPhotoUrl('');
    setIsUploadingPhoto(false);
    toast({ title: 'Фото удалено' });
  };

  const onSubmit = async (formData: DoctorProfileFormData) => {
    if (!user) return;
    setIsLoading(true);

    const payload = {
      user_id: user.id,
      specialty: formData.specialty,
      department: formData.department,
      experience: formData.experience,
      category: formData.category,
      education: formData.education,
      description: formData.description,
      is_published: isPublished,
    };

    let error;

    if (profileExists) {
      const result = await supabase
        .from('doctor_profiles')
        .update(payload)
        .eq('user_id', user.id);
      error = result.error;
    } else {
      const result = await supabase
        .from('doctor_profiles')
        .insert(payload);
      error = result.error;
      if (!error) setProfileExists(true);
    }

    if (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить профиль врача',
        variant: 'destructive',
      });
      console.error('Error saving doctor profile:', error);
    } else {
      toast({
        title: 'Сохранено',
        description: isPublished
          ? 'Профиль сохранён и опубликован'
          : 'Профиль сохранён (не опубликован)',
      });
    }

    setIsLoading(false);
  };

  const handlePublishToggle = async (checked: boolean) => {
    setIsPublished(checked);

    // If profile exists, save publish state immediately
    if (profileExists && user) {
      const { error } = await supabase
        .from('doctor_profiles')
        .update({ is_published: checked })
        .eq('user_id', user.id);

      if (error) {
        console.error('Error toggling publish:', error);
        setIsPublished(!checked);
      } else {
        toast({
          title: checked ? 'Профиль опубликован' : 'Профиль скрыт',
          description: checked
            ? 'Ваш профиль теперь виден на странице врачей'
            : 'Ваш профиль скрыт со страницы врачей',
        });
      }
    }
  };

  if (isFetching) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
      {/* Photo upload */}
      <div className="flex items-center gap-4 rounded-lg border p-4">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-muted">
          {isUploadingPhoto ? (
            <div className="flex h-full w-full items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : photoUrl ? (
            <img src={photoUrl} alt="Фото врача" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <User className="h-10 w-10 text-muted-foreground/50" />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label className="text-base">Фото профиля</Label>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingPhoto}
            >
              <Camera className="mr-1 h-4 w-4" />
              {photoUrl ? 'Заменить' : 'Загрузить'}
            </Button>
            {photoUrl && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handlePhotoRemove}
                disabled={isUploadingPhoto}
              >
                <Trash2 className="mr-1 h-4 w-4" />
                Удалить
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">JPEG, PNG или WebP, до 2 МБ</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handlePhotoUpload}
          className="hidden"
        />
      </div>

      {/* Publish toggle */}
      <div className="flex items-center justify-between rounded-lg border p-4">
        <div className="space-y-0.5">
          <Label className="text-base">Публикация профиля</Label>
          <p className="text-sm text-muted-foreground">
            {isPublished
              ? 'Ваш профиль виден на странице врачей'
              : 'Профиль скрыт — заполните данные и опубликуйте'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isPublished ? (
            <Eye className="h-4 w-4 text-primary" />
          ) : (
            <EyeOff className="h-4 w-4 text-muted-foreground" />
          )}
          <Switch checked={isPublished} onCheckedChange={handlePublishToggle} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="specialty">Специальность *</Label>
        <Input
          id="specialty"
          placeholder="Например: Кардиолог"
          {...register('specialty')}
          disabled={isLoading}
        />
        {errors.specialty && (
          <p className="text-sm text-destructive">{errors.specialty.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="department">Отделение *</Label>
        <Select
          value={watch('department')}
          onValueChange={(val) => setValue('department', val, { shouldDirty: true })}
          disabled={isLoading}
        >
          <SelectTrigger id="department">
            <SelectValue placeholder="Выберите отделение" />
          </SelectTrigger>
          <SelectContent>
            {availableDepartments.map((dept) => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.department && (
          <p className="text-sm text-destructive">{errors.department.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="experience">Стаж (лет) *</Label>
        <Input
          id="experience"
          type="number"
          min={0}
          max={70}
          {...register('experience')}
          disabled={isLoading}
        />
        {errors.experience && (
          <p className="text-sm text-destructive">{errors.experience.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Категория *</Label>
        <Select
          value={watch('category')}
          onValueChange={(val) => setValue('category', val, { shouldDirty: true })}
          disabled={isLoading}
        >
          <SelectTrigger id="category">
            <SelectValue placeholder="Выберите категорию" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && (
          <p className="text-sm text-destructive">{errors.category.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="education">Образование *</Label>
        <Textarea
          id="education"
          placeholder="Укажите учебное заведение и год окончания"
          rows={3}
          {...register('education')}
          disabled={isLoading}
        />
        {errors.education && (
          <p className="text-sm text-destructive">{errors.education.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">О себе *</Label>
        <Textarea
          id="description"
          placeholder="Расскажите о своей специализации и опыте работы"
          rows={4}
          {...register('description')}
          disabled={isLoading}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isLoading || (!isDirty && profileExists)}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Сохранение...
          </>
        ) : profileExists ? (
          'Сохранить изменения'
        ) : (
          'Создать профиль врача'
        )}
      </Button>
    </form>
  );
}
