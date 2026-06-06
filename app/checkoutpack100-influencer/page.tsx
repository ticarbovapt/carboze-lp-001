import { redirect } from "next/navigation";
import { CHECKOUT_INFLUENCER_CARROS } from "@/lib/constants";

export default function CheckoutPack100InfluencerPage() {
  redirect(CHECKOUT_INFLUENCER_CARROS);
}
