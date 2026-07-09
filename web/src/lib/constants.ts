export const SITE = {
  name: "HarvestLink",
  legalName: "HarvestLink Cooperative",
  tagline: "Member-Owned · Farmer-Connected · Middlemen-Free",
  description:
    "A member-owned consumer cooperative linking Indian diaspora households in the U.S. directly with farmer-owned organisations in India — disintermediated farm-to-consumer supply for pure products at better pricing.",
  contactEmail: "hello@harvestlink.coop",
  preparedBy: "Centre for Sustainable Agriculture, Hyderabad",
  documentVersion: "Draft 1.0 — May 2026",
  membershipFee: 100,
  investmentUnit: 100,
  minimumVotingInvestment: 1000,
} as const;

export const FRAMING_NOTE =
  "This is not a charity model, a remittance scheme, or a cultural nostalgia project. It is a structural market intervention: a member-governed institution on the demand side matched with democratically governed institutions on the supply side.";

export const MEMBERSHIP = {
  joiningFee: 100,
  monthlyPurchaseCommitment: 25,
  title: "Membership",
  summary:
    "Become a member-owner with a USD 100 one-time joining fee and access to pure groceries sourced directly from farmer-owned organisations — better returns to farmers and better pricing for members through a middlemen-free supply chain.",
  benefits: [
    "USD 100 one-time joining fee — member-owned cooperative",
    "Access to pure products at better pricing",
    "Member fulfillment through cooperative retail stores (Costco model)",
    "Local WhatsApp groups coordinate group delivery at one location on scheduled dates",
    "Disintermediated farm-to-consumer supply chain",
    "Regional food baskets — Telangana, Tamil, North Indian, and more",
    "Membership in a community institution — not just a grocery customer",
  ],
  obligations: [
    "USD 100 one-time joining fee",
    "USD 25/month minimum purchase commitment once products are available",
    "Optional: 2 hours/month volunteer work",
  ],
  governance: [
    "USD 1,000+ invested members receive voting rights — one member, one vote",
    "Dividends proportional to capital investment",
    "Board elected by voting members",
    "Annual public reporting of finances",
    "Sourcing principles charter amendable only by 75% member vote",
    "Farmer-owned organisation advisory representation on the cooperative board",
  ],
  scale: "500 member households target for Phase 1 viable procurement volumes",
  chapters:
    "Initial chapters in New Jersey, California, and Texas — with Texas store opening soon",
  legalForm:
    "Ohio domestic cooperative corporation (registered May 2026)",
} as const;

export const INVESTOR = {
  unitAmount: 100,
  minimumVotingAmount: 1000,
  title: "Cooperative Capital Investment",
  summary:
    "Members who invest USD 1,000 or more in cooperative capital receive voting rights and dividends proportional to their investment — one member, one vote among voting members.",
  benefits: [
    "Voting rights for members with USD 1,000+ invested capital",
    "Dividends proportional to your investment amount",
    "Support farmer-owned aggregation and cooperative export readiness",
    "Funds cooperative retail stores and logistics",
    "Transparent, community-driven capital model",
  ],
  details: [
    "Minimum USD 1,000 investment for voting rights",
    "Dividends proportional to capital invested",
    "One member, one vote among members with voting rights",
    "Separate from the USD 100 membership joining fee",
    "Open to cooperative members seeking to deepen their stake",
    "Patron capital supports Phase 1 shipments and farmer-owned partnerships",
  ],
  note:
    "The USD 100 membership joining fee is required for all members. Capital investment of USD 1,000 or more is optional and grants voting rights. Contact us to discuss investment.",
} as const;

export const SUPPLY_CHAIN = {
  summary:
    "We prefer farmer-owned organisations and similar mission-oriented entrepreneurs — cooperative structures like Farmveda — over commodity middlemen. Farmer-owned organisations collect from member farmers, process, and assure pure quality.",
  farmerReturns:
    "Disintermediated supply chain with better returns to farmers and pure products at better pricing for members.",
} as const;

export { MANUAL_PAYMENT } from "./manual-payment";

export const NAV_LINKS = [
  { href: "/how-it-works", label: "How It Works" },
  { href: "/farmers", label: "FPO Partners" },
  { href: "/membership", label: "Membership" },
  { href: "/texas", label: "Texas" },
  { href: "/faq", label: "FAQ" },
] as const;

