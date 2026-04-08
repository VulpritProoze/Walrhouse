import { Plus, Edit, MoreVertical, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { WarehouseFormDialog } from './WarehouseFormDialog';
import React from 'react';

export function WarehouseView() {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<{
    id: string;
    code: string;
    name: string;
    location?: string;
  } | null>(null);
  const warehouses = [
    {
      id: '1',
      name: 'Main Distribution Center',
      code: 'W-MAIN',
      location: 'Section A',
      status: 'Active',
    },
    { id: '2', name: 'South Branch', code: 'W-SOUTH', location: 'Section B', status: 'Active' },
    {
      id: '3',
      name: 'Overflow Storage',
      code: 'W-OVER',
      location: 'Remote',
      status: 'Maintenance',
    },
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Controlled edit dialog rendered at top-level so menu can open it */}
      {selected && (
        <WarehouseFormDialog
          initial={selected}
          open={dialogOpen}
          onOpenChange={(v) => setDialogOpen(v)}
          onSave={(updated) => {
            // TODO: call API or update local state
            console.log('saved', updated);
            setDialogOpen(false);
            setSelected(null);
          }}
        />
      )}
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-lg font-medium">Warehouses</h4>
          <p className="text-sm text-muted-foreground">Manage physical storage facilities.</p>
        </div>
        <WarehouseFormDialog
          initial={{ id: '', code: '', name: '', location: '' }}
          trigger={
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Warehouse
            </Button>
          }
          onSave={(created) => {
            // TODO: call create API and refresh list
            console.log('created', created);
          }}
        />
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {warehouses.map((w) => (
              <TableRow key={w.id} className="hover:bg-muted/10 group cursor-default">
                <TableCell className="font-mono font-bold text-xs">{w.code}</TableCell>
                <TableCell>{w.name}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{w.location}</TableCell>
                <TableCell>
                  <Badge
                    variant={w.status === 'Active' ? 'success' : 'outline'}
                    className="text-[10px] font-bold uppercase"
                  >
                    {w.status}
                  </Badge>
                </TableCell>
                <TableCell className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      }
                    />
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="gap-2"
                        onClick={() => {
                          setSelected({
                            id: w.id,
                            code: w.code,
                            name: w.name,
                            location: w.location,
                          });
                          setDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 text-destructive">
                        <Trash2 className="h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
