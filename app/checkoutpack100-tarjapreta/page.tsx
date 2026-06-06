import { redirect } from "next/navigation";
import { CHECKOUT_TARJAPRETA_CARROS } from "@/lib/constants";

export default function CheckoutPack100TarjaPage() {
  redirect(CHECKOUT_TARJAPRETA_CARROS);
}
