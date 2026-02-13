import { Layout } from '@/components/layout/Layout';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { useAuth } from '@/contexts/AuthContext';
import { PatientDashboard } from '@/components/dashboard/PatientDashboard';
import { DoctorDashboard } from '@/components/dashboard/DoctorDashboard';
import { AdminDashboard } from '@/components/dashboard/AdminDashboard';

const Dashboard = () => {
  const { role, profile } = useAuth();

  const renderDashboard = () => {
    switch (role) {
      case 'admin':
        return <AdminDashboard />;
      case 'doctor':
        return <DoctorDashboard />;
      case 'patient':
      default:
        return <PatientDashboard />;
    }
  };

  const getRoleTitle = () => {
    switch (role) {
      case 'admin':
        return 'Панель администратора';
      case 'doctor':
        return 'Кабинет врача';
      case 'patient':
      default:
        return 'Личный кабинет пациента';
    }
  };

  return (
    <Layout>
      <div className="bg-muted py-6">
        <div className="container">
          <Breadcrumbs />
          <h1 className="text-3xl font-bold mt-4">{getRoleTitle()}</h1>
          {profile?.full_name && (
            <p className="text-muted-foreground mt-1">
              Добро пожаловать, {profile.full_name}!
            </p>
          )}
        </div>
      </div>

      <div className="container py-8">
        {renderDashboard()}
      </div>
    </Layout>
  );
};

export default Dashboard;
