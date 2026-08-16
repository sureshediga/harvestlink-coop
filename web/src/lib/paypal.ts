import type { ApplicationKind } from "./applications";
import { INVESTOR, MEMBERSHIP } from "./constants";
import { isRealSecret } from "./env-secret";
import { getSiteUrl } from "./site-url";

type PayPalTokenResponse = {
  access_token: string;
};

type PayPalLink = {
  href: string;
  rel: string;
  method: string;
};

type PayPalOrderResponse = {
  id: string;
  status: string;
  links: PayPalLink[];
  purchase_units?: Array<{
    custom_id?: string;
    payments?: {
      captures?: Array<{ id: string; status?: string }>;
    };
  }>;
};

function getPayPalBaseUrl(): string {
  return process.env.PAYPAL_MODE === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";
}

export function isPayPalConfigured(): boolean {
  return (
    isRealSecret(process.env.PAYPAL_CLIENT_ID) &&
    isRealSecret(process.env.PAYPAL_CLIENT_SECRET)
  );
}

async function getAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("PayPal credentials are not configured");
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const response = await fetch(`${getPayPalBaseUrl()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    throw new Error("Unable to authenticate with PayPal");
  }

  const data = (await response.json()) as PayPalTokenResponse;
  return data.access_token;
}

function formatAmount(cents: number): string {
  return (cents / 100).toFixed(2);
}

export async function createPayPalOrder(input: {
  pendingId: string;
  kind: ApplicationKind;
  investmentUnits: number;
}): Promise<{ orderId: string; approvalUrl: string }> {
  const token = await getAccessToken();
  const siteUrl = getSiteUrl();
  const capturePath =
    input.kind === "investment"
      ? "/api/invest/paypal/capture"
      : "/api/paypal/capture";

  const membershipCents =
    input.kind === "membership" ? MEMBERSHIP.joiningFee * 100 : 0;
  const investmentUnits =
    input.kind === "investment" ? Math.max(input.investmentUnits, 1) : 0;
  const investmentCents = investmentUnits * INVESTOR.unitAmount * 100;
  const totalCents = membershipCents + investmentCents;

  const items =
    input.kind === "membership"
      ? [
          {
            name: "HarvestLinx Cooperative Membership",
            description: "USD 100 joining fee — voting rights from USD 1,000+ investment",
            unit_amount: {
              currency_code: "USD",
              value: formatAmount(membershipCents),
            },
            quantity: "1",
            category: "DIGITAL_GOODS",
          },
        ]
      : [
          {
            name: `HarvestLinx Investment (${investmentUnits} units)`,
            description: "Patron capital — dividends proportional",
            unit_amount: {
              currency_code: "USD",
              value: formatAmount(investmentCents),
            },
            quantity: "1",
            category: "DIGITAL_GOODS",
          },
        ];

  const response = await fetch(`${getPayPalBaseUrl()}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          custom_id: input.pendingId,
          amount: {
            currency_code: "USD",
            value: formatAmount(totalCents),
            breakdown: {
              item_total: {
                currency_code: "USD",
                value: formatAmount(totalCents),
              },
            },
          },
          items,
        },
      ],
      application_context: {
        brand_name: "HarvestLinx Cooperative",
        landing_page: "NO_PREFERENCE",
        user_action: "PAY_NOW",
        return_url: `${siteUrl}${capturePath}`,
        cancel_url: `${siteUrl}/${input.kind === "investment" ? "invest" : "join"}?cancelled=true`,
      },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("PayPal create order failed:", errorBody);
    throw new Error("Unable to create PayPal order");
  }

  const order = (await response.json()) as PayPalOrderResponse;
  const approvalUrl = order.links.find((link) => link.rel === "approve")?.href;

  if (!approvalUrl) {
    throw new Error("PayPal approval URL was not returned");
  }

  return { orderId: order.id, approvalUrl };
}

function extractCapturedPayment(order: PayPalOrderResponse): {
  pendingId: string;
  captureId: string;
} | null {
  const pendingId = order.purchase_units?.[0]?.custom_id;
  const captures = order.purchase_units?.[0]?.payments?.captures ?? [];
  const completedCapture =
    captures.find((capture) => capture.status === "COMPLETED") ??
    (order.status === "COMPLETED" ? captures[0] : undefined);

  if (!pendingId || !completedCapture?.id) {
    return null;
  }

  return { pendingId, captureId: completedCapture.id };
}

async function getPayPalOrder(
  orderId: string,
  token: string
): Promise<PayPalOrderResponse> {
  const response = await fetch(
    `${getPayPalBaseUrl()}/v2/checkout/orders/${orderId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("PayPal get order failed:", errorBody);
    throw new Error("Unable to load PayPal order");
  }

  return (await response.json()) as PayPalOrderResponse;
}

/**
 * Captures an approved PayPal order. If PayPal already captured the funds
 * (timeout, refresh, double-submit), recovers the capture from the order
 * instead of treating it as a failed / unpaid checkout.
 */
export async function capturePayPalOrder(orderId: string): Promise<{
  pendingId: string;
  captureId: string;
}> {
  const token = await getAccessToken();

  const response = await fetch(
    `${getPayPalBaseUrl()}/v2/checkout/orders/${orderId}/capture`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (response.ok) {
    const order = (await response.json()) as PayPalOrderResponse;
    const captured = extractCapturedPayment(order);
    if (captured) {
      return captured;
    }
    console.error(
      "PayPal capture response OK but payment details incomplete; attempting order recovery:",
      orderId
    );
  } else {
    const errorBody = await response.text();
    console.error("PayPal capture failed:", errorBody);
  }

  // Common after a successful capture whose response never reached us
  // (function timeout, network drop, browser refresh on the return URL),
  // or when the capture response shape is incomplete. Money may already
  // be taken — recover from the order before treating as unpaid.
  try {
    const existing = await getPayPalOrder(orderId, token);
    const recovered = extractCapturedPayment(existing);
    if (recovered) {
      console.warn(
        "PayPal capture recovered from already-completed order:",
        orderId
      );
      return recovered;
    }
  } catch (lookupError) {
    console.error("PayPal order recovery lookup failed:", lookupError);
  }

  throw new Error("Unable to capture PayPal payment");
}
