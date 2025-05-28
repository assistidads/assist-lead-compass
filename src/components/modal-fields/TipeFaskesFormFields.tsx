
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TipeFaskesFormFieldsProps {
  formData: any;
  setFormData: (data: any) => void;
}

export function TipeFaskesFormFields({ formData, setFormData }: TipeFaskesFormFieldsProps) {
  return (
    <div>
      <Label htmlFor="nama">Tipe Faskes</Label>
      <Input
        id="nama"
        value={formData?.nama || ''}
        onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
        required
      />
    </div>
  );
}
