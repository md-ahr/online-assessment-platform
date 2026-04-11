export default function DashboardLoading() {
  return (
    <section className="container-wrapper min-h-[calc(100vh-161px)] py-8 pb-12 dark:bg-background">
      <div className="flex flex-col gap-4">
        <div className="h-10 w-48 animate-pulse rounded-lg bg-muted" />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {Array.from({ length: 4 }, (_, index) => (
            <div
              key={`dashboard-skeleton-${index + 1}`}
              className="h-52 animate-pulse rounded-2xl bg-muted"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
