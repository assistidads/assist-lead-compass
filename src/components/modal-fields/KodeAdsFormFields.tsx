
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface KodeAdsFormFieldsProps {
  formData: any;
  setFormData: (data: any) => void;
}

export function KodeAdsFormFields({ formData, setFormData }: KodeAdsFormFieldsProps) {
  return (
    <div>
      <Label htmlFor="kode">Kode Ads</Label>
      <Input
        id="kode"
        value={formData?.kode || ''}
        onChange={(e) => setFormData({ ...formData, kode: e.target.value })}
        required
      />
    </div>
  );
}
