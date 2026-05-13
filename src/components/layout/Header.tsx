"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Search, Plus, LogOut, User, Star, AlertTriangle, MessageCircle, X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface Notification {
  id: string;
  type: "negative_review" | "pending_request";
  message: string;
  link: string;
  created_at: string;
}

export function Header() {
  const { user, profile, signOut } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    fetchNotifications();

    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [user, fetchNotifications]);

  async function fetchNotifications() {
    if (!user) return;
    const list: Notification[] = [];

    const { data: reviews } = await supabase
      .from("reviews")
      .select("id, content, rating, created_at")
      .eq("user_id", user.id)
      .eq("responded", false)
      .lte("rating", 2)
      .limit(5);

    if (reviews) {
      for (const r of reviews) {
        list.push({
          id: `neg-${r.id}`,
          type: "negative_review",
          message: `${r.rating}-star review: "${(r.content || "No content").slice(0, 60)}..."`,
          link: "/dashboard/reviews",
          created_at: r.created_at,
        });
      }
    }

    const { data: requests } = await supabase
      .from("review_requests")
      .select("id, created_at")
      .eq("user_id", user.id)
      .eq("status", "pending")
      .limit(5);

    if (requests) {
      for (const r of requests) {
        list.push({
          id: `req-${r.id}`,
          type: "pending_request",
          message: "Pending review request",
          link: "/dashboard/requests",
          created_at: r.created_at,
        });
      }
    }

    setNotifications(list);
  }

  async function handleSignOut() {
    await signOut();
    router.push("/");
  }

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-8">
      {/* Search */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search reviews, customers..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-0 rounded-lg text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700" onClick={() => router.push("/dashboard/customers")}>
          <Plus className="w-4 h-4 mr-1" />
          Request Review
        </Button>
        <div className="relative" ref={dropdownRef}>
          <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors" onClick={() => setShowDropdown(!showDropdown)}>
            <Bell className="w-5 h-5" />
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center">
                {notifications.length > 9 ? "9+" : notifications.length}
              </span>
            )}
          </button>
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto">
              <div className="p-3 border-b border-slate-100 flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-900">Notifications</p>
                <button className="text-slate-400 hover:text-slate-600" onClick={() => setShowDropdown(false)}>
                  <X className="w-4 h-4" />
                </button>
              </div>
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-sm text-slate-500">No notifications</div>
              ) : (
                notifications.map((n) => (
                  <button
                    key={n.id}
                    className="w-full p-3 hover:bg-slate-50 text-left border-b border-slate-50 last:border-0 flex items-start gap-3 transition-colors"
                    onClick={() => { router.push(n.link); setShowDropdown(false); }}
                  >
                    <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      n.type === "negative_review" ? "bg-red-50" : "bg-amber-50"
                    }`}>
                      {n.type === "negative_review" ? (
                        <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                      ) : (
                        <MessageCircle className="w-3.5 h-3.5 text-amber-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-700">{n.message}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {new Date(n.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-300 flex-shrink-0 mt-1" />
                  </button>
                ))
              )}
            </div>
          )}
        </div>
        
        {/* User menu */}
        <div className="flex items-center gap-2 ml-2 pl-4 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-slate-900">{profile?.full_name || user?.email}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleSignOut} className="ml-2">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}