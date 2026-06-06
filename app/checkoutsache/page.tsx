import { redirect } from "next/navigation";
import { CHECKOUT_MOTOS } from "@/lib/constants";

export default function CheckoutSachePage() {
  redirect(CHECKOUT_MOTOS);
}
