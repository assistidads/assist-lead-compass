
import { Button } from '@/components/ui/button';

interface ProspekTablePaginationProps {
  startIndex: number;
  endIndex: number;
  filteredDataLength: number;
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

export function ProspekTablePagination({
  startIndex,
  endIndex,
  filteredDataLength,
  currentPage,
  totalPages,
  setCurrentPage
}: ProspekTablePaginationProps) {
  return (
    <div className="flex items-center justify-between p-4 border-t border-gray-200">
      <div className="text-sm text-gray-700">
        Menampilkan {startIndex + 1} - {Math.min(endIndex, filteredDataLength)} dari {filteredDataLength} data
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
        >
          Sebelumnya
        </Button>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">
            Halaman {currentPage} dari {totalPages}
          </span>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          disabled={currentPage >= totalPages}
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
        >
          Selanjutnya
        </Button>
      </div>
    </div>
  );
}
