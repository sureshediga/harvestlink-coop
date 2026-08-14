import Stripe from "stripe";

import { isRealSecret } from "./env-secret";

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }

  if (!stripeClient) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);
  }

  return stripeClient;
}

export function isStripeConfigured(): boolean {
  return (
    isRealSecret(process.env.STRIPE_SECRET_KEY) &&
    isRealSecret(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  );
}
