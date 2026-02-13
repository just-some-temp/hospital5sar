import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { type PriceItem } from '@/data/services';

interface PriceTableProps {
  items: PriceItem[];
}

export function PriceTable({ items }: PriceTableProps) {
  // Group items by category
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, PriceItem[]>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedItems).map(([category, categoryItems]) => (
        <div key={category} className="rounded-lg border overflow-hidden">
          <div className="bg-secondary px-4 py-3">
            <h3 className="font-semibold text-foreground">{category}</h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-full">Услуга</TableHead>
                <TableHead className="text-right whitespace-nowrap">Цена, ₽</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categoryItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell className="text-right font-medium">
                    {item.price.toLocaleString('ru-RU')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ))}
    </div>
  );
}
