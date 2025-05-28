
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProspekFormData } from '@/hooks/useProspekForm';

const sumberLeads = ['Meta Ads', 'Google Ads', 'TikTok Ads', 'Google', 'Referral', 'Website Organik'];
const kodeAds = ['MA01', 'GA01', 'TA01', 'FB01'];
const statusLeads = ['Prospek', 'Dihubungi', 'Leads', 'Bukan Leads', 'On Going'];

interface ProspekFormBasicFieldsProps {
  formData: ProspekFormData;
  onInputChange: (field: string, value: string) => void;
}

export function ProspekFormBasicFields({ formData, onInputChange }: ProspekFormBasicFieldsProps) {
  const showKodeAds = formData.sumberLeads.toLowerCase().includes('ads');

  return (
    <>
      {/* Tanggal Prospek Masuk */}
      <div>
        <Label htmlFor="tanggalProspek">Tanggal Prospek Masuk <span className="text-red-500">*</span></Label>
        <Input
          id="tanggalProspek"
          type="date"
          value={formData.tanggalProspek}
          onChange={(e) => onInputChange('tanggalProspek', e.target.value)}
          autoComplete="off"
          required
        />
      </div>

      {/* Sumber Leads */}
      <div>
        <Label htmlFor="sumberLeads">Sumber Leads <span className="text-red-500">*</span></Label>
        <Select value={formData.sumberLeads} onValueChange={(value) => onInputChange('sumberLeads', value)} required>
          <SelectTrigger>
            <SelectValue placeholder="Pilih sumber leads" />
          </SelectTrigger>
          <SelectContent>
            {sumberLeads.map(item => (
              <SelectItem key={item} value={item}>{item}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Kode Ads - Conditional */}
      {showKodeAds && (
        <div>
          <Label htmlFor="kodeAds">Kode Ads <span className="text-red-500">*</span></Label>
          <Select value={formData.kodeAds} onValueChange={(value) => onInputChange('kodeAds', value)} required>
            <SelectTrigger>
              <SelectValue placeholder="Pilih kode ads" />
            </SelectTrigger>
            <SelectContent>
              {kodeAds.map(item => (
                <SelectItem key={item} value={item}>{item}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* ID Ads - Conditional */}
      {showKodeAds && formData.kodeAds && (
        <div>
          <Label htmlFor="idAds">ID Ads <span className="text-red-500">*</span></Label>
          <Select value={formData.idAds} onValueChange={(value) => onInputChange('idAds', value)} required>
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
        <Label htmlFor="namaProspek">Nama Prospek <span className="text-red-500">*</span></Label>
        <Input
          id="namaProspek"
          value={formData.namaProspek}
          onChange={(e) => onInputChange('namaProspek', e.target.value)}
          placeholder="Masukkan nama prospek"
          autoComplete="off"
          required
        />
      </div>

      {/* No WhatsApp */}
      <div>
        <Label htmlFor="noWhatsApp">No WhatsApp <span className="text-red-500">*</span></Label>
        <Input
          id="noWhatsApp"
          value={formData.noWhatsApp}
          onChange={(e) => onInputChange('noWhatsApp', e.target.value)}
          placeholder="Contoh: 081234567890"
          autoComplete="off"
          required
        />
      </div>

      {/* Status Leads */}
      <div>
        <Label htmlFor="statusLeads">Status Leads <span className="text-red-500">*</span></Label>
        <Select value={formData.statusLeads} onValueChange={(value) => onInputChange('statusLeads', value)} required>
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
