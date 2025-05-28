
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ProspekFormData } from '@/hooks/useProspekForm';

const bukanLeads = ['Tidak Tertarik', 'Sudah Ada Vendor', 'Budget Tidak Sesuai', 'Lainnya'];

interface ProspekFormStatusFieldsProps {
  formData: ProspekFormData;
  onInputChange: (field: string, value: string) => void;
}

export function ProspekFormStatusFields({ formData, onInputChange }: ProspekFormStatusFieldsProps) {
  const showBukanLeadsFields = formData.statusLeads === 'Bukan Leads';

  if (!showBukanLeadsFields) return null;

  return (
    <>
      {/* Bukan Leads */}
      <div>
        <Label htmlFor="bukanLeads">Bukan Leads <span className="text-red-500">*</span></Label>
        <Select value={formData.bukanLeads} onValueChange={(value) => onInputChange('bukanLeads', value)} required>
          <SelectTrigger>
            <SelectValue placeholder="Pilih alasan bukan leads" />
          </SelectTrigger>
          <SelectContent>
            {bukanLeads.map(item => (
              <SelectItem key={item} value={item}>{item}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Keterangan Bukan Leads - Full Width */}
      <div className="md:col-span-2">
        <Label htmlFor="keteranganBukanLeads">Keterangan Bukan Leads <span className="text-red-500">*</span></Label>
        <Textarea
          id="keteranganBukanLeads"
          value={formData.keteranganBukanLeads}
          onChange={(e) => onInputChange('keteranganBukanLeads', e.target.value)}
          placeholder="Masukkan keterangan tambahan..."
          className="mt-1"
          required
        />
      </div>
    </>
  );
}
