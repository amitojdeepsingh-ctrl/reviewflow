"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sparkles, Star, MessageCircle, Send, CheckCircle, ArrowRight, Loader2, Building2, Users, Smartphone } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

function OnboardingContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const steps = [
    { icon: Building2, title: "Your Business", desc: "Tell us about your business" },
    { icon: Users, title: "Add a Customer", desc: "Add your first customer" },
    { icon: Smartphone, title: "Send Request", desc: "Send your first review request" },
  ];
  const [businessName, setBusinessName] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");

  // Step 2
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  // Step 3
  const [sent, setSent] = useState(false);

  async function saveBusiness() {
    if (!user || !businessName) return;
    setLoading(true);
    await supabase.from("profiles").upsert({
      id: user.id, company_name: businessName, phone: businessPhone,
    }, { onConflict: "id" });
    setLoading(false);
    setStep(1);
  }

  async function addCustomer() {
    if (!user || !customerName) return;
    setLoading(true);
    await supabase.from("customers").insert({
      user_id: user.id, name: customerName, phone: customerPhone || null,
    });
    setLoading(false);
    setStep(2);
  }

  async function sendFirstRequest() {
    if (!user) return;
    setLoading(true);
    const { data: customers } = await supabase
      .from("customers")
      .select("id")
      .eq("user_id", user.id)
      .limit(1)
      .single();

    if (customers) {
      await fetch("/api/send-review-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: customers.id }),
      });
    }
    setSent(true);
    setLoading(false);
  }

  useEffect(() => {
    if (user) {
      supabase.from("profiles").select("company_name").eq("id", user.id).single().then(({ data }) => {
        if (data?.company_name) {
          setBusinessName(data.company_name);
          setStep(1);
        }
      });
    }
  }, [user]);

  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-16 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome to ReviewFlow</h1>
          <p className="text-slate-500 mt-2">Get started in 3 easy steps</p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                i < step ? "bg-emerald-500 text-white" :
                i === step ? "bg-indigo-600 text-white" :
                "bg-slate-200 text-slate-400"
              }`}>
                {i < step ? <CheckCircle className="w-5 h-5" /> : i + 1}
              </div>
              <span className={`text-sm hidden sm:block ${i === step ? "text-indigo-600 font-medium" : "text-slate-400"}`}>
                {s.title}
              </span>
              {i < 2 && <div className={`w-10 h-0.5 ${i < step ? "bg-emerald-500" : "bg-slate-200"}`} />}
            </div>
          ))}
        </div>

        <Card className="border-0 shadow-xl shadow-indigo-500/5">
          <CardContent className="p-8">
            {step === 0 && (
              <div className="space-y-6 animate-in">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-4">
                    <Building2 className="w-8 h-8 text-indigo-600" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">What&apos;s your business name?</h2>
                  <p className="text-slate-500 text-sm mt-1">This will appear in review requests</p>
                </div>
                <Input placeholder="e.g. ADS Immigration" value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
                <Input placeholder="Phone number (optional)" value={businessPhone} onChange={(e) => setBusinessPhone(e.target.value)} />
                <Button className="w-full bg-indigo-600" onClick={saveBusiness} disabled={loading || !businessName}>
                  {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Continue <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-6 animate-in">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-purple-600" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">Add your first customer</h2>
                  <p className="text-slate-500 text-sm mt-1">They&apos;ll receive a review request</p>
                </div>
                <Input placeholder="Customer name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
                <Input placeholder="Phone number" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} />
                <Button className="w-full bg-indigo-600" onClick={addCustomer} disabled={loading || !customerName}>
                  {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Add Customer <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 text-center animate-in">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                  {sent ? <CheckCircle className="w-8 h-8 text-emerald-600" /> : <Send className="w-8 h-8 text-emerald-600" />}
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  {sent ? "All set!" : "Ready to send your first request?"}
                </h2>
                <p className="text-slate-500 text-sm">
                  {sent
                    ? "Your first review request has been sent. You'll see it in Requests history."
                    : "We'll send an SMS to your customer asking for a review."}
                </p>
                {!sent ? (
                  <Button className="w-full bg-indigo-600" onClick={sendFirstRequest} disabled={loading}>
                    {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    Send Review Request
                  </Button>
                ) : (
                  <Button className="w-full bg-indigo-600" onClick={() => router.push("/dashboard")}>
                    Go to Dashboard <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <AuthProvider>
      <OnboardingContent />
    </AuthProvider>
  );
}