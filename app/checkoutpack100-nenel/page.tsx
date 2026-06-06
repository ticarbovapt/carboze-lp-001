import { redirect } from "next/navigation";
import { CHECKOUT_NENEL_CARROS } from "@/lib/constants";

export default function CheckoutPack100NenelPage() {
  redirect(CHECKOUT_NENEL_CARROS);
}
