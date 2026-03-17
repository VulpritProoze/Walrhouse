import { Button } from '@/components/ui/button';

function App() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-6 px-6 py-16">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Walrhouse Web Client</p>
        <h1 className="text-3xl font-semibold tracking-tight">Frontend stack is ready</h1>
        <p className="text-muted-foreground">
          React Query, Axios, Zod, Tailwind v4, and shadcn are now configured.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button>Primary action</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
      </div>

      <div className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">
        Use <code className="font-mono">src/lib/axios.ts</code> for API calls and
        <code className="ml-1 font-mono">src/lib/schemas/item.schema.ts</code> for runtime
        validation.
      </div>
    </main>
  );
}

export default App;
