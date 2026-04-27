import type { Metadata } from "next";
import ClientAdminLayout from "./layout-client";

export const metadata: Metadata = {
  title: "Admin | iCARE++",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <ClientAdminLayout>{children}</ClientAdminLayout>;
}