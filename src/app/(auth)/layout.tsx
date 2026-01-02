import { SystemLogo } from "@/components/system-logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col justify-center min-h-screen">
      <div className="md:mb-8 mb-4 flex items-center justify-center">
        <SystemLogo />
      </div>

      {children}
    </div>
  )
}