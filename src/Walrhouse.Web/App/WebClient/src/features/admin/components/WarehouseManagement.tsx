/**
 * WarehouseManagement component for the Admin Panel.
 * Handles warehouses, bins, and system-wide settings via a sidebar layout.
 */
import { useState } from 'react';
import {
  LayoutPanelLeft,
  Trash2,
  Edit,
  Plus,
  Settings,
  ShieldCheck,
  Layers,
  MoreVertical,
  Warehouse,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

type ViewMode = 'warehouse' | 'bin' | 'settings';

export default function WarehouseManagement() {
  const [view, setView] = useState<ViewMode>('warehouse');

  return (
    <SidebarProvider>
      <div className="flex gap-6 min-h-[600px] w-full">
        {/* Local Sidebar */}
        <Sidebar
          variant="floating"
          collapsible="none"
          className="static h-auto border-none shadow-sm bg-muted/20 rounded-xl overflow-hidden"
        >
          <SidebarContent>
            <Collapsible defaultOpen className="group/collapsible">
              <SidebarGroup>
                <div className="px-2 mb-2">
                  <CollapsibleTrigger className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground px-2 py-1.5 rounded-md w-full flex items-center justify-between transition-all text-sm font-medium text-sidebar-foreground/70 ring-sidebar-ring outline-hidden focus-visible:ring-2 [&[data-panel-open]>svg:last-child]:rotate-90">
                    <div className="flex items-center gap-2">
                      <LayoutPanelLeft className="h-4 w-4" />
                      Infrastructure
                    </div>
                    <ChevronRight className="h-3 w-3 transition-transform duration-200" />
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenuSub className="ml-0 border-l px-0">
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          isActive={view === 'warehouse'}
                          onClick={() => setView('warehouse')}
                          className="pl-6 border-l-2 border-transparent data-active:border-primary rounded-none"
                        >
                          <Warehouse className="h-4 w-4" />
                          <span>Warehouses</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          isActive={view === 'bin'}
                          onClick={() => setView('bin')}
                          className="pl-6 border-l-2 border-transparent data-active:border-primary rounded-none"
                        >
                          <Layers className="h-4 w-4" />
                          <span>Bins</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>

            <Collapsible defaultOpen className="group/collapsible">
              <SidebarGroup className="mt-2 pt-2 border-t border-sidebar-border/50">
                <div className="px-2 mb-2">
                  <CollapsibleTrigger className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground px-2 py-1.5 rounded-md w-full flex items-center justify-between transition-all text-sm font-medium text-sidebar-foreground/70 ring-sidebar-ring outline-hidden focus-visible:ring-2 [&[data-panel-open]>svg:last-child]:rotate-90">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4" />
                      System
                    </div>
                    <ChevronRight className="h-3 w-3 transition-transform duration-200" />
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenuSub className="ml-0 border-l px-0">
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          isActive={view === 'settings'}
                          onClick={() => setView('settings')}
                          className="pl-6 border-l-2 border-transparent data-active:border-primary rounded-none"
                        >
                          <Settings className="h-4 w-4" />
                          <span>UI Settings</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          </SidebarContent>
        </Sidebar>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {view === 'warehouse' && <WarehouseView />}
          {view === 'bin' && <BinView />}
          {view === 'settings' && <SettingsView />}
        </div>
      </div>
    </SidebarProvider>
  );
}

// SidebarItem removed as it's replaced by SidebarMenuButton

function WarehouseView() {
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
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-lg font-medium">Warehouses</h4>
          <p className="text-sm text-muted-foreground">Manage physical storage facilities.</p>
        </div>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Warehouse
        </Button>
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
                <TableCell>
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
                      <DropdownMenuItem className="gap-2">
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

function BinView() {
  const bins = [
    { id: 'b1', name: 'A-01-01', type: 'Pallet Rack', warehouse: 'W-MAIN', capacity: '1000kg' },
    { id: 'b2', name: 'A-01-02', type: 'Pallet Rack', warehouse: 'W-MAIN', capacity: '1000kg' },
    { id: 'b3', name: 'B-01-01', type: 'Small Parts', warehouse: 'W-MAIN', capacity: '50kg' },
    { id: 'b4', name: 'S-01-01', type: 'Cold Storage', warehouse: 'W-SOUTH', capacity: '500kg' },
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-lg font-medium">Bin Locations</h4>
          <p className="text-sm text-muted-foreground">Manage specific storage slots and racks.</p>
        </div>
        <Button size="sm" className="gap-2" variant="outline">
          <Plus className="h-4 w-4" />
          Add Bins (Bulk)
        </Button>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead>Bin ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Warehouse</TableHead>
              <TableHead>Max Capacity</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bins.map((b) => (
              <TableRow key={b.id} className="hover:bg-muted/10 group cursor-default">
                <TableCell className="font-mono text-sm font-semibold">{b.name}</TableCell>
                <TableCell className="text-sm">{b.type}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{b.warehouse}</TableCell>
                <TableCell className="text-sm">{b.capacity}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

function SettingsView() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h4 className="text-lg font-medium">UI Settings</h4>
        <p className="text-sm text-muted-foreground">Adjust infrastructure display preferences.</p>
      </div>

      <Card className="p-6 border-none shadow-sm space-y-6">
        <div className="space-y-4">
          <h5 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Display Preferences
          </h5>
          <div className="flex items-start space-x-3 pointer-events-none opacity-80">
            <Checkbox id="show-empty" />
            <div className="grid gap-1.5 leading-none">
              <label htmlFor="show-empty" className="text-sm font-medium leading-none">
                Show empty warehouses in main dashboard
              </label>
              <p className="text-xs text-muted-foreground">
                Display facilities even if they currently have 0 stock recorded.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Checkbox id="confirm-move" defaultChecked />
            <div className="grid gap-1.5 leading-none">
              <label htmlFor="confirm-move" className="text-sm font-medium leading-none">
                Require confirmation for bin deactivation
              </label>
              <p className="text-xs text-muted-foreground">
                Adds an extra verification step before marking bins as unavailable.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button variant="outline" className="h-9">
            Restore Defaults
          </Button>
          <Button className="ml-2 h-9 shadow-sm">Save Changes</Button>
        </div>
      </Card>
    </div>
  );
}
