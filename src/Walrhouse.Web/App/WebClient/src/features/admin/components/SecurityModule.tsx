import { useState } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table.tsx';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog.tsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge/badge.tsx';
import {
  ShieldCheck,
  ShieldX,
  ShieldAlert,
  Globe,
  Plus,
  Search,
  AlertTriangle,
  Lock,
} from 'lucide-react';
import type { IpRecord } from '../types/admin';

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_IPS: IpRecord[] = [
  {
    ip: '192.168.1.105',
    userId: 'usr-001',
    userName: 'Maria Santos',
    lastSeen: '2026-03-29T09:11:00Z',
    requestCount: 312,
    status: 'allowed',
    country: 'PH',
  },
  {
    ip: '10.0.0.22',
    userId: 'usr-003',
    userName: 'Ana Garcia',
    lastSeen: '2026-03-27T10:55:00Z',
    requestCount: 87,
    status: 'allowed',
    country: 'PH',
  },
  {
    ip: '203.177.92.14',
    lastSeen: '2026-03-28T22:40:00Z',
    requestCount: 1523,
    status: 'flagged',
    country: 'CN',
  },
  {
    ip: '185.220.101.53',
    lastSeen: '2026-03-25T03:10:00Z',
    requestCount: 4422,
    status: 'blocked',
    country: 'DE',
  },
];

const STATUS_VARIANT: Record<IpRecord['status'], 'default' | 'success' | 'warning' | 'destructive'> = {
  allowed: 'success',
  flagged: 'warning',
  blocked: 'destructive',
};

const SECURITY_STATS = [
  { label: 'Active Sessions', value: '14', icon: ShieldCheck, color: 'text-green-500' },
  { label: 'Flagged IPs', value: '3', icon: AlertTriangle, color: 'text-amber-500' },
  { label: 'Blocked IPs', value: '12', icon: ShieldX, color: 'text-red-500' },
  { label: 'Locked Accounts', value: '1', icon: Lock, color: 'text-orange-500' },
];

// ─── Add IP Dialog ────────────────────────────────────────────────────────────
function AddIpDialog({ onAdd }: { onAdd: (r: IpRecord) => void }) {
  const [open, setOpen] = useState(false);
  const [ip, setIp] = useState('');
  const [status, setStatus] = useState<IpRecord['status']>('allowed');

  const handleSubmit = () => {
    if (!ip.trim()) return;
    onAdd({
      ip: ip.trim(),
      lastSeen: new Date().toISOString(),
      requestCount: 0,
      status,
    });
    setOpen(false);
    setIp('');
    setStatus('allowed');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add IP Rule
          </Button>
        }
      />
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Add IP Rule</DialogTitle>
          <DialogDescription>Manually whitelist or block an IP address.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 py-2">
          <div>
            <label className="text-xs font-medium text-foreground/70 mb-1 block">IP Address *</label>
            <Input value={ip} onChange={(e) => setIp(e.target.value)} placeholder="e.g. 192.168.1.1" />
          </div>
          <div>
            <label className="text-xs font-medium text-foreground/70 mb-1.5 block">Status</label>
            <div className="flex gap-2">
              {(['allowed', 'flagged', 'blocked'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors capitalize ${
                    status === s
                      ? 'bg-foreground text-background border-foreground'
                      : 'bg-transparent text-foreground/60 border-border hover:border-foreground/40'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Apply Rule</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function SecurityModule() {
  const [records, setRecords] = useState<IpRecord[]>(MOCK_IPS);
  const [search, setSearch] = useState('');

  const filtered = records.filter(
    (r) =>
      r.ip.includes(search) ||
      r.userName?.toLowerCase().includes(search.toLowerCase()) ||
      (r.country ?? '').toLowerCase().includes(search.toLowerCase()),
  );

  const setStatus = (ip: string, status: IpRecord['status']) => {
    setRecords((prev) => prev.map((r) => (r.ip === ip ? { ...r, status } : r)));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {SECURITY_STATS.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="rounded-lg border bg-card p-4 flex items-center gap-3"
          >
            <div className={`${color} shrink-0`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-semibold leading-none">{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* IP Management */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold flex items-center gap-1.5">
              <Globe className="h-4 w-4 text-muted-foreground" />
              IP Address Management
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Track, whitelist, flag, or block IP addresses.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search IPs, users, countries…"
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <AddIpDialog onAdd={(r) => setRecords((prev) => [r, ...prev])} />
        </div>

        <div className="rounded-lg border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>IP Address</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Requests</TableHead>
                <TableHead>Last Seen</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right pr-4">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-10">
                    No IP records found.
                  </TableCell>
                </TableRow>
              )}
              {filtered.map((rec) => (
                <TableRow key={rec.ip}>
                  <TableCell className="font-mono text-xs">{rec.ip}</TableCell>
                  <TableCell>
                    {rec.country ? (
                      <span className="text-xs font-medium">{rec.country}</span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {rec.userName ? (
                      <div>
                        <p className="text-xs font-medium">{rec.userName}</p>
                        {rec.userId && (
                          <p className="text-[10px] text-muted-foreground font-mono">{rec.userId}</p>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-xs">Unknown</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`text-xs font-medium ${
                        rec.requestCount > 1000 ? 'text-destructive' : ''
                      }`}
                    >
                      {rec.requestCount.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-muted-foreground">
                      {new Date(rec.lastSeen).toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANT[rec.status]} className="capitalize text-[10px]">
                      {rec.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {rec.status !== 'allowed' && (
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          title="Allow"
                          onClick={() => setStatus(rec.ip, 'allowed')}
                        >
                          <ShieldCheck className="h-3.5 w-3.5 text-green-500" />
                        </Button>
                      )}
                      {rec.status !== 'flagged' && (
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          title="Flag"
                          onClick={() => setStatus(rec.ip, 'flagged')}
                        >
                          <ShieldAlert className="h-3.5 w-3.5 text-amber-500" />
                        </Button>
                      )}
                      {rec.status !== 'blocked' && (
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          title="Block"
                          onClick={() => setStatus(rec.ip, 'blocked')}
                        >
                          <ShieldX className="h-3.5 w-3.5 text-destructive" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <p className="text-xs text-muted-foreground">
          {filtered.length} record{filtered.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
}
