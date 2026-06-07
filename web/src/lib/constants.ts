export const SITE = {
  name: "HarvestLink",
  legalName: "HarvestLink Cooperative",
  tagline: "Member-Owned · Farmer-Connected · Middlemen-Free",
  description:
    "A member-owned consumer cooperative linking Indian diaspora households in the U.S. directly with Farmer Producer Organizations in India for safe, traceable, culturally authentic food.",
  contactEmail: "hello@harvestlink.coop",
  preparedBy: "Centre for Sustainable Agriculture, Hyderabad",
  documentVersion: "Draft 1.0 — May 2026",
  membershipFee: 100,
  investmentUnit: 100,
} as const;

export const FRAMING_NOTE =
  "This is not a charity model, a remittance scheme, or a cultural nostalgia project. It is a structural market intervention: a member-governed institution on the demand side matched with democratically governed institutions on the supply side.";

export const MEMBERSHIP = {
  joiningFee: 100,
  monthlyPurchaseCommitment: 25,
  title: "Consumer Membership",
  summary:
    "Become an owner of the cooperative with democratic governance rights and access to traceable, region-specific groceries sourced directly from FPO partners in India.",
  benefits: [
    "One member household, one vote — democratic governance",
    "Elected board of directors and annual member meeting",
    "Access to residue-tested, traceable FPO-sourced products",
    "Target 15–25% below comparable quality ethnic retail pricing",
    "Regional food baskets — Telangana, Tamil, North Indian, and more",
    "QR traceability: farm, FPO, season, and test results for every lot",
    "Membership in a community institution — not just a grocery customer",
  ],
  obligations: [
    "USD 100 one-time joining fee",
    "USD 25/month minimum purchase commitment once products are available",
    "Optional: 2 hours/month volunteer work for an additional 10% member discount",
  ],
  governance: [
    "One member, one vote",
    "Board elected by members",
    "Annual public reporting of finances and residue test results",
    "Sourcing principles charter amendable only by 75% member vote",
    "FPO advisory representation on the cooperative board",
  ],
  scale: "500 member households target for Phase 1 viable procurement volumes",
  chapters:
    "Initial chapters in New Jersey, California, and Texas — with Texas store opening soon",
  legalForm:
    "Ohio domestic cooperative corporation (registered May 2026)",
} as const;

export const INVESTOR = {
  unitAmount: 100,
  title: "Cooperative Capital Investment",
  summary:
    "Members may invest additional capital in multiples of USD 100 to support cooperative growth. Dividends are proportional to investment — voting rights remain equal for all members.",
  benefits: [
    "Dividends proportional to your investment amount",
    "Support FPO export readiness and cooperative infrastructure",
    "Equal voting rights — investment does not affect one-member-one-vote",
    "Transparent, community-driven capital model",
    "Funds cooperative development including traceability platform and logistics",
  ],
  details: [
    "Minimum investment: USD 100 (1 unit)",
    "Invest in multiples of USD 100 — USD 100, 200, 500, or custom",
    "Open to cooperative members seeking to deepen their stake",
    "Patron capital supports Phase 1 shipments, platform, and FPO partnerships",
    "Phase 3: Cooperative Development Fund (2% of revenue) for new FPO export readiness",
  ],
  note:
    "Investment is optional and separate from membership. You must agree to cooperative investment terms. Membership is required before or alongside investment.",
} as const;

export { MANUAL_PAYMENT } from "./manual-payment";

export const NAV_LINKS = [
  { href: "/how-it-works", label: "How It Works" },
  { href: "/farmers", label: "FPO Partners" },
  { href: "/membership", label: "Membership" },
  { href: "/invest", label: "Invest" },
  { href: "/texas", label: "Texas" },
  { href: "/faq", label: "FAQ" },
] as const;

export const PILLARS = [
  {
    title: "Member-Owned",
    icon: "🤝",
    description:
      "USD 100 joining fee. One member, one vote. Democratic governance with elected board and annual member meeting.",
  },
  {
    title: "FPO-Connected",
    icon: "🌱",
    description:
      "Direct institution-to-institution linkage with registered Farmer Producer Organizations — not individual middlemen.",
  },
  {
    title: "Middlemen-Free",
    icon: "↔️",
    description:
      "Disintermediated supply chain with farm-to-consumer traceability, residue testing, and fair price distribution.",
  },
] as const;

