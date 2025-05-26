
import { Dashboard } from './Dashboard';
import { ProspekForm } from './ProspekForm';
import { ProspekTable } from './ProspekTable';
import { DataMaster } from './DataMaster';
import { Laporan } from './Laporan';

interface AppContentProps {
  currentPage: string;
}

export function AppContent({ currentPage }: AppContentProps) {
  switch (currentPage) {
    case 'dashboard':
      return <Dashboard />;
    case 'prospek':
      return <ProspekTable />;
    case 'laporan':
      return <Laporan />;
    case 'master':
      return <DataMaster />;
    default:
      return <Dashboard />;
  }
}
