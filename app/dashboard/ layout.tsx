import Sidebar from "../components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#0b0b0b] text-white">
      <Sidebar />
      <main className="flex-1 bg-amber-700 overflow-y-auto">{children}</main>
    </div>
  );
}
