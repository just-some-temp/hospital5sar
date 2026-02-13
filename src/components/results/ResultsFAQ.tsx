import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqItems = [
  {
    question: 'Как узнать номер направления?',
    answer:
      'Номер направления указан в верхнем правом углу бланка направления на анализы, который вам выдал врач. Обычно это 8-12 цифр.',
  },
  {
    question: 'Когда будут готовы результаты?',
    answer:
      'Сроки готовности зависят от вида исследования. Общий анализ крови и мочи — 1 рабочий день. Биохимический анализ — 2-3 рабочих дня. Специфические исследования — до 7 рабочих дней.',
  },
  {
    question: 'Можно ли получить результаты на бумаге?',
    answer:
      'Да, вы можете получить бумажную версию результатов в регистратуре лаборатории. При себе необходимо иметь паспорт и направление.',
  },
  {
    question: 'Результаты не найдены. Что делать?',
    answer:
      'Убедитесь, что вы правильно ввели номер направления и дату рождения. Если результаты всё ещё не отображаются, возможно, анализы ещё не готовы. Также вы можете позвонить в лабораторию по телефону +7 (8412) 99-91-15.',
  },
  {
    question: 'Нужно ли расшифровывать результаты?',
    answer:
      'Интерпретацию результатов анализов должен проводить лечащий врач. Самостоятельная расшифровка может привести к неправильным выводам. Обратитесь к специалисту для консультации.',
  },
];

export function ResultsFAQ() {
  return (
    <Accordion type="single" collapsible className="w-full">
      {faqItems.map((item, index) => (
        <AccordionItem key={index} value={`item-${index}`}>
          <AccordionTrigger className="text-left">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
