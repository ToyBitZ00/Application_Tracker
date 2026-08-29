
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-paper">
      <main className="pb-28">{children}</main>
    </div>
  );
}