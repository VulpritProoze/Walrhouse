import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Package, Calendar, ExternalLink, Loader2 } from 'lucide-react';
import { useVerificationHistories } from '@/features/verification/hooks/queries/use-verification';

export default function RecentScans() {
  const navigate = useNavigate();
  const { data, isLoading } = useVerificationHistories({
    pageNumber: 1,
    pageSize: 5,
  });

  const scans = data?.items ?? [];

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="text-lg">Recent Verifications</CardTitle>
        <CardDescription>Your latest batch verifications at a glance.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="text-xs font-medium uppercase tracking-wider">
                  Reference ID
                </TableHead>
                <TableHead className="text-xs font-medium uppercase tracking-wider">
                  <span className="flex items-center gap-1">
                    <Package className="h-3 w-3" /> Batch Number
                  </span>
                </TableHead>
                <TableHead className="text-xs font-medium uppercase tracking-wider">
                  Remarks
                </TableHead>
                <TableHead className="text-xs font-medium uppercase tracking-wider">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Scan Date
                  </span>
                </TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Loading verifications...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : scans.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                    No recent verifications found.
                  </TableCell>
                </TableRow>
              ) : (
                scans.map((scan) => (
                  <TableRow key={scan.id}>
                    <TableCell className="font-mono text-xs font-medium">#{scan.id}</TableCell>
                    <TableCell className="text-sm font-medium">
                      {scan.batchNumberVerified}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm truncate max-w-[200px]">
                      {scan.remarks || '---'}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {new Date(scan.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => navigate(`/history`)}
                      >
                        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="sr-only">View scan detail</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