export const PILLARS = [
  {
    title: "Member-Owned",
    icon: "🤝",
    description:
      "USD 100 one-time joining fee. Member-owned cooperative. Members investing USD 1,000 or more receive voting rights — one member, one vote.",
  },
  {
    title: "Farmer-Connected",
    icon: "🌱",
    description:
      "Direct from farmer-owned organisations and mission-oriented entrepreneurs — preferring cooperative structures over commodity middlemen.",
  },
  {
    title: "Middlemen-Free",
    icon: "↔️",
    description:
      "Disintermediated farm-to-consumer supply chain — better returns to farmers and pure products at better pricing for members.",
  },
] as const;

export const LOGISTICS_STAGES = [
  {
    stage: 1,
    title: "Farmer-Owned Aggregation (India)",
    description:
      "Farmer-owned organisations collect from member farmers, process, and pack for export.",
  },
  {
    stage: 2,
    title: "Export Consolidation (India)",
    description:
      "Licensed Export Management Organisation consolidates shipments, obtains certificates, and arranges sea freight.",
  },
  {
    stage: 3,
    title: "US Import & Warehousing",
    description:
      "FDA-registered import broker clears customs and warehouses at regional hubs.",
  },
  {
    stage: 4,
    title: "Member Fulfillment",
    description:
      "Membership retail stores (Costco model). Local WhatsApp groups coordinate group delivery at one location on scheduled dates.",
  },
] as const;

export const FPO_CRITERIA = [
  "Registered FPC under Companies Act",
  "Institutional bank account, GST registration, and IEC (Import Export Code)",
] as const;

export const MEMBER_VALUE_PROPS = [
  {
    title: "Pure products",
    text: "Farmer-owned organisations collect, process, and assure quality through direct aggregation.",
  },
  {
    title: "Direct sourcing",
    text: "Focus on products from farmer-owned organisations and similar mission-oriented entrepreneurs.",
  },
  {
    title: "Cultural authenticity",
    text: "Region-specific varieties — Telugu groundnut oil, Tamil kavuni rice, Gujarati bajra, and more.",
  },
  {
    title: "Price advantage",
    text: "Target minimum 15% below comparable retail.",
  },
  {
    title: "Identity & meaning",
    text: "Governance rights, accountability, and connection to the farms that feed your family.",
  },
] as const;

export const PRODUCT_LINES = [
  {
    name: "Cold-pressed groundnut oil",
    region: "Telangana / Andhra Pradesh",
    price: "$12–18 per litre",
    note: "Chemical-free, wood-pressed",
  },
  {
    name: "Native millets",
    region: "Karnataka / Telangana / MP",
    price: "$4–8 per kg",
    note: "Traditional varieties, no synthetic inputs",
  },
  {
    name: "GI-tagged spices",
    region: "AP / Karnataka",
    price: "$15–30 per kg",
    note: "GI certified",
  },
  {
    name: "Wild forest honey",
    region: "Odisha / Chhattisgarh tribal FPOs",
    price: "$20–35 per kg",
    note: "Single-origin",
  },
  {
    name: "Turmeric (Lakadong / native)",
    region: "Meghalaya / Telangana",
    price: "$8–15 per kg",
    note: "High curcumin, native varieties",
  },
  {
    name: "Traditional rice varieties",
    region: "Tamil Nadu / Telangana",
    price: "$5–10 per kg",
    note: "Sona Masuri, Mappillai Samba — region-specific",
  },
] as const;

export const FARMER_PARTNERS = [
  {
    name: "Telangana Spice & Oil Collective",
    region: "Telangana, India",
    crops: "Groundnut oil, turmeric, native spices",
    story:
      "FPO partner candidate for cold-pressed groundnut oil and GI-tagged spices with export-ready documentation.",
  },
  {
    name: "Konkan & Western Ghats FPO Network",
    region: "Maharashtra / Karnataka, India",
    crops: "Millets, forest honey, Coorg pepper",
    story:
      "Institutional partners for native millets and single-origin honey from tribal FPO networks.",
  },
  {
    name: "Southern Rice & Pulse Alliance",
    region: "Tamil Nadu / Andhra Pradesh, India",
    crops: "Traditional rice, lentils, pulses",
    story:
      "FPOs aggregating region-specific rice varieties and pulses for diaspora regional baskets.",
  },
] as const;

