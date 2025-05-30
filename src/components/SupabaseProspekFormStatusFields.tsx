
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { SupabaseProspekFormData } from '@/hooks/useSupabaseProspekForm';

interface AlasanBukanLeadsOption {
  id: string;
  alasan: string;
}

interface SupabaseProspekFormStatusFieldsProps {
  formData: SupabaseProspekFormData;
  onInputChange: (field: string, value: string) => void;
  alasanBukanLeadsOptions: AlasanBukanLeadsOption[];
}

// Master data status leads
const statusLeadsOptions = [
  'Prospek',
  'Dihubungi',
  'Leads',
  'Bukan Leads',
  'On Going'
];

export function SupabaseProspekFormStatusFields({ 
  formData, 
  onInputChange, 
  alasanBukanLeadsOptions 
}: SupabaseProspekFormStatusFieldsProps) {
  const showBukanLeadsFields = formData.status_leads === 'Bukan Leads';

  return (
    <>
      {/* Status Leads */}
      <div>
        <Label htmlFor="status_leads">Status Leads <span className="text-red-500">*</span></Label>
        <Select value={formData.status_leads} onValueChange={(value) => onInputChange('status_leads', value)} required>
          <SelectTrigger>
            <SelectValue placeholder="Pilih status leads" />
          </SelectTrigger>
          <SelectContent>
            {statusLeadsOptions.map(status => (
              <SelectItem key={status} value={status}>{status}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Alasan Bukan Leads - Only show if status is "Bukan Leads" */}
      {showBukanLeadsFields && (
        <>
          <div>
            <Label htmlFor="alasan_bukan_leads_id">Alasan Bukan Leads <span className="text-red-500">*</span></Label>
            <Select value={formData.alasan_bukan_leads_id} onValueChange={(value) => onInputChange('alasan_bukan_leads_id', value)} required>
              <SelectTrigger>
                <SelectValue placeholder="Pilih alasan bukan leads" />
              </SelectTrigger>
              <SelectContent>
                {alasanBukanLeadsOptions.map(alasan => (
                  <SelectItem key={alasan.id} value={alasan.id}>{alasan.alasan}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Keterangan Bukan Leads - Full Width */}
          <div className="md:col-span-2">
            <Label htmlFor="keterangan_bukan_leads">Keterangan Bukan Leads <span className="text-red-500">*</span></Label>
            <Textarea
              id="keterangan_bukan_leads"
              value={formData.keterangan_bukan_leads}
              onChange={(e) => onInputChange('keterangan_bukan_leads', e.target.value)}
              placeholder="Masukkan keterangan tambahan..."
              className="mt-1"
              required
            />
          </div>
        </>
      )}
    </>
  );
}