export const LOGISTICS_STAGES = [
  {
    stage: 1,
    title: "FPO Aggregation (India)",
    description:
      "FPO collects from member farmers, processes, tests quality, and packs with QR-coded lot traceability.",
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
      "FDA-registered import broker clears customs, conducts entry testing, and warehouses at regional hubs.",
  },
  {
    stage: 4,
    title: "Member Fulfillment",
    description:
      "Members pre-order quarterly regional baskets — shipped from NJ, CA, and TX hubs or collected locally.",
  },
] as const;

export const FPO_CRITERIA = [
  "Registered FPC under Companies Act or multi-state cooperative with 500+ farmer-members",
  "Minimum two years of active trading with documented accounts",
  "PGS-India, NPOP organic, or verified natural farming protocols",
  "Institutional bank account, GST registration, and IEC (Import Export Code)",
  "Willingness for residue testing and farm-level traceability data",
] as const;

export const MEMBER_VALUE_PROPS = [
  {
    title: "Food safety",
    text: "Residue-tested products with publicly available test results — not certification alone.",
  },
  {
    title: "Traceability",
    text: "Named FPO, district, farmer count, and harvest season — not just 'Product of India.'",
  },
  {
    title: "Cultural authenticity",
    text: "Region-specific varieties — Telugu groundnut oil, Tamil kavuni rice, Gujarati bajra, and more.",
  },
  {
    title: "Price advantage",
    text: "Member ownership eliminates commercial profit extraction — target 15–25% below comparable retail.",
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
    note: "Chemical-free, wood-pressed, traceable",
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
    note: "GI certified, residue tested",
  },
  {
    name: "Wild forest honey",
    region: "Odisha / Chhattisgarh tribal FPOs",
    price: "$20–35 per kg",
    note: "Single-origin, lab certified",
  },
  {
    name: "Turmeric (Lakadong / native)",
    region: "Meghalaya / Telangana",
    price: "$8–15 per kg",
    note: "High curcumin, documented",
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
  "FPO advisory board seats for partner institution representatives",
  "Sourcing principles in articles — FPO-only procurement, residue testing, fair price floors",
  "75% member vote required to amend sourcing principles",
  "Annual public financial and residue test reporting",
  "Conflict of interest policy for board members in food import/export",
  "Multi-year FPO supply agreements (3–5 year rolling contracts)",
] as const;

export const ROADMAP = [
  {
    phase: "Phase 1 — Foundation",
    timeline: "Months 1–18",
    items: [
      "Incorporate cooperative and recruit 100 charter members",
      "Identify 5–8 FPO partners across 3–4 Indian states",
      "First pilot shipment and traceability platform MVP",
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
      "HarvestLink is a member-owned consumer cooperative registered in Ohio, linking Indian diaspora households in the U.S. directly with Farmer Producer Organizations in India. We source safe, traceable, culturally authentic food without commodity middlemen.",
  },
  {
    question: "What does membership cost and include?",
    answer:
      "Membership requires a USD 100 one-time joining fee and a USD 25/month minimum purchase commitment once products are available. You become an owner with one member, one vote, access to traceable FPO products, regional baskets, and democratic governance.",
  },
  {
    question: "What is the difference between membership and investment?",
    answer:
      "Membership (USD 100 joining fee) gives you ownership, voting rights, and access to cooperative products. Optional investment (USD 100 multiples) is separate patron capital that may earn proportional dividends — but every member has equal voting power regardless of investment.",
  },
  {
    question: "How does the FPO linkage work?",
    answer:
      "We source exclusively from registered FPOs — not individual farmers or commodity traders. FPOs aggregate supply, enforce quality standards, handle export documentation, and provide institutional accountability.",
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
      "Every member household gets one vote, regardless of investment amount. Members elect the board and vote on cooperative governance including sourcing principles.",
  },
  {
    question: "Can I invest without being a member?",
    answer:
      "Cooperative investment is designed for members. Join as a member first, then invest additional capital in multiples of USD 100 on our Invest page.",
  },
] as const;

export const MEMBERSHIP_TERMS = `By joining HarvestLink Cooperative, I acknowledge the USD 100 one-time joining fee and USD 25/month minimum purchase commitment once products are available. I understand that membership grants one equal vote per household in cooperative governance, that the board is elected by members, and that I am applying for consumer membership — not an investment contract. I agree to the cooperative principles of democratic member control, FPO-only sourcing, and community ownership.`;

export const INVESTMENT_TERMS = `By investing in HarvestLink Cooperative, I acknowledge this is patron capital in multiples of USD 100, separate from my membership fee. I understand dividends may be proportional to my investment, that voting rights remain equal for all members (one member, one vote), and that investment carries cooperative business risk. I agree to the cooperative investment terms and confirm I am or will become a cooperative member.`;
