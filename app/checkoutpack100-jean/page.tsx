import { redirect } from "next/navigation";
import { CHECKOUT_CARROS } from "@/lib/constants";

export default function CheckoutPack100JeanPage() {
  redirect(CHECKOUT_CARROS + "?utm_source=jean");
}
