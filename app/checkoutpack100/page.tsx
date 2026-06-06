import { redirect } from "next/navigation";
import { CHECKOUT_CARROS } from "@/lib/constants";

export default function CheckoutPack100Page() {
  redirect(CHECKOUT_CARROS);
}
