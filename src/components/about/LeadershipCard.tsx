import { Card, CardContent } from '@/components/ui/card';
import { User } from 'lucide-react';

interface LeadershipCardProps {
  name: string;
  position: string;
  description: string;
  imageUrl?: string;
}

export function LeadershipCard({ name, position, description, imageUrl }: LeadershipCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left gap-4">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-secondary">
            {imageUrl ? (
              <img src={imageUrl} alt={name} className="h-full w-full rounded-full object-cover" />
            ) : (
              <User className="h-12 w-12 text-muted-foreground" />
            )}
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">{name}</h3>
            <p className="text-sm font-medium text-primary">{position}</p>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
