import type { Metadata } from "next";
import AdminClient from "./AdminClient";

export const metadata: Metadata = {
  title: "Painel — Receba seu CarboZé",
  robots: { index: false, follow: false },
};

export default function ReceberMeuCarbozeAdminPage() {
  return <AdminClient />;
}
