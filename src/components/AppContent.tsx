
import { Dashboard } from './Dashboard';
import { SupabaseDataMaster } from './SupabaseDataMaster';
import { SupabaseProspekTable } from './SupabaseProspekTable';
import { SupabaseLaporan } from './SupabaseLaporan';

interface AppContentProps {
  currentPage: string;
}

export default function AppContent({ currentPage }: AppContentProps) {
  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'data-master':
        return <SupabaseDataMaster />;
      case 'data-prospek':
        return <SupabaseProspekTable />;
      case 'laporan':
        return <SupabaseLaporan />;
      default:
        return <Dashboard />;
    }
  };

  return <div className="space-y-6">{renderContent()}</div>;
}
