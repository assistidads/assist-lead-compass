
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

const sumberLeads = ['Meta Ads', 'Google Ads', 'TikTok Ads', 'Google', 'Referral', 'Website Organik'];
const kodeAds = ['MA01', 'GA01', 'TA01', 'FB01'];
const statusLeads = ['Prospek', 'Dihubungi', 'Leads', 'Bukan Leads', 'On Going'];
const layananAssist = ['SIMRS', 'Telemedicine', 'EMR', 'Farmasi', 'Laboratory'];
const tipeFaskes = ['Rumah Sakit', 'Klinik', 'Puskesmas', 'Laboratorium', 'Apotek'];
const bukanLeads = ['Tidak Tertarik', 'Sudah Ada Vendor', 'Budget Tidak Sesuai', 'Lainnya'];

interface Province {
  id: string;
  name: string;
}

interface Regency {
  id: string;
  province_id: string;
  name: string;
}

export function ProspekForm() {
  const [formData, setFormData] = useState({
    tanggalProspek: new Date().toISOString().split('T')[0],
    sumberLeads: '',
    kodeAds: '',
    idAds: '',
    namaProspek: '',
    noWhatsApp: '',
    statusLeads: '',
    bukanLeads: '',
    keteranganBukanLeads: '',
    layananAssist: '',
    namaFaskes: '',
    tipeFaskes: '',
    provinsi: '',
    kota: '',
    picLeads: 'CS Support 1'
  });

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [regencies, setRegencies] = useState<Regency[]>([]);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingRegencies, setLoadingRegencies] = useState(false);

  // Fetch provinces on component mount
  useEffect(() => {
    fetchProvinces();
  }, []);

  // Fetch regencies when province changes
  useEffect(() => {
    if (formData.provinsi) {
      fetchRegencies(formData.provinsi);
    } else {
      setRegencies([]);
    }
  }, [formData.provinsi]);

  const fetchProvinces = async () => {
    setLoadingProvinces(true);
    try {
      const response = await fetch('https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json');
      const data = await response.json();
      setProvinces(data);
    } catch (error) {
      console.error('Error fetching provinces:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data provinsi",
        variant: "destructive",
      });
    } finally {
      setLoadingProvinces(false);
    }
  };

  const fetchRegencies = async (provinceId: string) => {
    setLoadingRegencies(true);
    try {
      const response = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provinceId}.json`);
      const data = await response.json();
      setRegencies(data);
    } catch (error) {
      console.error('Error fetching regencies:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data kota/kabupaten",
        variant: "destructive",
      });
    } finally {
      setLoadingRegencies(false);
    }
  };

  const showKodeAds = formData.sumberLeads.toLowerCase().includes('ads');
  const showBukanLeadsFields = formData.statusLeads === 'Bukan Leads';

  const validateForm = () => {
    const requiredFields = [
      { field: 'tanggalProspek', label: 'Tanggal Prospek Masuk' },
      { field: 'sumberLeads', label: 'Sumber Leads' },
      { field: 'namaProspek', label: 'Nama Prospek' },
      { field: 'noWhatsApp', label: 'No WhatsApp' },
      { field: 'statusLeads', label: 'Status Leads' },
      { field: 'layananAssist', label: 'Layanan Assist' },
      { field: 'namaFaskes', label: 'Nama Faskes' },
      { field: 'tipeFaskes', label: 'Tipe Faskes' },
      { field: 'provinsi', label: 'Provinsi' },
      { field: 'kota', label: 'Kota/Kabupaten' }
    ];

    // Add conditional required fields
    if (showKodeAds) {
      requiredFields.push({ field: 'kodeAds', label: 'Kode Ads' });
      requiredFields.push({ field: 'idAds', label: 'ID Ads' });
    }

    if (showBukanLeadsFields) {
      requiredFields.push({ field: 'bukanLeads', label: 'Bukan Leads' });
      requiredFields.push({ field: 'keteranganBukanLeads', label: 'Keterangan Bukan Leads' });
    }

    for (const { field, label } of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        toast({
          title: "Field wajib kosong",
          description: `${label} harus diisi`,
          variant: "destructive",
        });
        return false;
      }
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    console.log('Form submitted:', formData);
    toast({
      title: "Prospek berhasil disimpan",
      description: "Data prospek telah ditambahkan ke database",
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Reset kode ads dan id ads jika sumber leads bukan ads
      if (field === 'sumberLeads' && !value.toLowerCase().includes('ads')) {
        newData.kodeAds = '';
        newData.idAds = '';
      }
      
      // Reset bukan leads fields jika status bukan "Bukan Leads"
      if (field === 'statusLeads' && value !== 'Bukan Leads') {
        newData.bukanLeads = '';
        newData.keteranganBukanLeads = '';
      }

      // Reset kota when province changes
      if (field === 'provinsi') {
        newData.kota = '';
      }
      
      return newData;
    });
  };

  return (
    <Card className="bg-white border border-gray-200">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900">Form Input Prospek</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tanggal Prospek Masuk */}
            <div>
              <Label htmlFor="tanggalProspek">Tanggal Prospek Masuk <span className="text-red-500">*</span></Label>
              <Input
                id="tanggalProspek"
                type="date"
                value={formData.tanggalProspek}
                onChange={(e) => handleInputChange('tanggalProspek', e.target.value)}
                autoComplete="off"
                required
              />
            </div>

            {/* Sumber Leads */}
            <div>
              <Label htmlFor="sumberLeads">Sumber Leads <span className="text-red-500">*</span></Label>
              <Select value={formData.sumberLeads} onValueChange={(value) => handleInputChange('sumberLeads', value)} required>
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
                <Select value={formData.kodeAds} onValueChange={(value) => handleInputChange('kodeAds', value)} required>
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
                <Select value={formData.idAds} onValueChange={(value) => handleInputChange('idAds', value)} required>
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
                onChange={(e) => handleInputChange('namaProspek', e.target.value)}
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
                onChange={(e) => handleInputChange('noWhatsApp', e.target.value)}
                placeholder="Contoh: 081234567890"
                autoComplete="off"
                required
              />
            </div>

            {/* Status Leads */}
            <div>
              <Label htmlFor="statusLeads">Status Leads <span className="text-red-500">*</span></Label>
              <Select value={formData.statusLeads} onValueChange={(value) => handleInputChange('statusLeads', value)} required>
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

            {/* Bukan Leads - Conditional */}
            {showBukanLeadsFields && (
              <div>
                <Label htmlFor="bukanLeads">Bukan Leads <span className="text-red-500">*</span></Label>
                <Select value={formData.bukanLeads} onValueChange={(value) => handleInputChange('bukanLeads', value)} required>
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
            )}

            {/* Layanan Assist */}
            <div>
              <Label htmlFor="layananAssist">Layanan Assist <span className="text-red-500">*</span></Label>
              <Select value={formData.layananAssist} onValueChange={(value) => handleInputChange('layananAssist', value)} required>
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
                onChange={(e) => handleInputChange('namaFaskes', e.target.value)}
                placeholder="Masukkan nama fasilitas kesehatan"
                autoComplete="off"
                required
              />
            </div>

            {/* Tipe Faskes */}
            <div>
              <Label htmlFor="tipeFaskes">Tipe Faskes <span className="text-red-500">*</span></Label>
              <Select value={formData.tipeFaskes} onValueChange={(value) => handleInputChange('tipeFaskes', value)} required>
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
              <Select value={formData.provinsi} onValueChange={(value) => handleInputChange('provinsi', value)} required>
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
                onValueChange={(value) => handleInputChange('kota', value)} 
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
          </div>

          {/* Keterangan Bukan Leads - Full Width Conditional */}
          {showBukanLeadsFields && (
            <div>
              <Label htmlFor="keteranganBukanLeads">Keterangan Bukan Leads <span className="text-red-500">*</span></Label>
              <Textarea
                id="keteranganBukanLeads"
                value={formData.keteranganBukanLeads}
                onChange={(e) => handleInputChange('keteranganBukanLeads', e.target.value)}
                placeholder="Masukkan keterangan tambahan..."
                className="mt-1"
                required
              />
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Simpan Prospek
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
