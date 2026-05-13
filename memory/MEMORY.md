# ReviewFlow - Session Memory

## Project
- **Name**: ReviewFlow
- **Type**: SaaS Web App (Next.js 14 + Supabase)
- **URL**: https://review-manager-navy.vercel.app
- **Test Login**: test@example.com / testpassword123

## Tech Stack
Next.js 14 (App Router), Tailwind CSS + Shadcn UI, Supabase (PostgreSQL + Auth), Twilio (SMS), Stripe (billing), Vercel

## Current State — ALL FEATURES WORKING ✓
Build: ✓ | Lint: ✓ | Git: Clean

## Features
- ✅ Landing page + Signup/Login auth
- ✅ Dashboard with stats & quick action cards
- ✅ Customer CRUD with search
- ✅ SMS review requests via Twilio (customizable template)
- ✅ Reviews page with filter/search
- ✅ Analytics page
- ✅ Google OAuth integration (Connect/Disconnect)
- ✅ Google Place ID search (type business name → auto-find)
- ✅ Sync Google reviews via Places API
- ✅ Notifications bell (negative reviews + pending requests)
- ✅ Stripe billing ($39/mo subscription)
- ✅ Sidebar shows real user info
- ✅ All buttons have handlers

## Env Vars
- `NEXT_PUBLIC_SUPABASE_URL` ✓
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` ✓
- `SUPABASE_SERVICE_ROLE_KEY` ✓
- `TWILIO_ACCOUNT_SID` ✓
- `TWILIO_AUTH_TOKEN` ✓
- `TWILIO_PHONE_NUMBER` ✓
- `GOOGLE_CLIENT_ID` ✓
- `GOOGLE_CLIENT_SECRET` ✓
- `GOOGLE_REDIRECT_URI` ✓
- `GOOGLE_BUSINESS_API_KEY` ✓
- `FACEBOOK_APP_ID` ✓
- `FACEBOOK_APP_SECRET` ✓
- `FACEBOOK_REDIRECT_URI` ✓
- `NEXT_PUBLIC_SITE_URL` ✓
- `STRIPE_SECRET_KEY` ✓
- `STRIPE_PRICE_ID` ✓
- `STRIPE_WEBHOOK_SECRET` ✓

## Last Updated
2026-05-10