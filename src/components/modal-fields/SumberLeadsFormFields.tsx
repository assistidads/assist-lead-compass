
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SumberLeadsFormFieldsProps {
  formData: any;
  setFormData: (data: any) => void;
}

export function SumberLeadsFormFields({ formData, setFormData }: SumberLeadsFormFieldsProps) {
  return (
    <div>
      <Label htmlFor="nama">Sumber Leads</Label>
      <Input
        id="nama"
        value={formData?.nama || ''}
        onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
        required
      />
    </div>
  );
}
