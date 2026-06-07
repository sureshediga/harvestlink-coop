# HarvestLink Cooperative — UI Design Spec

**Date:** 2026-06-05  
**Status:** Approved pending user review  
**Scope:** Phase 1 — Pre-launch marketing site with online membership signup

---

## 1. Overview

HarvestLink Cooperative is a consumer-owned cooperative connecting U.S. members directly to farmer-owned organizations, mission-driven entrepreneurs, and ethical small producers in India. The website is a **pre-launch membership hub** centered on **online founding-member signup** ($100 lifetime membership) before the first Texas store opens.

### Core tagline

> **Member-Owned · Farmer-Connected · Middlemen-Free**

### Primary conversion goal

Every page funnels to **Become a Founding Member — $100** with secure online payment.

---

## 2. Business Context

| Item | Detail |
|---|---|
| Legal entity | HarvestLink Cooperative (Ohio domestic cooperative) |
| First store | Texas — opening within ~3 months |
| Status | Shipments from India in transit |
| Expansion | Major U.S. cities after Texas launch |
| Membership | $100 lifetime, one member = one vote |
| Investment | Optional, multiples of $100, proportional dividends, equal voting |
| Payment | Online at signup (Stripe) |

### Value proposition

- Direct from farmers to consumers — no middlemen
- Better prices for farmers, better quality for consumers
- Democratic governance — board elected by members
- Every member is an owner and stakeholder

---

## 3. Brand Identity

### Logo — Concept B: "Linked Hands & Harvest" (selected)

**Symbol:** Two hands cupping upward, holding a wheat sheaf and green sprout together — farmers and consumers united in community ownership.

**Reference asset:** `assets/harvestlink-logo-concept-b-hands.png`

**Production deliverables for build:**
- SVG icon (hands + harvest mark)
- SVG full lockup (icon + wordmark)
- PNG exports: 512px, 192px (PWA), 32px (favicon source)
- Monochrome variant for receipts/print

### Color palette

| Name | Hex | Usage |
|---|---|---|
| Terracotta | `#C4704A` | Wheat, warmth, hands, accents |
| Monsoon green | `#2D6A4F` | Sprout, growth, secondary actions |
| Wheat gold | `#D4A853` | Harvest highlights, badge accents |
| Deep soil | `#3D2B1F` | Body text, badge ring |
| Saffron | `#E8923A` | Primary CTA buttons |
| Cream | `#FAF7F2` | Page backgrounds |
| White | `#FFFFFF` | Cards, form fields |

### Typography

| Role | Font | Fallback |
|---|---|---|
| Headings | Fraunces | Georgia, serif |
| Body / UI | Source Sans 3 | system-ui, sans-serif |
| Small caps labels | Source Sans 3 (600, letter-spacing) | — |

### Voice & tone

- Warm, trustworthy, community-driven
- Clear and plain language — no legal jargon on marketing pages
- Dignified representation of farmers — partnership, not charity
- Confident about the cooperative model without being preachy

---

## 4. Information Architecture

```
Home
├── How It Works
├── Our Farmer Partners
├── Membership & Investment
├── Opening in Texas
├── Our Vision
├── FAQ
└── Join (/join)  ← primary conversion
    └── Welcome (/join/welcome)
```

### Navigation (header)

Logo + links: How It Works · Farmers · Membership · Texas · FAQ · **[Join — $100]**

Mobile: hamburger menu + sticky **Join — $100** button.

### Footer

Quick links, cooperative tagline, contact email, Ohio cooperative registration note, repeat **Join the Movement** CTA.

---

## 5. Page Specifications

### 5.1 Home

**Hero**
- Badge: `Opening Soon in Texas`
- Headline: *Member-Owned. Farmer-Connected. Middlemen-Free.*
- Subhead: *Direct from Indian farmers to you.*
- CTA: **Become a Founding Member — $100**

**Three pillar cards**
1. Member-Owned — $100 lifetime, one vote, you’re an owner
2. Farmer-Connected — Direct from farmer orgs and ethical producers
3. Middlemen-Free — Better for farmers and consumers

**How it works** — 3-step preview with link to full page

**Farmer partners** — 2–3 preview cards

