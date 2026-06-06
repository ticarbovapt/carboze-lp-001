import { redirect } from "next/navigation";
import { CHECKOUT_MOTOS } from "@/lib/constants";

export default function CheckoutSacheJeanPage() {
  redirect(CHECKOUT_MOTOS + "?utm_source=jean");
}
