
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ProspekTableHeaderProps {
  rowsPerPage: number;
  setRowsPerPage: (value: number) => void;
  setCurrentPage: (page: number) => void;
  filteredDataLength: number;
}

export function ProspekTableHeader({
  rowsPerPage,
  setRowsPerPage,
  setCurrentPage,
  filteredDataLength
}: ProspekTableHeaderProps) {
  return (
    <div className="flex justify-between items-center p-4 border-b border-gray-200">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-700">Tampilkan</span>
        <Select value={rowsPerPage.toString()} onValueChange={(value) => {
          setRowsPerPage(parseInt(value));
          setCurrentPage(1);
        }}>
          <SelectTrigger className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="25">25</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-gray-700">baris</span>
      </div>
      <div className="text-sm text-gray-700">
        Total: {filteredDataLength} data
      </div>
    </div>
  );
}
