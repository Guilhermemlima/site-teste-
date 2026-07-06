import { Sidebar } from "@/components/Sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Sidebar />
      <main className="flex-1 px-4 py-6 md:px-10 md:py-10">
        <div className="mx-auto max-w-6xl animate-fadeIn">{children}</div>
      </main>
    </div>
  );
}
