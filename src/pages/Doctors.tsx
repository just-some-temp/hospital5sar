import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, User } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { doctors as staticDoctors, departments as staticDepartments } from '@/data/doctors';
import { useDoctorProfiles } from '@/hooks/useDoctorProfiles';
import { cn } from '@/lib/utils';

const Doctors = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('Все отделения');
  const { dbDoctors } = useDoctorProfiles();

  // Merge static and database doctors
  const allDoctors = useMemo(() => [...staticDoctors, ...dbDoctors], [dbDoctors]);

  // Build dynamic department list
  const allDepartments = useMemo(() => {
    const dbDepts = dbDoctors
      .map((d) => d.department)
      .filter((dept) => dept && !staticDepartments.includes(dept));
    const uniqueDbDepts = [...new Set(dbDepts)];
    return [...staticDepartments, ...uniqueDbDepts];
  }, [dbDoctors]);

  const filteredDoctors = useMemo(() => {
    return allDoctors.filter((doctor) => {
      const matchesSearch =
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDepartment =
        selectedDepartment === 'Все отделения' || doctor.department === selectedDepartment;
      return matchesSearch && matchesDepartment;
    });
  }, [searchQuery, selectedDepartment, allDoctors]);

  return (
    <Layout>
      <div className="bg-muted py-12">
        <div className="container">
          <h1 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">Наши врачи</h1>
          <p className="max-w-2xl text-muted-foreground">
            В нашей больнице работают высококвалифицированные специалисты различных направлений.
            Найдите нужного врача по специальности или фамилии.
          </p>
        </div>
      </div>

      <div className="container py-8">
        {/* Filters */}
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Поиск по ФИО или специальности..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {allDepartments.map((dept) => (
              <Button
                key={dept}
                variant={selectedDepartment === dept ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedDepartment(dept)}
                className="text-sm"
              >
                {dept}
              </Button>
            ))}
          </div>
        </div>

        <p className="mb-6 text-sm text-muted-foreground">
          Найдено врачей: {filteredDoctors.length}
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredDoctors.map((doctor) => (
            <Card key={doctor.id} className="overflow-hidden transition-all hover:shadow-lg">
              <CardContent className="p-0">
                <div className="flex h-48 items-center justify-center bg-muted">
                  {doctor.photo ? (
                    <img
                      src={doctor.photo}
                      alt={doctor.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-20 w-20 text-muted-foreground/30" />
                  )}
                </div>

                <div className="p-5">
                  <Badge variant="secondary" className="mb-2">
                    {doctor.specialty}
                  </Badge>
                  <h3 className="mb-1 font-semibold text-foreground">{doctor.name}</h3>
                  <p className="text-sm text-muted-foreground">Стаж: {doctor.experience} лет</p>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Категория: {doctor.category}
                  </p>
                  <Button asChild className="w-full">
                    <Link to={`/doctors/${doctor.id}`}>Подробнее</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredDoctors.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-lg text-muted-foreground">По вашему запросу врачи не найдены</p>
            <Button
              variant="link"
              onClick={() => {
                setSearchQuery('');
                setSelectedDepartment('Все отделения');
              }}
            >
              Сбросить фильтры
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Doctors;
