
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface StatusLeadsFormFieldsProps {
  formData: any;
  setFormData: (data: any) => void;
}

export function StatusLeadsFormFields({ formData, setFormData }: StatusLeadsFormFieldsProps) {
  return (
    <div>
      <Label htmlFor="nama">Status Leads</Label>
      <Input
        id="nama"
        value={formData?.nama || ''}
        onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
        placeholder="Masukkan nama status leads"
        required
      />
    </div>
  );
}
