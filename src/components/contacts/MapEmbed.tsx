interface MapEmbedProps {
  address?: string;
  className?: string;
}

export function MapEmbed({ className = '' }: MapEmbedProps) {
  // Yandex Maps embed for Saratov, 4 Rabochiy proezd, building 3
  const mapUrl = 'https://yandex.ru/map-widget/v1/?ll=45.984759%2C51.540475&z=16&l=map&pt=45.984759%2C51.540475%2Cpm2rdm';

  return (
    <div className={`relative overflow-hidden rounded-lg border bg-muted ${className}`}>
      <iframe
        src={mapUrl}
        width="100%"
        height="100%"
        style={{ border: 0, minHeight: '400px' }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Карта расположения ГУЗ СГКБ №5"
      />
      {/* Fallback for when iframe doesn't load */}
      <noscript>
        <div className="flex h-full min-h-[400px] items-center justify-center p-8 text-center">
          <p className="text-muted-foreground">
            г. Саратов, 4 Рабочий проезд, здание 3
          </p>
        </div>
      </noscript>
    </div>
  );
}
