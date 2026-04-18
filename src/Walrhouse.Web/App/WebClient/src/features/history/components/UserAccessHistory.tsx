import { Shield, Calendar, Monitor, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
} from '@/components/ui/empty';

export default function UserAccessHistory() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Shield className="h-5 w-5 text-primary" />
          User Access History
        </CardTitle>
        <CardDescription>Login sessions and account activity.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="text-xs font-medium uppercase tracking-wider">
                  Action
                </TableHead>
                <TableHead className="text-xs font-medium uppercase tracking-wider">
                  <span className="flex items-center gap-1">
                    <Monitor className="h-3 w-3" /> Device
                  </span>
                </TableHead>
                <TableHead className="text-xs font-medium uppercase tracking-wider">
                  IP Address
                </TableHead>
                <TableHead className="w-[180px] text-xs font-medium uppercase tracking-wider">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Date
                  </span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={4} className="h-48 p-0">
                  <Empty className="border-none">
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <Info className="size-4" />
                      </EmptyMedia>
                      <EmptyTitle>Feature coming soon</EmptyTitle>
                      <EmptyDescription>
                        We're currently working on the Access History feature. This module will
                        allow you to track login sessions and account activity in real-time.
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
