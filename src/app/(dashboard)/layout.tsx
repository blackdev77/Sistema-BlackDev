import { Shell } from "@/components/layout/Shell";
import { auth } from "@/auth";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return <Shell session={session}>{children}</Shell>;
}
