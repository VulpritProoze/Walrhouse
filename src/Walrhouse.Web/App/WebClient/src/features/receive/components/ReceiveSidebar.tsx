import { PackageOpen, Layers, Settings2, FileDown } from 'lucide-react';
import { Sidebar, type SidebarMenuItem } from '@/components/common/Sidebar';

export type ReceiveFeature = 'receiving' | 'batches' | 'settings' | 'incoming-orders';

interface ReceiveSidebarProps {
  activeFeature: ReceiveFeature;
  onSelect: (feature: ReceiveFeature) => void;
  collapsed?: boolean;
  onToggle?: () => void;
}

export const ReceiveSidebar = ({
  activeFeature,
  onSelect,
  collapsed = false,
  onToggle,
}: ReceiveSidebarProps) => {
  const menuItems: SidebarMenuItem<ReceiveFeature>[] = [
    {
      id: 'receiving-group',
      label: 'Receiving',
      icon: PackageOpen,
      features: ['receiving', 'incoming-orders'],
      subItems: [
        { id: 'receiving', label: 'Worklist', icon: PackageOpen },
        { id: 'incoming-orders', label: 'Incoming Orders', icon: FileDown },
      ],
    },
    { id: 'batches', label: 'Batch Master List', icon: Layers, features: ['batches'] },
    { id: 'settings', label: 'Settings', icon: Settings2, features: ['settings'] },
  ];

  return (
    <Sidebar
      title="Receiving"
      activeFeature={activeFeature}
      menuItems={menuItems}
      onSelect={onSelect}
      collapsed={collapsed}
      onToggle={onToggle}
    />
  );
};
