export interface Service {
  id: string;
  name: string;
  description: string;
  category: 'oms' | 'paid';
  department: string;
}

export interface PriceItem {
  id: string;
  name: string;
  price: number;
  category: string;
}

export const services: Service[] = [
  // ОМС услуги
  {
    id: 'oms-1',
    name: 'Приём терапевта',
    description: 'Первичный и повторный приём врача-терапевта, осмотр, консультация, назначение лечения',
    category: 'oms',
    department: 'Терапевтическое отделение',
  },
  {
    id: 'oms-2',
    name: 'Приём кардиолога',
    description: 'Консультация кардиолога, ЭКГ, диагностика сердечно-сосудистых заболеваний',
    category: 'oms',
    department: 'Кардиологическое отделение',
  },
  {
    id: 'oms-3',
    name: 'Приём хирурга',
    description: 'Консультация хирурга, осмотр, диагностика хирургических патологий',
    category: 'oms',
    department: 'Хирургическое отделение',
  },
  {
    id: 'oms-4',
    name: 'Приём невролога',
    description: 'Диагностика и лечение заболеваний нервной системы',
    category: 'oms',
    department: 'Неврологическое отделение',
  },
  {
    id: 'oms-5',
    name: 'Лабораторные исследования',
    description: 'Общий анализ крови, биохимия, анализ мочи и другие базовые исследования',
    category: 'oms',
    department: 'Лаборатория',
  },
  {
    id: 'oms-6',
    name: 'УЗИ-диагностика',
    description: 'Ультразвуковое исследование органов брюшной полости, щитовидной железы',
    category: 'oms',
    department: 'Диагностическое отделение',
  },
  // Платные услуги
  {
    id: 'paid-1',
    name: 'Расширенный check-up',
    description: 'Комплексное обследование организма с расширенным перечнем анализов',
    category: 'paid',
    department: 'Диагностическое отделение',
  },
  {
    id: 'paid-2',
    name: 'МРТ-диагностика',
    description: 'Магнитно-резонансная томография различных органов и систем',
    category: 'paid',
    department: 'Диагностическое отделение',
  },
  {
    id: 'paid-3',
    name: 'КТ-диагностика',
    description: 'Компьютерная томография с контрастом и без',
    category: 'paid',
    department: 'Диагностическое отделение',
  },
  {
    id: 'paid-4',
    name: 'Косметологические процедуры',
    description: 'Дерматологические и косметологические услуги',
    category: 'paid',
    department: 'Дерматологическое отделение',
  },
];

export const priceList: PriceItem[] = [
  // Консультации
  { id: 'p-1', name: 'Первичная консультация терапевта', price: 1500, category: 'Консультации' },
  { id: 'p-2', name: 'Повторная консультация терапевта', price: 1200, category: 'Консультации' },
  { id: 'p-3', name: 'Консультация кардиолога', price: 2000, category: 'Консультации' },
  { id: 'p-4', name: 'Консультация хирурга', price: 1800, category: 'Консультации' },
  { id: 'p-5', name: 'Консультация невролога', price: 2000, category: 'Консультации' },
  { id: 'p-6', name: 'Консультация эндокринолога', price: 1900, category: 'Консультации' },
  
  // Диагностика
  { id: 'p-7', name: 'ЭКГ', price: 800, category: 'Диагностика' },
  { id: 'p-8', name: 'УЗИ брюшной полости', price: 2500, category: 'Диагностика' },
  { id: 'p-9', name: 'УЗИ щитовидной железы', price: 1500, category: 'Диагностика' },
  { id: 'p-10', name: 'МРТ головного мозга', price: 5500, category: 'Диагностика' },
  { id: 'p-11', name: 'МРТ позвоночника (1 отдел)', price: 5000, category: 'Диагностика' },
  { id: 'p-12', name: 'КТ грудной клетки', price: 4500, category: 'Диагностика' },
  
  // Анализы
  { id: 'p-13', name: 'Общий анализ крови', price: 450, category: 'Лабораторные исследования' },
  { id: 'p-14', name: 'Биохимический анализ крови', price: 1800, category: 'Лабораторные исследования' },
  { id: 'p-15', name: 'Гормональная панель', price: 3500, category: 'Лабораторные исследования' },
  { id: 'p-16', name: 'Коагулограмма', price: 1200, category: 'Лабораторные исследования' },
  
  // Процедуры
  { id: 'p-17', name: 'Внутривенная инъекция', price: 350, category: 'Процедуры' },
  { id: 'p-18', name: 'Капельница', price: 800, category: 'Процедуры' },
  { id: 'p-19', name: 'Перевязка', price: 600, category: 'Процедуры' },
  { id: 'p-20', name: 'Снятие швов', price: 500, category: 'Процедуры' },
];

export const serviceCategories = [
  { id: 'oms', name: 'Услуги по ОМС', description: 'Бесплатные услуги по полису обязательного медицинского страхования' },
  { id: 'paid', name: 'Платные услуги', description: 'Услуги на коммерческой основе' },
];
