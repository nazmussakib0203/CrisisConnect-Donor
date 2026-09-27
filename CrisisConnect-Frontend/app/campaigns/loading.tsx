import Header from "@/components/Header";

export default function Loading() {
return (
<> <Header title="Campaigns" />

```
  <main className="mx-auto max-w-6xl px-6 py-10">
    <div className="rounded-lg border border-border bg-card p-8 text-center shadow-md">
      <h1 className="mb-3 text-3xl font-bold">
        Campaigns
      </h1>

      <p className="text-muted-foreground">
        Loading campaigns...
      </p>
    </div>
  </main>
</>

);
}