export const GOVERNANCE_SAFEGUARDS = [
  "Farmer-owned organisation advisory board seats for partner institution representatives",
  "Sourcing principles in articles — farmer-owned procurement, fair price floors, quality standards",
  "75% member vote required to amend sourcing principles",
  "Annual public financial reporting",
  "Conflict of interest policy for board members in food import/export",
  "Multi-year supply agreements (3–5 year rolling contracts) with farmer-owned partners",
] as const;

export const ROADMAP = [
  {
    phase: "Phase 1 — Foundation",
    timeline: "Months 1–18",
    items: [
      "Incorporate cooperative and recruit 100 charter members",
      "Identify 5–8 FPO partners across 3–4 Indian states",
      "First pilot shipment to member chapters",
      "Target 500 active member households",
    ],
  },
  {
    phase: "Phase 2 — Scale",
    timeline: "Months 18–42",
    items: [
      "Expand to California and Texas chapters — 2,000+ members",
      "20+ FPO partners across 8+ states",
      "Deepen product range: pulses, herbs, regional condiments",
    ],
  },
  {
    phase: "Phase 3 — Institutionalise",
    timeline: "Year 4+",
    items: [
      "Financial self-sustainability at USD 3M+ annual revenue",
      "Cooperative Development Fund (2% of revenue) for FPO export readiness",
      "Explore physical cooperative stores in high-density diaspora areas",
    ],
  },
] as const;

export const FAQ_ITEMS = [
  {
    question: "What is HarvestLink Cooperative?",
    answer:
      "HarvestLink is a member-owned consumer cooperative registered in Ohio, linking Indian diaspora households in the U.S. directly with Farmer Producer Organizations in India. We source safe, culturally authentic food without commodity middlemen.",
  },
  {
    question: "What does membership cost and include?",
    answer:
      "Membership requires a USD 100 one-time joining fee and a USD 25/month minimum purchase commitment once products are available. You become a member-owner with access to pure products, cooperative retail fulfillment (Costco model), and local WhatsApp group delivery. Voting rights require a separate minimum USD 1,000 capital investment.",
  },
  {
    question: "What is the difference between membership and investment?",
    answer:
      "Membership is USD 100 one-time online — it gives you access to member pricing, products, and fulfillment. Investment of USD 1,000 or more is separate patron capital that grants voting rights and dividends proportional to your investment. For investment opportunities, please call 614-961-9552.",
  },
  {
    question: "How does the farmer-owned supply chain work?",
    answer:
      "We source from farmer-owned organisations and mission-oriented entrepreneurs — preferring cooperative structures over commodity middlemen. These organisations collect from member farmers, process, and assure pure quality. The result is a disintermediated farm-to-consumer supply chain with better returns to farmers and better pricing for members.",
  },
  {
    question: "When will the Texas store open?",
    answer:
      "Shipments from India are in transit. We expect to open our first Texas chapter within the next three months, alongside expansion in New Jersey and California.",
  },
  {
    question: "How do I pay?",
    answer:
      "Pay by Zelle to 614-961-9552. Submit your application online to receive a reference number — include it in the Zelle memo. Membership is activated within 1–2 business days after payment is received.",
  },
  {
    question: "How does voting work?",
    answer:
      "Members who invest USD 1,000 or more in cooperative capital receive voting rights — one member, one vote among voting members. Dividends are proportional to capital invested. The USD 100 membership fee alone does not confer voting rights.",
  },
  {
    question: "Can I invest without being a member?",
    answer:
      "Membership is required. The USD 100 joining fee makes you a member; USD 1,000 or more in patron capital grants voting rights and proportional dividends. Call 614-961-9552 to discuss investment.",
  },
] as const;

export const MEMBERSHIP_TERMS = `By joining HarvestLink Cooperative, I acknowledge the USD 100 one-time joining fee and USD 25/month minimum purchase commitment once products are available. I understand that the USD 100 membership fee grants member access and benefits but does not confer voting rights — voting rights require a minimum USD 1,000 cooperative capital investment (one member, one vote among voting members). I am applying for membership — not an investment contract. I agree to the cooperative principles of member ownership, farmer-connected sourcing, and community ownership.`;

export const INVESTMENT_TERMS = `By investing in HarvestLink Cooperative, I acknowledge this is patron capital of USD 1,000 or more, separate from my USD 100 membership fee. I understand that USD 1,000+ investment grants voting rights (one member, one vote among voting members) and that dividends may be proportional to my investment. I agree to the cooperative investment terms and confirm I am or will become a cooperative member. Investment carries cooperative business risk.`;
