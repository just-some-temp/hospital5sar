export interface Document {
  id: string;
  name: string;
  category: 'license' | 'founding' | 'regulations' | 'reports' | 'privacy';
  date: string;
  description: string;
  fileUrl: string;
}

export const documents: Document[] = [
  // Лицензии
  {
    id: 'doc-1',
    name: 'Лицензия на осуществление медицинской деятельности',
    category: 'license',
    date: '2023-05-15',
    description: 'Лицензия № ЛО-64-01-005678 от 15.05.2023 г., выданная Министерством здравоохранения Саратовской области',
    fileUrl: '#',
  },
  {
    id: 'doc-2',
    name: 'Приложение к лицензии',
    category: 'license',
    date: '2023-05-15',
    description: 'Перечень работ (услуг), составляющих медицинскую деятельность',
    fileUrl: '#',
  },
  
  // Учредительные документы
  {
    id: 'doc-3',
    name: 'Устав учреждения',
    category: 'founding',
    date: '2022-01-10',
    description: 'Устав государственного учреждения здравоохранения «Саратовская городская клиническая больница №5»',
    fileUrl: '#',
  },
  {
    id: 'doc-4',
    name: 'Свидетельство о государственной регистрации',
    category: 'founding',
    date: '2000-03-20',
    description: 'Свидетельство о внесении записи в ЕГРЮЛ',
    fileUrl: '#',
  },
  {
    id: 'doc-5',
    name: 'Свидетельство о постановке на учёт в налоговом органе',
    category: 'founding',
    date: '2000-03-25',
    description: 'ИНН/КПП организации',
    fileUrl: '#',
  },
  
  // Нормативные акты
  {
    id: 'doc-6',
    name: 'Правила внутреннего распорядка для пациентов',
    category: 'regulations',
    date: '2024-01-01',
    description: 'Правила поведения пациентов и посетителей в больнице',
    fileUrl: '#',
  },
  {
    id: 'doc-7',
    name: 'Положение о платных медицинских услугах',
    category: 'regulations',
    date: '2024-01-01',
    description: 'Порядок и условия предоставления платных медицинских услуг',
    fileUrl: '#',
  },
  {
    id: 'doc-8',
    name: 'Правила записи на приём',
    category: 'regulations',
    date: '2024-01-01',
    description: 'Порядок записи на первичный и повторный приём к специалистам',
    fileUrl: '#',
  },
  
  // Отчёты
  {
    id: 'doc-9',
    name: 'Годовой отчёт за 2024 год',
    category: 'reports',
    date: '2025-01-15',
    description: 'Отчёт о результатах деятельности учреждения за 2024 год',
    fileUrl: '#',
  },
  {
    id: 'doc-10',
    name: 'План финансово-хозяйственной деятельности',
    category: 'reports',
    date: '2025-01-01',
    description: 'План ФХД на 2025 год',
    fileUrl: '#',
  },
  
  // Политика конфиденциальности
  {
    id: 'doc-11',
    name: 'Политика обработки персональных данных',
    category: 'privacy',
    date: '2024-01-01',
    description: 'Политика в отношении обработки персональных данных пациентов',
    fileUrl: '#',
  },
  {
    id: 'doc-12',
    name: 'Согласие на обработку персональных данных',
    category: 'privacy',
    date: '2024-01-01',
    description: 'Форма согласия на обработку персональных данных',
    fileUrl: '#',
  },
];

export const documentCategories = [
  { id: 'license', name: 'Лицензии', icon: 'FileCheck' },
  { id: 'founding', name: 'Учредительные документы', icon: 'Building' },
  { id: 'regulations', name: 'Нормативные акты', icon: 'Scale' },
  { id: 'reports', name: 'Отчёты', icon: 'BarChart' },
  { id: 'privacy', name: 'Персональные данные', icon: 'Shield' },
];
