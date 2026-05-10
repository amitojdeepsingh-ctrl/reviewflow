# Local Service Review Manager - Product Specification

## Project Overview
- **Name**: ReviewFlow
- **Tagline**: "Get more 5-star reviews. Simple as that."
- **Product Type**: SaaS Web Application
- **Target Users**: Small local service businesses (1-5 employees) — plumbers, electricians, HVAC technicians, house cleaners, salons, auto repair shops
- **Price**: $39/month (annual), $49/month (monthly)

---

## Why We'll Win

### Competitors' Problems
| Competitor | Problem |
|------------|---------|
| Podium ($399/mo) | Cluttered interface, too many features, enterprise-focused |
| Birdeye ($299/mo) | Outdated UI, steep learning curve, overkill for small biz |
| NiceJob ($75/mo) | Marketing-first, not review-focused |
| ReviewDrop ($29/mo) | Limited features, no AI |

### Our Differentiation
1. **Gorgeous UI** — Modern, clean, delightful to use (think Linear/Notion level)
2. **Laser focus** — Only what small businesses need, nothing more
3. **AI-powered** — Smart responses, auto-summaries, sentiment analysis
4. **5-minute setup** — No onboarding needed, self-serve
5. **Transparent pricing** — No hidden fees, no contracts

---

## UI/UX Design Principles

### Visual Style
- **Aesthetic**: Modern, clean, trustworthy — like a premium fintech app
- **Inspiration**: Linear, Notion, Stripe, Modern UI patterns
- **Motion**: Smooth transitions, subtle micro-interactions

### Color Palette
```
Primary: #0F172A (Slate 900 - deep, professional)
Accent: #6366F1 (Indigo 500 - trust, action)
Success: #10B981 (Emerald 500 - 5-star)
Warning: #F59E0B (Amber 500 - attention)
Error: #EF4444 (Red 500 - negative reviews)
Background: #F8FAFC (Slate 50)
Surface: #FFFFFF
Text Primary: #1E293B (Slate 800)
Text Secondary: #64748B (Slate 500)
```

### Typography
- **Headings**: Inter (bold, modern)
- **Body**: Inter (clean, readable)
- **Font sizes**: 14px base, 12px small, 18px medium, 24px large, 32px hero

### Layout
- **Sidebar**: 260px fixed, collapsible on mobile
- **Main content**: Fluid, max-width 1200px
- **Spacing**: 8px base unit (8, 16, 24, 32, 48, 64)
- **Border radius**: 8px (buttons), 12px (cards), 16px (modals)

---

## Core Features

### 1. Dashboard (Home)
**Purpose**: At-a-glance view of review health

**Components**:
- **Stats Cards**: 
  - Total reviews (with trend)
  - Average rating (with trend)
  - Reviews this month
  - Response rate %
- **Review Stream**: Latest 5 reviews with quick actions
- **Quick Actions**: "Request Review", "Respond to Pending"
- **Performance Chart**: Rating over time (last 30 days)

**UI Treatment**: 
- Clean card layout with subtle shadows
- Animated counters on load
- Color-coded rating badges (green for 5-star, etc.)

### 2. Reviews Page
**Purpose**: View and manage all reviews

**Components**:
- **Filter Bar**: By rating (1-5 stars), platform (Google, Facebook), status
- **Review List**: 
  - Customer name + photo (from platform)
  - Star rating (visual)
  - Review text (truncated, expandable)
  - Date
  - Platform icon
  - Status (responded/not)
- **Review Detail Modal**: Full review, AI response suggestion, respond button

**UI Treatment**:
- List with generous whitespace
- Click to expand inline
- Quick-respond without leaving context

### 3. Customers Page
**Purpose**: Manage customer database

**Components**:
- **Customer List**: Name, phone, email, job count, last contact
- **Add Customer**: Form with name, phone, email, notes
- **Quick Actions**: Send review request, view history

**UI Treatment**:
- Clean table with search
- Inline add customer (no modal needed)
- Phone number masking

### 4. Review Requests
**Purpose**: Automate review collection

**Components**:
- **Request Templates**: 
  - SMS message (customizable)
  - Timing (immediate, 1 day after job, etc.)
