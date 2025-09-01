import { getAllConfessionsForAdmin, signOutAdmin } from '@/lib/actions';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { redirect } from 'next/navigation';
import AdminActions from './_components/admin-actions';
import { format } from 'date-fns';
import { isUserBanned } from '@/lib/db';
import { cookies } from 'next/headers';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export default async function AdminPage() {
  const cookieStore = cookies();
  const isAdmin = cookieStore.get('admin-auth')?.value === 'true';

  if (!isAdmin) {
    redirect('/admin/login');
  }

  const confessions = await getAllConfessionsForAdmin();

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'approved':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'rejected':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-center md:text-left">Admin Dashboard</h1>
        <form action={signOutAdmin}>
          <Button variant="outline" size="sm">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </form>
      </div>

      <div className="flex flex-col gap-6">
        {confessions.length > 0 ? (
          confessions.map(async (confession) => {
            const banned = await isUserBanned(confession.anonHash);
            return (
              <Card key={confession.id}>
                <CardHeader>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                    <div className='flex-1'>
                      <CardTitle className="text-lg mb-1 flex items-center gap-2 flex-wrap">
                        <span>Confession #{confession.id.substring(0, 6)}</span>
                        {banned && <Badge variant="destructive">Banned</Badge>}
                      </CardTitle>
                      <CardDescription>
                        {format(new Date(confession.timestamp), 'PPP p')}
                      </CardDescription>
                    </div>
                    <Badge variant={getStatusVariant(confession.status)} className="self-start md:self-center">
                      {confession.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="font-code text-base">{confession.text}</p>
                  <div className="text-sm text-muted-foreground mt-4 pt-4 border-t flex flex-wrap gap-4">
                    <span>Likes: {confession.likes}</span>
                    <span>Dislikes: {confession.dislikes}</span>
                    <span>Comments: {confession.comments.length}</span>
                  </div>
                  <AdminActions
                    confessionId={confession.id}
                    anonHash={confession.anonHash}
                  />
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="text-center text-muted-foreground py-12">
            <p>No confessions to review.</p>
          </div>
        )}
      </div>
    </div>
  );
}
