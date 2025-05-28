
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SupabaseProspekFormData } from '@/hooks/useSupabaseProspekForm';

const statusLeads = ['Prospek', 'Dihubungi', 'Leads', 'Bukan Leads', 'On Going'];

interface SupabaseProspekFormBasicFieldsProps {
  formData: SupabaseProspekFormData;
  onInputChange: (field: string, value: string) => void;
  sumberLeadsOptions: any[];
  kodeAdsOptions: any[];
}

export function SupabaseProspekFormBasicFields({ 
  formData, 
  onInputChange, 
  sumberLeadsOptions,
  kodeAdsOptions 
}: SupabaseProspekFormBasicFieldsProps) {
  const selectedSumber = sumberLeadsOptions.find(s => s.id === formData.sumber_leads_id);
  const showKodeAds = selectedSumber?.nama.toLowerCase().includes('ads');

  return (
    <>
      {/* Tanggal Prospek Masuk */}
      <div>
        <Label htmlFor="tanggal_prospek">Tanggal Prospek Masuk <span className="text-red-500">*</span></Label>
        <Input
          id="tanggal_prospek"
          type="date"
          value={formData.tanggal_prospek}
          onChange={(e) => onInputChange('tanggal_prospek', e.target.value)}
          required
        />
      </div>

      {/* Sumber Leads */}
      <div>
        <Label htmlFor="sumber_leads_id">Sumber Leads <span className="text-red-500">*</span></Label>
        <Select value={formData.sumber_leads_id} onValueChange={(value) => onInputChange('sumber_leads_id', value)} required>
          <SelectTrigger>
            <SelectValue placeholder="Pilih sumber leads" />
          </SelectTrigger>
          <SelectContent>
            {sumberLeadsOptions.map(item => (
              <SelectItem key={item.id} value={item.id}>{item.nama}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Kode Ads - Conditional */}
      {showKodeAds && (
        <div>
          <Label htmlFor="kode_ads_id">Kode Ads <span className="text-red-500">*</span></Label>
          <Select value={formData.kode_ads_id} onValueChange={(value) => onInputChange('kode_ads_id', value)} required>
            <SelectTrigger>
              <SelectValue placeholder="Pilih kode ads" />
            </SelectTrigger>
            <SelectContent>
              {kodeAdsOptions.map(item => (
                <SelectItem key={item.id} value={item.id}>{item.kode}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* ID Ads - Conditional */}
      {showKodeAds && formData.kode_ads_id && (
        <div>
          <Label htmlFor="id_ads">ID Ads <span className="text-red-500">*</span></Label>
          <Select value={formData.id_ads} onValueChange={(value) => onInputChange('id_ads', value)} required>
            <SelectTrigger>
              <SelectValue placeholder="Pilih ID ads" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Form">Form</SelectItem>
              {Array.from({length: 21}, (_, i) => (
                <SelectItem key={i} value={i.toString()}>{i}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Nama Prospek */}
      <div>
        <Label htmlFor="nama_prospek">Nama Prospek <span className="text-red-500">*</span></Label>
        <Input
          id="nama_prospek"
          value={formData.nama_prospek}
          onChange={(e) => onInputChange('nama_prospek', e.target.value)}
          placeholder="Masukkan nama prospek"
          required
        />
      </div>

      {/* No WhatsApp */}
      <div>
        <Label htmlFor="no_whatsapp">No WhatsApp <span className="text-red-500">*</span></Label>
        <Input
          id="no_whatsapp"
          value={formData.no_whatsapp}
          onChange={(e) => onInputChange('no_whatsapp', e.target.value)}
          placeholder="Contoh: 081234567890"
          required
        />
      </div>

      {/* Status Leads */}
      <div>
        <Label htmlFor="status_leads">Status Leads <span className="text-red-500">*</span></Label>
        <Select value={formData.status_leads} onValueChange={(value) => onInputChange('status_leads', value)} required>
          <SelectTrigger>
            <SelectValue placeholder="Pilih status leads" />
          </SelectTrigger>
          <SelectContent>
            {statusLeads.map(item => (
              <SelectItem key={item} value={item}>{item}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