- **Send Request**: 
  - Select customer
  - Preview message
  - Send button
- **Request History**: Log of all sent requests
- **Auto-Request Rules**: Set up automatic requests based on triggers

**UI Treatment**:
- Drag-and-drop template builder
- Live preview
- Clear success/error states

### 5. Analytics
**Purpose**: Deep dive into performance

**Components**:
- **Overview Cards**: Same as dashboard but detailed
- **Rating Distribution**: Pie/donut chart
- **Platform Breakdown**: Google vs Facebook vs others
- **Response Time**: Average time to respond
- **Competitor Compare**: (Premium) Compare to nearby competitors

**UI Treatment**:
- Interactive charts
- Date range picker
- Export to CSV

### 6. Settings
**Purpose**: Configure the app

**Components**:
- **Business Profile**: Name, logo, address
- **Integrations**: Google Business Profile connection
- **Team**: Add team members (2 users included)
- **Billing**: Subscription management
- **Notifications**: Email/SMS preferences

---

## User Flow

### New User Journey
1. **Landing**: "Get more 5-star reviews" → CTA "Start Free Trial"
2. **Sign Up**: Email + password (no credit card for trial)
3. **Onboarding** (3 steps):
   - Step 1: Connect Google Business (optional, can skip)
   - Step 2: Add first customer
   - Step 3: Send first review request
4. **Dashboard**: See the magic happen

### Returning User Flow
1. **Dashboard**: See today's stats
2. **Quick Action**: Click "Request Review" → Select customer → Send
3. **Review Comes In**: Notification → Click to view → AI response → Send

---

## Technical Specification

### Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + Shadcn UI
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **SMS**: Twilio
- **Deployment**: Vercel (free tier)
- **State**: React Query + Zustand

### Data Model

```
users
- id (uuid)
- email
- name
- business_name
- phone
- created_at

customers
- id (uuid)
- user_id (fk)
- name
- phone
- email
- notes
- created_at

reviews
- id (uuid)
- user_id (fk)
- customer_id (fk)
- platform (google/facebook/yelp)
- rating (1-5)
- content (text)
- review_url
- responded (bool)
- responded_at
- created_at

review_requests
- id (uuid)
- user_id (fk)
- customer_id (fk)
- message
- sent_at
- status (pending/sent/failed)
```

---

## Pricing Page (Simple)

```
┌─────────────────────────────────┐
│        ReviewFlow               │
│   Get more 5-star reviews.       │
│        Simple as that.           │
├─────────────────────────────────┤
│  $39/month (billed annually)    │
│  or $49/month (monthly)         │
├─────────────────────────────────┤
│  ✓ Unlimited customers         │
│  ✓ Unlimited review requests   │
│  ✓ AI-powered responses        │
│  ✓ Google & Facebook reviews   │
│  ✓ SMS + Email requests        │
│  ✓ Analytics & reporting        │
│  ✓ 14-day free trial           │
│  ✓ No credit card needed       │
└─────────────────────────────────┘
```

---

## Success Metrics

- Dashboard loads in < 2 seconds
- First review request sent in < 5 minutes
- Customer satisfaction > 4.8 stars
- Net promoter score > 50

---

## MVP Scope (Phase 1)

1. ✅ User auth + dashboard
2. ✅ Customer management (CRUD)
3. ✅ Manual review request via SMS
4. ✅ View incoming reviews (manual entry for MVP)
5. ✅ Basic analytics
6. ✅ Beautiful, polished UI

**Phase 2** (Post-launch):
- Google Business API integration
- Auto-responder
- AI response suggestions
- Email campaigns

---

## File Structure

```
/app
  /layout.tsx
  /page.tsx (landing)
  /dashboard
    /page.tsx
    /reviews/page.tsx
    /customers/page.tsx
    /requests/page.tsx
    /analytics/page.tsx
    /settings/page.tsx
  /login/page.tsx
  /signup/page.tsx
/components
  /ui (shadcn components)
  /dashboard (dashboard-specific)
  /layout (sidebar, header)
/lib
  /supabase.ts
  /utils.ts
/types
  /index.ts
```

---

*Let's build something beautiful.*