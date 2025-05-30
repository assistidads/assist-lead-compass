
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { SupabaseProspekFormData } from '@/hooks/useSupabaseProspekForm';

interface Province {
  id: string;
  name: string;
}

interface Regency {
  id: string;
  name: string;
}

interface LayananAssistOption {
  id: string;
  nama: string;
}

interface UserOption {
  id: string;
  full_name: string;
}

interface SupabaseProspekFormFaskesFieldsProps {
  formData: SupabaseProspekFormData;
  onInputChange: (field: string, value: string) => void;
  provinces: Province[];
  regencies: Regency[];
  loadingRegencies: boolean;
  layananAssistOptions: LayananAssistOption[];
  usersOptions: UserOption[];
  userRole?: string;
}

// Master data tipe faskes
const tipeFaskesOptions = [
  'Rumah Sakit',
  'Puskesmas', 
  'Klinik',
  'Lab Kesehatan'
];

export function SupabaseProspekFormFaskesFields({ 
  formData, 
  onInputChange, 
  provinces, 
  regencies, 
  loadingRegencies,
  layananAssistOptions,
  usersOptions,
  userRole = 'cs_support'
}: SupabaseProspekFormFaskesFieldsProps) {
  return (
    <>
      {/* Layanan Assist */}
      <div>
        <Label htmlFor="layanan_assist_id">Layanan Assist <span className="text-red-500">*</span></Label>
        <Select value={formData.layanan_assist_id} onValueChange={(value) => onInputChange('layanan_assist_id', value)} required>
          <SelectTrigger>
            <SelectValue placeholder="Pilih layanan assist" />
          </SelectTrigger>
          <SelectContent>
            {layananAssistOptions.map(layanan => (
              <SelectItem key={layanan.id} value={layanan.id}>{layanan.nama}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Nama Faskes */}
      <div>
        <Label htmlFor="nama_faskes">Nama Faskes <span className="text-red-500">*</span></Label>
        <Input
          id="nama_faskes"
          value={formData.nama_faskes}
          onChange={(e) => onInputChange('nama_faskes', e.target.value)}
          placeholder="Masukkan nama faskes"
          required
        />
      </div>

      {/* Tipe Faskes */}
      <div>
        <Label htmlFor="tipe_faskes">Tipe Faskes <span className="text-red-500">*</span></Label>
        <Select value={formData.tipe_faskes} onValueChange={(value) => onInputChange('tipe_faskes', value)} required>
          <SelectTrigger>
            <SelectValue placeholder="Pilih tipe faskes" />
          </SelectTrigger>
          <SelectContent>
            {tipeFaskesOptions.map(tipe => (
              <SelectItem key={tipe} value={tipe}>{tipe}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Provinsi */}
      <div>
        <Label htmlFor="provinsi_id">Provinsi <span className="text-red-500">*</span></Label>
        <Select value={formData.provinsi_id} onValueChange={(value) => onInputChange('provinsi_id', value)} required>
          <SelectTrigger>
            <SelectValue placeholder="Pilih provinsi" />
          </SelectTrigger>
          <SelectContent>
            {provinces.map(province => (
              <SelectItem key={province.id} value={province.id}>{province.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Kota/Kabupaten */}
      <div>
        <Label htmlFor="kota">Kota/Kabupaten <span className="text-red-500">*</span></Label>
        <Select 
          value={formData.kota} 
          onValueChange={(value) => onInputChange('kota', value)} 
          disabled={loadingRegencies || !formData.provinsi_id}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder={loadingRegencies ? "Memuat..." : "Pilih kota/kabupaten"} />
          </SelectTrigger>
          <SelectContent>
            {loadingRegencies ? (
              <SelectItem value="loading" disabled>
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Memuat data...
                </div>
              </SelectItem>
            ) : (
              regencies.map(regency => (
                <SelectItem key={regency.id} value={regency.name}>{regency.name}</SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      {/* PIC Leads - Only for Admin */}
      {userRole === 'admin' && (
        <div>
          <Label htmlFor="pic_leads_id">PIC Leads</Label>
          <Select value={formData.pic_leads_id} onValueChange={(value) => onInputChange('pic_leads_id', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih PIC Leads" />
            </SelectTrigger>
            <SelectContent>
              {usersOptions.map(user => (
                <SelectItem key={user.id} value={user.id}>{user.full_name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </>
  );
}
