import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* About */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">
                5
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-foreground">ГУЗ «СГКБ №5»</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Саратовская городская клиническая больница №5 — многопрофильное медицинское учреждение, 
              оказывающее высококвалифицированную медицинскую помощь жителям города и области.
            </p>
          </div>

          {/* Contacts */}
          <div>
            <h3 className="mb-4 font-semibold text-foreground">Контакты</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <a href="tel:+78452996900" className="flex items-center gap-2 hover:text-primary">
                  <Phone className="h-4 w-4" />
                  <span>+7 (8452) 996-900</span>
                </a>
              </li>
              <li>
                <a href="mailto:sgkb5@mail.ru" className="flex items-center gap-2 hover:text-primary">
                  <Mail className="h-4 w-4" />
                  <span>sgkb5@mail.ru</span>
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>410071, г. Саратов, 4 Рабочий проезд, здание 3</span>
              </li>
            </ul>
          </div>

          {/* Working Hours */}
          <div>
            <h3 className="mb-4 font-semibold text-foreground">Режим работы</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Поликлиника: Пн-Пт 8:00-20:00</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Суббота: 9:00-15:00</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Воскресенье: 9:00-14:00</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Стационар: круглосуточно</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 font-semibold text-foreground">Навигация</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/appointment" className="text-muted-foreground hover:text-primary">
                  Записаться на приём
                </Link>
              </li>
              <li>
                <Link to="/doctors" className="text-muted-foreground hover:text-primary">
                  Наши врачи
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-muted-foreground hover:text-primary">
                  Услуги
                </Link>
              </li>
              <li>
                <Link to="/news" className="text-muted-foreground hover:text-primary">
                  Новости
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-primary">
                  Вопросы и ответы
                </Link>
              </li>
              <li>
                <Link to="/sitemap" className="text-muted-foreground hover:text-primary">
                  Карта сайта
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 border-t pt-8">
          <div className="flex flex-col items-center justify-between gap-4 text-center text-sm text-muted-foreground md:flex-row md:text-left">
            <p>© 2024 ГУЗ «СГКБ №5». Все права защищены.</p>
            <div className="flex items-center gap-4">
              <a href="https://vk.com/sargkb5" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                VK
              </a>
              <a href="https://t.me/sargcb5" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                Telegram
              </a>
              <Link to="/documents" className="hover:text-primary">
                Лицензия
              </Link>
              <Link to="/documents" className="hover:text-primary">
                Политика конфиденциальности
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
