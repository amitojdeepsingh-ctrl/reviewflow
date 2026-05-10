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
  ThumbsUp,
  Plus,
  Users,
  Loader2,
  AlertTriangle
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

interface Stats {
  totalCustomers: number;
  totalReviews: number;
  avgRating: number;
  pendingRequests: number;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    totalCustomers: 0,
    totalReviews: 0,
    avgRating: 0,
    pendingRequests: 0
  });

  useEffect(() => {
    if (user) fetchDashboardData();
  }, [user]);

  async function fetchDashboardData() {
    setLoading(true);
    
    // Fetch customers
    const { data: customers } = await supabase
      .from("customers")
      .select("id");

    // Fetch reviews
    const { data: reviews } = await supabase
      .from("reviews")
      .select("rating");

    // Fetch pending requests
    const { data: requests } = await supabase
      .from("review_requests")
      .select("id")
      .eq("status", "pending");

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
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
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
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-1">Welcome back! Here's your review overview.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <ExternalLink className="w-4 h-4" />
            View Live Reviews
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 gap-2">
            <Plus className="w-4 h-4" />
            Add Customer
          </Button>
        </div>
      </div>

      {/* Empty State */}
      {stats.totalCustomers === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Get Started with ReviewFlow</h3>
            <p className="text-slate-500 mt-2 max-w-md mx-auto">
              Add your first customer to start sending review requests. 
              It only takes 30 seconds!
            </p>
            <Button className="mt-4 bg-indigo-600 hover:bg-indigo-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Customer
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {statCards.map((stat, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">{stat.label}</p>
                      <p className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</p>
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

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg">Send Review Requests</h3>
                <p className="text-indigo-100 text-sm mt-1">Reach out to your customers for reviews</p>
                <Button className="mt-4 bg-white text-indigo-600 hover:bg-indigo-50">
                  Go to Customers
                </Button>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg">Check Reviews</h3>
                <p className="text-emerald-100 text-sm mt-1">See what customers are saying</p>
                <Button className="mt-4 bg-white text-emerald-600 hover:bg-emerald-50">
                  View Reviews
                </Button>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-amber-500 to-orange-500 text-white">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg">Analyze Performance</h3>
                <p className="text-amber-100 text-sm mt-1">Track your rating and growth</p>
                <Button className="mt-4 bg-white text-amber-600 hover:bg-amber-50">
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