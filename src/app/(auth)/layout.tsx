import { SystemLogo } from "@/components/system-logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col justify-center min-h-screen">
      <SystemLogo />

      {children}
    </div>
  )
}