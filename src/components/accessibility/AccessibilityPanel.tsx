import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { Eye, Type, Palette, AlignJustify, ImageOff } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AccessibilityPanel() {
  const {
    isHighContrast,
    toggleHighContrast,
    fontSize,
    setFontSize,
    colorScheme,
    setColorScheme,
    lineHeight,
    setLineHeight,
    imagesDisabled,
    toggleImages,
  } = useAccessibility();

  const fontSizeLabels = {
    normal: 'Обычный',
    large: 'Крупный',
    xlarge: 'Очень крупный',
  };

  const colorSchemes = [
    { id: 'normal', label: 'Обычная', className: 'bg-white text-black border' },
    { id: 'contrast-bw', label: 'Чёрно-белая', className: 'bg-black text-white' },
    { id: 'contrast-yb', label: 'Жёлто-чёрная', className: 'bg-black text-yellow-400' },
    { id: 'contrast-by', label: 'Чёрно-жёлтая', className: 'bg-yellow-400 text-black' },
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 text-primary-foreground hover:bg-primary-foreground/10"
          aria-label="Настройки доступности"
        >
          <Eye className="h-4 w-4" />
          <span className="hidden sm:inline">Версия для слабовидящих</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-6">
          <div className="space-y-2">
            <h4 className="font-medium leading-none flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Настройки доступности
            </h4>
            <p className="text-sm text-muted-foreground">
              Настройте отображение сайта под свои потребности
            </p>
          </div>

          {/* Font size */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              Размер шрифта
            </Label>
            <div className="flex gap-2">
              {(['normal', 'large', 'xlarge'] as const).map((size) => (
                <Button
                  key={size}
                  variant={fontSize === size ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFontSize(size)}
                  className="flex-1"
                >
                  {fontSizeLabels[size]}
                </Button>
              ))}
            </div>
          </div>

          {/* Color scheme */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Цветовая схема
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {colorSchemes.map((scheme) => (
                <Button
                  key={scheme.id}
                  variant="outline"
                  size="sm"
                  onClick={() => setColorScheme(scheme.id as any)}
                  className={cn(
                    'h-auto py-2 px-3',
                    colorScheme === scheme.id && 'ring-2 ring-primary'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <div className={cn('h-4 w-4 rounded', scheme.className)} />
                    <span className="text-xs">{scheme.label}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Line height */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <AlignJustify className="h-4 w-4" />
              Межстрочный интервал
            </Label>
            <div className="flex items-center gap-4">
              <Slider
                value={[lineHeight]}
                min={1}
                max={2}
                step={0.25}
                onValueChange={([value]) => setLineHeight(value)}
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground w-8">{lineHeight}</span>
            </div>
          </div>

          {/* Disable images */}
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <ImageOff className="h-4 w-4" />
              Отключить изображения
            </Label>
            <Button
              variant={imagesDisabled ? 'default' : 'outline'}
              size="sm"
              onClick={toggleImages}
            >
              {imagesDisabled ? 'Вкл' : 'Выкл'}
            </Button>
          </div>

          {/* Quick toggle */}
          <div className="border-t pt-4">
            <Button
              variant={isHighContrast ? 'default' : 'outline'}
              className="w-full"
              onClick={toggleHighContrast}
            >
              {isHighContrast ? 'Обычная версия сайта' : 'Высококонтрастный режим'}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
