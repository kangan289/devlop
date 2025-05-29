import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 bg-background text-foreground">{children}</main>
      <Footer />
    </div>
  );
}
