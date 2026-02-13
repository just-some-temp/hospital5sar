import { useState, useMemo } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { faqItems, faqCategories } from '@/data/faq';
import { Search, HelpCircle, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredFAQ = useMemo(() => {
    return faqItems.filter((item) => {
      const matchesSearch =
        searchQuery === '' ||
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <Layout>
      {/* Header */}
      <div className="bg-muted py-8">
        <div className="container">
          <Breadcrumbs />
          <h1 className="mt-4 text-3xl font-bold text-foreground md:text-4xl">
            Вопросы и ответы
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Ответы на часто задаваемые вопросы о работе больницы
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container py-8">
        {/* Search and filters */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Поиск по вопросам..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {faqCategories.map((category) => (
              <Badge
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                className={cn(
                  'cursor-pointer transition-colors',
                  selectedCategory === category.id
                    ? ''
                    : 'hover:bg-secondary'
                )}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.label}
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* FAQ List */}
          <div className="lg:col-span-2">
            {filteredFAQ.length > 0 ? (
              <Accordion type="single" collapsible className="space-y-4">
                {filteredFAQ.map((item) => (
                  <AccordionItem
                    key={item.id}
                    value={item.id}
                    className="rounded-lg border bg-card px-4"
                  >
                    <AccordionTrigger className="text-left hover:no-underline">
                      <span className="pr-4 font-medium">{item.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <HelpCircle className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
                  <p className="text-lg font-medium">Вопросы не найдены</p>
                  <p className="text-muted-foreground">
                    Попробуйте изменить параметры поиска
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  Не нашли ответ?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Если вы не нашли ответ на свой вопрос, позвоните нам или
                  напишите на электронную почту.
                </p>
                <div className="space-y-2">
                  <a
                    href="tel:+78412999111"
                    className="block text-primary hover:underline"
                  >
                    +7 (8412) 99-91-11
                  </a>
                  <a
                    href="mailto:sgkb5@mail.ru"
                    className="block text-primary hover:underline"
                  >
                    sgkb5@mail.ru
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Режим работы</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>Поликлиника: Пн-Пт 8:00-20:00</p>
                <p>Суббота: 9:00-15:00</p>
                <p>Стационар: круглосуточно</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FAQ;
