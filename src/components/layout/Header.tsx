import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AccessibilityPanel } from '@/components/accessibility/AccessibilityPanel';
import { UserMenu } from '@/components/auth/UserMenu';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Главная', path: '/' },
  { label: 'Врачи', path: '/doctors' },
  { label: 'Услуги', path: '/services' },
  { label: 'Новости', path: '/news' },
  { label: 'О больнице', path: '/about' },
  { label: 'Документы', path: '/documents' },
  { label: 'Контакты', path: '/contacts' },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      {/* Top bar with contact info */}
      <div className="bg-primary text-primary-foreground">
        <div className="container flex flex-wrap items-center justify-between gap-2 py-2 text-sm">
          <div className="flex items-center gap-4">
            <a href="tel:+78452996900" className="flex items-center gap-1 hover:underline">
              <Phone className="h-4 w-4" />
              <span>+7 (8452) 996-900</span>
            </a>
            <span className="hidden items-center gap-1 sm:flex">
              <Clock className="h-4 w-4" />
              <span>Пн-Пт: 8:00-20:00</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <AccessibilityPanel />
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="container">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">
              5
            </div>
            <div className="hidden flex-col sm:flex">
              <span className="text-lg font-bold text-foreground">ГУЗ «СГКБ №5»</span>
              <span className="text-xs text-muted-foreground">Саратовская городская клиническая больница</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                  location.pathname === item.path
                    ? 'bg-secondary text-primary'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* User Menu + Mobile menu button */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <UserMenu />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="border-t py-4 lg:hidden">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    'px-4 py-3 text-base font-medium rounded-md transition-colors',
                    location.pathname === item.path
                      ? 'bg-secondary text-primary'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <div className="px-4 pt-4 border-t mt-2 sm:hidden">
                <UserMenu />
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
