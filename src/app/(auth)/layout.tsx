import { SystemLogo } from "@/components/system-logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen h-screen bg-gray-100 flex flex-col overflow-hidden">
      <nav className="bg-white border-b border-gray-200 w-full z-50 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between gap-4 py-4">
            <SystemLogo />
            <h2 className="md:text-3xl text-2xl font-bold font-protest-strike text-primary">
              METRA
            </h2>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center w-full px-4">
        <div className="w-full max-w-2xl">
          {children}
        </div>
      </div>
    </main>
  )
}