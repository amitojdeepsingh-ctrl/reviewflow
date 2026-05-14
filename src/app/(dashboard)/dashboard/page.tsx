"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Star, 
  TrendingUp, 
  MessageCircle, 
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink,
  Plus,
  Users,
  Loader2
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface Stats {
  totalCustomers: number;
  totalReviews: number;
  avgRating: number;
  pendingRequests: number;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [stats, setStats] = useState<Stats>({
    totalCustomers: 0,
    totalReviews: 0,
    avgRating: 0,
    pendingRequests: 0
  });

  async function seedTestData() {
    setSeeding(true);
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      if (res.ok) {
        window.location.reload();
      }
    } catch (e) {
      console.error(e);
    }
    setSeeding(false);
  }

  useEffect(() => {
    if (user) fetchDashboardData();
  }, [user]);

  async function fetchDashboardData() {
    setLoading(true);
    
    const { data: customers } = await supabase.from("customers").select("id");
    const { data: reviews } = await supabase.from("reviews").select("rating");
    const { data: requests } = await supabase.from("review_requests").select("id").eq("status", "pending");

    const avgRating = reviews?.length 
      ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length 
      : 0;

    setStats({
      totalCustomers: customers?.length || 0,
      totalReviews: reviews?.length || 0,
      avgRating: Math.round(avgRating * 10) / 10,
      pendingRequests: requests?.length || 0
    });
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#7C3AED]" />
      </div>
    );
  }

  const statCards = [
    { 
      label: "Total Customers", 
      value: stats.totalCustomers, 
      change: stats.totalCustomers > 0 ? "+1" : "0", 
      trend: "up",
      icon: Users,
      color: "emerald"
    },
    { 
      label: "Average Rating", 
      value: stats.avgRating || "-", 
      change: stats.avgRating > 4 ? "+0.1" : "0", 
      trend: stats.avgRating > 4 ? "up" : "down",
      icon: TrendingUp,
      color: "blue"
    },
    { 
      label: "Total Reviews", 
      value: stats.totalReviews, 
      change: "+0", 
      trend: "up",
      icon: Star,
      color: "purple"
    },
    { 
      label: "Pending Requests", 
      value: stats.pendingRequests, 
      change: "0", 
      trend: "neutral",
      icon: Clock,
      color: stats.pendingRequests > 0 ? "amber" : "slate"
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#4C1D95]">Dashboard</h1>
          <p className="text-slate-600 mt-1">Welcome back! Here&apos;s your review overview.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 cursor-pointer" onClick={() => router.push("/dashboard/reviews")}>
            <ExternalLink className="w-4 h-4" />
            View Live Reviews
          </Button>
          <Button className="bg-[#7C3AED] hover:bg-[#6D28D9] gap-2" onClick={() => router.push("/dashboard/customers")}>
            <Plus className="w-4 h-4" />
            Add Customer
          </Button>
        </div>
      </div>

      {stats.totalCustomers === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-[#7C3AED]/10 flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-[#7C3AED]" />
            </div>
            <h3 className="text-lg font-semibold text-[#4C1D95]">Get Started with ReviewManager</h3>
            <p className="text-slate-600 mt-2 max-w-md mx-auto">
              Add your first customer to start sending review requests. 
              It only takes 30 seconds!
            </p>
            <div className="flex gap-3 justify-center mt-4">
              <Button className="bg-[#7C3AED] hover:bg-[#6D28D9]" onClick={() => router.push("/dashboard/customers")}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Customer
              </Button>
              <Button variant="outline" onClick={seedTestData} disabled={seeding} className="cursor-pointer">
                {seeding ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Add Test Data
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {statCards.map((stat, i) => (
              <Card key={i} className="cursor-pointer hover:border-[#7C3AED] transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600">{stat.label}</p>
                      <p className="text-3xl font-bold text-[#4C1D95] mt-2">{stat.value}</p>
                      <p className={`text-sm mt-2 flex items-center gap-1 ${
                        stat.trend === "up" ? "text-emerald-600" : 
                        stat.trend === "down" ? "text-red-600" : "text-slate-400"
                      }`}>
                        {stat.trend === "up" && <ArrowUpRight className="w-4 h-4" />}
                        {stat.trend === "down" && <ArrowDownRight className="w-4 h-4" />}
                        {stat.change}
                      </p>
                    </div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      stat.color === "emerald" ? "bg-emerald-50" :
                      stat.color === "blue" ? "bg-blue-50" :
                      stat.color === "purple" ? "bg-purple-50" :
                      stat.color === "amber" ? "bg-amber-50" :
                      "bg-slate-50"
                    }`}>
                      <stat.icon className={`w-6 h-6 ${
                        stat.color === "emerald" ? "text-emerald-600" :
                        stat.color === "blue" ? "text-blue-600" :
                        stat.color === "purple" ? "text-purple-600" :
                        stat.color === "amber" ? "text-amber-600" :
                        "text-slate-600"
                      }`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-[#7C3AED] text-white cursor-pointer hover:bg-[#6D28D9] transition-colors">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg">Send Review Requests</h3>
                <p className="text-violet-200 text-sm mt-1">Reach out to your customers for reviews</p>
                <Button className="mt-4 bg-white text-[#7C3AED] hover:bg-violet-50" onClick={() => router.push("/dashboard/customers")}>
                  Go to Customers
                </Button>
              </CardContent>
            </Card>
            <Card className="bg-emerald-600 text-white cursor-pointer hover:bg-emerald-700 transition-colors">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg">Check Reviews</h3>
                <p className="text-emerald-100 text-sm mt-1">See what customers are saying</p>
                <Button className="mt-4 bg-white text-emerald-600 hover:bg-emerald-50" onClick={() => router.push("/dashboard/reviews")}>
                  View Reviews
                </Button>
              </CardContent>
            </Card>
            <Card className="bg-[#F97316] text-white cursor-pointer hover:bg-[#EA580C] transition-colors">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg">Analyze Performance</h3>
                <p className="text-orange-100 text-sm mt-1">Track your rating and growth</p>
                <Button className="mt-4 bg-white text-[#F97316] hover:bg-orange-50" onClick={() => router.push("/dashboard/analytics")}>
                  View Analytics
                </Button>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}