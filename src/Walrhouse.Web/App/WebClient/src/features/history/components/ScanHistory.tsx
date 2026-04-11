import { useState } from 'react';
import { History, Package, Calendar, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ScanDetailsDialog } from './ScanDetailsDialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useVerificationHistories } from '@/features/verification/hooks/queries/use-verification';
import { Spinner } from '@/components/ui/spinner';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { type VerificationHistoryDto } from '../types';

export default function ScanHistory() {
  const [selectedScan, setSelectedScan] = useState<VerificationHistoryDto | null>(null);
  const { data: histories, isLoading, isError } = useVerificationHistories();

  if (isLoading) {
    return (
      <Card className="w-full h-96 flex items-center justify-center">
        <Spinner className="size-8" />
      </Card>
    );
  }

  if (isError || !histories?.items?.length) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <History className="h-5 w-5 text-primary" />
            Scan History
          </CardTitle>
          <CardDescription>Items you have scanned and verified in the warehouse.</CardDescription>
        </CardHeader>
        <CardContent>
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <History className="size-5" />
              </EmptyMedia>
              <EmptyTitle>No Scan History</EmptyTitle>
              <EmptyDescription>
                You haven't scanned any items yet. Start verifying items to see them here.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </CardContent>
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <History className="h-5 w-5 text-primary" />
            Scan History
          </CardTitle>
          <CardDescription>Items you have scanned and verified in the warehouse.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead className="w-[140px] text-xs font-medium uppercase tracking-wider">
                    <span className="flex items-center gap-1">
                      <Package className="h-3 w-3" /> Batch No
                    </span>
                  </TableHead>
                  <TableHead className="w-[180px] text-xs font-medium uppercase tracking-wider">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> Scan Date
                    </span>
                  </TableHead>
                  <TableHead className="w-[120px] text-xs font-medium uppercase tracking-wider">
                    Verified By
                  </TableHead>
                  <TableHead className="w-[120px] text-xs font-medium uppercase tracking-wider">
                    Remarks
                  </TableHead>
                  <TableHead className="w-[80px] text-xs font-medium uppercase tracking-wider">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {histories.items.map((scan) => {
                  return (
                    <TableRow key={scan.id}>
                      <TableCell className="font-mono text-xs font-medium">
                        {scan.batchNumberVerified}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        {new Date(scan.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        {scan.createdBy}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground truncate max-w-[120px]">
                        {scan.remarks || '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Tooltip>
                          <TooltipTrigger
                            className={cn(
                              buttonVariants({ variant: 'ghost', size: 'icon' }),
                              'h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer',
                            )}
                            onClick={() => setSelectedScan(scan)}
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View Details</span>
                          </TooltipTrigger>
                          <TooltipContent className="pointer-events-none" side="bottom" align="end">
                            <p>View Details</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <ScanDetailsDialog
            scan={selectedScan}
            onOpenChange={(open) => !open && setSelectedScan(null)}
          />
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
