import type { Metadata } from "next";
import NpsForm from "./NpsForm";

export const metadata: Metadata = {
  title: "Avalie o CarboZé",
  description: "Conte como foi sua experiência com o CarboZé.",
  alternates: { canonical: "/nps" },
  robots: { index: false, follow: false },
};

export default function NpsPage() {
  return <NpsForm />;
}
