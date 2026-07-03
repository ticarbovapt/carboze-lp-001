import { redirect } from "next/navigation";
import { CHECKOUT_JEAN_MOTOS } from "@/lib/constants";

export default function CheckoutSacheJeanPage() {
  redirect(CHECKOUT_JEAN_MOTOS);
}