**Membership teaser** — $100 lifetime + optional investment link

**Full-width CTA band** — *Join the movement*

---

### 5.2 How It Works

Visual flow diagram:

```
Indian farmer orgs → HarvestLink Cooperative → Texas store → Your table
```

Sections:
- Who we source from (farmer-owned orgs, mission entrepreneurs, ethical producers)
- Middlemen comparison (before/after simple graphic)
- Why cooperative vs. traditional retail

CTA: **Become a Founding Member**

---

### 5.3 Our Farmer Partners

- Grid of farmer/partner profile cards (placeholder content at launch)
- Each card: region, crop type, short story, photo placeholder
- Emphasis on fair pricing and direct partnership

CTA: **Join and support our farmers**

---

### 5.4 Membership & Investment

Two clearly separated sections:

**Lifetime Membership — $100**
- One member = one vote
- Democratic governance, board elected by members
- Every member becomes a stakeholder
- CTA: **Join Now**

**Invest & Earn (optional)**
- Invest in multiples of $100
- Dividends proportional to investment
- Voting rights remain equal for all members
- Note: investment is added at checkout, not required

---

### 5.5 Opening in Texas

- Shipments from India in transit
- Expected opening within three months
- Visual timeline (soft — no hard date unless provided)
- Future expansion to major U.S. cities
- Founding member urgency: *Reserve your membership before we open*

CTA: **Become a Founding Member**

---

### 5.6 Our Vision

- Nationwide member-owned retail network
- Supports Indian farmers
- High-quality groceries
- Sustainable supply chain
- Community ownership

---

### 5.7 FAQ

Suggested questions:
- What is HarvestLink Cooperative?
- What does my $100 membership include?
- What is the difference between membership and investment?
- When will the Texas store open?
- Do I get anything before the store opens?
- How does voting work?
- Can I invest later?

---

## 6. Membership Signup Flow (`/join`)

### Design principle

**Membership first.** Investment is opt-in via a text link on the Review step — never a competing primary button.

### Flow

```
Step 1: Why Join
Step 2: Your Info
Step 3: Review & Pay  (+ optional "Add investment" link)
Step 4: Stripe Checkout
Step 5: Welcome
```

### Step 1 — Why Join

- Three pillars recap
- Founding member status before Texas opening
- Shipments in transit message
- Button: **Continue**

### Step 2 — Your Info

Fields:
- Full name (required)
- Email (required)
- Phone (required)
- Street address (required)
- City (required)
- State (required)
- ZIP (required)

Validation: client-side (Zod) + server-side on submit.

### Step 3 — Review & Pay

**Default view (membership only):**

```
Lifetime Membership                    $100.00
─────────────────────────────────────────────
☐ I agree to HarvestLink Cooperative membership terms

[ Pay $100 — Become a Founding Member ]

─────────────────────────────────────────────
Want to invest in the cooperative?
Add investment →
```

**With investment added:**

```
Lifetime Membership                    $100.00
Cooperative Investment (N × $100)      $N.00
─────────────────────────────────────────────
Total                                  $TOTAL

Voting: 1 member = 1 vote (unchanged)
Dividends: proportional to investment

[ Pay $TOTAL ]              [ Remove investment ]
```

Investment selector (on expand):
- Presets: $100 · $200 · $500
- Custom input: multiples of $100 only
- Minimum investment: $100

Terms checkbox required before payment.

### Step 4 — Stripe Checkout

- Stripe Checkout Session with line items:
  - `HarvestLink Lifetime Membership` — $100.00
  - `Cooperative Investment (N units)` — $N.00 *(if applicable)*
- Success redirect: `/join/welcome?session_id={CHECKOUT_SESSION_ID}`
- Cancel redirect: `/join?cancelled=true`

### Step 5 — Welcome (`/join/welcome`)

- Founding member confirmation
- Member reference number
- Summary of payment
- What happens next:
  - Email confirmation sent
  - Updates as Texas store opening approaches
  - Invitation to follow progress
- Optional: share/referral prompt (Phase 2)

### Post-signup email

Triggered on successful Stripe webhook:
- Receipt (membership + investment if any)
- Member number
- Welcome message
- Link to FAQ
- Contact for questions

