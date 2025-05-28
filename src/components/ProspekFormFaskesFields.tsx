
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProspekFormData } from '@/hooks/useProspekForm';

const layananAssist = ['SIMRS', 'Telemedicine', 'EMR', 'Farmasi', 'Laboratory'];
const tipeFaskes = ['Rumah Sakit', 'Klinik', 'Puskesmas', 'Laboratorium', 'Apotek'];

interface Province {
  id: string;
  name: string;
}

interface Regency {
  id: string;
  province_id: string;
  name: string;
}

interface ProspekFormFaskesFieldsProps {
  formData: ProspekFormData;
  onInputChange: (field: string, value: string) => void;
  provinces: Province[];
  regencies: Regency[];
  loadingProvinces: boolean;
  loadingRegencies: boolean;
}

export function ProspekFormFaskesFields({ 
  formData, 
  onInputChange, 
  provinces, 
  regencies, 
  loadingProvinces, 
  loadingRegencies 
}: ProspekFormFaskesFieldsProps) {
  return (
    <>
      {/* Layanan Assist */}
      <div>
        <Label htmlFor="layananAssist">Layanan Assist <span className="text-red-500">*</span></Label>
        <Select value={formData.layananAssist} onValueChange={(value) => onInputChange('layananAssist', value)} required>
          <SelectTrigger>
            <SelectValue placeholder="Pilih layanan assist" />
          </SelectTrigger>
          <SelectContent>
            {layananAssist.map(item => (
              <SelectItem key={item} value={item}>{item}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Nama Faskes */}
      <div>
        <Label htmlFor="namaFaskes">Nama Faskes <span className="text-red-500">*</span></Label>
        <Input
          id="namaFaskes"
          value={formData.namaFaskes}
          onChange={(e) => onInputChange('namaFaskes', e.target.value)}
          placeholder="Masukkan nama fasilitas kesehatan"
          autoComplete="off"
          required
        />
      </div>

      {/* Tipe Faskes */}
      <div>
        <Label htmlFor="tipeFaskes">Tipe Faskes <span className="text-red-500">*</span></Label>
        <Select value={formData.tipeFaskes} onValueChange={(value) => onInputChange('tipeFaskes', value)} required>
          <SelectTrigger>
            <SelectValue placeholder="Pilih tipe faskes" />
          </SelectTrigger>
          <SelectContent>
            {tipeFaskes.map(item => (
              <SelectItem key={item} value={item}>{item}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Provinsi */}
      <div>
        <Label htmlFor="provinsi">Provinsi <span className="text-red-500">*</span></Label>
        <Select value={formData.provinsi} onValueChange={(value) => onInputChange('provinsi', value)} required>
          <SelectTrigger>
            <SelectValue placeholder={loadingProvinces ? "Memuat..." : "Pilih provinsi"} />
          </SelectTrigger>
          <SelectContent>
            {provinces.map(province => (
              <SelectItem key={province.id} value={province.id}>{province.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Kota */}
      <div>
        <Label htmlFor="kota">Kota/Kabupaten <span className="text-red-500">*</span></Label>
        <Select 
          value={formData.kota} 
          onValueChange={(value) => onInputChange('kota', value)} 
          disabled={!formData.provinsi}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder={
              !formData.provinsi ? "Pilih provinsi dulu" :
              loadingRegencies ? "Memuat..." : 
              "Pilih kota/kabupaten"
            } />
          </SelectTrigger>
          <SelectContent>
            {regencies.map(regency => (
              <SelectItem key={regency.id} value={regency.name}>{regency.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
