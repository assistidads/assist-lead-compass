
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LayananFormFieldsProps {
  formData: any;
  setFormData: (data: any) => void;
}

export function LayananFormFields({ formData, setFormData }: LayananFormFieldsProps) {
  return (
    <div>
      <Label htmlFor="nama">Layanan</Label>
      <Input
        id="nama"
        value={formData?.nama || ''}
        onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
        required
      />
    </div>
  );
}
