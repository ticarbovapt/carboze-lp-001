import { redirect } from "next/navigation";
import { CHECKOUT_CARPOWER_CARROS } from "@/lib/constants";

export default function CheckoutPack100CarPowerPage() {
  redirect(CHECKOUT_CARPOWER_CARROS);
}
