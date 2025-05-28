
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface UserFormFieldsProps {
  formData: any;
  setFormData: (data: any) => void;
  mode: 'add' | 'edit';
}

export function UserFormFields({ formData, setFormData, mode }: UserFormFieldsProps) {
  return (
    <>
      <div>
        <Label htmlFor="full_name">Nama Lengkap</Label>
        <Input
          id="full_name"
          value={formData?.full_name || ''}
          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData?.email || ''}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>
      {mode === 'add' && (
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={formData?.password || ''}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            minLength={6}
            placeholder="Minimal 6 karakter"
          />
        </div>
      )}
      <div>
        <Label htmlFor="role">Role</Label>
        <Select value={formData?.role || ''} onValueChange={(value) => setFormData({ ...formData, role: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="cs_support">CS Support</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
