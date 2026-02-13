import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { type Service } from '@/data/services';

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Card className="h-full transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg">{service.name}</CardTitle>
          <Badge variant={service.category === 'oms' ? 'default' : 'secondary'}>
            {service.category === 'oms' ? 'ОМС' : 'Платно'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-3">{service.description}</p>
        <p className="text-xs text-muted-foreground">
          <span className="font-medium">Отделение:</span> {service.department}
        </p>
      </CardContent>
    </Card>
  );
}
