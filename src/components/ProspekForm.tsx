
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useProspekForm } from '@/hooks/useProspekForm';
import { ProspekFormBasicFields } from './ProspekFormBasicFields';
import { ProspekFormStatusFields } from './ProspekFormStatusFields';
import { ProspekFormFaskesFields } from './ProspekFormFaskesFields';

export function ProspekForm() {
  const {
    formData,
    provinces,
    regencies,
    loadingProvinces,
    loadingRegencies,
    handleInputChange,
    validateForm
  } = useProspekForm();

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

  const showBukanLeadsFields = formData.statusLeads === 'Bukan Leads';

  return (
    <Card className="bg-white border border-gray-200">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900">Form Input Prospek</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProspekFormBasicFields 
              formData={formData}
              onInputChange={handleInputChange}
            />
            
            <ProspekFormStatusFields 
              formData={formData}
              onInputChange={handleInputChange}
            />

            <ProspekFormFaskesFields 
              formData={formData}
              onInputChange={handleInputChange}
              provinces={provinces}
              regencies={regencies}
              loadingProvinces={loadingProvinces}
              loadingRegencies={loadingRegencies}
            />
          </div>

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
