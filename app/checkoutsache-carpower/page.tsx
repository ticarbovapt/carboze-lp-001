import { redirect } from "next/navigation";
import { CHECKOUT_CARPOWER_MOTOS } from "@/lib/constants";

export default function CheckoutSacheCarPowerPage() {
  redirect(CHECKOUT_CARPOWER_MOTOS);
}
