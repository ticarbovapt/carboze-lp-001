import { redirect } from "next/navigation";
import { CHECKOUT_DIONISIO_CARROS } from "@/lib/constants";

export default function CheckoutPack100DionisioPage() {
  redirect(CHECKOUT_DIONISIO_CARROS);
}
