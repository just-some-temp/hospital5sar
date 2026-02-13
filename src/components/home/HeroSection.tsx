import { Link } from 'react-router-dom';
import { Calendar, Home, FileText, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-primary via-primary to-accent py-16 md:py-24">
      <div className="container relative z-10">
        <div className="mx-auto max-w-4xl text-center text-primary-foreground">
          <h1 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            ГУЗ «Саратовская городская клиническая больница №5»
          </h1>
          <p className="mb-8 text-lg opacity-90 sm:text-xl">
            Современная многопрофильная больница с высококвалифицированными специалистами. 
            Мы заботимся о вашем здоровье уже более 50 лет.
          </p>
          
          {/* Quick action buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              variant="secondary"
              className="gap-2 text-base"
              asChild
            >
              <Link to="/appointment">
                <Calendar className="h-5 w-5" />
                Записаться к врачу
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 text-base"
              asChild
            >
              <Link to="/home-visit">
                <Home className="h-5 w-5" />
                Вызвать врача на дом
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 text-base"
              asChild
            >
              <Link to="/results">
                <FileText className="h-5 w-5" />
                Результаты анализов
              </Link>
            </Button>
          </div>

          {/* Contact info */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm opacity-90">
            <a href="tel:+78452996900" className="flex items-center gap-2 hover:underline">
              <Phone className="h-4 w-4" />
              <span>Регистратура: +7 (8452) 996-900</span>
            </a>
            <span className="hidden sm:inline">•</span>
            <span>Пн-Пт: 8:00-20:00, Сб: 9:00-15:00</span>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.05),transparent_50%)]" />
    </section>
  );
}
