import { Package, QrCode, ArrowLeftRight, RefreshCcw, History, Scale, List } from 'lucide-react';
import { Sidebar, type SidebarMenuItem } from '@/components/common/Sidebar';

export type InventoryFeature = 'items' | 'uom' | 'barcode' | 'movement' | 'replenishment' | 'audit';

interface InventorySidebarProps {
  activeFeature: InventoryFeature;
  onSelect: (feature: InventoryFeature) => void;
  collapsed?: boolean;
  onToggle?: () => void;
}

export const InventorySidebar = ({
  activeFeature,
  onSelect,
  collapsed = false,
  onToggle,
}: InventorySidebarProps) => {
  const menuItems: SidebarMenuItem<InventoryFeature>[] = [
    {
      id: 'items-group',
      label: 'Items',
      icon: Package,
      features: ['items', 'uom'],
      subItems: [
        { id: 'items', label: 'Items Master List', icon: List },
        { id: 'uom', label: 'Unit of Measures', icon: Scale },
      ],
    },
    { id: 'barcode', label: 'Barcodes', icon: QrCode, features: ['barcode'] },
    { id: 'movement', label: 'Stock Movement', icon: ArrowLeftRight, features: ['movement'] },
    { id: 'replenishment', label: 'Replenishment', icon: RefreshCcw, features: ['replenishment'] },
    { id: 'audit', label: 'Audit & History', icon: History, features: ['audit'] },
  ];

  return (
    <Sidebar
      title="Inventory"
      activeFeature={activeFeature}
      menuItems={menuItems}
      onSelect={onSelect}
      collapsed={collapsed}
      onToggle={onToggle}
    />
  );
};
