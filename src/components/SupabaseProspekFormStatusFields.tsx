
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { SupabaseProspekFormData } from '@/hooks/useSupabaseProspekForm';
import { useSupabaseData } from '@/hooks/useSupabaseData';

interface SupabaseProspekFormStatusFieldsProps {
  formData: SupabaseProspekFormData;
  onInputChange: (field: string, value: string) => void;
  alasanBukanLeadsOptions: any[];
}

export function SupabaseProspekFormStatusFields({ 
  formData, 
  onInputChange, 
  alasanBukanLeadsOptions 
}: SupabaseProspekFormStatusFieldsProps) {
  const { statusLeadsData } = useSupabaseData();
  
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
            {statusLeadsData.map(item => (
              <SelectItem key={item.id} value={item.nama || ''}>{item.nama}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Show Bukan Leads fields only when status is "Bukan Leads" */}
      {formData.status_leads === 'Bukan Leads' && (
        <>
          {/* Alasan Bukan Leads */}
          <div>
            <Label htmlFor="alasan_bukan_leads_id">Alasan Bukan Leads <span className="text-red-500">*</span></Label>
            <Select value={formData.alasan_bukan_leads_id} onValueChange={(value) => onInputChange('alasan_bukan_leads_id', value)} required>
              <SelectTrigger>
                <SelectValue placeholder="Pilih alasan bukan leads" />
              </SelectTrigger>
              <SelectContent>
                {alasanBukanLeadsOptions.map(item => (
                  <SelectItem key={item.id} value={item.id}>{item.alasan}</SelectItem>
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
              required
            />
          </div>
        </>
      )}
    </>
  );
}
