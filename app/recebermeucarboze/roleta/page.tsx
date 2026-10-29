import type { Metadata } from "next";
import RoletaClient from "./RoletaClient";

export const metadata: Metadata = {
  title: "Roleta — Ação Parada Certa",
  robots: { index: false, follow: false },
};

export default function RoletaPage() {
  return <RoletaClient />;
}
