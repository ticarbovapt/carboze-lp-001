import { redirect } from "next/navigation";
import { CHECKOUT_JEAN_CARROS } from "@/lib/constants";

export default function CheckoutPack100JeanPage() {
  redirect(CHECKOUT_JEAN_CARROS);
}
