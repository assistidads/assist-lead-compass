
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface BukanLeadsFormFieldsProps {
  formData: any;
  setFormData: (data: any) => void;
}

export function BukanLeadsFormFields({ formData, setFormData }: BukanLeadsFormFieldsProps) {
  return (
    <div>
      <Label htmlFor="alasan">Alasan Bukan Leads</Label>
      <Input
        id="alasan"
        value={formData?.alasan || ''}
        onChange={(e) => setFormData({ ...formData, alasan: e.target.value })}
        required
      />
    </div>
  );
}
