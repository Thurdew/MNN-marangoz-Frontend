'use client';

import { usePathname } from "next/navigation";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { AuthProvider } from "./contexts/AuthContext";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Admin sayfalarında navbar ve footer gösterme
  const isAdminPage = pathname?.startsWith('/admin');

  return (
    <AuthProvider>
      {!isAdminPage && <Navbar />}
      {children}
      {!isAdminPage && <Footer />}
    </AuthProvider>
  );
}
