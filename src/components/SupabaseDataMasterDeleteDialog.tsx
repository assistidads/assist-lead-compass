
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface SupabaseDataMasterDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
}

export function SupabaseDataMasterDeleteDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  itemName 
}: SupabaseDataMasterDeleteDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Konfirmasi Hapus</DialogTitle>
          <DialogDescription>
            Apakah Anda yakin ingin menghapus "{itemName}"? Tindakan ini tidak dapat dibatalkan.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button 
            variant="destructive" 
            onClick={onConfirm}
          >
            Hapus
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