---

## 7. Data Model (Phase 1)

### `members` table

| Field | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| member_number | string | Human-readable, e.g. HL-2026-0001 |
| full_name | string | |
| email | string | Unique |
| phone | string | |
| address | jsonb | street, city, state, zip |
| membership_paid | boolean | |
| membership_amount | integer | Cents, default 10000 |
| investment_units | integer | 0 if none |
| investment_amount | integer | Cents |
| stripe_session_id | string | |
| stripe_payment_intent_id | string | |
| is_founding_member | boolean | true for pre-Texas-launch signups |
| created_at | timestamptz | |

---

## 8. Technical Architecture

| Layer | Choice | Rationale |
|---|---|---|
| Framework | Next.js 15 (App Router) | SEO, performance, Stripe integration |
| Styling | Tailwind CSS | Rapid theme implementation |
| Forms | React Hook Form + Zod | Validated signup |
| Payments | Stripe Checkout | Secure, PCI-compliant |
| Database | Supabase (Postgres) | Member records, simple admin |
| Email | Resend or Supabase edge function | Confirmation emails |
| Hosting | Vercel | Simple deploy |
| Analytics | Vercel Analytics or Plausible | Privacy-friendly traffic |

### API routes

- `POST /api/checkout` — create Stripe session from signup data
- `POST /api/webhooks/stripe` — confirm payment, create member record, send email
- `GET /api/members/[session_id]` — fetch confirmation for welcome page

### Environment variables

```
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
RESEND_API_KEY
NEXT_PUBLIC_SITE_URL
```

---

## 9. UI Components

| Component | Usage |
|---|---|
| `Header` | Sticky nav + Join CTA |
| `Footer` | Links, tagline, legal |
| `TexasBanner` | Dismissible "Opening Soon" announcement |
| `PillarCard` | Three pillars on home |
| `FarmerCard` | Farmer partner profiles |
| `CTABand` | Full-width join prompt |
| `MembershipSummary` | Review step line items |
| `InvestmentExpand` | Opt-in investment selector |
| `StepIndicator` | Join flow progress |
| `FoundingMemberBadge` | Welcome page badge |

---

## 10. Responsive & Accessibility

- Mobile-first layout (320px+)
- Touch targets ≥ 44px
- Color contrast WCAG AA minimum
- Form labels, error messages, focus states
- Semantic HTML landmarks
- Alt text on all images

---

## 11. Phase Roadmap

### Phase 1 — Launch (this spec)

- All marketing pages
- `/join` signup with Stripe
- Member record storage
- Confirmation email
- Admin CSV export of members

### Phase 2 — Story & growth

- Real farmer partner profiles and photos
- Texas opening countdown (when date confirmed)
- Referral program
- Blog / updates section

### Phase 3 — Store opening

- Store location, hours, product preview
- Transition messaging from waitlist to shopping

### Phase 4 — Member portal

- Authentication
- Investment dashboard
- Dividend statements
- Governance / voting

---

## 12. Design Decisions Log

| Decision | Choice |
|---|---|
| Primary goal | Membership signup |
| Launch context | Pre-launch, Texas opening ~3 months |
| Membership fee | $100 lifetime, online payment |
| Investment | Opt-in from Review step (Option B) |
| Logo | Concept B — Linked Hands & Harvest |
| Payment | Stripe Checkout |
| Default signup path | Membership only ($100) |

---

## 13. Open Items (non-blocking for Phase 1)

- [ ] Final farmer partner content and photos
- [ ] Exact Texas store city and opening date
- [ ] Membership terms & conditions document (legal text for checkbox)
- [ ] Contact email address for footer
- [ ] Custom domain name
- [ ] Stripe account configuration

---

## 14. Success Criteria

Phase 1 is complete when:

1. A visitor can read about the cooperative on all marketing pages
2. A visitor can complete membership signup and pay $100 online
3. A visitor can optionally add investment in $100 multiples at checkout
4. Payment confirmation creates a member record and sends a welcome email
5. Site is mobile-responsive and matches the brand palette and Concept B logo direction
6. Admin can export a list of founding members
