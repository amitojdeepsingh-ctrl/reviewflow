import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy - ReviewFlow",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/" className="text-indigo-600 hover:underline text-sm">← Back to Home</Link>
        <h1 className="text-3xl font-bold text-slate-900 mt-8">Privacy Policy</h1>
        <p className="text-slate-500 mt-2">Last updated: May 2026</p>

        <div className="mt-8 space-y-6 text-slate-600 text-sm leading-relaxed">
          <h2 className="text-lg font-semibold text-slate-900">1. Information We Collect</h2>
          <p>We collect information you provide when creating an account (name, email, phone) and business information (company name, address). When you connect Google Business Profile or Facebook, we store OAuth tokens to access your review data.</p>

          <h2 className="text-lg font-semibold text-slate-900">2. How We Use Your Information</h2>
          <p>We use your information to: provide review management services, send review requests to your customers, display analytics about your reviews, and improve our service.</p>

          <h2 className="text-lg font-semibold text-slate-900">3. Data Sharing</h2>
          <p>We do not sell your personal data. We may share data with third-party service providers (Twilio for SMS, Supabase for database hosting, Vercel for hosting).</p>

          <h2 className="text-lg font-semibold text-slate-900">4. Data Deletion</h2>
          <p>You can delete your account and all associated data by contacting us at amitoj.deep.singh@gmail.com. We will process deletion requests within 30 days.</p>

          <h2 className="text-lg font-semibold text-slate-900">5. Contact</h2>
          <p>For questions about this policy, contact: amitoj.deep.singh@gmail.com</p>
        </div>
      </div>
    </div>
  );
}