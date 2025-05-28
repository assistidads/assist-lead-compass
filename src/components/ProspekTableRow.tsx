
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { ProspekData } from '@/types/prospek';

interface ProspekTableRowProps {
  item: ProspekData;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export function ProspekTableRow({ item, onView, onEdit, onDelete }: ProspekTableRowProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Leads':
        return 'bg-green-100 text-green-800';
      case 'Dihubungi':
        return 'bg-blue-100 text-blue-800';
      case 'Prospek':
        return 'bg-yellow-100 text-yellow-800';
      case 'On Going':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50">
      <td className="py-3 px-4 text-sm text-gray-900">{item.createdDate}</td>
      <td className="py-3 px-4 text-sm text-gray-900">{item.tanggalProspekMasuk}</td>
      <td className="py-3 px-4 text-sm text-gray-900">{item.sumberLeads}</td>
      <td className="py-3 px-4 text-sm text-gray-900">{item.kodeAds || '-'}</td>
      <td className="py-3 px-4 text-sm text-gray-900">{item.idAds || '-'}</td>
      <td className="py-3 px-4 text-sm font-medium text-gray-900">{item.namaProspek}</td>
      <td className="py-3 px-4 text-sm text-gray-900">{item.noWhatsApp}</td>
      <td className="py-3 px-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.statusLeads)}`}>
          {item.statusLeads}
        </span>
      </td>
      <td className="py-3 px-4 text-sm text-gray-900">{item.alasanBukanLeads || '-'}</td>
      <td className="py-3 px-4 text-sm text-gray-900">
        {item.keterangan ? (
          <span className="max-w-32 truncate block" title={item.keterangan}>
            {item.keterangan}
          </span>
        ) : '-'}
      </td>
      <td className="py-3 px-4 text-sm text-gray-900">{item.layananAssist}</td>
      <td className="py-3 px-4 text-sm text-gray-900">{item.namaFaskes}</td>
      <td className="py-3 px-4 text-sm text-gray-900">{item.tipeFaskes}</td>
      <td className="py-3 px-4 text-sm text-gray-900">{item.lokasiFaskes}</td>
      <td className="py-3 px-4 text-sm text-gray-900">{item.picLeads}</td>
      <td className="py-3 px-4">
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="h-8 w-8 p-0"
            onClick={() => onView(item.id)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="h-8 w-8 p-0"
            onClick={() => onEdit(item.id)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
            onClick={() => onDelete(item.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}
