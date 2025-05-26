
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

const sumberLeads = ['Meta Ads', 'Google Ads', 'TikTok Ads', 'Google', 'Referral', 'Website Organik'];
const kodeAds = ['MA01', 'GA01', 'TA01', 'FB01'];
const statusLeads = ['Prospek', 'Dihubungi', 'Leads', 'Bukan Leads'];
const layananAssist = ['SIMRS', 'Telemedicine', 'EMR', 'Farmasi', 'Laboratory'];
const tipeFaskes = ['Rumah Sakit', 'Klinik', 'Puskesmas', 'Laboratorium', 'Apotek'];
const provinsi = ['DKI Jakarta', 'Jawa Barat', 'Jawa Tengah', 'Jawa Timur', 'Banten'];
const bukanLeads = ['Tidak Tertarik', 'Sudah Ada Vendor', 'Budget Tidak Sesuai', 'Lainnya'];

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

  const showKodeAds = formData.sumberLeads.toLowerCase().includes('ads');
  const showBukanLeadsFields = formData.statusLeads === 'Bukan Leads';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
              <Label htmlFor="tanggalProspek">Tanggal Prospek Masuk</Label>
              <Input
                id="tanggalProspek"
                type="date"
                value={formData.tanggalProspek}
                onChange={(e) => handleInputChange('tanggalProspek', e.target.value)}
                autoComplete="off"
              />
            </div>

            {/* Sumber Leads */}
            <div>
              <Label htmlFor="sumberLeads">Sumber Leads</Label>
              <Select value={formData.sumberLeads} onValueChange={(value) => handleInputChange('sumberLeads', value)}>
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
                <Label htmlFor="kodeAds">Kode Ads</Label>
                <Select value={formData.kodeAds} onValueChange={(value) => handleInputChange('kodeAds', value)}>
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
                <Label htmlFor="idAds">ID Ads</Label>
                <Select value={formData.idAds} onValueChange={(value) => handleInputChange('idAds', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih ID ads" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({length: 21}, (_, i) => (
                      <SelectItem key={i} value={i.toString()}>{i}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Nama Prospek */}
            <div>
              <Label htmlFor="namaProspek">Nama Prospek</Label>
              <Input
                id="namaProspek"
                value={formData.namaProspek}
                onChange={(e) => handleInputChange('namaProspek', e.target.value)}
                placeholder="Masukkan nama prospek"
                autoComplete="off"
              />
            </div>

            {/* No WhatsApp */}
            <div>
              <Label htmlFor="noWhatsApp">No WhatsApp</Label>
              <Input
                id="noWhatsApp"
                value={formData.noWhatsApp}
                onChange={(e) => handleInputChange('noWhatsApp', e.target.value)}
                placeholder="Contoh: 081234567890"
                autoComplete="off"
              />
            </div>

            {/* Status Leads */}
            <div>
              <Label htmlFor="statusLeads">Status Leads</Label>
              <Select value={formData.statusLeads} onValueChange={(value) => handleInputChange('statusLeads', value)}>
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
                <Label htmlFor="bukanLeads">Bukan Leads</Label>
                <Select value={formData.bukanLeads} onValueChange={(value) => handleInputChange('bukanLeads', value)}>
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
              <Label htmlFor="layananAssist">Layanan Assist</Label>
              <Select value={formData.layananAssist} onValueChange={(value) => handleInputChange('layananAssist', value)}>
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
              <Label htmlFor="namaFaskes">Nama Faskes</Label>
              <Input
                id="namaFaskes"
                value={formData.namaFaskes}
                onChange={(e) => handleInputChange('namaFaskes', e.target.value)}
                placeholder="Masukkan nama fasilitas kesehatan"
                autoComplete="off"
              />
            </div>

            {/* Tipe Faskes */}
            <div>
              <Label htmlFor="tipeFaskes">Tipe Faskes</Label>
              <Select value={formData.tipeFaskes} onValueChange={(value) => handleInputChange('tipeFaskes', value)}>
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
              <Label htmlFor="provinsi">Provinsi</Label>
              <Select value={formData.provinsi} onValueChange={(value) => handleInputChange('provinsi', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih provinsi" />
                </SelectTrigger>
                <SelectContent>
                  {provinsi.map(item => (
                    <SelectItem key={item} value={item}>{item}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Kota */}
            <div>
              <Label htmlFor="kota">Kota/Kabupaten</Label>
              <Input
                id="kota"
                value={formData.kota}
                onChange={(e) => handleInputChange('kota', e.target.value)}
                placeholder="Masukkan kota/kabupaten"
                autoComplete="off"
              />
            </div>
          </div>

          {/* Keterangan Bukan Leads - Full Width Conditional */}
          {showBukanLeadsFields && (
            <div>
              <Label htmlFor="keteranganBukanLeads">Keterangan Bukan Leads</Label>
              <Textarea
                id="keteranganBukanLeads"
                value={formData.keteranganBukanLeads}
                onChange={(e) => handleInputChange('keteranganBukanLeads', e.target.value)}
                placeholder="Masukkan keterangan tambahan..."
                className="mt-1"
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
