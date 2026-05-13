import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Data Deletion - ReviewManager",
};

export default function DataDeletionPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/" className="text-indigo-600 hover:underline text-sm">← Back to Home</Link>
        <h1 className="text-3xl font-bold text-slate-900 mt-8">Data Deletion Request</h1>

        <div className="mt-8 space-y-6 text-slate-600 text-sm leading-relaxed">
          <p>To request deletion of your account and all associated data, please email us at:</p>
          <p className="text-lg font-semibold text-indigo-600">amitoj.deep.singh@gmail.com</p>
          <p>Include the email address associated with your ReviewManager account. We will process your request within 30 days.</p>
          <p>Data that will be deleted:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Account information (name, email, phone)</li>
            <li>Business profile data</li>
            <li>Customer records</li>
            <li>Review history</li>
            <li>Connected integration tokens (Google, Facebook)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}