import { Shield, Calendar, Monitor, LogIn, LogOut } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const placeholderAccessLog = [
  {
    id: 1,
    action: 'Login',
    device: 'Desktop — Chrome',
    ip: '192.168.1.42',
    date: '2026-03-19 08:01',
  },
  {
    id: 2,
    action: 'Scan session started',
    device: 'Handheld — Scanner App',
    ip: '192.168.1.55',
    date: '2026-03-19 08:05',
  },
  {
    id: 3,
    action: 'Settings changed',
    device: 'Desktop — Chrome',
    ip: '192.168.1.42',
    date: '2026-03-18 16:30',
  },
  { id: 4, action: 'Login', device: 'Mobile — Safari', ip: '10.0.0.12', date: '2026-03-18 07:55' },
  {
    id: 5,
    action: 'Logout',
    device: 'Desktop — Chrome',
    ip: '192.168.1.42',
    date: '2026-03-17 17:00',
  },
];

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
              {placeholderAccessLog.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="text-sm">
                    <span className="flex items-center gap-1.5 font-medium">
                      {entry.action.includes('Login') ? (
                        <LogIn className="h-3.5 w-3.5 text-emerald-500" />
                      ) : entry.action.includes('Logout') ? (
                        <LogOut className="h-3.5 w-3.5 text-muted-foreground" />
                      ) : (
                        <Shield className="h-3.5 w-3.5 text-blue-500" />
                      )}
                      {entry.action}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">{entry.device}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {entry.ip}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">{entry.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
