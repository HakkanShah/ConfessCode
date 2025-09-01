'use client';
import { Button } from '@/components/ui/button';
import {
  deleteConfession,
  updateConfessionStatus,
  banUser,
} from '@/lib/actions';
import { CheckCircle, XCircle, Trash2, Ban } from 'lucide-react';
import { useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function AdminActions({
  confessionId,
  anonHash,
}: {
  confessionId: string;
  anonHash: string;
}) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleAction = async (
    action: (id: string, ...args: any[]) => Promise<any>,
    id: string,
    ...args: any[]
  ) => {
    startTransition(async () => {
      const result = await action(id, ...args);
      if (result.success) {
        toast({ title: 'Success', description: result.message });
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.message,
        });
      }
    });
  };

  return (
    <div className="flex justify-end flex-wrap gap-2 mt-4 border-t pt-4">
      <Button
        variant="destructive"
        size="sm"
        onClick={() => handleAction(deleteConfession, confessionId)}
        disabled={isPending}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Delete
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => handleAction(banUser, anonHash)}
        disabled={isPending}
      >
        <Ban className="mr-2 h-4 w-4" />
        Ban User
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          handleAction(updateConfessionStatus, confessionId, 'rejected')
        }
        disabled={isPending}
      >
        <XCircle className="mr-2 h-4 w-4" />
        Reject
      </Button>
      <Button
        size="sm"
        onClick={() =>
          handleAction(updateConfessionStatus, confessionId, 'approved')
        }
        disabled={isPending}
      >
        <CheckCircle className="mr-2 h-4 w-4" />
        Approve
      </Button>
    </div>
  );
}
