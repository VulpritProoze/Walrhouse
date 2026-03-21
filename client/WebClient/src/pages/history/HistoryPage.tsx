import CommonLayout from '@/layouts/CommonLayout';
import { ScanHistory, UserAccessHistory } from '@/features/history';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function HistoryPage() {
  return (
    <CommonLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-2xl font-semibold">History</h2>
          <p className="text-sm text-muted-foreground">Review past scans and account activity.</p>
        </div>

        <Tabs defaultValue="scans" className="w-full">
          <TabsList
            variant="line"
            className="w-full justify-start border-b rounded-none px-0 h-10 gap-4"
          >
            <TabsTrigger value="scans" className="after:bottom-0">
              Scan History
            </TabsTrigger>
            <TabsTrigger value="access" className="after:bottom-0">
              User Access
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="scans">
              <ScanHistory />
            </TabsContent>
            <TabsContent value="access">
              <UserAccessHistory />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </CommonLayout>
  );
}
