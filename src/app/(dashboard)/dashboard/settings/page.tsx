"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Building2, User, CreditCard, Bell, Link, CheckCircle, Loader2, XCircle, Search, MessageCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

interface Integrations {
  google: boolean;
  facebook: boolean;
  googleBusinessName?: string | null;
  facebookPageName?: string | null;
  googleAuthUrl?: string;
  facebookAuthUrl?: string;
}

export default function SettingsPage() {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [business, setBusiness] = useState({
    company_name: "",
    phone: "",
    address: "",
    google_place_id: "",
    sms_template: "",
  });
  const [integrations, setIntegrations] = useState<Integrations>({ google: false, facebook: false });
  const [connecting, setConnecting] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [billingLoading, setBillingLoading] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!user) return;
      const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    
    if (data) {
      setBusiness({
        company_name: data.company_name || "",
        phone: data.phone || "",
        address: data.address || "",
        google_place_id: data.google_place_id || "",
        sms_template: data.sms_template || "",
      });
      if (data.subscription_status) setSubscriptionStatus(data.subscription_status);
    }
  }, [user]);

  const fetchIntegrations = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/integrations?userId=${user.id}`);
      const data = await res.json();
      setIntegrations({
        google: data.google || false,
        facebook: data.facebook || false,
        googleBusinessName: data.googleBusinessName,
        facebookPageName: data.facebookPageName,
        googleAuthUrl: data.googleAuthUrl,
        facebookAuthUrl: data.facebookAuthUrl,
      });
    } catch (e) {
      console.error("Failed to fetch integrations", e);
    }
  }, [user]);

  async function searchBusiness() {
    if (!searchQuery.trim()) return;
    setSearching(true);
    setSearchResults([]);
    try {
      const res = await fetch(`/api/search-business?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      setSearchResults(data.results || []);
    } catch {
      setSearchResults([]);
    }
    setSearching(false);
  }

  function selectPlace(place: any) {
    setBusiness(prev => ({ ...prev, google_place_id: place.placeId, company_name: prev.company_name || place.name }));
    setSearchResults([]);
    setSearchQuery("");
  }

  async function startCheckout() {
    if (!user?.email) return;
    setBillingLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, email: user.email }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch { setBillingLoading(false); }
  }

  async function manageBilling() {
    if (!user) return;
    setBillingLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch { setBillingLoading(false); }
  }

  // Check OAuth callback result from URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const isOAuthReturn = params.get('success') || params.get('error');
    if (isOAuthReturn) {
      // Don't fetch integrations from server — use callback state
      window.history.replaceState({}, '', '/dashboard/settings');
    } else if (user) {
      fetchProfile();
      fetchIntegrations();
    }
  }, [user, fetchProfile, fetchIntegrations]);

  // Handle OAuth callback params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const success = params.get('success');
    const err = params.get('error');
    if (success === 'google_connected') {
      setIntegrations(prev => ({ ...prev, google: true }));
      setError("Google Business connected successfully!");
      setTimeout(() => setError(""), 8000);
    } else if (success === 'facebook_connected') {
      setIntegrations(prev => ({ ...prev, facebook: true }));
      setError("Facebook connected successfully!");
      setTimeout(() => setError(""), 8000);
    } else if (err === 'access_denied') setError("Connection cancelled");
    else if (err) setError(`Connection failed: ${err}`);
  }, []);

  async function toggleIntegration(platform: 'google' | 'facebook') {
    if (!user) return;

    if (integrations[platform]) {
      // Disconnect
      setConnecting(platform);
      try {
        const res = await fetch('/api/integrations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, platform, action: 'disconnect' })
        });
        const data = await res.json();
        if (res.ok) {
          setIntegrations(prev => ({ ...prev, [platform]: false, [`${platform}BusinessName`]: null }));
        } else {
          setError(data.error || 'Failed to disconnect');
        }
      } catch (e) {
        setError('Failed to disconnect');
      }
      setConnecting(null);
    } else {
      // Connect via OAuth
      const authUrl = platform === 'google' ? integrations.googleAuthUrl : integrations.facebookAuthUrl;
      if (authUrl) {
        window.location.href = authUrl;
      } else {
        setError('OAuth not configured');
      }
    }
  }

  async function saveProfile() {
    if (!user) {
      setError("Please log in first");
      return;
    }
    setSaving(true);
    setError("");
    
    // Insert or update
    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        company_name: business.company_name,
        phone: business.phone,
        address: business.address,
        google_place_id: business.google_place_id || null,
        sms_template: business.sms_template || null,
      }, { onConflict: 'id' });
    
    if (error) {
      console.error("Save error:", error);
      setError(error.message);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
    setSaving(false);
  }
  return (
    <div className="space-y-6 animate-in max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your account and preferences</p>
      </div>

      {/* Business Profile */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Business Profile</CardTitle>
              <CardDescription>Your business information shown to customers</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="businessName">Business Name</Label>
              <Input 
                id="businessName" 
                value={business.company_name}
                onChange={(e) => setBusiness({ ...business, company_name: e.target.value })}
                className="mt-1.5" 
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone" 
                value={business.phone}
                onChange={(e) => setBusiness({ ...business, phone: e.target.value })}
                className="mt-1.5" 
              />
            </div>
          </div>
          <div>
            <Label htmlFor="address">Business Address</Label>
            <Input 
              id="address" 
              value={business.address}
              onChange={(e) => setBusiness({ ...business, address: e.target.value })}
              className="mt-1.5" 
            />
          </div>
          <div>
            <Label htmlFor="placeId">Google Place ID</Label>
            <div className="flex gap-2 mt-1.5">
              <Input 
                id="placeId" 
                value={business.google_place_id}
                onChange={(e) => setBusiness({ ...business, google_place_id: e.target.value })}
                className="flex-1"
                placeholder="ChIJ..."
              />
            </div>
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="Search your business name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button variant="outline" size="sm" onClick={searchBusiness} disabled={searching}>
                {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                Find
              </Button>
            </div>
            {searchResults.length > 0 && (
              <div className="mt-2 border border-slate-200 rounded-lg divide-y divide-slate-100">
                {searchResults.map((r: any) => (
                  <button
                    key={r.placeId}
                    className="w-full p-3 text-left hover:bg-slate-50 transition-colors"
                    onClick={() => selectPlace(r)}
                  >
                    <p className="text-sm font-medium text-slate-900">{r.name}</p>
                    <p className="text-xs text-slate-500">{r.address}</p>
                  </button>
                ))}
              </div>
            )}
            <p className="text-xs text-slate-400 mt-1">
              Search for your business above, or find your <a href="https://developers.google.com/maps/documentation/places/web-service/place-id" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Place ID manually</a>
            </p>
          </div>
          <Button className="bg-indigo-600" onClick={saveProfile} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : saved ? <CheckCircle className="w-4 h-4 mr-2" /> : null}
            {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
          </Button>
          {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
        </CardContent>
      </Card>

      {/* SMS Template */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-lg">SMS Review Request</CardTitle>
              <CardDescription>Customize the text your customers receive</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Message Template</Label>
            <textarea
              value={business.sms_template}
              onChange={(e) => setBusiness({ ...business, sms_template: e.target.value })}
              className="w-full mt-1.5 px-3 py-2 border border-slate-200 rounded-lg text-sm min-h-[100px] focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Hi {name}! Thanks for choosing {business_name}. We'd love a quick review: {link}. It only takes 10 seconds!"
            />
          </div>
          <div className="bg-slate-50 rounded-lg p-3 text-sm">
            <p className="font-medium text-slate-700 mb-1">Available variables:</p>
            <ul className="space-y-1 text-slate-500">
              <li><code className="bg-slate-200 px-1 rounded text-xs">{'{name}'}</code> &mdash; Customer&apos;s first name</li>
              <li><code className="bg-slate-200 px-1 rounded text-xs">{'{business_name}'}</code> — Your business name</li>
              <li><code className="bg-slate-200 px-1 rounded text-xs">{'{link}'}</code> — Review link</li>
            </ul>
          </div>
          <div className="bg-indigo-50 rounded-lg p-3 text-sm text-indigo-700">
            <p className="font-medium mb-1">Preview:</p>
            <p className="text-indigo-600">
              {business.sms_template
                .replace(/\{name\}/g, "John")
                .replace(/\{business_name\}/g, business.company_name || "Your Business")
                .replace(/\{link\}/g, "https://search.google.com/local/writereview?placeid=...")
                || "Hi John! Thanks for choosing " + (business.company_name || "Your Business") + ". We'd love a quick review: https://search.google.com/local/writereview?placeid=... It only takes 10 seconds!"
              }
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Integrations */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Link className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Integrations</CardTitle>
              <CardDescription>Connect your review platforms</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </div>
              <div>
                <p className="font-medium text-slate-900">Google Business Profile</p>
                <p className={`text-sm ${integrations.google ? 'text-emerald-600' : 'text-slate-500'}`}>
                  {integrations.googleBusinessName ? `Connected to ${integrations.googleBusinessName}` : integrations.google ? 'Connected' : 'Not connected'}
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => toggleIntegration('google')}
              disabled={connecting === 'google'}
            >
              {connecting === 'google' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : integrations.google ? (
                <>
                  <XCircle className="w-4 h-4 mr-1" /> Disconnect
                </>
              ) : (
                'Connect'
              )}
            </Button>
          </div>
          {integrations.google && (
            <SyncButton userId={user?.id} />
          )}
          <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.341-3.369-1.341-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.776-10-10-10z"/>
                </svg>
              </div>
              <div>
                <p className="font-medium text-slate-900">Facebook</p>
                <p className={`text-sm ${integrations.facebook ? 'text-emerald-600' : 'text-slate-500'}`}>
                  {integrations.facebookPageName ? `Connected to ${integrations.facebookPageName}` : integrations.facebook ? 'Connected' : 'Not connected'}
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => toggleIntegration('facebook')}
              disabled={connecting === 'facebook'}
            >
              {connecting === 'facebook' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : integrations.facebook ? (
                <>
                  <XCircle className="w-4 h-4 mr-1" /> Disconnect
                </>
              ) : (
                'Connect'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
              <Bell className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Notifications</CardTitle>
              <CardDescription>Configure how you receive alerts</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900">New Review Alerts</p>
              <p className="text-sm text-slate-500">Get notified when you receive a new review</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900">Negative Review Alerts</p>
              <p className="text-sm text-slate-500">Instant alerts for 1-2 star reviews so you can respond fast</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900">Review Request Responses</p>
              <p className="text-sm text-slate-500">Get notified when customers respond to review requests</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900">Negative Review Alerts</p>
              <p className="text-sm text-slate-500">Immediate alert for 1-2 star reviews</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900">Weekly Summary</p>
              <p className="text-sm text-slate-500">Receive a weekly digest of your reviews</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Billing */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Billing</CardTitle>
              <CardDescription>Manage your subscription and payments</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div>
              <p className="font-medium text-slate-900">Pro Plan</p>
              <p className="text-sm text-slate-500">
                {subscriptionStatus === "active" ? "Active • $39/month" : "Billed annually • $39/month"}
              </p>
            </div>
            {subscriptionStatus === "active" ? (
              <Button variant="outline" onClick={manageBilling} disabled={billingLoading}>
                {billingLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Manage Billing
              </Button>
            ) : (
              <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={startCheckout} disabled={billingLoading}>
                {billingLoading ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : null}
                Subscribe — $39/mo
              </Button>
            )}
          </div>
          {subscriptionStatus === "active" && (
            <div className="mt-4 flex items-center gap-2 text-sm text-emerald-600">
              <CheckCircle className="w-4 h-4" />
              Your subscription is active
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function SyncButton({ userId }: { userId?: string | null }) {
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState("");

  async function handleSync() {
    if (!userId) return;
    setSyncing(true);
    setSyncResult("");
    try {
      const res = await fetch("/api/sync-google-reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (res.ok) {
        setSyncResult(`✓ ${data.message}`);
      } else {
        setSyncResult(`✗ ${data.error}`);
      }
    } catch {
      setSyncResult("✗ Sync failed");
    }
    setSyncing(false);
    setTimeout(() => setSyncResult(""), 5000);
  }

  return (
    <div className="pl-4 border-l-2 border-indigo-200 ml-2">
      <Button variant="outline" size="sm" onClick={handleSync} disabled={syncing}>
        {syncing ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : null}
        {syncing ? "Syncing..." : "Sync Google Reviews"}
      </Button>
      {syncResult && (
        <p className={`text-sm mt-1 ${syncResult.startsWith("✓") ? "text-emerald-600" : "text-red-600"}`}>
          {syncResult}
        </p>
      )}
    </div>
  );
}