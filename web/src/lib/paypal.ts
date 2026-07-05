import type { ApplicationKind } from "./applications";
import { INVESTOR, MEMBERSHIP } from "./constants";
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
      captures?: Array<{ id: string }>;
    };
  }>;
};

function getPayPalBaseUrl(): string {
  return process.env.PAYPAL_MODE === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";
}

export function isPayPalConfigured(): boolean {
  return Boolean(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET);
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
            name: "HarvestLink Cooperative Membership",
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
            name: `HarvestLink Investment (${investmentUnits} units)`,
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
        brand_name: "HarvestLink Cooperative",
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

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("PayPal capture failed:", errorBody);
    throw new Error("Unable to capture PayPal payment");
  }

  const order = (await response.json()) as PayPalOrderResponse;
  const pendingId = order.purchase_units?.[0]?.custom_id;
  const captureId = order.purchase_units?.[0]?.payments?.captures?.[0]?.id;

  if (!pendingId || !captureId || order.status !== "COMPLETED") {
    throw new Error("PayPal payment was not completed");
  }

  return { pendingId, captureId };
}
