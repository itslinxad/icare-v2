import type { Metadata } from "next";
import ClientFacultyLayout from "./layout-client";

export const metadata: Metadata = {
  title: "Faculty | iCARE++",
};

export default function FacultyLayout({ children }: { children: React.ReactNode }) {
  return <ClientFacultyLayout>{children}</ClientFacultyLayout>;
}