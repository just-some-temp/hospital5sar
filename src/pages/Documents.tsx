import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { DocumentCard } from '@/components/documents/DocumentCard';
import { documents, documentCategories } from '@/data/documents';
import { Button } from '@/components/ui/button';
import { FileCheck, Building, Scale, BarChart, Shield } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  FileCheck: <FileCheck className="h-5 w-5" />,
  Building: <Building className="h-5 w-5" />,
  Scale: <Scale className="h-5 w-5" />,
  BarChart: <BarChart className="h-5 w-5" />,
  Shield: <Shield className="h-5 w-5" />,
};

export default function Documents() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredDocuments = selectedCategory === 'all'
    ? documents
    : documents.filter(doc => doc.category === selectedCategory);

  return (
    <Layout>
      {/* Hero section */}
      <section className="bg-primary py-12 text-primary-foreground">
        <div className="container">
          <h1 className="text-3xl font-bold md:text-4xl">Документы</h1>
          <p className="mt-2 text-lg text-primary-foreground/80">
            Официальные документы и нормативные акты учреждения
          </p>
        </div>
      </section>

      <section className="py-8">
        <div className="container">
          {/* Category filter */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Категории документов</h2>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('all')}
              >
                Все документы
              </Button>
              {documentCategories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.id)}
                  className="flex items-center gap-2"
                >
                  {iconMap[cat.icon]}
                  {cat.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Documents list */}
          <div className="space-y-4">
            {filteredDocuments.length > 0 ? (
              filteredDocuments.map((doc) => (
                <DocumentCard key={doc.id} document={doc} />
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>Документы в данной категории отсутствуют</p>
              </div>
            )}
          </div>

          {/* Info block */}
          <div className="mt-12 rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Информация о документах</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <h4 className="font-medium mb-2">Получение копий документов</h4>
                <p className="text-sm text-muted-foreground">
                  Для получения заверенных копий документов обратитесь в канцелярию учреждения 
                  с письменным заявлением. Срок исполнения — до 10 рабочих дней.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Контакты канцелярии</h4>
                <p className="text-sm text-muted-foreground">
                  Телефон: +7 (8452) 996-900<br />
                  Email: docs@sgkb5.ru<br />
                  Приём: Пн-Пт 9:00-17:00
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
