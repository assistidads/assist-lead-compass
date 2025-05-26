
import { Dashboard } from './Dashboard';
import { ProspekForm } from './ProspekForm';
import { ProspekTable } from './ProspekTable';

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
      return (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Laporan</h2>
          <p className="text-gray-600">Halaman laporan sedang dalam pengembangan</p>
        </div>
      );
    case 'master':
      return (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Master</h2>
          <p className="text-gray-600">Halaman data master sedang dalam pengembangan</p>
        </div>
      );
    default:
      return <Dashboard />;
  }
}
